import Docker from "dockerode";
import * as fs from "fs/promises";
import * as path from "path";
import { Writable } from "stream";
import { v4 as uuidv4 } from "uuid";

// Initialize Docker client
export const docker = new Docker();

// Language configuration for Docker containers
export const LANGUAGE_CONFIG = {
    PYTHON: {
        image: "python:3.11-alpine",
        filename: "solution.py",
        compileCmd: null,
        runCmd: ["python", "solution.py"],
    },
    JAVASCRIPT: {
        image: "node:20-alpine",
        filename: "solution.js",
        compileCmd: null,
        runCmd: ["node", "solution.js"],
    },
    CPP: {
        image: "gcc:latest",
        filename: "solution.cpp",
        compileCmd: ["g++", "-O2", "-o", "solution", "solution.cpp"],
        runCmd: ["./solution"],
    },
    JAVA: {
        image: "eclipse-temurin:17-alpine",
        filename: "Solution.java",
        compileCmd: ["javac", "Solution.java"],
        runCmd: ["java", "Solution"],
    },
};

export interface TestCaseResult {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    executionTime: number; // in ms
    memoryUsed: number; // in KB (estimate)
}

export interface ExecutionResult {
    status: "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR" | "COMPILATION_ERROR" | "INTERNAL_ERROR";
    testsTotal: number;
    testsPassed: number;
    runtime: number; // avg or max runtime
    memory: number; // avg or max memory
    errorMessage: string | null;
    failedTestCase: { input: string; expectedOutput: string; actualOutput: string } | null;
    testResults: TestCaseResult[];
}

/**
 * Runs the given code against all test cases in an isolated Docker container.
 */
export async function runCodeInContainer(
    code: string,
    language: "PYTHON" | "CPP" | "JAVA" | "JAVASCRIPT",
    testCases: { input: string; expectedOutput: string }[]
): Promise<ExecutionResult> {
    const config = LANGUAGE_CONFIG[language];
    const runId = uuidv4();
    const hostTempDir = path.join(process.cwd(), "tmp", "executions", runId);

    try {
        // 1. Setup temporary directory for this run
        await fs.mkdir(hostTempDir, { recursive: true });
        await fs.writeFile(path.join(hostTempDir, config.filename), code);

        // 2. Create container
        // We bind mount the temp directory to /app in the container
        const container = await docker.createContainer({
            Image: config.image,
            Cmd: ["sleep", "3600"], // Keep it alive so we can exec into it
            HostConfig: {
                Binds: [`${hostTempDir}:/app`],
                Memory: 256 * 1024 * 1024, // 256MB RAM limit
                NetworkMode: "none", // Disable networking for security
            },
            WorkingDir: "/app",
        });

        await container.start();

        try {
            // 3. Compile (if necessary)
            if (config.compileCmd) {
                const exec = await container.exec({
                    Cmd: config.compileCmd,
                    AttachStdout: true,
                    AttachStderr: true,
                });

                const stream = await exec.start({ Detach: false });
                // We could capture stdout/stderr here, simplified for now
                const compileOutput = await readWaitStream(stream);
                let compileResult;
                try {
                    compileResult = await exec.inspect();
                } catch (e: any) {
                    compileResult = { ExitCode: 1 };
                }

                if (compileResult.ExitCode !== 0) {
                    return {
                        status: "COMPILATION_ERROR",
                        testsTotal: testCases.length,
                        testsPassed: 0,
                        runtime: 0,
                        memory: 0,
                        errorMessage: "Compilation Error:\n" + compileOutput.stderr,
                        failedTestCase: null,
                        testResults: [],
                    };
                }
            }

            // 4. Run tests sequentially
            const testResults: TestCaseResult[] = [];
            let testsPassed = 0;
            let maxRuntime = 0;
            let maxMemory = 0;
            let firstFailed: ExecutionResult["failedTestCase"] | null = null;
            let overallStatus: ExecutionResult["status"] = "ACCEPTED";
            let errorMsg = null;

            for (const tc of testCases) {
                // Write the input to a file inside the mount so the program can read it, or construct an exec that inputs it via echo.
                // For simplicity and to avoid bash piping issues in exec, let's write input.txt to the host directory
                const inputFilePath = path.join(hostTempDir, "input.txt");
                await fs.writeFile(inputFilePath, tc.input);

                // We run: sh -c "cat input.txt | <runCmd>"
                const cmdStr = config.runCmd.join(" ");
                const scriptCmd = ["sh", "-c", `cat input.txt | ${cmdStr}`];

                const exec = await container.exec({
                    Cmd: scriptCmd,
                    AttachStdout: true,
                    AttachStderr: true,
                });

                const startTime = Date.now();
                const execStream = await exec.start({ Detach: false });

                let stdoutData = "";
                let stderrData = "";

                // Timeout mechanism
                let isTle = false;
                const TIME_LIMIT = 5000; // 5 seconds
                const timeout = setTimeout(() => {
                    isTle = true;
                    // We can't cleanly kill just the exec, we might just kill the container
                }, TIME_LIMIT);

                const execOutput = await readWaitStreamResult(execStream, timeout);
                clearTimeout(timeout);

                const duration = Date.now() - startTime;

                if (isTle) {
                    return {
                        status: "TIME_LIMIT_EXCEEDED",
                        testsTotal: testCases.length,
                        testsPassed,
                        runtime: Math.max(maxRuntime, TIME_LIMIT),
                        memory: 0,
                        errorMessage: null,
                        failedTestCase: { input: tc.input, expectedOutput: tc.expectedOutput, actualOutput: "" },
                        testResults,
                    };
                }

                const inspect = await exec.inspect();

                const actualOutput = execOutput.stdout.trim();
                const cleanExpected = tc.expectedOutput.trim();
                const passed = inspect.ExitCode === 0 && actualOutput === cleanExpected;

                if (inspect.ExitCode !== 0) {
                    overallStatus = "RUNTIME_ERROR";
                    errorMsg = execOutput.stderr || "Process exited with code " + inspect.ExitCode;
                    firstFailed = { input: tc.input, expectedOutput: cleanExpected, actualOutput: errorMsg };
                    break; // Stop running further tests
                }

                if (passed) {
                    testsPassed++;
                } else {
                    overallStatus = "WRONG_ANSWER";
                    if (!firstFailed) {
                        firstFailed = { input: tc.input, expectedOutput: cleanExpected, actualOutput: actualOutput };
                    }
                    // Usually we break on first fail in strict mode
                    break;
                }

                maxRuntime = Math.max(maxRuntime, duration);
                maxMemory = 0; // Hard to accurately measure peak memory per exec without cgroups inspection. Mock for now.

                testResults.push({
                    input: tc.input,
                    expectedOutput: cleanExpected,
                    actualOutput,
                    passed,
                    executionTime: duration,
                    memoryUsed: 0,
                });
            }

            return {
                status: overallStatus,
                testsTotal: testCases.length,
                testsPassed,
                runtime: maxRuntime,
                memory: maxMemory,
                errorMessage: errorMsg,
                failedTestCase: firstFailed,
                testResults,
            };
        } finally {
            // 5. Cleanup container
            try {
                await container.stop();
                await container.remove({ force: true });
            } catch (e) {
                console.error("Error cleaning up container", e);
            }
        }
    } catch (error: any) {
        console.error("Docker execution error", error);
        return {
            status: "INTERNAL_ERROR",
            testsTotal: testCases.length,
            testsPassed: 0,
            runtime: 0,
            memory: 0,
            errorMessage: error.message || "Internal server error during execution",
            failedTestCase: null,
            testResults: [],
        };
    } finally {
        // 6. Cleanup Host Directory
        try {
            await fs.rm(hostTempDir, { recursive: true, force: true });
        } catch (e) {
            console.error("Error cleaning up host temp dir", e);
        }
    }
}

// Helper to reliably read stdout/stderr from a dockerode stream
function readWaitStreamResult(stream: any, timeoutId: NodeJS.Timeout): Promise<{ stdout: string, stderr: string }> {
    return new Promise((resolve) => {
        let stdout = "";
        let stderr = "";

        docker.modem.demuxStream(stream,
            new Writable({
                write(chunk, encoding, next) {
                    stdout += chunk.toString("utf8");
                    next();
                }
            }),
            new Writable({
                write(chunk, encoding, next) {
                    stderr += chunk.toString("utf8");
                    next();
                }
            })
        );

        stream.on("end", () => {
            resolve({ stdout, stderr });
        });

        stream.on("error", (err: any) => {
            stderr += err.toString();
            resolve({ stdout, stderr });
        });
    });
}

function readWaitStream(stream: any): Promise<{ stdout: string, stderr: string }> {
    return new Promise((resolve) => {
        let stdout = "";
        let stderr = "";
        docker.modem.demuxStream(stream,
            new Writable({
                write(chunk, encoding, next) {
                    stdout += chunk.toString("utf8");
                    next();
                }
            }),
            new Writable({
                write(chunk, encoding, next) {
                    stderr += chunk.toString("utf8");
                    next();
                }
            })
        );

        stream.on("end", () => resolve({ stdout, stderr }));
        stream.on("error", () => resolve({ stdout, stderr }));
    });
}

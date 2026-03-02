import Docker from "dockerode";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const docker = new Docker();

// Path to the tracer script
const TRACER_SCRIPT = path.join(process.cwd(), "src", "lib", "execution", "visualizer", "python_tracer.py");

export interface VisualizerStep {
    step: number;
    line: number;
    event: "line" | "call" | "return" | "exception";
    function: string;
    variables: Record<string, { value: any; type: string }>;
    callStack: string[];
    stdout: string;
    returnValue?: any;
    error?: string;
}

export interface VisualizerResult {
    steps: VisualizerStep[];
    totalSteps: number;
    code: string;
    error: { type: string; message: string } | null;
    finalOutput: string;
}

export async function runVisualizer(
    code: string,
    language: string,
    input: string = ""
): Promise<VisualizerResult> {
    if (language !== "PYTHON") {
        return {
            steps: [],
            totalSteps: 0,
            code,
            error: { type: "UnsupportedLanguage", message: `Visualizer currently only supports Python. ${language} support coming soon.` },
            finalOutput: ""
        };
    }

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "algoforge-viz-"));

    try {
        // Write user code
        fs.writeFileSync(path.join(tmpDir, "solution.py"), code);
        // Write input
        fs.writeFileSync(path.join(tmpDir, "input.txt"), input);
        // Copy tracer script
        fs.copyFileSync(TRACER_SCRIPT, path.join(tmpDir, "tracer.py"));

        const container = await docker.createContainer({
            Image: "python:3.11-alpine",
            Cmd: ["python", "/code/tracer.py"],
            WorkingDir: "/code",
            HostConfig: {
                Binds: [`${tmpDir}:/code:rw`],
                Memory: 256 * 1024 * 1024, // 256MB
                NanoCpus: 1e9, // 1 CPU
                NetworkMode: "none",
            },
            AttachStdout: true,
            AttachStderr: true,
        });

        await container.start();

        // Wait with timeout (10 seconds for visualizer)
        const waitPromise = container.wait();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Visualizer timeout")), 10000)
        );

        try {
            await Promise.race([waitPromise, timeoutPromise]);
        } catch {
            try { await container.stop({ t: 0 }); } catch { }
        }

        // Get stdout
        const logs = await container.logs({ stdout: true, stderr: true });
        const output = logs.toString("utf-8");

        // Clean up container
        try { await container.remove({ force: true }); } catch { }

        // Parse JSON from output — need to strip Docker stream headers
        const lines = output.split("\n").filter((l: string) => l.trim());
        const lastLine = lines[lines.length - 1];

        // Strip potential docker stream header bytes
        let jsonStr = lastLine;
        try {
            // Docker stream protocol: first 8 bytes are header
            const startIdx = jsonStr.indexOf("{");
            if (startIdx > 0) {
                jsonStr = jsonStr.substring(startIdx);
            }
        } catch { }

        try {
            const result = JSON.parse(jsonStr) as VisualizerResult;
            return result;
        } catch (parseError) {
            return {
                steps: [],
                totalSteps: 0,
                code,
                error: { type: "ParseError", message: `Failed to parse tracer output: ${output.substring(0, 500)}` },
                finalOutput: output
            };
        }
    } finally {
        // Cleanup temp directory
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch { }
    }
}

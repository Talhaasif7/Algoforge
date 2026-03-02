import { NextRequest, NextResponse } from "next/server";
import { runVisualizer } from "@/lib/execution/visualizer/runner";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { code, language, input } = body;

        if (!code || !language) {
            return NextResponse.json(
                { error: "Code and language are required" },
                { status: 400 }
            );
        }

        const result = await runVisualizer(code, language, input || "");
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Visualizer API error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

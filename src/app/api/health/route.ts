import { successResponse } from "@/lib/utils/api-response";

export async function GET() {
  return successResponse({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "0.1.0",
  });
}

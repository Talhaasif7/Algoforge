import { NextResponse } from "next/server";

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data } as ApiSuccessResponse<T>, { status });
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: unknown
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    { success: false, error: { code, message, details } } as ApiErrorResponse,
    { status }
  );
}

// ─── Common error responses ─────────────────────────────────

export function unauthorizedResponse(message = "Authentication required") {
  return errorResponse("UNAUTHORIZED", message, 401);
}

export function forbiddenResponse(message = "Access denied") {
  return errorResponse("FORBIDDEN", message, 403);
}

export function notFoundResponse(message = "Resource not found") {
  return errorResponse("NOT_FOUND", message, 404);
}

export function validationErrorResponse(message: string, details?: unknown) {
  return errorResponse("VALIDATION_ERROR", message, 400, details);
}

export function rateLimitResponse(message = "Too many requests") {
  return errorResponse("RATE_LIMITED", message, 429);
}

export function internalErrorResponse(message = "Internal server error") {
  return errorResponse("INTERNAL_ERROR", message, 500);
}

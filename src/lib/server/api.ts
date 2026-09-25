import "server-only";

export function validId(value: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/.test(value);
}

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function jsonBody(request: Request): Promise<unknown> {
  try { return await request.json(); } catch { return null; }
}

export function objectBody(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function serverError(error: unknown) {
  console.error("API database error", error);
  return jsonError("Database request failed", 500);
}

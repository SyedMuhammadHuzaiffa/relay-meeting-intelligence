import { jsonBody, jsonError, objectBody, serverError, validId } from "@/lib/server/api";
import { setActionCompleted } from "@/lib/server/meetings";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!validId(id)) return jsonError("Invalid action item ID", 400);
  const body = await jsonBody(request);
  if (!objectBody(body) || typeof body.completed !== "boolean") return jsonError("completed must be a boolean", 400);
  try {
    const action = await setActionCompleted(id, body.completed);
    return action ? Response.json({ actionItem: action }) : jsonError("Action item not found", 404);
  } catch (error) { return serverError(error); }
}

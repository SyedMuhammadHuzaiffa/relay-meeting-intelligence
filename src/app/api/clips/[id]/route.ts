import { jsonError, serverError, validId } from "@/lib/server/api";
import { getClip } from "@/lib/server/meetings";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!validId(id)) return jsonError("Invalid clip ID", 400);
  try {
    const clip = await getClip(id);
    return clip ? Response.json({ clip }) : jsonError("Clip not found", 404);
  } catch (error) { return serverError(error); }
}

import { listMeetings } from "@/lib/server/meetings";
import { serverError } from "@/lib/server/api";

export async function GET() {
  try { return Response.json({ meetings: await listMeetings() }); }
  catch (error) { return serverError(error); }
}

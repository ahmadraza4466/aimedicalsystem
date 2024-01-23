import { refreshAccessToken } from "../route";

export async function GET() {
  return Response.json({ token: await refreshAccessToken() });
}

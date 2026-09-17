import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = (session as any).accessToken;
    const url = "https://blizzard.com";
    
    const response = await fetch(url, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) {
      return Response.json({ error: "Blizzard Error" }, { status: response.status });
    }

    const data = await response.json();
    return Response.json({ wowAccounts: data.wow_accounts || [] });

  } catch (error) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

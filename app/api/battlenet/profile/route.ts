import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return Response.json(
      { error: "Не авторизован" },
      { status: 401 }
    );
  }

  return Response.json({
    user: session.user,
  });
}

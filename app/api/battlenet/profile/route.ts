import { getServerSession } from "next-auth";
import { Response } from "next/dist/compiled/@edge-runtime/cookies"; 
// Примечание: стандартный глобальный Response в Next.js обычно доступен без импортов
import { authOptions } from "@/lib/auth"; // Импортируйте ваши authOptions из файла, куда вы их перенесли

export async function GET() {
  // Обязательно передаем authOptions внутрь getServerSession
  const session = await getServerSession(authOptions);

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

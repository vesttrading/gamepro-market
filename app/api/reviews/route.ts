import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "../../../lib/auth";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase server environment variables are missing.");
}

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, author_name, rating, text, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      reviews: data || []
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не удалось загрузить отзывы."
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { error: "Сначала войди через Battle.net." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const text = String(body.text || "").trim();
    const rating = Number(body.rating);

    if (!text) {
      return Response.json(
        { error: "Напиши отзыв." },
        { status: 400 }
      );
    }

    if (text.length > 1000) {
      return Response.json(
        { error: "Отзыв слишком длинный. Максимум 1000 символов." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rating)  rating < 1  rating > 5) {
      return Response.json(
        { error: "Оценка должна быть от 1 до 5." },
        { status: 400 }
      );
    }

    const sessionData = session as any;

    const battlenetId =
      sessionData?.battlenetId ||
      sessionData?.user?.id ||
      null;

    const authorName =
      sessionData?.user?.name ||
      "GamePro игрок";

    if (!battlenetId) {
      return Response.json(
        { error: "Не найден Battle.net ID пользователя." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        battlenet_id: String(battlenetId),
        author_name: authorName,
        rating,
        text
      })
      .select("id, author_name, rating, text, created_at")
      .single();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      review: data
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Ошибка отправки отзыва."
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Инициализируем защищенный серверный клиент Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Используем ваш секретный ключ
);

export async function GET(request: Request) {
  try {
    // Получаем параметры фильтрации из URL запроса
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const playerClass = searchParams.get('class');
    const minRating = searchParams.get('minRating');

    // Базовый запрос к вашей таблице верифицированных игроков
    let query = supabase
      .from('player_verifications')
      .select('*');

    // Динамически накладываем фильтры, если они переданы с фронтенда
    if (role) {
      query = query.eq('role', role);
    }
    if (playerClass) {
      query = query.eq('class', playerClass);
    }
    if (minRating) {
      query = query.gte('rating', parseInt(minRating, 10));
    }

    // Сортировка по рейтингу
    query = query.order('rating', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

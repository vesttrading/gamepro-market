import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const playerClass = searchParams.get('class');
    const minRating = searchParams.get('minRating');

    let query = supabase
      .from('player_verifications')
      .select('*');

    if (role) query = query.eq('role', role);
    if (playerClass) query = query.eq('class', playerClass);
    if (minRating) query = query.gte('mythic_plus_score', parseInt(minRating, 10));

    query = query.order('mythic_plus_score', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

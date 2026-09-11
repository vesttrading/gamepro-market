import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Код авторизации не найден' }, { status: 400 });
  }

  const clientId = process.env.BATTLE_NET_CLIENT_ID;
  const clientSecret = process.env.BATTLE_NET_CLIENT_SECRET;
  const redirectUri = 'https://vercel.app';

  try {
    const response = await fetch('https://battle.net', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(${clientId}:${clientSecret}).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error_description }, { status: 400 });
    }

    const baseUrl = new URL('/', request.url);
    return NextResponse.redirect(${baseUrl.origin}/?token=${data.access_token});

  } catch (error: any) {
    return NextResponse.json({ error: 'Ошибка сервера: ' + error.message }, { status: 500 });
  }
}

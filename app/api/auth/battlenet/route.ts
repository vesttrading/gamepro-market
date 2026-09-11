import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.BATTLE_NET_CLIENT_ID;
  
  // URL возврата, который вы указали в панели Blizzard
  const redirectUri = encodeURIComponent('https://vercel.app');
  
  // Формируем ссылку авторизации Blizzard
  const blizzardUrl = https://battle.net{clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+wow.profile;

  return NextResponse.redirect(blizzardUrl);
}

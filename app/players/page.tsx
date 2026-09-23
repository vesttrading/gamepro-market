 'use client';

import { useEffect, useState } from 'react';
// Импортируйте ваш готовый клиент Supabase из папки lib
import { supabase } from '../lib/supabase';

interface VerifiedPlayer {
  id: number;
  battlenet_id: string;
  character_name: string | null;
  realm: string | null;
  role: string | null;
  class: string | null;
  rating: number | null;
}

export default function PlayersSearchPage() {
  const [players, setPlayers] = useState<VerifiedPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  // Состояния для фильтров
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [minRating, setMinRating] = useState('');

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      // Запрос к нашей обновленной таблице
      let query = supabase
        .from('player_verifications')
        .select('id, battlenet_id, character_name, realm, role, class, rating');

      // Динамическая фильтрация
      if (selectedRole) {
        query = query.eq('role', selectedRole);
      }
      if (selectedClass) {
        query = query.eq('class', selectedClass);
      }
      if (minRating) {
        query = query.gte('rating', parseInt(minRating, 10));
      }

      // Сортировка по убыванию рейтинга
      query = query.order('rating', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      setPlayers(data || []);
    } catch (err) {
      console.error('Ошибка при получении списка игроков:', err);
    } finally {
      setLoading(false);
    }
  };

  // Перезапускаем поиск при изменении фильтров
  useEffect(() => {
    fetchPlayers();
  }, [selectedRole, selectedClass, minRating]);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-slate-900 text-white min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
        Поиск верифицированных игроков
      </h1>

      {/* Панель фильтров */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-slate-800 rounded-xl border border-slate-700">
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Роль</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все роли</option>
            <option value="Tank">Танк</option>
            <option value="Healer">Хилер</option>
            <option value="DPS">ДД (DPS)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Класс</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все классы</option>
            <option value="Mage">Маг (Mage)</option>
            <option value="Warrior">Воин (Warrior)</option>
            <option value="Priest">Жрец (Priest)</option>
            <option value="Rogue">Разбойник (Rogue)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Минимальный рейтинг</label>
          <input
            type="number"
            placeholder="Например: 2000"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {/* Список игроков */}
      {loading ? (
        <div className="text-center py-10 text-slate-400">Загрузка...</div>
      ) : players.length === 0 ? (
        <div className="text-center py-10 text-slate-500 border border-dashed border-slate-700 rounded-xl">
          Игроки по заданным критериям не найдены.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {players.map((player) => (
            <div key={player.id} className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-slate-100">
                    {player.character_name || 'Без имени'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Мир: {player.realm || '—'}</p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Verified
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-300 border-t border-slate-700/50 pt-3">
                <p><span className="text-slate-500">Роль:</span> {player.role || '—'}</p>
                <p><span className="text-slate-500">Класс:</span> {player.class || '—'}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-700 flex justify-between items-center">
                <span className="text-xs text-slate-500 uppercase">Рейтинг</span>
                <span className="text-2xl font-black text-blue-400">
                  {player.rating ?? '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

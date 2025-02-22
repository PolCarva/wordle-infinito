'use client';

import { useState, useEffect } from 'react';
import { Swords } from 'lucide-react';
import { api } from '@/app/services/api';
import Image from 'next/image';
import MainLayout from '../../components/layouts/MainLayout';

interface ProfileStats {
  gamesPlayed: number;
  gamesWon: number;
  streak: number;
  winRate: number;
  versusPlayed: number;
  versusWon: number;
  versusWinRate: number;
  versusStreak: number;
  bestStreak: number;
  versusBestStreak: number;
}

interface ProfileData {
  username?: string;
  email: string;
  imageUrl?: string;
  stats: ProfileStats;
}

function getInitials(name: string | undefined): string {
  if (!name) return '??';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function ProfileContent({ userId }: { userId: string }) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.getProfile(userId);
        setProfileData(data);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadProfile();
  }, [userId]);

  if (!profileData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
          <div className="flex items-center space-x-4">
            {profileData.imageUrl ? (
              <Image
                src={profileData.imageUrl}
                alt={profileData.username || 'Usuario'}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-2xl text-primary-foreground">
                {getInitials(profileData.username || profileData.email)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{profileData.username || 'Usuario'}</h1>
              <p className="text-gray-500 dark:text-gray-400">{profileData.email}</p>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold mb-4">Estadísticas de juego</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard title="Partidas jugadas" value={profileData.stats.gamesPlayed} />
              <StatCard title="Victorias" value={profileData.stats.gamesWon} />
              <StatCard title="Ratio victorias" value={`${Math.round(profileData.stats.winRate)}%`} />
              <StatCard title="Racha actual" value={profileData.stats.streak} />
              <StatCard title="Mejor racha" value={profileData.stats.bestStreak || 0} />
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Swords className="w-5 h-5" />
              Estadísticas Versus
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard title="Duelos jugados" value={profileData.stats.versusPlayed} />
              <StatCard title="Duelos ganados" value={profileData.stats.versusWon} />
              <StatCard title="Ratio victorias" value={`${Math.round(profileData.stats.versusWinRate)}%`} />
              <StatCard title="Racha actual" value={profileData.stats.versusStreak || 0} />
              <StatCard title="Mejor racha" value={profileData.stats.versusBestStreak || 0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage({ params }: { params: { userId: string } }) {
  return (
    <MainLayout>
      <ProfileContent userId={params.userId} />
    </MainLayout>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-background p-4 rounded-lg border dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
} 
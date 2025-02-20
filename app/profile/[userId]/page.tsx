'use client';

import { useEffect, useState } from 'react';
import { useAuth, AuthProvider } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/app/services/api';
import Image from 'next/image';

interface ProfileStats {
  gamesPlayed: number;
  gamesWon: number;
  streak: number;
  winRate: number;
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
  const { user } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Si es el perfil del usuario actual, usar los datos del contexto
        if (user && user.userId === userId) {
          setProfileData({
            username: user.username,
            email: user.email,
            imageUrl: user.imageUrl,
            stats: user.stats
          });
        } else {
          // Si no, hacer una petición al backend
          const response = await api.getProfile(userId);
          setProfileData(response);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 left-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16">
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
              <h1 className="text-2xl font-bold text-foreground">
                {profileData.username || 'Usuario'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {profileData.email}
              </p>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">
              Estadísticas de juego
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Partidas jugadas" value={profileData.stats.gamesPlayed} />
              <StatCard title="Victorias" value={profileData.stats.gamesWon} />
              <StatCard 
                title="Porcentaje de victorias" 
                value={`${Math.round(profileData.stats.winRate)}%`} 
              />
              <StatCard title="Racha actual" value={profileData.stats.streak} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-background p-4 rounded-lg border dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export default function ProfilePage({ params }: { params: { userId: string } }) {
  return (
    <AuthProvider>
      <ProfileContent userId={params.userId} />
    </AuthProvider>
  );
} 
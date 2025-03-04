'use client';

import { useAuth, AuthProvider } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MainLayout from '../components/layouts/MainLayout';

function ProfileContent() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
     

      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
          <div className="flex items-center space-x-4">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.username || 'Usuario'}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-2xl text-primary-foreground">
                {getInitials(user.username || user.email)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{user.username || 'Usuario'}</h1>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold mb-4">Estadísticas de juego</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Partidas jugadas" value={user.stats?.gamesPlayed || 0} />
              <StatCard title="Victorias" value={user.stats?.gamesWon || 0} />
              <StatCard 
                title="Porcentaje de victorias" 
                value={`${Math.round(user.stats?.winRate || 0)}%`} 
              />
              <StatCard title="Racha actual" value={user.stats?.streak || 0} />
            </div>
          </div>

         {/*  <div className="border-t dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Swords className="w-5 h-5" />
              Estadísticas Versus
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard 
                title="Duelos jugados" 
                value={user.stats?.versusPlayed || 0} 
              />
              <StatCard 
                title="Duelos ganados" 
                value={user.stats?.versusWon || 0} 
              />
              <StatCard 
                title="Ratio victorias" 
                value={`${Math.round(user.stats?.versusWinRate || 0)}%`} 
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthProvider>
      <MainLayout>
        <ProfileContent />
      </MainLayout>
    </AuthProvider>
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

function getInitials(name: string | undefined): string {
  if (!name) return '??';
  
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
} 
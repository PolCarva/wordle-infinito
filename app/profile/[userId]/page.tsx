'use client';

import { useState, useEffect } from 'react';
import { api } from '@/app/services/api';
import Image from 'next/image';
import MainLayout from '../../components/layouts/MainLayout';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/app/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

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
  role?: string;
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

// Componente para seleccionar el rol del usuario
function RoleSelector({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRoleChange = async (newRole: 'user' | 'vip' | 'mod' | 'admin') => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
            
      await api.updateUserRole(userId, newRole);
      
      setSuccess(`Rol cambiado a ${newRole}`);
      console.log(`Rol cambiado exitosamente a ${newRole}`);
      
      // Recargar la página después de 1 segundo para ver los cambios
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('Error al cambiar el rol:', err);
      setError(err instanceof Error ? err.message : 'No se pudo cambiar el rol');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 px-2" disabled={loading}>
            Cambiar rol <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleRoleChange('user')}>
            👤 Usuario
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoleChange('vip')}>
            👑 VIP
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoleChange('mod')}>
            🛡️ Moderador
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoleChange('admin')}>
            ⚡ Administrador
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {error && (
        <div className="text-xs text-red-500 mt-1">{error}</div>
      )}
      
      {success && (
        <div className="text-xs text-green-500 mt-1">{success}</div>
      )}
      
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 mt-1">
          Debug: userId={userId}, currentRole={currentRole}
        </div>
      )} */}
    </div>
  );
}

function ProfileContent({ userId }: { userId: string }) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const { user } = useAuth();
  const isOwnProfile = user?.userId === userId;

  // Depurar información del usuario actual
 /*  useEffect(() => {
    if (user) {
      console.log("Usuario actual:", {
        userId: user.userId,
        role: user.role,
        isAdmin: user.role === 'admin'
      });
    }
  }, [user]); */

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.getProfile(userId);
        /* console.log("Datos de perfil recibidos:", data); */
        setProfileData(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadProfile();
  }, [userId]);

  if (!profileData) {
    return <div className='flex justify-center items-center h-screen'>Cargando...</div>;
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
              {isOwnProfile && (
                <p className="text-gray-500 dark:text-gray-400">{profileData.email}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm px-2 py-0.5 rounded-full ${
                  profileData.role === 'vip' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                    : profileData.role === 'mod' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                      : profileData.role === 'admin' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {profileData.role === 'vip' 
                    ? '👑 VIP' 
                    : profileData.role === 'mod' 
                      ? '🛡️ Moderador' 
                      : profileData.role === 'admin' 
                        ? '⚡ Administrador' 
                        : '👤 Usuario'}
                </span>
                
                {/* Mostrar el selector de rol si el usuario actual es admin y no es su propio perfil */}
                {user?.role === 'admin' && user.userId !== userId && (
                  <RoleSelector userId={userId} currentRole={profileData.role || 'user'} />
                )}
              </div>
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

         {/*  <div className="border-t dark:border-gray-700 pt-6">
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
          </div> */}
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
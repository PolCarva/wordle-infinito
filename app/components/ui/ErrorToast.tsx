'use client';

interface ErrorToastProps {
  message: string | null;
}

export function ErrorToast({ message }: ErrorToastProps) {
  if (!message) return null;

  return (
    <div className="fixed top-5 md:top-auto bottom-4 z-50 left-1/2 transform -translate-x-1/2 animate-fade-out">
      <div className="bg-red-500 text-white font-bold py-2 px-4 rounded">
        {message}
      </div>
    </div>
  );
} 
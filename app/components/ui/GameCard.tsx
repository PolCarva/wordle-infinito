import Link from 'next/link';

interface GameCardProps {
  title: string;
  description: string;
  path: string;
  isComingSoon?: boolean;
  backgroundColor: string;
  icon: string;
}

const GameCard = ({ title, description, path, isComingSoon = false, backgroundColor, icon }: GameCardProps) => {
  return (
    <div className={`rounded-lg h-full p-6 ${backgroundColor} flex flex-col items-center`}>
      <div className="w-24 h-24 mb-4 bg-black/10 rounded-lg flex items-center justify-center text-4xl">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">{description}</p>
      {isComingSoon ? (
        <button 
          className="w-full bg-black/20 text-white py-2 px-4 rounded-md cursor-not-allowed"
          disabled
        >
          Próximamente...
        </button>
      ) : (
        <Link href={path} className="w-full mt-auto">
          <button className="w-full bg-black/20 text-white py-2 px-4 rounded-md hover:bg-black/30 transition-colors">
            Jugar
          </button>
        </Link>
      )}
    </div>
  );
};

export default GameCard; 
import MainNav from '../ui/MainNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import DashboardSidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-black">
      <Navbar isMinimal={true} />
      <div className="flex flex-1 pt-16">
        <aside className="fixed top-16 left-0 bottom-0 w-60 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-20 overflow-y-auto">
          <DashboardSidebar />
        </aside>
        <main className="pl-60 w-full overflow-x-hidden">
          <div className="p-4 md:p-6 bg-gray-50 dark:bg-black">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;

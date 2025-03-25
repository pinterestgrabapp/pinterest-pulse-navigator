
import React, { ReactNode } from 'react';
import Navbar from './DashboardNavbar';
import Footer from './Footer';
import DashboardSidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        {/* Fixed Sidebar */}
        <aside className="fixed top-16 bottom-0 left-0 w-60 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 z-20 overflow-y-auto">
          <DashboardSidebar />
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 ml-60">
          <div className="p-4 md:p-6 bg-gray-50 dark:bg-black min-h-[calc(100vh-theme(spacing.16)-4rem)]">
            {children}
          </div>
          
          <Footer className="ml-0 relative z-30" />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

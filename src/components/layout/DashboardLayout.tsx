
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import DashboardSidebar from './Sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-900">
        <Navbar isMinimal={true} />
        <div className="flex flex-1 pt-20">
          <DashboardSidebar />
          <SidebarInset className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 w-full">
            {children}
          </SidebarInset>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;


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
      <div className="flex flex-col min-h-screen w-full">
        <Navbar isMinimal={true} />
        <div className="flex flex-1 pt-16">
          <DashboardSidebar />
          <SidebarInset className="p-4 md:p-6">
            {children}
          </SidebarInset>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

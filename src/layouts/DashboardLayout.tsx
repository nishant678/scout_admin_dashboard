import React from 'react';
import { Sidebar, Header, Footer } from '../components/layout';
import { cn } from '../utils';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Mobile overlay and desktop static */}
      <Sidebar />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Fixed Header */}
        <Header title={title} />

        {/* Scrollable Content Area */}
        <main
          className={cn(
            'flex-1 overflow-y-auto',
            'p-4 sm:p-6',
            'w-full',
            'pb-24' // Add padding for fixed footer
          )}
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        {/* Fixed Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;

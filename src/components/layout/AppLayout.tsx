import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from './';
import TokenRefreshIndicator from '../common/TokenRefreshIndicator';

const AppLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed Navbar */}
      <Navbar />

      <div className="flex pt-16"> {/* Add padding-top to account for fixed navbar */}
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Token Refresh Indicator */}
      <TokenRefreshIndicator />
    </div>
  );
};

export default AppLayout;

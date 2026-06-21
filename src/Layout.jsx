import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header, Footer } from './Pages';
import AIAuctionManager from './Components/AIAuctionManager';
import AIChatbot from './Components/AIChatbot';

function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col relative">
      <Header />
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <Footer />
      <AIAuctionManager />
      <AIChatbot />
    </div>
  );
}

export default Layout;


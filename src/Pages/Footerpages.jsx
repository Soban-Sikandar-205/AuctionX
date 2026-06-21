import React from 'react';
import { useLocation } from 'react-router-dom';

const FooterPages = () => {
  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
      case '/about':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-slate-200 to-teal-300 bg-clip-text text-transparent tracking-tight">
                About AuctioNex
              </h1>
              <p className="text-slate-300 leading-relaxed text-lg max-w-3xl">
                AuctioNex is a state-of-the-art, decentralized-inspired bidding platform engineered to bring real-time, interactive, and transparent auction events directly to your screen. Whether you are seeking rare collectibles or listing assets to a global market, AuctioNex redefines the online auction space.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-slate-950/40 border border-slate-800/50 p-6 rounded-2xl shadow-inner hover:border-teal-500/30 transition duration-300">
                <div className="w-12 h-12 bg-teal-950/60 border border-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center font-bold text-xl mb-4 shadow-md">
                  ⚡
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Real-Time Bids</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Experience instantaneous bidding updates. Our modern synchronized database engine ensures bids are registered and displayed to all active participants in real-time.
                </p>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/50 p-6 rounded-2xl shadow-inner hover:border-teal-500/30 transition duration-300">
                <div className="w-12 h-12 bg-teal-950/60 border border-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center font-bold text-xl mb-4 shadow-md">
                  🛡️
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Secure Transactions</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Bid with absolute confidence. Your credentials and assets are verified and protected using industry-standard Firebase security protocols and authentication tokens.
                </p>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/50 p-6 rounded-2xl shadow-inner hover:border-teal-500/30 transition duration-300">
                <div className="w-12 h-12 bg-teal-950/60 border border-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center font-bold text-xl mb-4 shadow-md">
                  📱
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Hybrid Mobile App</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  AuctioNex is compiled natively for Android using Capacitor, delivering a highly responsive, fluid native app experience on mobile devices and desktop browsers alike.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/30 border border-slate-800/55 p-8 rounded-2xl mt-8">
              <h3 className="text-xl font-bold text-teal-300 mb-3">Our Core Philosophy</h3>
              <p className="text-slate-300 text-base leading-relaxed">
                We believe that auctioning should be accessible, safe, and engaging. AuctioNex lowers the entry barrier for sellers and provides bidders with an exciting, transparent, and fair playing field. By combining the speed of the modern web with rich tactile design, we make every bid feel like a real-time event.
              </p>
            </div>
          </div>
        );
      case '/contact':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-slate-200 to-teal-300 bg-clip-text text-transparent tracking-tight">
                Contact Us
              </h1>
              <p className="text-slate-350 leading-relaxed max-w-2xl">
                Have questions, inquiries, or feedback? Get in touch with our team directly. We are always ready to assist you or listen to your recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="bg-slate-950/40 border border-slate-800/50 p-8 rounded-2xl shadow-inner space-y-6">
                <h3 className="text-xl font-bold text-white mb-2">Contact Details</h3>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-teal-400 font-bold text-lg shadow-inner">
                    📧
                  </div>
                  <div>
                    <span className="text-slate-450 text-xs uppercase font-bold tracking-wider block">Email Address</span>
                    <a href="mailto:msobansikandar@gmail.com" className="text-white hover:text-teal-300 font-medium transition-colors">
                      msobansikandar@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-teal-400 font-bold text-lg shadow-inner">
                    📞
                  </div>
                  <div>
                    <span className="text-slate-450 text-xs uppercase font-bold tracking-wider block">Phone Number</span>
                    <a href="tel:+923286519678" className="text-white hover:text-teal-300 font-medium transition-colors">
                      +92 328 6519678
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-teal-400 font-bold text-lg shadow-inner">
                    🕒
                  </div>
                  <div>
                    <span className="text-slate-450 text-xs uppercase font-bold tracking-wider block">Availability</span>
                    <span className="text-slate-200 font-medium">
                      24/7 Support for Active Auctions
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/50 p-8 rounded-2xl shadow-inner flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Headquarters</h3>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    AuctioNex is powered globally. If you run into database synchronization issues, storage capacity limits, or bidding exceptions, please ping us directly via email with details so our developers can scale the Firebase nodes immediately.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <span className="text-xs text-slate-500">
                    Lead Developer: <strong className="text-slate-400">Soban Sikandar</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      case '/privacy-policy':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-slate-200 to-teal-300 bg-clip-text text-transparent tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-slate-300 leading-relaxed">
              Last updated: May 25, 2026. This Privacy Policy describes our policies and procedures on the collection, use, and disclosure of your information when you use AuctioNex.
            </p>

            <div className="space-y-6 mt-6">
              <section className="bg-slate-950/30 border border-slate-800/50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">1. Information Collection</h3>
                <p className="text-slate-450 text-sm leading-relaxed">
                  We collect information when you create an account, list items, or place bids. This includes registration details (email, username), profile metadata, item details (titles, descriptions, image URLs), and real-time bid entries containing timestamps and numeric values.
                </p>
              </section>

              <section className="bg-slate-950/30 border border-slate-800/50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">2. Use of Your Personal Data</h3>
                <p className="text-slate-450 text-sm leading-relaxed">
                  We use your personal data to authenticate your account, maintain active auction sessions, update live bid histories, decide winners, and facilitate live messaging/chat sessions between owners and winners upon successful completion of an auction.
                </p>
              </section>

              <section className="bg-slate-950/30 border border-slate-800/50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">3. Firebase Services & Data Security</h3>
                <p className="text-slate-450 text-sm leading-relaxed">
                  Our application is integrated with Firebase products (Authentication, Realtime Database, Cloud Storage). While we implement secure database rules to prevent unauthorized changes, please notice that data transmission over the internet cannot be guaranteed 100% secure. You are responsible for keeping your login credentials safe.
                </p>
              </section>

              <section className="bg-slate-950/30 border border-slate-800/50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">4. Third-Party Links & Images</h3>
                <p className="text-slate-450 text-sm leading-relaxed">
                  AuctioNex allows users to submit direct image URLs. We do not inspect, host, or assume liability for external image content loaded from third-party hosting services. If you locate copyright-infringing content, please contact us at msobansikandar@gmail.com.
                </p>
              </section>
            </div>
          </div>
        );
      case '/terms-and-conditions':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-slate-200 to-teal-300 bg-clip-text text-transparent tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-slate-300 leading-relaxed">
              Welcome to AuctioNex. Please read these Terms and Conditions carefully before using our platform.
            </p>

            <div className="space-y-6 mt-6">
              <section className="bg-slate-950/30 border border-slate-800/50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">1. Acceptance of Terms</h3>
                <p className="text-slate-450 text-sm leading-relaxed">
                  By registering an account, listing items, or placing bids on AuctioNex, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions.
                </p>
              </section>

              <section className="bg-slate-950/30 border border-slate-800/50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">2. Bidding Rules & Commitments</h3>
                <p className="text-slate-450 text-sm leading-relaxed">
                  All bids submitted on AuctioNex are final, binding, and cannot be retracted. By placing a bid, you commit to purchase the listed item at the submitted price if you are declared the winner at the conclusion of the auction duration.
                </p>
              </section>

              <section className="bg-slate-950/30 border border-slate-800/50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">3. Listings and Image URLs</h3>
                <p className="text-slate-450 text-sm leading-relaxed">
                  Sellers are responsible for the accuracy of their listings, including titles, starting bids, and image URLs. Image URLs must lead to direct, valid, and safe image files. AuctioNex reserves the right to remove any listing containing broken links, inappropriate descriptions, or incorrect categories.
                </p>
              </section>

              <section className="bg-slate-950/30 border border-slate-800/50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">4. Disclaimers & Limitation of Liability</h3>
                <p className="text-slate-450 text-sm leading-relaxed">
                  AuctioNex is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties regarding database uptime, network delays, or concurrent bid collisions. Bids made in the final seconds of an auction are subject to network transmission speeds.
                </p>
              </section>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-rose-500 mb-2">Page Not Found</h2>
            <p className="text-slate-400">The requested section could not be resolved.</p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto my-10 max-w-5xl bg-slate-900 border border-slate-800/80 p-8 md:p-12 rounded-2xl shadow-3d-elevated">
      {renderContent()}
    </div>
  );
};

export default FooterPages;

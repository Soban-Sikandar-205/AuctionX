import React, { useState, useEffect, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleWinner, retrieveItems } from '../redux/itemActions';
import { AuthContext } from '../context/AuthProvider';

function AIAuctionManager() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { auctionItems } = useSelector((state) => state.auctionDataReducer);

  // States
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(() => {
    const saved = localStorage.getItem('ai_autoclose_active');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), text: '🤖 AI Auction Engine initialized.' },
    { id: 2, time: new Date().toLocaleTimeString(), text: '🤖 System status: Standing by.' }
  ]);
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal', 'monitor', 'settings'
  
  // Admin Closure Popup State
  const [adminPopup, setAdminPopup] = useState(null);

  // Refs to keep track of items processed
  const processingRef = useRef(new Set());
  const seenClosedAuctionsRef = useRef(new Set());
  const initialScanDoneRef = useRef(false);
  const terminalEndRef = useRef(null);

  // Save toggle setting to localStorage
  useEffect(() => {
    localStorage.setItem('ai_autoclose_active', JSON.stringify(isActive));
    addLog(`AI Auto-Closer system was ${isActive ? 'ENABLED' : 'DISABLED'}.`);
  }, [isActive]);

  // Scroll to bottom of terminal log
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isExpanded, activeTab]);

  const addLog = (text) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString(),
        text: `🤖 ${text}`
      }
    ]);
  };

  const triggerToast = (title, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  // Main background monitor loop
  useEffect(() => {
    const scanAuctions = async () => {
      if (!auctionItems || Object.keys(auctionItems).length === 0) return;

      const flatItems = Object.values(auctionItems).flatMap((category) => category);
      const now = new Date();
      let hasUpdates = false;

      // 1. Initialize closed auctions history on first load
      if (!initialScanDoneRef.current) {
        flatItems.forEach((item) => {
          if (item.winner) {
            seenClosedAuctionsRef.current.add(item.key);
          }
        });
        initialScanDoneRef.current = true;
      }

      // 2. Scan for closed/closing auctions
      for (const item of flatItems) {
        // A. Handle newly closed auctions (alert Admin)
        if (item.winner && !seenClosedAuctionsRef.current.has(item.key)) {
          seenClosedAuctionsRef.current.add(item.key);
          
          // Trigger Admin notification
          if (currentUser?.email === 'admin@auctionex.com') {
            const winnerDetails = Object.values(item.winner)[0];
            setAdminPopup({
              itemId: item.key,
              itemTitle: item.itemTitle,
              category: item.category,
              winnerName: winnerDetails.userName || winnerDetails.user,
              winnerEmail: winnerDetails.user,
              finalBid: winnerDetails.bid,
              owner: item.itemOwner,
              wasNoBids: winnerDetails.user === 'none'
            });
            addLog(`Admin Alert: Auction closed for "${item.itemTitle}"`);
          }
        }

        // B. Handle auto-closing of expired auctions (if active)
        if (isActive && item.auctionDuration) {
          const endDate = new Date(item.auctionDuration);
          
          if (endDate < now && !item.winner && !processingRef.current.has(item.key)) {
            processingRef.current.add(item.key);
            hasUpdates = true;
            
            addLog(`Detected expired auction: "${item.itemTitle}" (Ends: ${endDate.toLocaleString()})`);
            addLog(`Analyzing bids for "${item.itemTitle}"...`);

            try {
              const bids = item.recentBids ? Object.values(item.recentBids) : [];
              let winnerPayload;

              if (bids.length > 0) {
                const highestBidObj = [...bids].sort((a, b) => b.bid - a.bid)[0];
                winnerPayload = {
                  item: item.key,
                  user: highestBidObj.user,
                  userName: highestBidObj.userName || highestBidObj.user,
                  bid: highestBidObj.bid,
                  owner: item.itemOwner,
                  category: item.category
                };
                addLog(`AI Winner Selected: ${winnerPayload.userName} with bid $${winnerPayload.bid}`);
              } else {
                winnerPayload = {
                  item: item.key,
                  user: 'none',
                  userName: 'No Bids',
                  bid: 0,
                  owner: item.itemOwner,
                  category: item.category,
                  status: 'expired_no_bids'
                };
                addLog(`AI Evaluation: No bids placed. Closing auction without winner.`);
              }

              await handleWinner(winnerPayload, item.category);
              addLog(`Successfully closed auction and saved results for "${item.itemTitle}".`);
              
              triggerToast(
                'AI Auto-Closed Auction',
                `"${item.itemTitle}" has been closed. Winner: ${winnerPayload.userName}`
              );
            } catch (error) {
              console.error('AI Auto-Closer failed for item:', item.key, error);
              addLog(`Error auto-closing "${item.itemTitle}": ${error.message}`);
              processingRef.current.delete(item.key);
            }
          }
        }
      }

      if (hasUpdates) {
        dispatch(retrieveItems());
      }
    };

    scanAuctions();

    const interval = setInterval(scanAuctions, 5000); // Poll every 5s for snappy admin closure popups
    return () => clearInterval(interval);
  }, [auctionItems, isActive, dispatch, currentUser]);

  // Force manual scan
  const handleForceScan = () => {
    addLog('Manual AI scan initiated.');
    if (!isActive) {
      addLog('Warning: AI Auto-Closer is currently disabled. Enable it to process.');
      return;
    }
    
    processingRef.current.clear();
    dispatch(retrieveItems()).then(() => {
      addLog('Redux store synced. Scanning...');
      triggerToast('AI Scan Complete', 'Auctions checked and database updated.');
    });
  };

  const getActiveStats = () => {
    if (!auctionItems) return { active: 0, expired: 0, closed: 0 };
    const flatItems = Object.values(auctionItems).flatMap((category) => category);
    const now = new Date();
    let active = 0;
    let expired = 0;
    let closed = 0;

    flatItems.forEach((item) => {
      if (item.winner) {
        closed++;
      } else if (item.auctionDuration && new Date(item.auctionDuration) < now) {
        expired++;
      } else {
        active++;
      }
    });

    return { active, expired, closed };
  };

  const stats = getActiveStats();

  return (
    <>
      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="w-80 p-4 bg-slate-900/90 backdrop-blur-md border border-teal-500/30 rounded-2xl shadow-2xl flex gap-3 text-slate-100 animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto"
          >
            <div className="text-teal-400 text-xl font-bold flex-shrink-0 mt-0.5">🤖</div>
            <div>
              <h4 className="font-bold text-sm text-white">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-1">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Winner Side Popup */}
      {adminPopup && (
        <div className="fixed bottom-24 left-6 w-96 bg-slate-950/95 backdrop-blur-xl border-2 border-teal-500/50 hover:border-teal-400/80 shadow-[0_0_30px_rgba(20,184,166,0.25)] rounded-3xl z-50 overflow-hidden flex flex-col p-6 animate-in slide-in-from-left-6 duration-300">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏆</span>
              <div>
                <h4 className="font-extrabold text-sm text-teal-400 uppercase tracking-wider">Auction Closed!</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Admin Notifications Desk</p>
              </div>
            </div>
            <button
              onClick={() => setAdminPopup(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Item Title</span>
              <span className="font-extrabold text-white text-base bg-slate-900/50 border border-slate-800/80 px-3 py-1.5 rounded-xl block truncate shadow-inner">
                {adminPopup.itemTitle}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/30 border border-slate-900 p-3 rounded-xl">
                <span className="text-slate-400 text-[9px] uppercase font-bold block mb-0.5">Winner</span>
                <span className={`font-bold text-xs truncate block ${adminPopup.wasNoBids ? 'text-amber-400' : 'text-teal-300'}`}>
                  {adminPopup.winnerName}
                </span>
              </div>
              <div className="bg-slate-900/30 border border-slate-900 p-3 rounded-xl">
                <span className="text-slate-400 text-[9px] uppercase font-bold block mb-0.5">Final Amount</span>
                <span className="font-extrabold text-xs text-indigo-300 block">
                  {adminPopup.wasNoBids ? '—' : `$${adminPopup.finalBid}`}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 space-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900/50">
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="font-semibold text-slate-300 uppercase">{adminPopup.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Seller:</span>
                <span className="font-semibold text-slate-300 truncate max-w-[180px]">{adminPopup.owner}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  navigate(`/allItems/${adminPopup.itemId}`);
                  setAdminPopup(null);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                View Listing
              </button>
              <button
                onClick={() => setAdminPopup(null)}
                className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 hover:text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`h-14 w-14 rounded-full flex items-center justify-center relative shadow-3d-elevated transition-all duration-300 cursor-pointer ${
            isExpanded
              ? 'bg-rose-600 hover:bg-rose-500 rotate-90'
              : isActive
              ? 'bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-teal-500/50 hover:border-teal-400'
              : 'bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-slate-700 hover:border-slate-600'
          }`}
          title="AI Auction Manager"
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <>
              {isActive && (
                <div className="absolute inset-0 rounded-full border border-dashed border-teal-400 animate-spin" style={{ animationDuration: '8s' }}></div>
              )}
              <div className={`absolute top-0 right-0 h-3 w-3 rounded-full border border-slate-950 ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></div>
              <span className="text-xl">🤖</span>
            </>
          )}
        </button>
      </div>

      {/* Slide-out Dashboard Panel */}
      {isExpanded && (
        <div className="fixed bottom-24 right-6 w-96 h-[480px] bg-slate-950/95 backdrop-blur-xl border border-slate-800/80 shadow-3d-elevated rounded-3xl z-40 overflow-hidden flex flex-col animate-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-900 flex justify-between items-center bg-slate-900/35">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <h3 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                  AuctioNex AI Agent
                  <span className={`h-2 w-2 rounded-full inline-block ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">Bidding Automation Engine</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Quick Stats Panel */}
          <div className="grid grid-cols-3 text-center border-b border-slate-900/60 py-3 bg-slate-950/20 text-xs">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Active</span>
              <span className="font-extrabold text-indigo-400 text-sm">{stats.active}</span>
            </div>
            <div className="border-x border-slate-900/60">
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Pending AI</span>
              <span className="font-extrabold text-amber-400 text-sm">{stats.expired}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Closed</span>
              <span className="font-extrabold text-teal-400 text-sm">{stats.closed}</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-900/60 bg-slate-900/10">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'terminal'
                  ? 'border-teal-500 text-teal-400 bg-slate-900/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              AI Terminal
            </button>
            <button
              onClick={() => setActiveTab('monitor')}
              className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'monitor'
                  ? 'border-teal-500 text-teal-400 bg-slate-900/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Monitor
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'settings'
                  ? 'border-teal-500 text-teal-400 bg-slate-900/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Control
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0 bg-slate-950/20">
            
            {/* AI Terminal Log Tab */}
            {activeTab === 'terminal' && (
              <div className="h-full flex flex-col font-mono text-[10px] text-slate-300 bg-slate-950/80 p-3 border border-slate-900 rounded-xl overflow-y-auto shadow-inner">
                <div className="flex-1 overflow-y-auto space-y-1.5 leading-relaxed pr-1 select-text">
                  {logs.map((log) => (
                    <div key={log.id} className="hover:bg-slate-900/50 rounded py-0.5 px-1 transition-colors">
                      <span className="text-slate-500">[{log.time}]</span>{' '}
                      <span className={log.text.includes('FAIL') || log.text.includes('Error') ? 'text-rose-400' : log.text.includes('Success') || log.text.includes('Winner') ? 'text-teal-400 font-medium' : ''}>
                        {log.text}
                      </span>
                    </div>
                  ))}
                  <div ref={terminalEndRef}></div>
                </div>
              </div>
            )}

            {/* Monitor Tab */}
            {activeTab === 'monitor' && (
              <div className="h-full space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Auctions Status</h4>
                {(!auctionItems || Object.keys(auctionItems).length === 0) ? (
                  <p className="text-slate-500 text-xs italic text-center py-8">No auctions available.</p>
                ) : (
                  <div className="space-y-2 pr-1">
                    {Object.values(auctionItems)
                      .flatMap((category) => category)
                      .map((item) => {
                        const isExpired = item.auctionDuration && new Date(item.auctionDuration) < new Date();
                        const isWinner = !!item.winner;
                        let statusText = 'Active';
                        let statusColor = 'text-teal-400 bg-teal-950/30 border-teal-500/20';

                        if (isWinner) {
                          statusText = 'Closed';
                          statusColor = 'text-slate-400 bg-slate-900/40 border-slate-800/40';
                        } else if (isExpired) {
                          statusText = 'Pending Closure';
                          statusColor = 'text-amber-400 bg-amber-950/30 border-amber-500/20';
                        }

                        return (
                          <div
                            key={item.key}
                            className="bg-slate-900/40 border border-slate-900 p-3 rounded-xl flex items-center justify-between text-xs transition-colors hover:border-slate-850"
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <h5 className="font-semibold text-white truncate">{item.itemTitle}</h5>
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                Ends: {new Date(item.auctionDuration).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                              </p>
                            </div>
                            <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${statusColor}`}>
                              {statusText}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* Settings & Control Tab */}
            {activeTab === 'settings' && (
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">AI Automation Engine</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Auto-close auctions after duration passes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500 peer-checked:after:bg-white peer-checked:after:border-white"></div>
                      </label>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 leading-relaxed bg-slate-950/50 border border-slate-900/60 p-3 rounded-xl shadow-inner space-y-1.5">
                    <p className="font-semibold text-slate-300">🤖 Engine Parameters:</p>
                    <p>• Polling Cycle: 5,000ms</p>
                    <p>• Method: High-Bid Declarer (Firebase Realtime Database Transaction simulation)</p>
                    <p>• Fallback: No-Bid Grace Closure</p>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <button
                    onClick={handleForceScan}
                    className="w-full py-3 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-750 active:translate-y-0.5 text-xs font-bold rounded-xl text-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>🔄</span> Force Scan & Refresh
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Info */}
          <div className="px-5 py-3 border-t border-slate-900 text-center bg-slate-900/10 text-[9px] text-slate-500 font-semibold tracking-wider uppercase">
            AuctioNex Intelligent Broker v1.0
          </div>

        </div>
      )}
    </>
  );
}

export default AIAuctionManager;

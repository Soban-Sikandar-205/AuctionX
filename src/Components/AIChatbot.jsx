import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { databaseURL } from '../firebaseConfig';
import { AuthContext } from '../context/AuthProvider';

function AIChatbot() {
  const { currentUser } = useContext(AuthContext);
  const { auctionItems } = useSelector((state) => state.auctionDataReducer);

  // Load API Key from environment variables (configured via .env file)
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  
  // UI states
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Hi there! I'm your AuctioNex AI Assistant. How can I help you today? Ask me about active listings, bidding rules, or let me know if you have feedback for the admin!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);



  // Format active items into readable text for Gemini system prompt
  const formatAuctionItems = () => {
    if (!auctionItems || Object.keys(auctionItems).length === 0) {
      return "There are currently no active auctions in the marketplace.";
    }

    let text = "Here are the currently active auction items in the AuctioNex marketplace:\n\n";
    const flatItems = Object.values(auctionItems).flatMap((category) => category);

    flatItems.forEach((item, index) => {
      const isClosed = !!item.winner;
      const isExpired = item.auctionDuration && new Date(item.auctionDuration) < new Date();
      
      text += `${index + 1}. Title: ${item.itemTitle}\n`;
      text += `   - Category: ${item.category}\n`;
      text += `   - Current/Starting Bid: $${item.startingBid}\n`;
      text += `   - Seller/Owner: ${item.itemOwner}\n`;
      text += `   - Status: ${isClosed ? 'Closed (Winner declared)' : isExpired ? 'Expired' : 'Active'}\n`;
      text += `   - Ends at: ${item.auctionDuration}\n`;
      text += `   - Description: ${item.description}\n`;
      
      const bids = item.recentBids ? Object.values(item.recentBids) : [];
      if (bids.length > 0) {
        text += `   - Bids: ${bids.length} placed. Highest bid: $${[...bids].sort((a,b)=>b.bid-a.bid)[0].bid}\n`;
      } else {
        text += `   - Bids: No bids placed yet.\n`;
      }
      text += "\n";
    });

    return text;
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isTyping) return;

    // Add user message to log
    const userMessage = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Build active listings text
      const itemsContext = formatAuctionItems();

      // System Instructions
      const systemInstruction = `You are the AuctioNex AI Assistant, a friendly and interactive chatbot built inside the AuctioNex Premium Auction Platform.

YOUR SCOPE & RESTRICTIONS:
1. You are strictly restricted to discussing the AuctioNex app, its files, operations, and the items listed in the marketplace.
2. If the user asks about anything unrelated to AuctioNex, its features, or its items (like cooking, code development outside this app, math, or other general knowledge), politely decline to answer and guide them back to AuctioNex.
3. If they ask about bidding instructions: Bidders place higher bids than the current bid. Item owners cannot bid on their own listings.

ACTIVE MARKETPLACE ITEMS & DATA:
${itemsContext}

FEEDBACK COLLECTION:
- Your second primary role is to seek user feedback and suggestions about their experience.
- If the user provides feedback, suggestions, or comments about the app, acknowledge it warmly and end your message with a special tag: [FEEDBACK_SUBMIT: <feedback text>].
- The feedback text inside the tag must be a concise summary of the user's feedback. E.g. [FEEDBACK_SUBMIT: The dark mode layout is beautiful but could use faster bidding load times.]
- Crucial: The tag MUST be at the very end of your response, formatted EXACTLY as [FEEDBACK_SUBMIT: <feedback text>]. Do not change this structure. If there is no feedback, do not include this tag.`;

      // Build chat history content for Gemini API format
      // Map existing messages to Gemini format (user -> user, bot -> model)
      const contents = messages
        .filter((m) => !m.text.includes("API Key")) // exclude helper prompt messages
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      // Append new user message
      contents.push({
        role: 'user',
        parts: [{ text }]
      });

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          }
        }
      );

      const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't get that. Please try again.";
      
      // Check for feedback tag
      let cleanText = responseText;
      const feedbackMatch = responseText.match(/\[FEEDBACK_SUBMIT:\s*(.*?)\]/s);

      if (feedbackMatch) {
        const feedbackContent = feedbackMatch[1];
        // Clean the tag out of the text displayed to the user
        cleanText = responseText.replace(/\[FEEDBACK_SUBMIT:\s*(.*?)\]/gs, '').trim();

        // Submit feedback to Firebase
        try {
          await axios.post(`${databaseURL}/Feedbacks.json`, {
            userEmail: currentUser?.email || 'Chatbot Guest',
            text: `[Submitted via AI Chatbot] ${feedbackContent}`,
            timestamp: new Date().toISOString()
          });

          setFeedbackToast("Your feedback has been sent to the Admin! Thank you!");
          setTimeout(() => setFeedbackToast(null), 4000);
        } catch (fbErr) {
          console.error("Failed to post chatbot feedback to Firebase:", fbErr);
        }
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: cleanText }
      ]);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "⚠️ I encountered an error communicating with the AI. Please verify your API Key or connection."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // Suggestion Chips
  const suggestions = [
    "What items are active?",
    "How does AuctioNex work?",
    "I have feedback for the app!",
    "List active Electronics"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-24 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 w-14 rounded-full flex items-center justify-center relative shadow-3d-elevated transition-all duration-300 cursor-pointer ${
            isOpen
              ? 'bg-rose-600 hover:bg-rose-500 rotate-90'
              : 'bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-indigo-500/50 hover:border-indigo-400'
          }`}
          title="AuctioNex Support Assistant"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-24 w-96 h-[520px] bg-slate-950/95 backdrop-blur-xl border border-slate-800/80 shadow-3d-elevated rounded-3xl z-40 overflow-hidden flex flex-col animate-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-900 flex justify-between items-center bg-slate-900/35">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <span className="text-2xl">🤖</span>
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-indigo-400 border border-slate-950"></span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white tracking-tight">AuctioNex AI Support</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Gemini 1.5 Assistant</p>
              </div>
            </div>

          </div>

          {/* Feedback Success Notification */}
          {feedbackToast && (
            <div className="bg-emerald-950/80 border-b border-emerald-500/30 text-emerald-300 py-2 px-4 text-center text-xs font-semibold animate-pulse flex items-center justify-center gap-1.5 shadow-md">
              <span>📩</span> {feedbackToast}
            </div>
          )}

          {/* Chat Container */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0 space-y-4 bg-slate-950/20">
            {/* Message logs */}
            <>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed select-text shadow-sm ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-tr-none'
                        : 'bg-slate-900/90 border border-slate-850/60 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/90 border border-slate-850/60 text-slate-400 max-w-[80%] rounded-2xl rounded-tl-none p-3.5 text-xs flex items-center gap-1.5 shadow-sm">
                    <span className="text-xs">🤖 Thinking</span>
                    <span className="flex gap-0.5">
                      <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </>
          </div>

          {/* Quick Suggestions & Input Controls */}
          {apiKey && (
            <div className="p-3 border-t border-slate-900/80 bg-slate-950/40">
              
              {/* Suggestion Chips */}
              <div className="flex gap-2 overflow-x-auto pb-2 pr-1 scrollbar-none select-none">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="flex-shrink-0 px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-semibold text-slate-400 hover:text-teal-400 rounded-full transition-colors cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Message Entry Box */}
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  placeholder="Ask about active items, layout, or leave feedback..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                  className="flex-1 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none text-xs disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isTyping || !inputValue.trim()}
                  className="p-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>

            </div>
          )}

          {/* Footer Branding */}
          <div className="px-5 py-2.5 border-t border-slate-900 text-center bg-slate-900/10 text-[9px] text-slate-500 font-semibold tracking-wider uppercase">
            Restricted AI Assistant
          </div>

        </div>
      )}
    </>
  );
}

export default AIChatbot;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { databaseURL } from '../firebaseConfig';
import { AuthContext } from '../context/AuthProvider';
import Spinner from '../Components/utils/Spinner';

function Feedback() {
  const { currentUser } = useContext(AuthContext);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  const isAdmin = currentUser?.email === 'admin@auctionex.com';

  useEffect(() => {
    if (isAdmin) {
      fetchFeedbacks();
    }
  }, [isAdmin]);

  const fetchFeedbacks = async () => {
    setLoadingFeedbacks(true);
    try {
      const res = await axios.get(`${databaseURL}/Feedbacks.json`);
      if (res.data) {
        const feedbackList = Object.keys(res.data).map(key => ({
          id: key,
          ...res.data[key]
        })).reverse();
        setFeedbacks(feedbackList);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    setMessage('');
    try {
      await axios.post(`${databaseURL}/Feedbacks.json`, {
        userEmail: currentUser?.email || 'Anonymous',
        text: feedbackText,
        timestamp: new Date().toISOString()
      });
      setMessage('Thank you for your feedback!');
      setFeedbackText('');
      if (isAdmin) fetchFeedbacks();
    } catch (error) {
      setMessage('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl lg:text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-slate-200 to-teal-300 bg-clip-text text-transparent tracking-tight">
        Feedback & Suggestions
      </h2>

      <div className="max-w-2xl mx-auto glass-card-dark p-6 rounded-2xl border border-slate-800/60 shadow-3d-elevated">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-slate-300 font-semibold mb-2">We value your thoughts! Tell us how we can improve.</label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows="5"
            placeholder="Write your suggestion here..."
            className="w-full p-4 rounded-xl input-3d bg-slate-900/60 border-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none"
            required
          ></textarea>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-4 text-white font-bold rounded-xl btn-3d-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
          
          {message && (
            <p className={`text-center font-semibold ${message.includes('Thank') ? 'text-teal-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}
        </form>
      </div>

      {isAdmin && (
        <div className="mt-12 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">Admin View: User Feedbacks</h3>
          {loadingFeedbacks ? (
            <Spinner />
          ) : feedbacks.length > 0 ? (
            <div className="space-y-4">
              {feedbacks.map(fb => (
                <div key={fb.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span className="font-semibold text-teal-300">{fb.userEmail}</span>
                    <span>{new Date(fb.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-200">{fb.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No feedback received yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Feedback;

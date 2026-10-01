import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import EmailVerificationBanner from '../components/EmailVerificationBanner';
import Loader from '../components/Loader';
const Dashboard = () => {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [recentReqs, setRecentReqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        // Fetch recent
        const { data: recentData, error: recentError } = await supabase
          .from('research_submissions')
          .select('id, reference_id, industry, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (recentError) throw recentError;
        setRecentReqs(recentData || []);

        // Fetch stats
        const { data: allData, error: allError } = await supabase
          .from('research_submissions')
          .select('status')
          .eq('user_id', user.id);
        
        if (allError) throw allError;
        
        const total = allData?.length || 0;
        const pending = allData?.filter(r => r.status === 'Pending').length || 0;
        const completed = allData?.filter(r => r.status === 'Completed').length || 0;
        
        setStats({ total, pending, completed });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'in progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    }
  };

  return (
    <div className="bg-background text-on-background dark:bg-dark-navy dark:text-surface-container-lowest font-body-md transition-colors duration-300 min-h-screen">
      <Navigation />
      
      <main className="pt-32 pb-section-gap-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto">
        <div className="mb-10">
          <h1 className="font-headline-lg text-headline-lg text-primary dark:text-white mb-2">
            Welcome, {profile?.full_name || 'User'}
          </h1>
          <p className="text-on-surface-variant dark:text-on-surface-variant text-lg">
            Manage your research requirements and track their progress.
          </p>
        </div>

        <EmailVerificationBanner profile={profile} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface-container-lowest dark:bg-white/10 rounded-2xl p-6 border border-border-slate/50 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-accent-blue">
                <span className="material-symbols-outlined text-2xl">folder_open</span>
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface-variant dark:text-on-surface-variant">Total Submissions</p>
                <p className="text-3xl font-bold text-primary dark:text-white">{loading ? '-' : stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest dark:bg-white/10 rounded-2xl p-6 border border-border-slate/50 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                <span className="material-symbols-outlined text-2xl">pending_actions</span>
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface-variant dark:text-on-surface-variant">Pending Review</p>
                <p className="text-3xl font-bold text-primary dark:text-white">{loading ? '-' : stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-white/10 rounded-2xl p-6 border border-border-slate/50 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                <span className="material-symbols-outlined text-2xl">task_alt</span>
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface-variant dark:text-on-surface-variant">Completed</p>
                <p className="text-3xl font-bold text-primary dark:text-white">{loading ? '-' : stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-surface-container-lowest dark:bg-white/10 rounded-3xl border border-border-slate/50 dark:border-white/5 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 flex justify-between items-center border-b border-border-slate/50 dark:border-white/10">
            <h2 className="font-headline-md text-headline-md text-primary dark:text-white">Recent Requirements</h2>
            <Link to="/my-requirements" className="text-accent-blue hover:underline font-bold text-sm flex items-center gap-1">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          
          <div className="p-6 md:p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader size="lg" color="primary" className="mb-4" />
                <span className="text-on-surface-variant dark:text-on-surface-variant font-medium">Loading...</span>
              </div>
            ) : recentReqs.length > 0 ? (
              <div className="space-y-4">
                {recentReqs.map(req => (
                  <Link to={`/requirements/${req.id}`} key={req.id} className="block bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 p-5 rounded-2xl border border-border-slate/50 dark:border-white/5 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-xs font-bold text-accent-blue bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">{req.reference_id}</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusColor(req.status)}`}>
                            {req.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-primary dark:text-white">{req.industry}</h3>
                      </div>
                      <div className="text-sm text-on-surface-variant dark:text-on-surface-variant font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        {formatDate(req.created_at)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-black/10 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant dark:text-on-surface-variant">
                  <span className="material-symbols-outlined text-3xl">inbox</span>
                </div>
                <h3 className="font-bold text-lg text-primary dark:text-white mb-2">No requirements yet</h3>
                <p className="text-on-surface-variant dark:text-on-surface-variant mb-6">Submit your first research requirement to get started.</p>
                <Link to="/submit" className="bg-primary  text-white dark:bg-white/10 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-blue-600 transition-colors">
                  <span className="material-symbols-outlined">add</span>
                  Submit Requirement
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

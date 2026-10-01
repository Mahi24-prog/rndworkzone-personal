import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Loader from '../components/Loader';
const MyRequirements = () => {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequirements = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('research_submissions')
          .select('id, reference_id, industry, requirement, format, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setRequirements(data || []);
      } catch (error) {
        console.error('Error fetching requirements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
      case 'in progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
      default: return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
    }
  };

  return (
    <div className="bg-background text-on-background dark:bg-dark-navy dark:text-surface-container-lowest font-body-md transition-colors duration-300 min-h-screen">
      <Navigation />
      
      <main className="pt-32 pb-section-gap-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary dark:text-white mb-2">
              My Requirements
            </h1>
            <p className="text-on-surface-variant dark:text-on-surface-variant text-lg">
              View and track all your submitted research requirements.
            </p>
          </div>
          <Link to="/submit" className="bg-primary  text-white dark:bg-white/10 px-6 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            <span className="material-symbols-outlined">add</span>
            Submit New
          </Link>
        </div>

        <div className="bg-surface-container-lowest dark:bg-white/10 rounded-3xl border border-border-slate/50 dark:border-white/5 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader size="xl" color="primary" className="mb-4" />
              <span className="text-on-surface-variant dark:text-on-surface-variant font-medium">Loading requirements...</span>
            </div>
          ) : requirements.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5 border-b border-border-slate/50 dark:border-white/10">
                    <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">Ref ID</th>
                    <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">Industry & Requirement</th>
                    <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">Format</th>
                    <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">Date</th>
                    <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-slate/30 dark:divide-white/5">
                  {requirements.map((req) => (
                    <tr key={req.id} className="hover:bg-black/5 dark:hover:bg-white-[0.02] transition-colors group">
                      <td className="p-4 md:p-6 align-top">
                        <span className="font-mono text-xs font-bold text-accent-blue bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded inline-block whitespace-nowrap">
                          {req.reference_id}
                        </span>
                      </td>
                      <td className="p-4 md:p-6 align-top max-w-md">
                        <div className="font-bold text-primary dark:text-white mb-1">{req.industry}</div>
                        <div className="text-sm text-on-surface-variant dark:text-on-surface-variant line-clamp-2">
                          {req.requirement}
                        </div>
                      </td>
                      <td className="p-4 md:p-6 align-top text-sm text-on-surface-variant dark:text-on-surface-variant">
                        {req.format || 'Not specified'}
                      </td>
                      <td className="p-4 md:p-6 align-top text-sm text-on-surface-variant dark:text-on-surface-variant whitespace-nowrap">
                        {formatDate(req.created_at)}
                      </td>
                      <td className="p-4 md:p-6 align-top">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 md:p-6 align-top text-right">
                        <Link to={`/requirements/${req.id}`} className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-black/10 dark:bg-white/10 text-primary dark:text-white hover:bg-accent-blue hover:text-white dark:hover:bg-accent-blue transition-colors">
                          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 px-4">
              <div className="w-20 h-20 bg-black/10 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-on-surface-variant dark:text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl">inventory_2</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary dark:text-white mb-3">No requirements found</h3>
              <p className="text-on-surface-variant dark:text-on-surface-variant mb-8 max-w-md mx-auto text-lg">
                You haven't submitted any research requirements yet. Click the button below to get started.
              </p>
              <Link to="/submit" className="bg-primary  text-white dark:bg-white/10 px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg">
                <span className="material-symbols-outlined">add</span>
                Submit Requirement
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyRequirements;

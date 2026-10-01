import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminNavigation from '../../components/AdminNavigation';
import CustomSelect from '../../components/CustomSelect';
import { supabase } from '../../lib/supabase';
import Loader from '../../components/Loader';
import { useAuth } from '../../contexts/AuthContext';
import EmailVerificationBanner from '../../components/EmailVerificationBanner';

const AdminRequirements = () => {
  const { profile } = useAuth();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('research_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (profile?.role === 'expert') {
        const expertIndustries = profile?.industries || [];
        if (expertIndustries.length > 0) {
          query = query.in('industry', expertIndustries);
        } else {
          // If the expert has no industries assigned, they should see NO requirements.
          // By searching for an impossible value, we guarantee an empty result.
          query = query.eq('id', '00000000-0000-0000-0000-000000000000');
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setRequirements(data || []);
    } catch (error) {
      console.error('Error fetching requirements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filePath) => {
    if (!filePath) return;

    try {
      const { data, error } = await supabase.storage
        .from("requirements")
        .createSignedUrl(filePath, 60);

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (err) {
      console.error("Error generating download link:", err);
      alert("Failed to generate download link. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
      case 'in progress':
      case 'testing':
      case 'delivery':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
      case 'assigned':
      case 'under review':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800';
      case 'on hold':
      case 'deferred':
      case 'in backlog':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400 border border-slate-200 dark:border-slate-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-200 dark:border-gray-800';
      case 'payment in process':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800';
      case 'pending':
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
    }
  };

  const filteredReqs = requirements.filter(req => {
    const matchesSearch = 
      (req.reference_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.industry || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-background text-on-background dark:bg-dark-navy dark:text-surface-container-lowest font-body-md transition-colors duration-300 min-h-screen">
      <AdminNavigation />
      
      <main className="pt-32 pb-section-gap-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto">
        {profile?.role === 'expert' && <EmailVerificationBanner profile={profile} />}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary dark:text-white mb-2">
              All Requirements
            </h1>
            <p className="text-on-surface-variant dark:text-on-surface-variant text-lg">
              Manage and track all research submissions.
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest dark:bg-white/10 rounded-3xl border border-border-slate/50 dark:border-white/5 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 md:p-6 border-b border-border-slate/50 dark:border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-black/5 dark:bg-white-[0.02]">
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-on-surface-variant">search</span>
              <input 
                type="text" 
                placeholder="Search by ID, name, email or industry..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-navy border border-border-slate dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-blue dark:focus:border-accent-blue text-sm text-on-surface dark:text-white"
              />
            </div>
            <div className="flex items-center justify-end gap-4 w-full md:w-96">
              <CustomSelect
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'Draft', label: 'Draft' },
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Under Review', label: 'Under Review' },
                  { value: 'In Backlog', label: 'In Backlog' },
                  { value: 'Deferred', label: 'Deferred' },
                  { value: 'Approved', label: 'Approved' },
                  { value: 'Assigned', label: 'Assigned' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Testing', label: 'Testing' },
                  { value: 'Delivery', label: 'Delivery' },
                  { value: 'Payment in Process', label: 'Payment in Process' },
                  { value: 'Completed', label: 'Completed' },
                  { value: 'Rejected', label: 'Rejected' },
                  { value: 'Cancelled', label: 'Cancelled' },
                  { value: 'On Hold', label: 'On Hold' }
                ]}
                className="w-full px-4 py-2.5 bg-white dark:bg-dark-navy border border-border-slate dark:border-white/10 rounded-xl text-on-surface dark:text-white text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/5 dark:bg-white/5 border-b border-border-slate/50 dark:border-white/10">
                  <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">Ref ID</th>
                  <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">Details</th>
                  <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">Client</th>
                  <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">Date</th>
                  <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">Last Updated By</th>
                  <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/30 dark:divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8">
                      <div className="flex flex-col items-center justify-center py-8">
                        <Loader size="lg" color="primary" className="mb-4" />
                        <span className="text-on-surface-variant dark:text-on-surface-variant font-medium">Loading requirements...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredReqs.length > 0 ? (
                  filteredReqs.map((req) => (
                    <tr key={req.id} className="hover:bg-black/5 dark:hover:bg-white-[0.02] transition-colors group">
                      <td className="p-4 md:p-6 align-top">
                        <span className="font-mono text-xs font-bold text-accent-blue bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded inline-block whitespace-nowrap">
                          {req.reference_id}
                        </span>
                      </td>
                      <td className="p-4 md:p-6 align-top max-w-sm">
                        <div className="font-bold text-primary dark:text-white mb-1">{req.industry}</div>
                        <div className="text-sm text-on-surface-variant dark:text-on-surface-variant line-clamp-2 mb-2">
                          {req.requirement}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                            {req.format || 'Unspecified'}
                          </span>
                          {req.file_name && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDownload(req.file_path);
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 px-3 py-1.5 rounded-lg border border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800 shadow-sm transition-all cursor-pointer"
                              title={`Download ${req.file_name}`}
                            >
                              <span className="material-symbols-outlined text-[14px]">download</span>
                              Download Attached File
                            </button>
                          )}
                          {req.admin_notes && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                              <span className="material-symbols-outlined text-[12px]">note</span>
                              Note
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 md:p-6 align-top text-sm">
                        <div className="font-bold text-primary dark:text-white">{req.full_name}</div>
                        <div className="text-on-surface-variant dark:text-on-surface-variant text-xs">{req.email}</div>
                        {req.organization && <div className="text-on-surface-variant dark:text-on-surface-variant text-xs mt-1">{req.organization}</div>}
                      </td>
                      <td className="p-4 md:p-6 align-top text-sm text-on-surface-variant dark:text-on-surface-variant whitespace-nowrap">
                        {formatDate(req.created_at)}
                      </td>
                      <td className="p-4 md:p-6 align-top">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 md:p-6 align-top text-sm text-on-surface-variant dark:text-on-surface-variant">
                        {req.last_updated_by ? req.last_updated_by : '-'}
                      </td>
                      <td className="p-4 md:p-6 align-top text-right">
                        <Link to={`/admin/requirements/${req.id}`} className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-black/10 dark:bg-white/10 text-primary dark:text-white hover:bg-accent-blue hover:text-white dark:hover:bg-accent-blue transition-colors text-sm font-bold">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-on-surface-variant dark:text-on-surface-variant">
                      No requirements match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminRequirements;

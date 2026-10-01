import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNavigation from "../../components/AdminNavigation";
import { supabase } from "../../lib/supabase";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReqs: 0,
    pending: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentReqs, setRecentReqs] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats (using full counts, not selecting all data for efficiency)
        const [
          { count: userCount },
          { count: reqCount },
          { count: pendingCount },
          { count: completedCount },
        ] = await Promise.all([
          supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .neq("role", "super_admin"),
          supabase
            .from("research_submissions")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("research_submissions")
            .select("*", { count: "exact", head: true })
            .eq("status", "Pending"),
          supabase
            .from("research_submissions")
            .select("*", { count: "exact", head: true })
            .eq("status", "Completed"),
        ]);

        setStats({
          totalUsers: userCount || 0,
          totalReqs: reqCount || 0,
          pending: pendingCount || 0,
          completed: completedCount || 0,
        });

        // Fetch recent users
        const { data: users } = await supabase
          .from("profiles")
          .select("id, full_name, is_email_verified")
          .neq("role", "super_admin")
          .order("id", { ascending: false }) // Assuming newer users have newer UUIDs, though created_at is better if available
          .limit(3);
        setRecentUsers(users || []);

        // Fetch recent requirements
        const { data: reqs } = await supabase
          .from("research_submissions")
          .select("id, reference_id, industry, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5);
        setRecentReqs(reqs || []);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.role === "super_admin") {
      fetchDashboardData();
    } else if (profile?.role === "expert") {
      navigate("/admin/requirements");
    }
  }, [profile, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "in progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    }
  };

  return (
    <div className="bg-background text-on-background dark:bg-dark-navy dark:text-surface-container-lowest font-body-md transition-colors duration-300 min-h-screen">
      <AdminNavigation />

      <main className="pt-32 pb-section-gap-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary dark:text-white mb-2 flex items-center gap-3">
              <span className="material-symbols-outlined text-error text-3xl">
                manage_accounts
              </span>
              Super Admin Dashboard
            </h1>
            <p className="text-on-surface-variant dark:text-on-surface-variant text-lg">
              System overview and metrics.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface-container-lowest dark:bg-white/10 rounded-2xl p-6 border border-border-slate/50 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">
                Total Users
              </p>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                <span className="material-symbols-outlined text-xl">group</span>
              </div>
            </div>
            <p className="text-4xl font-bold text-primary dark:text-white">
              {loading ? "-" : stats.totalUsers}
            </p>
          </div>

          <div className="bg-surface-container-lowest dark:bg-white/10 rounded-2xl p-6 border border-border-slate/50 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">
                All Requirements
              </p>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-accent-blue">
                <span className="material-symbols-outlined text-xl">
                  folder_open
                </span>
              </div>
            </div>
            <p className="text-4xl font-bold text-primary dark:text-white">
              {loading ? "-" : stats.totalReqs}
            </p>
          </div>

          <div className="bg-surface-container-lowest dark:bg-white/10 rounded-2xl p-6 border border-border-slate/50 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">
                Pending
              </p>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                <span className="material-symbols-outlined text-xl">
                  pending_actions
                </span>
              </div>
            </div>
            <p className="text-4xl font-bold text-primary dark:text-white">
              {loading ? "-" : stats.pending}
            </p>
          </div>

          <div className="bg-surface-container-lowest dark:bg-white/10 rounded-2xl p-6 border border-border-slate/50 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">
                Completed
              </p>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                <span className="material-symbols-outlined text-xl">
                  task_alt
                </span>
              </div>
            </div>
            <p className="text-4xl font-bold text-primary dark:text-white">
              {loading ? "-" : stats.completed}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Requirements */}
          <div className="lg:col-span-2 bg-surface-container-lowest dark:bg-white/10 rounded-3xl border border-border-slate/50 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border-slate/50 dark:border-white/10 flex justify-between items-center">
              <h2 className="font-headline-sm text-headline-sm text-primary dark:text-white font-bold">
                Latest Requirements
              </h2>
              <Link
                to="/admin/requirements"
                className="text-accent-blue hover:underline font-bold text-sm"
              >
                View All
              </Link>
            </div>
            <div className="p-0 flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader size="md" color="primary" className="mb-2" />
                  <span className="text-on-surface-variant dark:text-on-surface-variant text-sm font-medium">Loading...</span>
                </div>
              ) : recentReqs.length > 0 ? (
                <div className="divide-y divide-border-slate/30 dark:divide-white/5">
                  {recentReqs.map((req) => (
                    <Link
                      to={`/admin/requirements/${req.id}`}
                      key={req.id}
                      className="flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white-[0.02] transition-colors group"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-accent-blue">
                            {req.reference_id}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(req.status)}`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-primary dark:text-white group-hover:text-accent-blue transition-colors">
                          {req.industry}
                        </h3>
                      </div>
                      <div className="text-xs text-on-surface-variant dark:text-on-surface-variant">
                        {formatDate(req.created_at)}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-on-surface-variant dark:text-on-surface-variant">
                  No requirements found.
                </div>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-surface-container-lowest dark:bg-white/10 rounded-3xl border border-border-slate/50 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border-slate/50 dark:border-white/10 flex justify-between items-center">
              <h2 className="font-headline-sm text-headline-sm text-primary dark:text-white font-bold">
                Newest Users
              </h2>
              <Link
                to="/admin/users"
                className="text-accent-blue hover:underline font-bold text-sm"
              >
                View All
              </Link>
            </div>
            <div className="p-0 flex-1">
              {loading ? (
                <div className="p-8 text-center text-on-surface-variant dark:text-on-surface-variant">
                  Loading...
                </div>
              ) : recentUsers.length > 0 ? (
                <div className="divide-y divide-border-slate/30 dark:divide-white/5">
                  {recentUsers.map((u) => (
                    <Link
                      to={`/admin/users/${u.id}`}
                      key={u.id}
                      className="flex items-center gap-3 p-4 hover:bg-black/5 dark:hover:bg-white-[0.02] transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white font-bold shrink-0 group-hover:bg-accent-blue group-hover:text-white transition-colors">
                        {u.full_name ? (
                          u.full_name.charAt(0).toUpperCase()
                        ) : (
                          <span className="material-symbols-outlined text-sm">
                            person
                          </span>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-sm text-primary dark:text-white truncate">
                          {u.full_name || "Unnamed User"}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          {u.is_email_verified ? (
                            <span className="material-symbols-outlined text-[12px] text-emerald-500">
                              verified
                            </span>
                          ) : (
                            <span className="material-symbols-outlined text-[12px] text-amber-500">
                              pending
                            </span>
                          )}
                          <span className="text-[11px] text-on-surface-variant dark:text-on-surface-variant">
                            {u.is_email_verified ? "Verified" : "Unverified"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-on-surface-variant dark:text-on-surface-variant">
                  No users found.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

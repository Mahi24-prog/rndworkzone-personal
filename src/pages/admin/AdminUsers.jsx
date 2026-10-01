import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavigation from "../../components/AdminNavigation";
import CreateExpertModal from "../../components/CreateExpertModal";
import { supabase } from "../../lib/supabase";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/AuthContext";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.role === "expert") {
      navigate("/admin/requirements");
      return;
    }
    fetchUsers();
  }, [profile, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Need to use inner join to auth.users if we wanted emails, but we only have access to profiles via public schema RLS.
      // Supabase RLS on auth.users is very restrictive. But wait, we can't easily join auth.users without service role.
      // Wait, profiles doesn't contain email by default.
      // Let's check if profiles table has email. If not, admin won't see emails in this list unless we added an email column.
      // Usually users will just rely on full_name and we can see email inside AdminUserDetails via a secure RPC, but for now we list profiles.
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("role", "super_admin")
        .order("id", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      // First, fetch the user's research submissions to get any associated file_paths
      const { data: userSubmissions, error: fetchSubError } = await supabase
        .from('research_submissions')
        .select('file_path')
        .eq('user_id', userToDelete.id);

      if (fetchSubError) {
        console.error("Error fetching user submissions:", fetchSubError);
      }

      // Extract file paths that are not null
      const filePathsToDelete = (userSubmissions || [])
        .map(sub => sub.file_path)
        .filter(path => path); // removes nulls/undefined

      // Delete the files from storage using exact file paths
      if (filePathsToDelete.length > 0) {
        try {
          const { error: removeError } = await supabase.storage
            .from('requirements')
            .remove(filePathsToDelete);
          if (removeError) {
            console.error("Error removing user files:", removeError);
          }
        } catch (err) {
          console.error("Storage cleanup error:", err);
        }
      }

      // Now delete associated research submissions to avoid foreign key constraint error
      const { error: subError } = await supabase
        .from('research_submissions')
        .delete()
        .eq('user_id', userToDelete.id);

      if (subError) {
        console.error("Error deleting associated submissions:", subError);
      }

      const { error } = await supabase.rpc('delete_user', { target_user_id: userToDelete.id });
      if (error) throw error;
      
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.message || "Failed to delete user. Please ensure the delete_user RPC is installed.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.id || "").toLowerCase().includes(searchTerm.toLowerCase());
      
    if (activeTab === "users") {
      return matchesSearch && u.role !== "expert";
    } else {
      return matchesSearch && u.role === "expert";
    }
  });

  return (
    <div className="bg-background text-on-background dark:bg-dark-navy dark:text-surface-container-lowest font-body-md transition-colors duration-300 min-h-screen">
      <AdminNavigation />

      <main className="pt-32 pb-section-gap-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary dark:text-white mb-2">
              Users Management
            </h1>
            <p className="text-on-surface-variant dark:text-on-surface-variant text-lg">
              View and manage all registered users.
            </p>
          </div>
          <div>
            <button
              onClick={() => setIsExpertModalOpen(true)}
              className="px-5 py-2.5 bg-primary text-white dark:bg-white/10 hover:bg-blue-600 dark:hover:bg-white/20 rounded-xl font-bold transition-all shadow-sm hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">
                person_add
              </span>
              Create Expert
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button 
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "users" 
                ? "bg-primary text-white shadow-md shadow-primary/20 dark:bg-accent-blue dark:shadow-accent-blue/20" 
                : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm"
            }`}
          >
            Regular Users
          </button>
          <button 
            onClick={() => setActiveTab("experts")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "experts" 
                ? "bg-primary text-white shadow-md shadow-primary/20 dark:bg-accent-blue dark:shadow-accent-blue/20" 
                : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm"
            }`}
          >
            Experts
          </button>
        </div>

        <div className="bg-surface-container-lowest dark:bg-white/10 rounded-3xl border border-border-slate/50 dark:border-white/5 shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-border-slate/50 dark:border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-black/5 dark:bg-white-[0.02]">
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-navy border border-border-slate dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-blue dark:focus:border-accent-blue text-sm text-on-surface dark:text-white"
              />
            </div>
            <div className="text-sm text-on-surface-variant dark:text-on-surface-variant font-medium">
              Total Users: {filteredUsers.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/5 dark:bg-white/5 border-b border-border-slate/50 dark:border-white/10">
                  <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">
                    User
                  </th>
                  <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">
                    Email ID
                  </th>
                  <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">
                    Role
                  </th>
                  <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/30 dark:divide-white/5">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8"
                    >
                      <div className="flex flex-col items-center justify-center py-8">
                        <Loader size="lg" color="primary" className="mb-4" />
                        <span className="text-on-surface-variant dark:text-on-surface-variant font-medium">Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-black/5 dark:hover:bg-white-[0.02] transition-colors group"
                    >
                      <td className="p-4 md:p-6 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white font-bold shrink-0">
                            {user.full_name ? (
                              user.full_name.charAt(0).toUpperCase()
                            ) : (
                              <span className="material-symbols-outlined text-sm">
                                person
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-primary dark:text-white">
                              {user.full_name || "Unnamed User"}
                            </span>
                            <span className="font-mono text-[11px] text-on-surface-variant dark:text-on-surface-variant bg-black/10 dark:bg-white/5 px-2 py-0.5 rounded mt-1 w-fit">
                              {user.id.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 align-middle">
                        <span className="text-sm text-on-surface dark:text-white">
                          {user.email || "N/A"}
                        </span>
                      </td>
                      <td className="p-4 md:p-6 align-middle">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            user.role === "super_admin"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                              : user.role === "expert"
                              ? "bg-blue-100 text-accent-blue dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-surface-container-highest dark:bg-white/10 text-on-surface-variant dark:text-on-surface-variant"
                          }`}
                        >
                          {user.role === "super_admin" ? "Admin" : user.role === "expert" ? "Expert" : "User"}
                        </span>
                      </td>
                      <td className="p-4 md:p-6 align-middle">
                        <div className="flex items-center gap-1.5">
                          {user.is_email_verified ? (
                            <span className="material-symbols-outlined text-[16px] text-emerald-500">
                              verified
                            </span>
                          ) : (
                            <span className="material-symbols-outlined text-[16px] text-amber-500">
                              pending
                            </span>
                          )}
                          <span className="text-sm text-on-surface-variant dark:text-on-surface-variant">
                            {user.is_email_verified ? "Verified" : "Unverified"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/users/${user.id}`}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-black/10 dark:bg-white/10 text-primary dark:text-white hover:bg-accent-blue hover:text-white dark:hover:bg-accent-blue transition-colors text-sm font-bold"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => setUserToDelete(user)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-error/10 text-error hover:bg-error hover:text-white transition-colors"
                            title="Delete User"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center text-on-surface-variant dark:text-on-surface-variant"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <CreateExpertModal
        isOpen={isExpertModalOpen}
        onClose={() => setIsExpertModalOpen(false)}
        onSuccess={fetchUsers}
      />

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-container-lowest dark:bg-dark-navy border border-border-slate/50 dark:border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-scale-up">
            <div className="flex items-center gap-4 text-error mb-4">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-white">
                Delete User?
              </h3>
            </div>
            
            <p className="text-on-surface-variant dark:text-on-surface-variant mb-2">
              Are you sure you want to delete <strong className="text-on-surface dark:text-white">{userToDelete.full_name || 'this user'}</strong>? 
            </p>
            <p className="text-sm text-on-surface-variant/80 dark:text-on-surface-variant/80 mb-8">
              This action cannot be undone. All of their data, including profile and authentication records, will be permanently removed.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3.5 px-4 rounded-xl font-bold bg-black/5 dark:bg-white/5 text-on-surface dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="flex-1 py-3.5 px-4 rounded-xl font-bold bg-error text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-error/20 disabled:opacity-50 disabled:shadow-none"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader size="sm" color="white" /> Deleting...
                  </span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

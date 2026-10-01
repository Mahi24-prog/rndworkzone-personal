import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AdminNavigation from "../../components/AdminNavigation";
import { supabase } from "../../lib/supabase";
import Loader from "../../components/Loader";
import CustomMultiSelect from "../../components/CustomMultiSelect";
import { industryOptions } from "../../components/CreateExpertModal";

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for editing industries
  const [isEditingIndustries, setIsEditingIndustries] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [updatingIndustries, setUpdatingIndustries] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        if (profileError) throw profileError;
        setUserProfile(profile);
        setSelectedIndustries(profile.industries || []);

        // Fetch user requirements
        const { data: reqs, error: reqsError } = await supabase
          .from("research_submissions")
          .select("*")
          .eq("user_id", id)
          .order("created_at", { ascending: false });

        if (reqsError) throw reqsError;
        setRequirements(reqs || []);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const handleUpdateIndustries = async () => {
    setUpdatingIndustries(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ industries: selectedIndustries })
        .eq('id', id);

      if (error) throw error;
      
      setUserProfile(prev => ({ ...prev, industries: selectedIndustries }));
      setIsEditingIndustries(false);
    } catch (err) {
      console.error("Error updating industries:", err);
      alert("Failed to update industries.");
    } finally {
      setUpdatingIndustries(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background dark:bg-dark-navy min-h-screen">
        <AdminNavigation />
        <div className="pt-32 flex flex-col items-center justify-center">
          <Loader size="xl" color="primary" className="mb-4" />
          <span className="text-on-surface-variant dark:text-on-surface-variant font-medium">Loading details...</span>
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="bg-background dark:bg-dark-navy min-h-screen">
        <AdminNavigation />
        <div className="pt-32 px-gutter max-w-2xl mx-auto text-center">
          <div className="bg-error/10 text-error p-6 rounded-2xl mb-6">
            <span className="material-symbols-outlined text-4xl mb-2">
              error
            </span>
            <h2 className="font-bold text-xl mb-2">Error Loading User</h2>
            <p>{error || "User not found"}</p>
          </div>
          <button
            onClick={() => navigate("/admin/users")}
            className="text-accent-blue hover:underline font-bold"
          >
            &larr; Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background dark:bg-dark-navy dark:text-surface-container-lowest font-body-md transition-colors duration-300 min-h-screen">
      <AdminNavigation />

      <main className="pt-32 pb-section-gap-lg px-margin-mobile md:px-gutter max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            to="/admin/users"
            className="inline-flex items-center text-on-surface-variant dark:text-on-surface-variant hover:text-accent-blue dark:hover:text-accent-blue font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-sm mr-1">
              arrow_back
            </span>
            Back to Users
          </Link>
        </div>

        {/* User Profile Card */}
        <div className="bg-surface-container-lowest dark:bg-white/20 rounded-3xl border border-border-slate/50 dark:border-white/5 shadow-lg overflow-hidden mb-8">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-border-slate/30 dark:border-white/10 bg-black/5 dark:bg-white-[0.02]">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-black/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white font-bold text-3xl shrink-0">
                {userProfile.full_name ? (
                  userProfile.full_name.charAt(0).toUpperCase()
                ) : (
                  <span className="material-symbols-outlined text-4xl">
                    person
                  </span>
                )}
              </div>
              <div>
                <h1 className="font-headline-md text-headline-md text-primary dark:text-white mb-1">
                  {userProfile.full_name || "Unnamed User"}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm text-on-surface-variant dark:text-on-surface-variant bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded">
                    ID: {userProfile.id}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      userProfile.role === "super_admin"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                        : userProfile.role === "expert"
                        ? "bg-blue-100 text-accent-blue dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-surface-container-highest dark:bg-white/10 text-on-surface-variant dark:text-on-surface-variant"
                    }`}
                  >
                    {userProfile.role === "super_admin" ? "Admin" : userProfile.role === "expert" ? "Expert" : "User"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest dark:bg-dark-navy p-4 rounded-xl border border-border-slate/50 dark:border-white/10 w-full md:w-auto">
              <p className="text-xs text-on-surface-variant dark:text-on-surface-variant uppercase font-bold tracking-wider mb-1">
                Account Status
              </p>
              <div className="flex items-center gap-2">
                {userProfile.is_email_verified ? (
                  <>
                    <span className="material-symbols-outlined text-emerald-500">
                      verified
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      Email Verified
                    </span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-amber-500">
                      pending
                    </span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">
                      Unverified Email
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Industries (For Experts Only) */}
        {userProfile.role === "expert" && (
          <div className="bg-surface-container-lowest dark:bg-white/10 rounded-3xl border border-border-slate/50 dark:border-white/5 shadow-sm p-6 md:p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-sm text-headline-sm text-primary dark:text-white">
                Assigned Industries
              </h2>
              {!isEditingIndustries ? (
                <button
                  onClick={() => setIsEditingIndustries(true)}
                  className="px-4 py-2 bg-black/5 dark:bg-white/10 text-primary dark:text-white hover:bg-black/10 dark:hover:bg-white/20 rounded-xl font-bold transition-colors flex items-center gap-2 text-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedIndustries(userProfile.industries || []);
                      setIsEditingIndustries(false);
                    }}
                    className="px-4 py-2 text-on-surface-variant dark:text-on-surface-variant hover:bg-black/5 dark:hover:bg-white/10 rounded-xl font-bold transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateIndustries}
                    disabled={updatingIndustries}
                    className="px-4 py-2 bg-primary text-white dark:bg-white/10 hover:bg-blue-600 dark:hover:bg-white/20 rounded-xl font-bold transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {updatingIndustries ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader size="sm" color="white" /> Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              )}
            </div>

            {isEditingIndustries ? (
              <div className="max-w-2xl">
                <CustomMultiSelect
                  id="edit-industries"
                  value={selectedIndustries}
                  onChange={(e) => setSelectedIndustries(e.target.value)}
                  options={industryOptions}
                  placeholder="Select industries..."
                  searchable={true}
                  className="w-full px-5 py-2.5 bg-black/5 dark:bg-white/5 border border-border-slate dark:border-white/10 rounded-xl text-on-surface dark:text-white text-sm"
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {userProfile.industries && userProfile.industries.length > 0 ? (
                  userProfile.industries.map((ind, i) => (
                    <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-accent-blue font-bold text-sm rounded-lg border border-blue-200 dark:border-blue-800/50">
                      {ind}
                    </span>
                  ))
                ) : (
                  <span className="text-on-surface-variant dark:text-on-surface-variant italic">No industries assigned.</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* User's Requirements */}
        {userProfile.role !== "expert" && (
          <>
            <h2 className="font-headline-sm text-headline-sm text-primary dark:text-white mb-4">
              Submitted Requirements ({requirements.length})
            </h2>

            <div className="bg-surface-container-lowest dark:bg-white/10 rounded-3xl border border-border-slate/50 dark:border-white/5 shadow-sm overflow-hidden">
              {requirements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/5 dark:bg-white/5 border-b border-border-slate/50 dark:border-white/10">
                        <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">
                          Ref ID
                        </th>
                        <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">
                          Industry & Content
                        </th>
                        <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">
                          Date
                        </th>
                        <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">
                          Status
                        </th>
                        <th className="p-4 md:p-6 font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-slate/30 dark:divide-white/5">
                      {requirements.map((req) => (
                        <tr
                          key={req.id}
                          className="hover:bg-black/5 dark:hover:bg-white-[0.02] transition-colors group"
                        >
                          <td className="p-4 md:p-6 align-top">
                            <span className="font-mono text-xs font-bold text-accent-blue bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded inline-block whitespace-nowrap">
                              {req.reference_id}
                            </span>
                          </td>
                          <td className="p-4 md:p-6 align-top max-w-md">
                            <div className="font-bold text-primary dark:text-white mb-1">
                              {req.industry}
                            </div>
                            <div className="text-sm text-on-surface-variant dark:text-on-surface-variant line-clamp-2 mb-2">
                              {req.requirement}
                            </div>
                            {req.file_name && (
                              <div className="inline-flex items-center gap-1 text-xs font-medium text-accent-blue bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                                <span className="material-symbols-outlined text-[14px]">
                                  attachment
                                </span>
                                Has attachment
                              </div>
                            )}
                          </td>
                          <td className="p-4 md:p-6 align-top text-sm">
                            <div className="font-medium text-primary dark:text-white mb-1">
                              {req.full_name}
                            </div>
                            <div className="text-on-surface-variant dark:text-on-surface-variant text-xs flex items-center gap-1.5 mb-1">
                              <span className="material-symbols-outlined text-[14px]">mail</span>
                              {req.email || "N/A"}
                            </div>
                            <div className="text-on-surface-variant dark:text-on-surface-variant text-xs flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[14px]">call</span>
                              {req.phone || req.mobile || req.phone_number || "Not Provided"}
                            </div>
                          </td>
                          <td className="p-4 md:p-6 align-top text-sm text-on-surface-variant dark:text-on-surface-variant whitespace-nowrap">
                            {formatDate(req.created_at)}
                          </td>
                          <td className="p-4 md:p-6 align-top">
                            <span
                              className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${getStatusColor(req.status)}`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4 md:p-6 align-top text-right">
                            <Link
                              to={`/admin/requirements/${req.id}`}
                              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-black/10 dark:bg-white/10 text-primary dark:text-white hover:bg-accent-blue hover:text-white dark:hover:bg-accent-blue transition-colors text-sm font-bold"
                            >
                              Manage
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 bg-black/10 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant dark:text-on-surface-variant">
                    <span className="material-symbols-outlined text-3xl">
                      inbox
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-primary dark:text-white mb-2">
                    No Requirements
                  </h3>
                  <p className="text-on-surface-variant dark:text-on-surface-variant">
                    This user hasn't submitted any requirements yet.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminUserDetails;

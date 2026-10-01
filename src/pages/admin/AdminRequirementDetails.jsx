import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AdminNavigation from "../../components/AdminNavigation";
import CustomSelect from "../../components/CustomSelect";
import { supabase } from "../../lib/supabase";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/AuthContext";
const AdminRequirementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [requirement, setRequirement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit states
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchRequirement();
  }, [id]);

  const fetchRequirement = async () => {
    try {
      const { data, error } = await supabase
        .from("research_submissions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setRequirement(data);
      setStatus(data.status);
      setAdminNotes(data.admin_notes || "");
    } catch (err) {
      console.error("Error fetching requirement:", err);
      setError("Requirement not found or access denied");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage({ text: "", type: "" });

    try {
      const updaterName = (profile?.role === 'super_admin' || profile?.role === 'admin') 
        ? 'Super Admin' 
        : (profile?.full_name || 'Expert');

      const { data, error } = await supabase
        .from("research_submissions")
        .update({
          status,
          admin_notes: adminNotes,
          last_updated_by: updaterName,
        })
        .eq("id", id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Update ignored by database. This usually means your Supabase Schema Cache needs reloading, or Row Level Security (RLS) blocked the update.");
      }

      // Send email to user
      try {
        const updateDetails = {
          email: requirement.email,
          full_name: requirement.full_name,
          reference_id: requirement.reference_id,
          status: status,
          admin_notes: adminNotes,
        };
        await supabase.functions.invoke("notify-user", {
          body: { updateDetails },
        });
      } catch (emailErr) {
        console.error("Failed to send email to user:", emailErr);
      }

      setSaveMessage({ text: "Changes saved successfully!", type: "success" });
      // Update local state
      setRequirement((prev) => ({ ...prev, status, admin_notes: adminNotes, last_updated_by: updaterName }));

      setTimeout(() => {
        setSaveMessage({ text: "", type: "" });
      }, 3000);
    } catch (err) {
      console.error("Error saving requirement:", err);
      setSaveMessage({
        text: "Failed to save changes. " + err.message,
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!requirement?.file_path) return;

    try {
      // Need to create signed URL because bucket is private or RLS restricted
      const { data, error } = await supabase.storage
        .from("requirements")
        .createSignedUrl(requirement.file_path, 60); // 60 seconds expiry

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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case "completed":
      case "approved":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      case "in progress":
      case "testing":
      case "delivery":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
      case "assigned":
      case "under review":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";
      case "on hold":
      case "deferred":
      case "in backlog":
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400 border border-slate-200 dark:border-slate-800";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-200 dark:border-gray-800";
      case "payment in process":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800";
      case "pending":
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
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

  if (error || !requirement) {
    return (
      <div className="bg-background dark:bg-dark-navy min-h-screen">
        <AdminNavigation />
        <div className="pt-32 px-gutter max-w-2xl mx-auto text-center">
          <div className="bg-error/10 text-error p-6 rounded-2xl mb-6">
            <span className="material-symbols-outlined text-4xl mb-2">
              error
            </span>
            <h2 className="font-bold text-xl mb-2">Error</h2>
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate("/admin/requirements")}
            className="text-accent-blue hover:underline font-bold"
          >
            &larr; Back to Requirements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background dark:bg-dark-navy dark:text-surface-container-lowest font-body-md transition-colors duration-300 min-h-screen">
      <AdminNavigation />

      <main className="pt-32 pb-section-gap-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <Link
              to="/admin/requirements"
              className="inline-flex items-center text-on-surface-variant dark:text-on-surface-variant hover:text-accent-blue dark:hover:text-accent-blue font-medium transition-colors mb-6"
            >
              <span className="material-symbols-outlined text-sm mr-1">
                arrow_back
              </span>
              Back to Requirements
            </Link>

            <div className="bg-surface-container-lowest dark:bg-white/20 rounded-3xl border border-border-slate/50 dark:border-white/5 shadow-lg overflow-hidden">
              <div className="p-6 md:p-8 border-b border-border-slate/50 dark:border-white/10 flex flex-col md:flex-row md:items-start justify-between gap-6 bg-black/5 dark:bg-white-[0.02]">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-sm font-bold text-accent-blue bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded">
                      Ref: {requirement.reference_id}
                    </span>
                    <span
                      className={`text-sm font-bold px-4 py-1.5 rounded-full ${getStatusColor(requirement.status)}`}
                    >
                      {requirement.status}
                    </span>
                  </div>
                  <h1 className="font-headline-md text-headline-md text-primary dark:text-white">
                    {requirement.industry}
                  </h1>
                </div>

                <div className="text-sm text-on-surface-variant dark:text-on-surface-variant md:text-right shrink-0">
                  <div className="mb-1">Submitted on:</div>
                  <div className="font-medium text-primary dark:text-white mb-3">
                    {formatDate(requirement.created_at)}
                  </div>
                  {requirement.last_updated_by && (
                    <>
                      <div className="mb-1">Last Updated By:</div>
                      <div className="font-medium text-accent-blue dark:text-blue-400">
                        {requirement.last_updated_by}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                <div>
                  <h3 className="font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider mb-3">
                    Research Requirement
                  </h3>
                  <div className="bg-black/5 dark:bg-white/5 p-6 rounded-2xl text-on-surface dark:text-white whitespace-pre-wrap leading-relaxed border border-border-slate/50 dark:border-white/5">
                    {requirement.requirement}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border-slate/30 dark:border-white/10">
                  <div>
                    <h3 className="font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider mb-2">
                      Requested Format
                    </h3>
                    <p className="font-medium text-primary dark:text-white bg-black/10 dark:bg-white/5 px-4 py-3 rounded-xl border border-border-slate/30 dark:border-white/5">
                      {requirement.format || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider mb-2">
                      Supporting Document
                    </h3>
                    {requirement.file_name ? (
                      <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 p-3 rounded-xl">
                        <div className="flex items-center gap-2 overflow-hidden mr-2">
                          <span className="material-symbols-outlined text-accent-blue shrink-0">
                            description
                          </span>
                          <span className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">
                            {requirement.file_name}
                          </span>
                        </div>
                        <button
                          onClick={handleDownload}
                          className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-800/50 text-accent-blue dark:text-blue-300 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors shrink-0"
                          title="Download File"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            download
                          </span>
                        </button>
                      </div>
                    ) : (
                      <p className="text-on-surface-variant dark:text-on-surface-variant text-sm py-2">
                        No file attached
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Admin Controls & Client Details */}
        <div className="space-y-6">
          {/* Admin Controls */}
          <div className="bg-surface-container-lowest dark:bg-white/5 rounded-3xl border border-error/20 dark:border-error/30 shadow-lg overflow-hidden relative backdrop-blur-lg">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-error to-purple-500"></div>
            <div className="p-6 border-b border-border-slate/50 dark:border-white/10 bg-error/5 dark:bg-error/10">
              <h2 className="font-headline-sm text-headline-sm text-primary dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-error">
                  manage_accounts
                </span>
                Admin Controls
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block mb-2 font-bold text-sm tracking-wide text-on-surface dark:text-white">
                  Update Status
                </label>
                <CustomSelect
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={[
                    { value: "Draft", label: "Draft" },
                    { value: "Pending", label: "Pending" },
                    { value: "Under Review", label: "Under Review" },
                    { value: "In Backlog", label: "In Backlog" },
                    { value: "Deferred", label: "Deferred" },
                    { value: "Approved", label: "Approved" },
                    { value: "Assigned", label: "Assigned" },
                    { value: "In Progress", label: "In Progress" },
                    { value: "Testing", label: "Testing" },
                    { value: "Delivery", label: "Delivery" },
                    { value: "Payment in Process", label: "Payment in Process" },
                    { value: "Completed", label: "Completed" },
                    { value: "Rejected", label: "Rejected" },
                    { value: "Cancelled", label: "Cancelled" },
                    { value: "On Hold", label: "On Hold" },
                  ]}
                  placeholder="Select Status"
                  className="w-full px-4 py-3 bg-white dark:bg-dark-navy border border-border-slate dark:border-white/10 rounded-xl text-on-surface dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block mb-2 font-bold text-sm tracking-wide text-on-surface dark:text-white flex items-center justify-between">
                  <span>Internal Admin Notes</span>
                  <span className="text-[10px] bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded text-on-surface-variant dark:text-on-surface-variant">
                    Private
                  </span>
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add private notes, internal task links, or status updates here..."
                  rows="5"
                  className="w-full px-4 py-3 bg-white dark:bg-dark-navy border border-border-slate dark:border-white/10 rounded-xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 text-sm resize-none text-on-surface dark:text-white"
                ></textarea>
              </div>

              {saveMessage.text && (
                <div
                  className={`p-3 rounded-xl text-sm font-bold flex items-center gap-2 ${saveMessage.type === "success" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-error/10 text-error"}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {saveMessage.type === "success" ? "check_circle" : "error"}
                  </span>
                  {saveMessage.text}
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-3.5 bg-primary  hover:bg-blue-600 text-white dark:bg-white/10 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader size="sm" color="white" /> Saving...
                  </span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">
                      save
                    </span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Client Details */}
          <div className="bg-surface-container-lowest dark:bg-white/10 rounded-3xl border border-border-slate/50 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-slate/50 dark:border-white/10">
              <h2 className="font-bold text-lg text-primary dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant dark:text-on-surface-variant">
                  contact_mail
                </span>
                Client Details
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 border-b border-border-slate/30 dark:border-white/5 pb-4">
                <div className="w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white font-bold text-xl shrink-0">
                  {requirement.full_name
                    ? requirement.full_name.charAt(0).toUpperCase()
                    : "?"}
                </div>
                <div>
                  <div className="font-bold text-primary dark:text-white">
                    {requirement.full_name}
                  </div>
                  <Link
                    to={`/admin/users/${requirement.user_id}`}
                    className="text-xs text-accent-blue hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="text-xs text-on-surface-variant dark:text-on-surface-variant uppercase font-bold tracking-wider mb-1">
                    Email
                  </div>
                  <a
                    href={`mailto:${requirement.email}`}
                    className="text-sm font-medium text-primary dark:text-white hover:text-accent-blue break-all"
                  >
                    {requirement.email}
                  </a>
                </div>

                {requirement.phone && (
                  <div>
                    <div className="text-xs text-on-surface-variant dark:text-on-surface-variant uppercase font-bold tracking-wider mb-1">
                      Phone
                    </div>
                    <a
                      href={`tel:${requirement.phone}`}
                      className="text-sm font-medium text-primary dark:text-white hover:text-accent-blue"
                    >
                      {requirement.phone}
                    </a>
                  </div>
                )}

                {requirement.organization && (
                  <div>
                    <div className="text-xs text-on-surface-variant dark:text-on-surface-variant uppercase font-bold tracking-wider mb-1">
                      Organization
                    </div>
                    <div className="text-sm font-medium text-primary dark:text-white">
                      {requirement.organization}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminRequirementDetails;

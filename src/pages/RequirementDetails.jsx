import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import Loader from "../components/Loader";
const RequirementDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requirement, setRequirement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequirement = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("research_submissions")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            throw new Error("Requirement not found or access denied");
          }
          throw error;
        }

        setRequirement(data);
      } catch (error) {
        console.error("Error fetching requirement:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirement();
  }, [id, user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      case "in progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-background dark:bg-dark-navy min-h-screen">
        <Navigation />
        <div className="pt-32 flex flex-col items-center justify-center">
          <Loader size="xl" color="primary" className="mb-4" />
          <span className="text-on-surface-variant dark:text-on-surface-variant font-medium">
            Loading details...
          </span>
        </div>
      </div>
    );
  }

  if (error || !requirement) {
    return (
      <div className="bg-background dark:bg-dark-navy min-h-screen">
        <Navigation />
        <div className="pt-32 px-gutter max-w-2xl mx-auto text-center">
          <div className="bg-error/10 text-error p-6 rounded-2xl mb-6">
            <span className="material-symbols-outlined text-4xl mb-2">
              error
            </span>
            <h2 className="font-bold text-xl mb-2">
              Error Loading Requirement
            </h2>
            <p>{error || "Requirement not found"}</p>
          </div>
          <button
            onClick={() => navigate("/my-requirements")}
            className="text-accent-blue hover:underline font-bold"
          >
            &larr; Back to My Requirements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background dark:bg-dark-navy dark:text-surface-container-lowest font-body-md transition-colors duration-300 min-h-screen">
      <Navigation />

      <main className="pt-32 pb-section-gap-lg px-margin-mobile md:px-gutter max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            to="/my-requirements"
            className="inline-flex items-center text-on-surface-variant dark:text-on-surface-variant hover:text-accent-blue dark:hover:text-accent-blue font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-sm mr-1">
              arrow_back
            </span>
            Back to My Requirements
          </Link>
        </div>

        <div className="bg-surface-container-lowest dark:bg-white/20 rounded-3xl border border-border-slate/50 dark:border-white/5 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-10 border-b border-border-slate/50 dark:border-white/10 flex flex-col md:flex-row md:items-start justify-between gap-6">
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
              <div className="font-medium text-primary dark:text-white">
                {formatDate(requirement.created_at)}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 md:p-10 space-y-8">
            <div>
              <h3 className="font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider mb-3">
                Research Requirement
              </h3>
              <div className="bg-black/5 dark:bg-white/5 p-6 rounded-2xl text-on-surface dark:text-white whitespace-pre-wrap leading-relaxed border border-border-slate/50 dark:border-white/5">
                {requirement.requirement}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border-slate/30 dark:border-white/10">
              <div>
                <h3 className="font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider mb-2">
                  Output Format
                </h3>
                <p className="font-medium text-primary dark:text-white">
                  {requirement.format || "Not specified"}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider mb-2">
                  Contact Details
                </h3>
                <div className="space-y-2 text-primary dark:text-white font-medium">
                  <p>{requirement.full_name}</p>
                  <p className="text-on-surface-variant dark:text-on-surface-variant">
                    {requirement.email}
                  </p>
                  {requirement.organization && (
                    <p className="text-on-surface-variant dark:text-on-surface-variant">
                      {requirement.organization}
                    </p>
                  )}
                  {requirement.phone && (
                    <p className="text-on-surface-variant dark:text-on-surface-variant">
                      {requirement.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {requirement.status === "Pending" && (
              <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 p-6 rounded-2xl flex gap-4">
                <span className="material-symbols-outlined text-accent-blue text-3xl shrink-0 mt-0.5">
                  info
                </span>
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">
                    Under Review
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200/80 text-sm">
                    Our HILAR-powered team is currently reviewing your
                    requirement. You will receive an email shortly with scope
                    confirmation, format recommendations, and timeline.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequirementDetails;

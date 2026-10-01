import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomMultiSelect from "./CustomMultiSelect";
import { supabase } from "../lib/supabase";
import { createClient } from "@supabase/supabase-js";
import Loader from "./Loader";
// Exporting industries list from here to avoid duplication. Normally would be in a shared constants file.
export const industryGroups = [
  {
    label: "Technology",
    options: [
      "Technology",
      "IT Services",
      "Software & SaaS",
      "Artificial Intelligence",
      "Cloud Computing",
      "Cybersecurity",
      "Data Analytics & BI",
      "Semiconductor",
      "Electronics",
      "Consumer Electronics",
      "Telecommunications",
      "IoT",
      "Blockchain & Web3",
      "Quantum Computing",
      "Robotics",
      "Space Technology",
    ],
  },
  {
    label: "Healthcare & Life Sciences",
    options: [
      "Healthcare",
      "Pharmaceuticals",
      "Biotechnology",
      "Medical Devices",
      "Hospitals & Healthcare Services",
      "Bioinformatics",
      "Genomics",
    ],
  },
  {
    label: "Financial Services",
    options: [
      "Banking",
      "Financial Services",
      "FinTech",
      "Insurance",
      "Investment Management",
      "Venture Capital",
      "Private Equity",
      "Stock Market & Trading",
      "Cryptocurrency",
    ],
  },
  {
    label: "Consumer & Retail",
    options: [
      "Retail",
      "FMCG",
      "Consumer Goods",
      "E-Commerce",
      "D2C Brands",
      "Fashion & Apparel",
      "Luxury Goods",
      "Beauty & Cosmetics",
    ],
  },
  {
    label: "Media, Marketing & Creative",
    options: [
      "Media",
      "Entertainment",
      "Advertising",
      "Digital Marketing",
      "Publishing",
      "Gaming & eSports",
      "Film & Television",
      "Music Industry",
      "Creator Economy",
    ],
  },
  {
    label: "Industrial & Manufacturing",
    options: [
      "Manufacturing",
      "Industrial Automation",
      "Heavy Engineering",
      "Aerospace",
      "Defense",
      "Automotive",
      "Electric Vehicles (EV)",
      "Chemicals",
      "Petrochemicals",
      "Nanotechnology",
    ],
  },
  {
    label: "Logistics & Infrastructure",
    options: [
      "Logistics",
      "Transportation",
      "Shipping & Maritime",
      "Aviation",
      "Railways",
      "Warehousing",
      "Supply Chain",
    ],
  },
  {
    label: "Real Estate & Construction",
    options: [
      "Real Estate",
      "Construction",
      "Infrastructure",
      "Smart Cities",
      "Architecture & Interior Design",
    ],
  },
  {
    label: "Energy & Environment",
    options: [
      "Energy",
      "Oil & Gas",
      "Renewable Energy",
      "Utilities",
      "Mining & Metals",
      "Sustainability & ESG",
      "ClimateTech",
      "Waste Management",
      "Water Management",
    ],
  },
  {
    label: "Agriculture & Food",
    options: [
      "Agriculture",
      "AgriTech",
      "Food Processing",
      "Dairy",
      "Fisheries",
      "Forestry",
      "Restaurants & Food Services",
    ],
  },
  {
    label: "Professional & Business Services",
    options: [
      "Consulting",
      "Legal Services",
      "HR & Recruitment",
      "BPO / KPO",
      "Government & Public Sector",
      "NGOs & Non-Profits",
      "Startups & Entrepreneurship",
    ],
  },
  {
    label: "Education & Wellness",
    options: [
      "Education",
      "EdTech",
      "E-Learning",
      "Sports & Fitness",
      "Wellness & Personal Care",
      "Hospitality",
      "Travel & Tourism",
    ],
  },
];

export const industryOptions = [
  ...industryGroups.map((group) => ({
    groupLabel: group.label,
    items: group.options.map((opt) => ({ value: opt, label: opt })),
  })),
  {
    groupLabel: "Other",
    items: [{ value: "other", label: "Other / Cross-Industry" }],
  },
];

const CreateExpertModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    industries: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        fullName: "",
        email: "",
        password: "",
        industries: [],
      });
      setError("");
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      formData.industries.length === 0
    ) {
      setError("Please fill all fields and select at least one industry.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Create a secondary supabase client that does not persist session
      // This prevents the admin from being logged out when the new user is created
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const secondarySupabase = createClient(
        supabaseUrl || "https://placeholder.supabase.co",
        supabaseAnonKey || "placeholder",
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        },
      );

      const { data: authData, error: authError } =
        await secondarySupabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              role: "expert",
              industries: formData.industries,
              requires_password_change: true,
            },
          },
        });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("User creation failed.");

      // 2. Update their profile to be an 'expert' and assign industries
      // We use secondarySupabase because it holds the newly created user's session.
      // Often, RLS allows users to update their own profiles, but restricts admins from updating others.
      const { error: profileError } = await secondarySupabase
        .from("profiles")
        .update({
          role: "expert",
          industries: formData.industries,
          requires_password_change: true,
        })
        .eq("id", userId);

      if (profileError) {
        console.error("Profile update error with secondary client:", profileError);
        
        // Fallback: try with the main admin client just in case
        await supabase
          .from("profiles")
          .update({
            role: "expert",
            industries: formData.industries,
            requires_password_change: true,
          })
          .eq("id", userId);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create expert account.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-surface-container-lowest dark:bg-dark-navy border border-border-slate/50 dark:border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-visible flex flex-col"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-on-surface-variant dark:text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <h2 className="font-headline-md text-headline-md text-primary dark:text-white mb-6">
            Create Expert Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-error/10 text-error p-4 rounded-xl text-sm font-medium border border-error/20">
                {error}
              </div>
            )}

            <div>
              <label className="block mb-2 font-bold text-sm tracking-wide text-on-surface dark:text-white">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Expert's Name"
                className="w-full px-5 py-3.5 bg-black/5 dark:bg-white/5 border border-border-slate dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-blue dark:focus:border-accent-blue text-sm text-on-surface dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold text-sm tracking-wide text-on-surface dark:text-white">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="expert@example.com"
                className="w-full px-5 py-3.5 bg-black/5 dark:bg-white/5 border border-border-slate dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-blue dark:focus:border-accent-blue text-sm text-on-surface dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold text-sm tracking-wide text-on-surface dark:text-white">
                Initial Password
              </label>
              <input
                id="password"
                type="text"
                value={formData.password}
                onChange={handleChange}
                placeholder="Temporary password (e.g., Expert@2026)"
                className="w-full px-5 py-3.5 bg-black/5 dark:bg-white/5 border border-border-slate dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-blue dark:focus:border-accent-blue text-sm text-on-surface dark:text-white"
              />
              <p className="text-xs text-on-surface-variant dark:text-on-surface-variant mt-1.5">
                The expert will be forced to change this password on their first
                login.
              </p>
            </div>

            <div>
              <label className="block mb-2 font-bold text-sm tracking-wide text-on-surface dark:text-white">
                Assigned Industries
              </label>
              <CustomMultiSelect
                id="industries"
                value={formData.industries}
                onChange={handleChange}
                options={industryOptions}
                placeholder="Select industries..."
                searchable={true}
                className="w-full px-5 py-2.5 bg-black/5 dark:bg-white/5 border border-border-slate dark:border-white/10 rounded-xl text-on-surface dark:text-white text-sm"
              />
            </div>

            <div className="pt-4 flex justify-end gap-4 mt-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-bold text-sm text-on-surface-variant dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-primary text-white dark:bg-white/10 hover:bg-blue-600 dark:hover:bg-white/20 transition-all shadow-md hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader size="sm" color="white" /> Creating...
                  </span>
                ) : (
                  "Create Expert"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateExpertModal;

import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import CustomSelect from "../components/CustomSelect";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import CustomCountrySelect from "../components/CustomCountrySelect";
import Loader from "../components/Loader";
import PasswordValidator, {
  isPasswordValid,
} from "../components/PasswordValidator";

const industryGroups = [
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

// Transform for CustomSelect
const industryOptions = [
  ...industryGroups.map((group) => ({
    groupLabel: group.label,
    items: group.options.map((opt) => ({ value: opt, label: opt })),
  })),
  {
    groupLabel: "Other",
    items: [{ value: "other", label: "Other / Cross-Industry" }],
  },
];

const formatOptions = [
  { value: "not-sure", label: "— Not sure / Let RnDWorkZone decide —" },
  { value: "report", label: "Research Report (Word / PDF)" },
  { value: "summary", label: "Executive Summary (2–3 pages)" },
  { value: "deck", label: "PowerPoint Strategy Deck" },
  { value: "market-intelligence", label: "Market Intelligence Report" },
  { value: "benchmarking", label: "Competitive Benchmarking" },
  { value: "swot", label: "SWOT & Strategic Analysis" },
  { value: "data-model", label: "Excel-Based Data Model" },
  { value: "sector-landscape", label: "Sector Landscape Report" },
  { value: "due-diligence", label: "Due Diligence Research Pack" },
  { value: "custom", label: "Custom / Multiple Formats" },
];

const SubmitRequirement = () => {
  const [formData, setFormData] = useState({
    industry: "",
    requirement: "",
    format: "",
    fullName: "",
    organization: "",
    email: "",
    phone: "",
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = React.useRef(null);
  const navigate = useNavigate();
  const { user, profile, signIn, signUp } = useAuth();

  const [authMode, setAuthMode] = useState("signup");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showAuthPassword, setShowAuthPassword] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        fullName: profile?.full_name || "",
      }));
    }

    // Redirect admins away from the client submission form
    if (profile?.role === "super_admin") {
      navigate("/admin", { replace: true });
    } else if (profile?.role === "expert") {
      navigate("/admin/requirements", { replace: true });
    }
  }, [user, profile, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.industry) newErrors.industry = "Please select an industry.";

    const illegalWords = [
      "sexual",
      "bomb",
      "murder",
      "terrorist",
      "weapon",
      "drugs",
      "illegal",
      "hack",
      "porn",
      "suicide",
      "kill",
      "assassinate",
      "explosive",
      "narcotics",
      "prostitution",
      "rape",
      "smuggle",
      "trafficking",
      "fraud",
      "scam",
      "phishing",
      "malware",
      "virus",
      "child abuse",
      "pedophile",
      "incest",
      "terrorism",
      "extremism",
      "genocide",
      "hate speech",
      "racist",
      "slur",
      "blackmail",
      "extortion",
      "cocaine",
      "heroin",
      "meth",
      "fentanyl",
      "cartel",
      "money laundering",
      "weapons of mass destruction",
      "wmd",
      "biohazard",
      "nuclear",
      "sniper",
      "hitman",
      "dark web",
      "bribe",
      "corruption",
      "smuggling",
      "human trafficking",
      "slave",
      "gore",
      "mutilation",
      "torture",
      "assault",
      "abduct",
      "kidnap",
      "ransom",
      "methamphetamine",
    ];
    const requirementLower = formData.requirement.toLowerCase();
    const foundIllegalWord = illegalWords.find((word) =>
      requirementLower.includes(word),
    );

    if (foundIllegalWord) {
      newErrors.requirement = `Your requirement contains a prohibited word: "${foundIllegalWord}". Please revise your requirement to comply with our ethics policy.`;
    } else if (formData.requirement.trim().length < 20) {
      newErrors.requirement =
        "Please describe your research requirement (at least 20 characters).";
    }
    if (!formData.fullName.trim())
      newErrors.fullName = "Please enter your full name.";

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(formData.email.trim()))
      newErrors.email = "Please enter a valid email address.";

    if (!user) {
      if (!authPassword) {
        newErrors.authPassword = "Password is required.";
      } else if (authMode === "signup" && !isPasswordValid(authPassword)) {
        newErrors.authPassword = "Password does not meet all requirements.";
      }

      if (authMode === "signup" && authPassword !== authConfirmPassword) {
        newErrors.authConfirmPassword = "Passwords do not match.";
      }
    }

    if (!formData.consent)
      newErrors.consent =
        "Please confirm the above declaration before submitting.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    // Clear error on change
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    setFileError("");
    const allowedExtensions = [".pdf", ".doc", ".docx", ".txt"];
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      setFileError(
        "Invalid file format. Please upload a PDF, DOC, DOCX, or TXT file.",
      );
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      setFileError("File size exceeds 10 MB limit.");
      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setAuthError("");

    if (!validate()) {
      // Scroll to the first error
      const firstError = document.querySelector(".text-error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setAuthLoading(true);

    try {
      let finalUserId = user?.id;

      if (!user) {
        if (authMode === "signin") {
          const { data, error } = await signIn(formData.email, authPassword);
          if (error) throw new Error(error.message);
          finalUserId = data.user?.id;
        } else {
          const { data, error } = await signUp(
            formData.email,
            authPassword,
            formData.fullName,
          );
          if (error) throw new Error(error.message);
          finalUserId = data.user?.id;
        }
      }

      if (!finalUserId)
        throw new Error("Authentication failed. Unable to submit.");

      const referenceId =
        "REQ-" + Math.random().toString(36).substr(2, 6).toUpperCase();

      let uploadedFilePath = null;
      let uploadedFileName = null;

      if (selectedFile) {
        const safeFileName = selectedFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
        const filePath = `${finalUserId}/${referenceId}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("requirements")
          .upload(filePath, selectedFile);

        if (uploadError) {
          throw new Error("Failed to upload file. Please try again.");
        }

        uploadedFilePath = filePath;
        uploadedFileName = selectedFile.name;
      }

      const { error } = await supabase.from("research_submissions").insert({
        user_id: finalUserId,
        reference_id: referenceId,
        industry: formData.industry,
        requirement: formData.requirement,
        format: formData.format,
        full_name: formData.fullName,
        organization: formData.organization,
        email: formData.email,
        phone: formData.phone,
        status: "Pending",
        file_path: uploadedFilePath,
        file_name: uploadedFileName,
      });

      if (error) throw error;

      // Call Edge Function for email notification (fire and forget / silently handle error)
      try {
        const submissionDetails = {
          reference_id: referenceId,
          industry: formData.industry,
          requirement: formData.requirement,
          format: formData.format,
          full_name: formData.fullName,
          organization: formData.organization,
          email: formData.email,
          phone: formData.phone,
          status: "Pending",
          file_name: uploadedFileName,
          file_path: uploadedFilePath,
        };
        await supabase.functions.invoke("notify-admin", {
          body: { submissionDetails },
        });
      } catch (emailErr) {
        console.error(
          "Email notification failed, but requirement was saved:",
          emailErr,
        );
      }

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const errMsgLower = (err.message || "").toLowerCase();

      if (
        !user &&
        (errMsgLower.includes("already registered") ||
          errMsgLower.includes("already in use") ||
          errMsgLower.includes("exists"))
      ) {
        setAuthError(
          "This email address is already registered. Please switch to the 'Sign In' tab above to log in and submit your requirement.",
        );
        setSubmitError(
          "An account with this email already exists. Please sign and submit the requirement.",
        );
      } else if (
        !user &&
        (errMsgLower.includes("credentials") ||
          errMsgLower.includes("password") ||
          errMsgLower.includes("invalid login"))
      ) {
        setAuthError(
          "Invalid email or password. Please check your credentials.",
        );
        setSubmitError(
          "Authentication failed. Please check your credentials and try again.",
        );
      } else {
        setSubmitError(
          err.message ||
            "An error occurred while submitting. Please try again.",
        );
      }
      console.error(err);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
      setAuthLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      industry: "",
      requirement: "",
      format: "",
      fullName: profile?.full_name || "",
      organization: "",
      email: user?.email || "",
      phone: "",
      consent: false,
    });
    setErrors({});
    setSubmitError("");
    setFileError("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsSuccess(false);
    setAuthPassword("");
    setAuthConfirmPassword("");
  };

  const inputClasses = (hasError) =>
    `block w-full px-4 py-3 text-on-surface dark:text-white bg-black/5 dark:bg-white/5 border ${hasError ? "border-error shadow-[0_0_0_4px_rgba(239,68,68,0.1)] dark:shadow-[0_0_0_4px_rgba(239,68,68,0.2)]" : "border-border-slate dark:border-white/10"} rounded-xl focus:outline-none focus:ring-0 focus:border-accent-blue dark:focus:border-accent-blue focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] dark:focus:shadow-[0_0_0_4px_rgba(59,130,246,0.2)] hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-black/5 dark:disabled:hover:bg-white/5`;
  const labelClasses = (hasError) =>
    `block mb-2 font-bold text-sm tracking-wide ${hasError ? "text-error dark:text-error" : "text-on-surface dark:text-white"}`;
  const asteriskClass = "text-accent-blue ml-1";

  return (
    <div className="bg-background text-on-background dark:bg-dark-navy dark:text-surface-container-lowest font-body-md transition-colors duration-300 min-h-screen">
      <Navigation />

      <main className="pt-24 pb-section-gap-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto">
        {/* Header Section */}
        <div className="relative mb-6">
          <div className="md:absolute md:left-0 md:top-1.5 mb-4 md:mb-0 z-10">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary dark:text-white/70 dark:hover:text-white transition-colors font-bold text-sm"
            >
              <span className="material-symbols-outlined text-[20px]">
                home
              </span>
              Back to Home
            </button>
          </div>
          <div className="text-center max-w-3xl mx-auto w-full">
            <div className="inline-flex items-center space-x-2 bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary-fixed-dim px-4 py-1.5 rounded-full font-label-md mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-secondary-fixed-dim"></span>
              <span>Submit Your Requirement</span>
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-on-surface-variant">
              Share your research question or business challenge. Our
              HILAR-powered team will respond within a few hours with scope,
              format, and timeline confirmation.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto bg-surface-container-lowest dark:bg-white/5 rounded-3xl p-5 md:p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_rgba(59,130,246,0.05)] border border-border-slate/50 dark:border-white/10 backdrop-blur-lg relative overflow-hidden">
          {!isSuccess ? (
            <form
              className="space-y-8 relative z-10 transition-opacity duration-300"
              onSubmit={handleSubmit}
            >
              {submitError && (
                <div className="bg-error/10 text-error p-4 rounded-xl text-sm font-medium border border-error/20 mb-6">
                  {submitError}
                </div>
              )}

              {/* Section 1: Intent */}
              <div className="space-y-5">
                <h2 className="font-headline-md text-headline-md text-primary dark:text-white border-b border-border-slate/30 dark:border-white/10 pb-2">
                  Research Intent
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {/* Industry / Sector */}
                  <div>
                    <label className={labelClasses(errors.industry)}>
                      Industry / Sector <span className={asteriskClass}>*</span>
                    </label>
                    <CustomSelect
                      id="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      options={industryOptions}
                      placeholder="— Select an Industry —"
                      className={inputClasses(errors.industry)}
                      searchable={true}
                    />
                    {errors.industry && (
                      <p className="text-error text-xs mt-1.5 font-medium">
                        {errors.industry}
                      </p>
                    )}
                  </div>

                  {/* Research Requirement */}
                  <div>
                    <label
                      className={labelClasses(errors.requirement)}
                      htmlFor="requirement"
                    >
                      Your Research Requirement{" "}
                      <span className={asteriskClass}>*</span>
                    </label>
                    <p className="text-xs text-on-surface-variant dark:text-on-surface-variant mb-2">
                      Describe your research question, business problem, or
                      strategic objective in as much detail as possible.
                    </p>
                    <textarea
                      id="requirement"
                      name="requirement"
                      value={formData.requirement}
                      onChange={handleChange}
                      placeholder="Example: We need a comprehensive competitive landscape report for the Indian SaaS HR-tech market, covering the top 10 players, their pricing models, feature comparison, and market share estimates..."
                      rows="4"
                      maxLength="2000"
                      className={`${inputClasses(errors.requirement)} resize-none`}
                    ></textarea>
                    <div className="flex justify-end mt-2 text-xs text-text-muted dark:text-on-surface-variant px-1">
                      <span
                        className={
                          formData.requirement.length > 1800
                            ? "text-secondary dark:text-secondary-fixed-dim font-bold"
                            : ""
                        }
                      >
                        {formData.requirement.length} / 2000 characters
                      </span>
                    </div>
                    {errors.requirement && (
                      <p className="text-error text-xs mt-1.5 font-medium">
                        {errors.requirement}
                      </p>
                    )}
                  </div>

                  {/* Output Format */}
                  <div>
                    <label className={labelClasses()}>
                      Preferred Output Format
                    </label>
                    <CustomSelect
                      id="format"
                      value={formData.format}
                      onChange={handleChange}
                      options={formatOptions}
                      placeholder="— Not sure / Let RnDWorkZone decide —"
                      className={inputClasses()}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Contact */}
              <div className="space-y-5 pt-6">
                <h2 className="font-headline-md text-headline-md text-primary dark:text-white border-b border-border-slate/30 dark:border-white/10 pb-2">
                  Contact Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={labelClasses(errors.fullName)}
                      htmlFor="fullName"
                    >
                      Full Name <span className={asteriskClass}>*</span>
                    </label>
                    <input
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      type="text"
                      className={inputClasses(errors.fullName)}
                      disabled={!!user}
                    />
                    {errors.fullName && (
                      <p className="text-error text-xs mt-1.5 font-medium">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClasses()} htmlFor="organization">
                      Organization / Company
                    </label>
                    <input
                      id="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Your company or firm"
                      type="text"
                      className={inputClasses()}
                    />
                  </div>

                  <div>
                    <label
                      className={labelClasses(errors.email)}
                      htmlFor="email"
                    >
                      Email Address <span className={asteriskClass}>*</span>
                    </label>
                    <input
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      type="email"
                      className={inputClasses(errors.email)}
                      disabled={!!user}
                    />
                    {errors.email && (
                      <p className="text-error text-xs mt-1.5 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className={labelClasses(errors.phone)}
                      htmlFor="phone"
                    >
                      Phone / WhatsApp
                    </label>
                    <PhoneInput
                      id="phone"
                      international
                      defaultCountry="IN"
                      value={formData.phone}
                      onChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          phone: value || "",
                        }));
                        if (errors.phone) {
                          setErrors((prev) => ({ ...prev, phone: undefined }));
                        }
                      }}
                      className={inputClasses(errors.phone)}
                      countrySelectComponent={CustomCountrySelect}
                    />
                    {errors.phone && (
                      <p className="text-error text-xs mt-1.5 font-medium">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Supporting Document */}
              <div className="space-y-5 pt-6">
                <h2 className="font-headline-md text-headline-md text-primary dark:text-white border-b border-border-slate/30 dark:border-white/10 pb-2">
                  Supporting Document (Optional)
                </h2>
                <div className="max-w-2xl">
                  <p className="text-sm text-on-surface-variant dark:text-on-surface-variant mb-4">
                    Upload any supplementary materials (e.g., NDA, brief, data
                    samples) that will help us understand your requirement.
                  </p>

                  {!selectedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-300 ${
                        isDragging
                          ? "border-accent-blue bg-accent-blue/5 dark:bg-accent-blue/10"
                          : fileError
                            ? "border-error bg-error/5"
                            : "border-border-slate/50 dark:border-white/10 hover:border-accent-blue/50 dark:hover:border-accent-blue/50 hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <input
                        type="file"
                        className="hidden text-on-surface dark:text-white placeholder:text-slate-muted dark:placeholder:text-white/40"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt"
                      />
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDragging ? "bg-accent-blue/10 text-accent-blue" : "bg-surface-container-highest dark:bg-white/5 text-on-surface-variant dark:text-on-surface-variant"}`}
                      >
                        <span className="material-symbols-outlined text-2xl">
                          upload_file
                        </span>
                      </div>
                      <p className="font-bold text-primary dark:text-white text-base mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-on-surface-variant dark:text-on-surface-variant">
                        PDF, DOC, DOCX, TXT (Max: 10MB)
                      </p>
                      {fileError && (
                        <p className="text-error text-sm font-medium mt-3">
                          {fileError}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-black/5 dark:bg-white/5 border border-border-slate/50 dark:border-white/10 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-accent-blue">
                            description
                          </span>
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-primary dark:text-white text-sm truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-on-surface-variant dark:text-on-surface-variant">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 text-on-surface-variant dark:text-on-surface-variant hover:text-error dark:hover:text-error hover:bg-error/10 rounded-lg transition-colors shrink-0 ml-2"
                        title="Remove file"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Section 4: Account / Authentication (Only if not logged in) */}
              {!user && (
                <div className="space-y-5 pt-6 border-t border-border-slate/30 dark:border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <h2 className="font-headline-md text-headline-md text-primary dark:text-white">
                      Account Verification
                    </h2>
                    <div className="flex bg-black/10 dark:bg-white/5 rounded-lg p-1 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("signup");
                          setAuthError("");
                          setErrors((prev) => ({
                            ...prev,
                            authPassword: "",
                            authConfirmPassword: "",
                          }));
                        }}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-bold transition-all duration-300 ${authMode === "signup" ? "bg-accent-blue text-white shadow-md scale-[1.02]" : "text-on-surface-variant dark:text-white/70 hover:text-on-surface dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"}`}
                      >
                        New Account
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("signin");
                          setAuthError("");
                          setErrors((prev) => ({
                            ...prev,
                            authPassword: "",
                            authConfirmPassword: "",
                          }));
                        }}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-bold transition-all duration-300 ${authMode === "signin" ? "bg-accent-blue text-white shadow-md scale-[1.02]" : "text-on-surface-variant dark:text-white/70 hover:text-on-surface dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"}`}
                      >
                        Sign In
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/5 dark:bg-white/5 border border-border-slate/50 dark:border-white/5 rounded-xl p-5 md:p-6">
                    <p className="text-sm text-on-surface-variant dark:text-on-surface-variant mb-6">
                      {authMode === "signup"
                        ? "Create a password to track your requirement status and communicate with our team. We'll use the email you provided above."
                        : "Welcome back! Enter your password to sign in and submit. We'll use the email you provided above."}
                    </p>

                    {authError && (
                      <div className="bg-error/10 text-error p-4 rounded-xl text-sm font-medium border border-error/20 mb-4">
                        {authError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className={labelClasses(errors.authPassword)}
                          htmlFor="authPassword"
                        >
                          Password <span className={asteriskClass}>*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="authPassword"
                            value={authPassword}
                            onChange={(e) => {
                              setAuthPassword(e.target.value);
                              if (errors.authPassword)
                                setErrors({
                                  ...errors,
                                  authPassword: undefined,
                                });
                            }}
                            placeholder="Enter a strong password"
                            type={showAuthPassword ? "text" : "password"}
                            className={`${inputClasses(errors.authPassword)} pr-12`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowAuthPassword(!showAuthPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-white/50 hover:text-on-surface dark:hover:text-white transition-colors flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined">
                              {showAuthPassword
                                ? "visibility_off"
                                : "visibility"}
                            </span>
                          </button>
                        </div>
                        {authMode === "signup" && (
                          <PasswordValidator password={authPassword} />
                        )}
                        {errors.authPassword && (
                          <p className="mt-1.5 text-sm text-error font-medium">
                            {errors.authPassword}
                          </p>
                        )}
                      </div>

                      {authMode === "signup" && (
                        <div>
                          <label
                            className={labelClasses(errors.authConfirmPassword)}
                            htmlFor="authConfirmPassword"
                          >
                            Confirm Password{" "}
                            <span className={asteriskClass}>*</span>
                          </label>
                          <input
                            id="authConfirmPassword"
                            value={authConfirmPassword}
                            onChange={(e) => {
                              setAuthConfirmPassword(e.target.value);
                              if (errors.authConfirmPassword)
                                setErrors({
                                  ...errors,
                                  authConfirmPassword: undefined,
                                });
                            }}
                            placeholder="••••••••"
                            type="password"
                            className={inputClasses(errors.authConfirmPassword)}
                          />
                          {errors.authConfirmPassword && (
                            <p className="text-error text-xs mt-1.5 font-medium">
                              {errors.authConfirmPassword}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Ethics & Submit */}
              <div className="space-y-6 pt-6 border-t border-border-slate/30 dark:border-white/10">
                <div className="bg-[#FFF7ED] dark:bg-[#78350F]/20 border-1.5 border-[#FDE68A] dark:border-[#92400E]/50 rounded-xl p-4 flex gap-4 shadow-sm">
                  <span className="material-symbols-outlined text-[#D97706] mt-0.5 text-3xl">
                    policy
                  </span>
                  <div>
                    <h4 className="font-bold text-[#92400E] dark:text-[#FDE68A] uppercase tracking-wider mb-2 text-sm">
                      ⚠ Research Ethics Disclaimer
                    </h4>
                    <p className="text-sm text-[#78350F] dark:text-[#FDE68A]/80 leading-relaxed">
                      RnDWorkZone does <strong>not</strong> undertake any
                      research that is harmful to individuals, communities, or
                      society — including research that facilitates illegal
                      activity, promotes discrimination, enables weapons
                      development, exploits vulnerable groups, or violates
                      privacy laws. All submissions are reviewed for compliance
                      before engagement.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    className={`flex items-start gap-4 cursor-pointer group bg-black/5 dark:bg-white/5 p-4 rounded-xl border ${errors.consent ? "border-error shadow-[0_0_0_4px_rgba(239,68,68,0.1)] dark:shadow-[0_0_0_4px_rgba(239,68,68,0.2)]" : "border-border-slate/50 dark:border-white/5 hover:border-accent-blue/50 dark:hover:border-accent-blue/50"} transition-colors`}
                  >
                    <div className="relative flex items-center mt-1 shrink-0">
                      <input
                        id="consent"
                        type="checkbox"
                        checked={formData.consent}
                        onChange={handleChange}
                        className="peer sr-only text-on-surface dark:text-white placeholder:text-slate-muted dark:placeholder:text-white/40"
                      />
                      <div
                        className={`w-6 h-6 border-2 ${errors.consent ? "border-error dark:border-error" : "border-border-slate dark:border-outline-variant"} rounded-md bg-transparent peer-checked:bg-accent-blue peer-checked:border-accent-blue transition-colors`}
                      ></div>
                      <span className="material-symbols-outlined absolute inset-0 text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-[24px] leading-[24px]">
                        check
                      </span>
                    </div>
                    <span
                      className={`text-sm ${errors.consent ? "text-error dark:text-error" : "text-on-surface-variant dark:text-on-surface-variant"} leading-relaxed pt-0.5`}
                    >
                      I confirm that my research requirement does not involve
                      any activity that is harmful, illegal, or unethical, and I
                      agree to RnDWorkZone's Terms of Service and
                      Confidentiality Commitment.
                      {/* <a href="#" className="text-accent-blue hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-accent-blue hover:underline">
                        Confidentiality Commitment
                      </a> */}
                      {/* . */}
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-error text-xs mt-2 ml-2 font-medium">
                      {errors.consent}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary  text-white dark:bg-white/10 w-full md:w-auto px-8 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-primary/30 hover:-translate-y-1"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader size="sm" color="white" /> Submitting...
                      </span>
                    ) : (
                      "Submit Research Requirement"
                    )}
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Success State */
            <div
              className="animate-fade-in flex flex-col items-center justify-center text-center py-16"
              id="success-state"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mb-8 shadow-[0_8px_24px_rgba(16,185,129,0.30)] text-white">
                <span className="material-symbols-outlined text-5xl">
                  check
                </span>
              </div>
              <h2 className="font-headline-xl text-headline-xl text-primary dark:text-white mb-4">
                Requirement Submitted!
              </h2>
              <p className="text-on-surface-variant dark:text-on-surface-variant max-w-lg mb-8 text-lg leading-relaxed">
                Thank you for reaching out. Our research team will review your
                requirement and respond to your email within{" "}
                <strong className="text-primary dark:text-white">
                  2–4 business hours
                </strong>{" "}
                with scope confirmation, format recommendations, and timeline.
              </p>

              <div className="inline-flex items-center gap-2 bg-blue-pale text-accent-blue px-6 py-3 rounded-full font-semibold text-sm mb-12">
                <span className="material-symbols-outlined text-sm">
                  schedule
                </span>
                Expected response: within 24–72 hours for standard reports
              </div>

              <button
                onClick={resetForm}
                className="border-2 border-border-slate dark:border-white/20 text-primary dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-surface-variant dark:hover:bg-white/5 transition-all hover:border-accent-blue dark:hover:border-accent-blue"
              >
                Submit Another Request
              </button>
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="bg-surface-container-lowest dark:bg-white/10 rounded-2xl p-5 flex flex-col items-center text-center gap-3 border border-border-slate/30 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-accent-blue text-3xl">
              verified_user
            </span>
            <span className="font-bold text-primary dark:text-white text-sm">
              100% Confidential
            </span>
          </div>
          <div className="bg-surface-container-lowest dark:bg-white/10 rounded-2xl p-5 flex flex-col items-center text-center gap-3 border border-border-slate/30 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-accent-blue text-3xl">
              timer
            </span>
            <span className="font-bold text-primary dark:text-white text-sm">
              Response in 2-4 hrs
            </span>
          </div>
          <div className="bg-surface-container-lowest dark:bg-white/10 rounded-2xl p-5 flex flex-col items-center text-center gap-3 border border-border-slate/30 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-accent-blue text-3xl">
              public
            </span>
            <span className="font-bold text-primary dark:text-white text-sm">
              150+ Industries
            </span>
          </div>
          <div className="bg-surface-container-lowest dark:bg-white/10 rounded-2xl p-5 flex flex-col items-center text-center gap-3 border border-border-slate/30 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-accent-blue text-3xl">
              psychology
            </span>
            <span className="font-bold text-primary dark:text-white text-sm">
              Human-Validated
            </span>
          </div>
        </div>
      </main>

      {/* Footer minimal version for submit page */}
      <footer className="bg-surface-container-lowest dark:bg-dark-navy w-full py-section-gap-md border-t border-outline-variant/30 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter text-center font-body-sm text-text-muted dark:text-on-surface-variant">
          © 2026 RnDWorkZone. All Rights Reserved.
          <br />
          <br />
          <a
            href="mailto:rndworkzone@gmail.com"
            className="hover:text-accent-blue transition-colors"
          >
            rndworkzone@gmail.com
          </a>{" "}
          · RnDWorkZone.com
        </div>
      </footer>
    </div>
  );
};

export default SubmitRequirement;

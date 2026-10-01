import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logoTextDark from "../assets/logo-text-dark.png";
import logoTextLight from "../assets/logo-text-light.png";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close mobile menu if open
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return;
    }

    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-white dark:bg-[#040916] border-b border-pale-blue dark:border-outline-variant transition-all duration-300 h-20 flex items-center ${isScrolled ? "shadow-md" : "shadow-sm"}`}
    >
      <div className="flex justify-between items-center px-gutter max-w-container-max mx-auto w-full">
        <a
          href="/"
          className="flex items-center gap-3"
          onClick={(e) => {
            e.preventDefault();
            if (window.location.pathname !== "/") {
              navigate("/");
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          {/* <img
            src="/rnd-logo-light.png"
            alt="RnD Logo"
            className="w-[43px] h-[43px] object-contain dark:hidden shrink-0 scale-[1.35]"
          />
          <img
            src="/rnd-logo-dark.png"
            alt="RnD Logo"
            className="w-[43px] h-[43px] object-contain hidden dark:block shrink-0 scale-[1.35]"
          />
          <span className="font-headline-sm text-[23px] font-bold tracking-tight">
            <span className="text-primary dark:text-white">RnD</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#13adff] to-[#7551ff]">
              WorkZone
            </span>
          </span> */}
          <img
            src={logoTextLight}
            alt="RnD Logo"
            className="h-[40px] md:h-[64px] object-contain dark:hidden shrink w-auto scale-100 md:scale-[1.2] origin-left"
          />
          <img
            src={logoTextDark}
            alt="RnD Logo"
            className="h-[40px] md:h-[64px] object-contain hidden dark:block shrink w-auto scale-100 md:scale-[1.2] origin-left"
          />
        </a>

        <div className="hidden lg:flex items-center gap-6">
          {window.location.pathname === "/" ? (
            <>
              <a
                className="font-title-lg text-body-sm font-medium text-on-surface-variant dark:text-white/70 hover:text-primary dark:hover:text-white transition-all cursor-pointer"
                onClick={(e) => handleNavClick(e, "industries")}
              >
                Industries
              </a>
              <a
                className="font-title-lg text-body-sm font-medium text-on-surface-variant dark:text-white/70 hover:text-primary dark:hover:text-white transition-all cursor-pointer"
                onClick={(e) => handleNavClick(e, "methodology")}
              >
                Methodology
              </a>
              <a
                className="font-title-lg text-body-sm font-medium text-on-surface-variant dark:text-white/70 hover:text-primary dark:hover:text-white transition-all cursor-pointer"
                onClick={(e) => handleNavClick(e, "services")}
              >
                Deliverables
              </a>
              <a
                className="font-title-lg text-body-sm font-medium text-on-surface-variant dark:text-white/70 hover:text-primary dark:hover:text-white transition-all cursor-pointer"
                onClick={(e) => handleNavClick(e, "faq")}
              >
                FAQ
              </a>
              <a
                className="font-title-lg text-body-sm font-medium text-on-surface-variant dark:text-white/70 hover:text-primary dark:hover:text-white transition-all cursor-pointer"
                onClick={(e) => handleNavClick(e, "footer")}
              >
                Contact Us
              </a>
            </>
          ) : (
            user && (
              <>
                {profile?.role === "super_admin" ||
                profile?.role === "expert" ? (
                  <Link
                    to={
                      profile?.role === "expert"
                        ? "/admin/requirements"
                        : "/admin"
                    }
                    className="font-title-lg text-body-sm font-bold text-error dark:text-error hover:text-red-700 dark:hover:text-red-400 transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {profile?.role === "expert"
                        ? "verified_user"
                        : "manage_accounts"}
                    </span>
                    {profile?.role === "expert"
                      ? "Expert Panel"
                      : "Admin Panel"}
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="font-title-lg text-body-sm font-medium text-on-surface-variant dark:text-white/70 hover:text-primary dark:hover:text-white transition-all"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/my-requirements"
                      className="font-title-lg text-body-sm font-medium text-on-surface-variant dark:text-white/70 hover:text-primary dark:hover:text-white transition-all"
                    >
                      My Requirements
                    </Link>
                  </>
                )}
              </>
            )
          )}
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/signin"
                className="font-bold text-sm text-primary dark:text-white hover:text-accent-blue dark:hover:text-accent-blue transition-colors"
              >
                Sign In
              </Link>
              {/* <Link to="/signup" className="hidden md:block font-bold text-sm text-primary dark:text-white hover:text-accent-blue dark:hover:text-accent-blue transition-colors">
                Sign Up
              </Link> */}
              {/* <Link
                to="/submit"
                className="bg-primary  text-white dark:bg-white/10 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-all shadow-md"
              >
                Submit Requirement
              </Link> */}
            </>
          ) : (
            <div className="flex items-center gap-4 relative">
              {/* <Link
                to="/submit"
                className="bg-primary  text-white dark:bg-white/10 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-all shadow-md"
              >
                Submit Requirement
              </Link> */}

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white font-bold hover:bg-surface-container-highest dark:hover:bg-white/20 transition-colors"
                >
                  {profile?.full_name ? (
                    profile.full_name.charAt(0).toUpperCase()
                  ) : (
                    <span className="material-symbols-outlined">person</span>
                  )}
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest dark:bg-surface-tint shadow-lg border border-border-slate/50 dark:border-white/10 rounded-xl py-2 flex flex-col z-50">
                    <div className="px-4 py-2 border-b border-border-slate/30 dark:border-white/10 mb-2">
                      <p className="text-sm font-bold text-primary dark:text-white truncate">
                        {profile?.full_name || "User"}
                      </p>
                      <p className="text-xs text-on-surface-variant dark:text-on-surface-variant truncate">
                        {user.email}
                      </p>
                    </div>
                    {profile?.role === "super_admin" ||
                    profile?.role === "expert" ? (
                      <Link
                        to={
                          profile?.role === "expert"
                            ? "/admin/requirements"
                            : "/admin"
                        }
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="px-4 py-2 text-sm text-on-surface dark:text-white hover:bg-black/10 dark:hover:bg-white/5 transition-colors"
                      >
                        {profile?.role === "expert"
                          ? "Expert Panel"
                          : "Admin Panel"}
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="px-4 py-2 text-sm text-on-surface dark:text-white hover:bg-black/10 dark:hover:bg-white/5 transition-colors"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/my-requirements"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="px-4 py-2 text-sm text-on-surface dark:text-white hover:bg-black/10 dark:hover:bg-white/5 transition-colors"
                        >
                          My Requirements
                        </Link>
                      </>
                    )}
                    <div className="border-t border-border-slate/30 dark:border-white/10 my-2"></div>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 text-sm text-left text-error hover:bg-error/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-pale-blue dark:hover:bg-white/10 transition-colors flex items-center justify-center text-on-surface-variant dark:text-white/70 hover:text-primary dark:hover:text-white mr-2"
            aria-label="Toggle Theme"
          >
            <span className="material-symbols-outlined">
              {theme === "light" ? "dark_mode" : "light_mode"}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-pale-blue dark:hover:bg-white/10 transition-colors flex items-center justify-center text-on-surface-variant dark:text-white/70"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white dark:bg-[#040916] border-b border-pale-blue dark:border-outline-variant shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col py-4 px-gutter">
            {window.location.pathname === "/" ? (
              <>
                <a
                  className="py-3 px-4 text-body-sm font-medium text-on-surface-variant dark:text-white/70 hover:bg-pale-blue dark:hover:bg-white/5 rounded-lg"
                  onClick={(e) => handleNavClick(e, "industries")}
                >
                  Industries
                </a>
                <a
                  className="py-3 px-4 text-body-sm font-medium text-on-surface-variant dark:text-white/70 hover:bg-pale-blue dark:hover:bg-white/5 rounded-lg"
                  onClick={(e) => handleNavClick(e, "methodology")}
                >
                  Methodology
                </a>
                <a
                  className="py-3 px-4 text-body-sm font-medium text-on-surface-variant dark:text-white/70 hover:bg-pale-blue dark:hover:bg-white/5 rounded-lg"
                  onClick={(e) => handleNavClick(e, "services")}
                >
                  Deliverables
                </a>
                <a
                  className="py-3 px-4 text-body-sm font-medium text-on-surface-variant dark:text-white/70 hover:bg-pale-blue dark:hover:bg-white/5 rounded-lg"
                  onClick={(e) => handleNavClick(e, "faq")}
                >
                  FAQ
                </a>
                <a
                  className="py-3 px-4 text-body-sm font-medium text-on-surface-variant dark:text-white/70 hover:bg-pale-blue dark:hover:bg-white/5 rounded-lg"
                  onClick={(e) => handleNavClick(e, "footer")}
                >
                  Contact Us
                </a>
              </>
            ) : (
              user && (
                <>
                  {profile?.role === "super_admin" ||
                  profile?.role === "expert" ? (
                    <Link
                      to={
                        profile?.role === "expert"
                          ? "/admin/requirements"
                          : "/admin"
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-3 px-4 text-body-sm font-bold text-error hover:bg-pale-blue dark:hover:bg-white/5 rounded-lg flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {profile?.role === "expert"
                          ? "verified_user"
                          : "manage_accounts"}
                      </span>
                      {profile?.role === "expert"
                        ? "Expert Panel"
                        : "Admin Panel"}
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-3 px-4 text-body-sm font-medium text-on-surface-variant dark:text-white/70 hover:bg-pale-blue dark:hover:bg-white/5 rounded-lg"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/my-requirements"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-3 px-4 text-body-sm font-medium text-on-surface-variant dark:text-white/70 hover:bg-pale-blue dark:hover:bg-white/5 rounded-lg"
                      >
                        My Requirements
                      </Link>
                    </>
                  )}
                </>
              )
            )}

            {!user && (
              <Link
                to="/signin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 py-3 px-4 bg-primary text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white text-center rounded-lg font-bold transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

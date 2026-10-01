import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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

    // Theme is handled in separate useEffect

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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path) =>
    `font-title-lg text-body-sm font-medium transition-all ${
      isActive(path)
        ? "text-primary dark:text-white border-b-2 border-primary dark:border-white pb-1"
        : "text-on-surface-variant dark:text-white/70 hover:text-primary dark:hover:text-white"
    }`;

  return (
    <nav
      className={`fixed top-0 w-full z-50 glass border-b border-error/20 dark:border-error/30 transition-all duration-300 h-20 flex items-center ${isScrolled ? "shadow-md" : "shadow-sm"}`}
    >
      <div className="flex justify-between items-center px-gutter max-w-container-max mx-auto w-full">
        <Link
          to={profile?.role === 'expert' ? "/admin/requirements" : "/admin"}
          className="font-headline-sm text-headline-sm font-bold text-primary dark:text-white flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-error text-[36px]">
            {profile?.role === 'expert' ? 'verified_user' : 'manage_accounts'}
          </span>
          {profile?.role === 'expert' ? 'Expert Panel' : 'Admin Panel'}
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {profile?.role !== 'expert' && (
            <>
              <Link to="/admin" className={navLinkClass("/admin")}>
                Dashboard
              </Link>
              <Link to="/admin/users" className={navLinkClass("/admin/users")}>
                Users
              </Link>
            </>
          )}
          <Link
            to="/admin/requirements"
            className={navLinkClass("/admin/requirements")}
          >
            Requirements
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 relative">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-10 h-10 rounded-full bg-error/10 dark:bg-error/20 flex items-center justify-center text-error font-bold hover:bg-error/20 dark:hover:bg-error/30 transition-colors border border-error/30"
              >
                {profile?.full_name ? (
                  profile.full_name.charAt(0).toUpperCase()
                ) : (
                  <span className="material-symbols-outlined">
                    shield_person
                  </span>
                )}
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest dark:bg-surface-tint shadow-lg border border-border-slate/50 dark:border-white/10 rounded-xl py-2 flex flex-col z-50">
                  <div className="px-4 py-2 border-b border-border-slate/30 dark:border-white/10 mb-2">
                    <p className="text-sm font-bold text-primary dark:text-white truncate flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-error">
                        verified_user
                      </span>
                      {profile?.full_name || "Admin"}
                    </p>
                    <p className="text-xs text-on-surface-variant dark:text-on-surface-variant truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="px-4 py-2 text-sm text-on-surface dark:text-white hover:bg-black/10 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      public
                    </span>
                    Public Site
                  </Link>
                  <div className="border-t border-border-slate/30 dark:border-white/10 my-2"></div>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm text-left text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      logout
                    </span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-pale-blue dark:hover:bg-white/10 transition-colors flex items-center justify-center text-on-surface-variant dark:text-white/70 hover:text-primary dark:hover:text-white mr-2"
            aria-label="Toggle Theme"
          >
            <span className="material-symbols-outlined">
              {theme === "light" ? "dark_mode" : "light_mode"}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;

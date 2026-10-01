import React from "react";
import { useNavigate } from "react-router-dom";
import logoTextDark from "../assets/logo-text-dark.png";
import logoTextLight from "../assets/logo-text-light.png";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Final CTA */}
      <section className="py-section-gap-lg px-gutter">
        <div className="max-w-container-max mx-auto rounded-[2.5rem] border cta-gradient text-on-surface dark:text-white p-12 md:p-20 relative overflow-hidden text-center shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent-blue/10 via-transparent to-transparent"></div>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-8 relative z-10 text-primary dark:text-white">
            Ready to Make Better Decisions?
          </h2>
          <p className="text-body-lg text-slate-muted dark:text-white/70 max-w-2xl mx-auto mb-12 relative z-10">
            Stop drowning in noise. Start leveraging intelligence built for the
            boardroom. Join enterprises and consultants using RnDWorkZone.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <button
              onClick={() => navigate("/submit")}
              className="bg-accent-blue text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 shadow-[0_12px_30px_rgba(65,75,255,0.25)] hover:shadow-[0_17px_38px_rgba(65,75,255,0.4)]"
            >
              Submit Requirement
            </button>
            {/* <button className="bg-pale-blue dark:bg-white/5 border border-border-light dark:border-white/10 text-primary dark:text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-surface-variant dark:hover:bg-white/10 transition-all hover:-translate-y-1">
              Book Free Discussion
            </button> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="footer"
        className="bg-surface-container-lowest dark:bg-dark-navy border-t border-border-light dark:border-white/10 pt-section-gap-lg pb-12 relative w-full transition-colors duration-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-gutter max-w-container-max mx-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
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
                className="h-[64px] object-contain dark:hidden shrink-0 w-auto  scale-[1.35]"
              />
              <img
                src={logoTextDark}
                alt="RnD Logo"
                className="h-[64px] object-contain hidden dark:block shrink-0 w-auto  scale-[1.35]"
              />
            </div>
            <p className="text-slate-muted dark:text-on-surface-variant text-sm leading-relaxed">
              AI-powered research and intelligence for organizations that need
              clarity, not noise.
            </p>
          </div>
          <div>
            <h4 className="font-label-caps text-slate-muted dark:text-on-surface-variant mb-6 tracking-widest uppercase">
              Navigation
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  className="text-sm dark:text-white/70 hover:text-primary dark:hover:text-white hover:translate-x-1 transition-all inline-block"
                  href="#industries"
                >
                  Industries
                </a>
              </li>
              <li>
                <a
                  className="text-sm dark:text-white/70 hover:text-primary dark:hover:text-white hover:translate-x-1 transition-all inline-block"
                  href="#services"
                >
                  Services
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-caps text-slate-muted dark:text-on-surface-variant mb-6 tracking-widest uppercase">
              Support
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  className="text-sm dark:text-white/70 hover:text-primary dark:hover:text-white hover:translate-x-1 transition-all inline-block"
                  href="mailto:rndworkzone@gmail.com"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  className="text-sm font-semibold text-primary dark:text-accent-blue hover:text-blue-600 dark:hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 mt-1"
                  href="mailto:rndworkzone@gmail.com"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    mail
                  </span>
                  rndworkzone@gmail.com
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-caps text-slate-muted dark:text-on-surface-variant mb-6 tracking-widest uppercase">
              Get Started
            </h4>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => navigate("/submit")}
                  className="text-sm font-semibold text-primary dark:text-white hover:underline"
                >
                  Submit Requirement
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-container-max mx-auto px-gutter mt-20 pt-8 border-t border-pale-blue dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-muted dark:text-on-surface-variant">
          <p>
            © 2026 RnDWorkZone. All rights reserved. Powered by HILAR
            Methodology.
          </p>
          <div className="flex gap-6"></div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

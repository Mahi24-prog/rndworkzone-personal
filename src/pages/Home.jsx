import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import TrustIndicators from "../components/TrustIndicators";
import WhyWeExist from "../components/WhyWeExist";
import IndustriesGrid from "../components/IndustriesGrid";
import HowWeWork from "../components/HowWeWork";
import HILARMethodology from "../components/HILARMethodology";
import Capabilities from "../components/Capabilities";
import Deliverables from "../components/Deliverables";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import { AnimatedSection } from "../components/AnimatedSection";

const Home = () => {
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 500px (roughly past the Hero section)
      if (window.scrollY > 500) {
        setShowFab(true);
      } else {
        setShowFab(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-page overflow-x-hidden">
      <Navigation />
      <main>
        <Hero />
        
        <AnimatedSection>
          <WhyWeExist />
        </AnimatedSection>
        
        <AnimatedSection>
          <IndustriesGrid />
        </AnimatedSection>
        
        <AnimatedSection>
          <HowWeWork />
        </AnimatedSection>
        
        <AnimatedSection>
          <HILARMethodology />
        </AnimatedSection>
        
        <AnimatedSection>
          <Deliverables />
        </AnimatedSection>
        
        <AnimatedSection>
          <FAQ />
        </AnimatedSection>
      </main>
      <Footer />

      {/* Floating Submit Button */}
      <Link
        to="/submit"
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 bg-accent-blue text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.5)] hover:-translate-y-1 transition-all duration-300 rounded-full px-5 py-3 flex items-center gap-2.5 font-bold group text-sm md:text-base ${
          showFab
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20 pointer-events-none"
        }`}
        aria-label="Submit Requirement"
      >
        <span className="material-symbols-outlined text-xl md:text-2xl group-hover:rotate-12 transition-transform">
          post_add
        </span>
        <span className="hidden md:inline">Submit Requirement</span>
      </Link>
    </div>
  );
};

export default Home;

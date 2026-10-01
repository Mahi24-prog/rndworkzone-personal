import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden text-white pt-20 pb-10"
      style={{
        background: `
          radial-gradient(circle at 10% 15%, rgba(24,128,255,.13), transparent 30%),
          radial-gradient(circle at 90% 35%, rgba(116,67,255,.12), transparent 32%),
          linear-gradient(135deg, #040916, #081125 55%, #040914)
        `,
      }}
    >
      <div className="relative z-10 max-w-container-max w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">
        {/* Left Content Column */}
        <div className="flex flex-col items-start text-left space-y-7 lg:pr-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#1a2d4c] bg-[#0b162c]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>
            <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase text-[#8da6ce]">
              Intelligent Research • Human Validated
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-7xl lg:text-[80px] font-bold tracking-tight leading-none"
          >
            <span className="text-white">RnD</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6fbaf8] to-[#c199ff]">
              WorkZone
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-2xl md:text-3xl lg:text-[34px] font-bold leading-tight mt-2 text-white"
          >
            Ask Better Questions.{" "}
            <span className="text-[#51baf0]">Get Better Research.</span>
            <br />
            Make Better Decisions.
          </motion.h2>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-[17px] md:text-[19px] text-[#94a3b8] max-w-xl font-normal leading-relaxed mt-2"
          >
            <strong className="text-white font-semibold">
              AI-powered research
            </strong>{" "}
            backed by structured methodologies, domain expertise, advanced
            analysis, and human validation.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-5 mt-4 w-full sm:w-auto"
          >
            <button
              onClick={() => navigate("/submit")}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#446bfe] to-[#8554ff] rounded-xl font-semibold text-white transition-all shadow-[0_4px_14px_rgba(68,107,254,0.3)] hover:shadow-[0_6px_20px_rgba(68,107,254,0.4)]"
            >
              Submit Requirement &rarr;
            </button>
            {/* <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-[#a1a1aa] border border-[#2a364a] bg-[#0c1222] hover:bg-[#121a2f] transition-all flex items-center justify-center gap-2">
              How It Works &rarr;
            </button> */}
          </motion.div>
        </div>

        {/* Right Visual Column */}
        <div className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center mt-10 lg:mt-0">
          {/* Concentric Rings - Solid, matching image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[300px] h-[300px] rounded-full border border-[#1e2e4a] absolute opacity-60"></div>
            <div className="w-[450px] h-[450px] rounded-full border border-[#1e2e4a] absolute opacity-40"></div>
            <div className="w-[600px] h-[600px] rounded-full border border-[#1e2e4a] absolute opacity-20"></div>
          </div>

          {/* Central 3D Sphere (Exact match) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10 w-[200px] h-[200px] md:w-[250px] md:h-[250px] rounded-full flex flex-col items-center justify-center"
            style={{
              background:
                "radial-gradient(circle at 45% 25%, #66a1ff 0%, #3a75ff 30%, #153280 75%, #050d24 100%)",
              boxShadow: "-10px 20px 40px rgba(0,0,0,0.6)",
            }}
          >
            <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-white/90 mb-1">
              POWERED BY
            </span>
            <span className="text-4xl md:text-5xl font-extrabold text-white">
              AI
            </span>
          </motion.div>

          {/* Floating Badges - Exactly matching the image style */}

          {/* Top Left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -5, 0] }}
            transition={{
              opacity: { delay: 0.8, duration: 0.5 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute z-20 top-[22%] left-[10%] md:left-[15%] px-3.5 py-1.5 rounded-lg bg-[#070e1c] border border-[#1e2e4a] flex items-center gap-2"
          >
            <span className="text-[13px]">🔬</span>
            <span className="text-[13px] font-semibold text-[#e2e8f0]">
              Research Request 
            </span>
          </motion.div>

          {/* Top Right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 5, 0] }}
            transition={{
              opacity: { delay: 1, duration: 0.5 },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 },
            }}
            className="absolute z-20 top-[40%] right-[0%] md:right-[5%] px-3.5 py-1.5 rounded-lg bg-[#070e1c] border border-[#1e2e4a] flex items-center gap-2"
          >
            <span className="text-[13px]">📄</span>
            <span className="text-[13px] font-semibold text-[#e2e8f0]">
              Data Discovery
            </span>
          </motion.div>

          {/* Bottom Left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -5, 0] }}
            transition={{
              opacity: { delay: 1.2, duration: 0.5 },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 },
            }}
            className="absolute z-20 bottom-[15%] left-[20%] md:left-[22%] px-3.5 py-1.5 rounded-lg bg-[#070e1c] border border-[#1e2e4a] flex items-center gap-2"
          >
            <span className="text-[13px]">🧠</span>
            <span className="text-[13px] font-semibold text-[#e2e8f0]">
              Expert Validation 
            </span>
          </motion.div>

          {/* Bottom Right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 5, 0] }}
            transition={{
              opacity: { delay: 1.4, duration: 0.5 },
              y: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              },
            }}
            className="absolute z-20 bottom-[2%] right-[10%] md:right-[20%] px-3.5 py-1.5 rounded-lg bg-[#070e1c] border border-[#1e2e4a] flex items-center gap-2"
          >
            <span className="text-[13px]">📊</span>
            <span className="text-[13px] font-semibold text-[#e2e8f0]">
               Insight & Report Generation
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

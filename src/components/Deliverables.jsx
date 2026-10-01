import React, { useState } from "react";

const deliverablesData = [
  {
    title: "Research Reports",
    desc: "Comprehensive deep-dive documents with structured findings, data analysis, and strategic recommendations.",
    icon: "menu_book",
  },
  {
    title: "Executive Summaries",
    desc: "Concise leadership-ready briefs that distil complex research into key insights for fast decision-making.",
    icon: "summarize",
  },
  {
    title: "PowerPoint Strategy Decks",
    desc: "Slide-ready presentations with visual structure, charts, and speaker-ready talking points.",
    icon: "co_present",
  },
  {
    title: "Market Intelligence Reports",
    desc: "Sector and market analysis with sizing, trends, competitive dynamics, and growth outlook.",
    icon: "query_stats",
  },
  {
    title: "Competitive Benchmarking",
    desc: "Side-by-side analysis of competitors covering capabilities, pricing, positioning, and strategy.",
    icon: "compare_arrows",
  },
  {
    title: "SWOT & Strategic Analysis",
    desc: "Structured strategic frameworks to evaluate organizational, market, and competitive positioning.",
    icon: "grid_view",
  },
  {
    title: "Excel-Based Analysis Models",
    desc: "Data models for financial analysis, market sizing, scenario planning, and operational metrics.",
    icon: "table_chart",
  },
  {
    title: "Dashboard Interpretation",
    desc: "Narrative analysis of KPIs, dashboard metrics, and performance signals with strategic context.",
    icon: "dashboard",
  },
  {
    title: "Trend Analysis Reports",
    desc: "Forward-looking research on emerging themes, disruptions, and signals across target sectors.",
    icon: "trending_up",
  },
  {
    title: "AI-Assisted Documentation",
    desc: "Structured SOPs, knowledge packs, and documentation built with AI precision and human review.",
    icon: "smart_toy",
  },
  {
    title: "Sector Landscape Reports",
    desc: "Macro-to-micro breakdown of a sector: players, structure, trends, regulations, and opportunities.",
    icon: "account_tree",
  },
  {
    title: "Due Diligence Packs",
    desc: "Investor-grade research covering market validation, risk assessment, and competitive context.",
    icon: "fact_check",
  },
  {
    title: "Consumer Insight Reports",
    desc: "Behavioural analysis, sentiment research, and buyer persona documentation for marketing strategy.",
    icon: "psychology",
  },
  {
    title: "Regulatory & Policy Briefs",
    desc: "Structured summaries of regulatory landscape changes and compliance implications by sector.",
    icon: "gavel",
  },
  {
    title: "White-Label Research",
    desc: "Unbranded research deliverables for consultants, agencies, and advisory firms.",
    icon: "branding_watermark",
  },
  {
    title: "Custom Engagements",
    desc: "Fully tailored scope, format, and depth for organizations with unique intelligence needs.",
    icon: "tune",
  },
];

const Deliverables = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
  };

  return (
    <section
      className="py-section-gap-lg bg-surface-container-lowest dark:bg-gradient-alt transition-colors duration-300"
      id="services"
    >
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="text-center mb-12">
          <h2 className="font-headline-md text-headline-md mb-2 dark:text-white">
            Professional <span className="gradient-text">Deliverables</span>
          </h2>
          <p className="text-slate-muted dark:text-on-surface-variant">
            Every engagement produces structured, formatted, and
            presentation-ready outputs.
          </p>
        </div>

        {/* Scrollable Container for Deliverables */}
        <div className="relative">
          {/* Dynamic Fade Overlay */}
          <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 dark:from-primary-container dark:via-primary-container/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 rounded-b-2xl ${isAtBottom ? 'opacity-0' : 'opacity-100'}`}></div>

          <div 
            className="max-h-[500px] overflow-y-auto custom-scrollbar pr-3 pb-4"
            onScroll={handleScroll}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {deliverablesData.map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl border border-pale-blue dark:border-white/10 hover:shadow-soft hover:bg-pale-blue/30 dark:hover:bg-white/5 transition-all group bg-white dark:bg-white/5 flex flex-col h-full"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform ${index % 2 === 0 ? "bg-primary dark:bg-white/20" : "bg-accent-blue"}`}
                  >
                    <span className="material-symbols-outlined">
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="font-bold mb-3 dark:text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-muted dark:text-on-surface-variant leading-relaxed flex-grow">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="py-6 text-center text-xs text-on-surface-variant/50 dark:text-white/30 font-bold uppercase tracking-widest mt-4 flex items-center justify-center gap-3">
              <span className="w-12 h-[1px] bg-border-slate/50 dark:bg-white/10"></span>
              End of List
              <span className="w-12 h-[1px] bg-border-slate/50 dark:bg-white/10"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Deliverables;

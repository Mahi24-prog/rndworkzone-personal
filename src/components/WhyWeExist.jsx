import React from "react";

const WhyWeExist = () => {
  return (
    <section
      id="why-we-exist"
      className="py-section-gap-lg transition-colors duration-300 bg-surface-container-lowest dark:bg-gradient-alt"
    >
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="text-center mb-16">
          <h2 className="font-headline-md text-headline-md mb-4 dark:text-white">
            The Gap We Were Built To Close
          </h2>
          <p className="text-slate-muted dark:text-on-surface-variant max-w-2xl mx-auto">
            The world doesn't lack information. It lacks clarity. Access to tools
            is not the same as access to intelligence.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Problem Card */}
          <div className="p-10 rounded-3xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 flex flex-col justify-between transition-colors duration-300">
            <div>
              <h3 className="font-title-lg text-2xl mb-8 flex items-center gap-3 dark:text-white">
                <span className="material-symbols-outlined text-error">
                  cancel
                </span>
                The Problem
              </h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="bg-red-100 dark:bg-error/20 text-error p-2 rounded-lg h-fit transition-colors">
                    <span className="material-symbols-outlined">psychology</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 dark:text-white">
                      Generic AI Outputs
                    </h4>
                    <p className="text-on-surface-variant dark:text-on-surface-variant">
                      Decisions are made on false or incomplete assumptions from
                      unverified prompts.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-red-100 dark:bg-error/20 text-error p-2 rounded-lg h-fit transition-colors">
                    <span className="material-symbols-outlined">reorder</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 dark:text-white">
                      Unstructured Data
                    </h4>
                    <p className="text-on-surface-variant dark:text-on-surface-variant">
                      Leaders can't act on walls of unformatted, verbose AI text.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-red-100 dark:bg-error/20 text-error p-2 rounded-lg h-fit transition-colors">
                    <span className="material-symbols-outlined">
                      hourglass_empty
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 dark:text-white">
                      Slow Intelligence
                    </h4>
                    <p className="text-on-surface-variant dark:text-on-surface-variant">
                      Slower intelligence means slower execution and loss of
                      competitive edge.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-10 rounded-3xl bg-primary text-white dark:bg-surface-tint shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent-blue/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="font-title-lg text-2xl mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-success">
                  check_circle
                </span>
                The Solution
              </h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="bg-white/10 p-2 rounded-lg h-fit">
                    <span className="material-symbols-outlined text-success">
                      verified
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      Human-Validated Research
                    </h4>
                    <p className="text-white/70">
                      Grounded in real sources and verified by subject matter
                      experts.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-white/10 p-2 rounded-lg h-fit">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Professional Formats</h4>
                    <p className="text-white/70">
                      Ready-to-use documents built for immediate boardroom
                      presentation.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-white/10 p-2 rounded-lg h-fit">
                    <span className="material-symbols-outlined">speed</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      Decision-Ready Deliverables
                    </h4>
                    <p className="text-white/70">
                      Strategic context that enables faster, deeper business
                      moves.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative z-10 mt-12 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="font-title-lg italic text-white/90">
                "We transform raw data into clarity for executive leadership."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWeExist;

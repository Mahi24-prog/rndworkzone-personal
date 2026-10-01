import React from "react";

const HowWeWork = () => {
  return (
    <section
      id="how-we-work"
      className="py-section-gap-lg overflow-hidden transition-colors duration-300 bg-surface-container-lowest dark:bg-gradient-alt"
    >
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="text-center mb-16">
          <h2 className="font-headline-md text-headline-md mb-2 dark:text-white">
            How We <span className="gradient-text">Work</span>
          </h2>
          <p className="text-slate-muted dark:text-on-surface-variant">
            A structured 5-step process from question to decision-ready output.
          </p>
        </div>
        <div className="relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-pale-blue dark:bg-white/10 -translate-y-1/2 hidden md:block"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 relative z-10">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-dark-navy border-2 border-primary dark:border-white/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:border-accent-blue dark:group-hover:border-accent-blue transition-all relative">
                <span className="font-bold dark:text-white">01</span>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">
                Requirement
              </h3>
              <p className="text-sm text-slate-muted dark:text-on-surface-variant">
                Share your objective or research question.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-dark-navy border-2 border-primary dark:border-white/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:border-accent-blue dark:group-hover:border-accent-blue transition-all relative">
                <span className="font-bold dark:text-white">02</span>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Scope</h3>
              <p className="text-sm text-slate-muted dark:text-on-surface-variant">
                We define sources, structure, and format.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-dark-navy border-2 border-primary dark:border-white/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:border-accent-blue dark:group-hover:border-accent-blue transition-all relative">
                <span className="font-bold dark:text-white">03</span>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">
                AI Discovery
              </h3>
              <p className="text-sm text-slate-muted dark:text-on-surface-variant">
                Advanced AI collects and synthesizes data.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center group">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-dark-navy border-2 border-primary dark:border-white/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:border-accent-blue dark:group-hover:border-accent-blue transition-all relative">
                <span className="font-bold dark:text-white">04</span>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Validation</h3>
              <p className="text-sm text-slate-muted dark:text-on-surface-variant">
                Analysts verify and enrich findings.
              </p>
            </div>

            {/* Step 5 */}
            <div className="text-center group">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-dark-navy border-2 border-primary dark:border-white/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:border-accent-blue dark:group-hover:border-accent-blue transition-all relative">
                <span className="font-bold dark:text-white">05</span>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Delivery</h3>
              <p className="text-sm text-slate-muted dark:text-on-surface-variant">
                Presentation-ready report delivered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;

import React from 'react';

const HILARMethodology = () => {
  return (
    <section className="bg-background dark:bg-dark-navy py-section-gap-lg transition-colors duration-300" id="methodology">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-label-caps text-accent-blue tracking-widest mb-4 block">PROPRIETARY ENGINE</span>
            <h2 className="font-headline-md text-headline-md mb-6 dark:text-white">Human-in-the-Loop AI Research (HILAR)</h2>
            <p className="text-body-lg text-slate-muted dark:text-on-surface-variant mb-8">
              We don't just run prompts. Every output passes through structured human validation before it reaches you. Speed without sacrificing accuracy.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-pale-blue dark:hover:bg-white/5 transition-colors border border-transparent hover:border-pale-blue dark:hover:border-white/10">
                <span className="material-symbols-outlined text-primary dark:text-white" style={{ fontVariationSettings: '"FILL" 1' }}>bolt</span>
                <div>
                  <h4 className="font-bold dark:text-white">AI Speed</h4>
                  <p className="text-sm text-slate-muted dark:text-on-surface-variant">Research that takes weeks delivered in 24-72 hours.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-pale-blue dark:hover:bg-white/5 transition-colors border border-transparent hover:border-pale-blue dark:hover:border-white/10">
                <span className="material-symbols-outlined text-primary dark:text-white" style={{ fontVariationSettings: '"FILL" 1' }}>verified_user</span>
                <div>
                  <h4 className="font-bold dark:text-white">Human Accuracy</h4>
                  <p className="text-sm text-slate-muted dark:text-on-surface-variant">Every finding verified before it reaches your desk.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-soft border border-pale-blue dark:border-white/10 bg-white dark:bg-white/5 transition-colors duration-300">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-lowest dark:bg-white/5">
                <tr>
                  <th className="p-5 font-label-caps text-slate-muted dark:text-on-surface-variant border-b border-pale-blue dark:border-white/10">Phase</th>
                  <th className="p-5 font-label-caps text-slate-muted dark:text-on-surface-variant border-b border-pale-blue dark:border-white/10">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pale-blue dark:divide-white/10">
                <tr>
                  <td className="p-5">
                    <div className="font-bold dark:text-white">Scope Definition</div>
                    <div className="text-xs text-slate-muted dark:text-on-surface-variant mt-1">Translated brief</div>
                  </td>
                  <td className="p-5 text-sm dark:text-on-surface-variant">Prevents scope creep and ensures the right question is answered.</td>
                </tr>
                <tr>
                  <td className="p-5">
                    <div className="font-bold dark:text-white">AI-Augmented Discovery</div>
                    <div className="text-xs text-slate-muted dark:text-on-surface-variant mt-1">Massive data scrape</div>
                  </td>
                  <td className="p-5 text-sm dark:text-on-surface-variant">Covers more ground in hours than a human team in weeks.</td>
                </tr>
                <tr>
                  <td className="p-5">
                    <div className="font-bold dark:text-white">Expert Filtering</div>
                    <div className="text-xs text-slate-muted dark:text-on-surface-variant mt-1">Contextual depth</div>
                  </td>
                  <td className="p-5 text-sm dark:text-on-surface-variant">Eliminates hallucinations and generic outputs.</td>
                </tr>
                <tr>
                  <td className="p-5">
                    <div className="font-bold dark:text-white">Strategic Synthesis</div>
                    <div className="text-xs text-slate-muted dark:text-on-surface-variant mt-1">Intelligence transformation</div>
                  </td>
                  <td className="p-5 text-sm dark:text-on-surface-variant">Actionable analysis tailored to your specific decision context.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HILARMethodology;

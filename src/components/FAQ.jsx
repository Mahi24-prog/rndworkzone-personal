import React, { useState } from "react";

const faqs = [
  {
    question: "What makes RnDWorkZone different from other research firms?",
    answer:
      "We sit at the intersection of AI speed and human judgment. Most research firms are slow; most AI tools are unstructured. We combine both — delivering research that is fast, verified, and professionally formatted. Every output is boardroom-ready from day one.",
  },
  {
    question: "How long does it take to receive a report?",
    answer:
      "Standard reports are typically delivered within 24–72 hours. Complex multi-source research engagements may take 3–7 business days. We are transparent about timelines at the start of every engagement — no surprises.",
  },
  {
    question: "Do you cover international markets?",
    answer:
      "Yes. RnDWorkZone covers global markets across all major regions including Asia-Pacific, North America, Europe, Middle East, Africa, and Latin America. Our 150+ industry coverage spans all geographies with no restrictions.",
  },
  {
    question: "Is my research requirement kept confidential?",
    answer:
      "Absolutely. All client engagements are treated with full confidentiality. We do not share, resell, or publish any client-specific research. Your intelligence belongs exclusively to you.",
  },
  {
    question: "Can I request a sample before committing?",
    answer:
      "Yes. You can book a free discovery discussion and we are happy to share sample report formats and past deliverable structures relevant to your sector or use case.",
  },
  {
    question: "Do you offer white-label research for consultants and agencies?",
    answer:
      "Yes. We work with management consultants, boutique advisory firms, and agencies that require unbranded, client-ready research outputs. White-label engagements are fully supported.",
  },
  {
    question: "What industries do you cover?",
    answer:
      "We cover 150+ industries across every major global sector — from technology, healthcare, and financial services to agriculture, logistics, real estate, and beyond. If your sector exists, we research it.",
  },
  {
    question: "What formats are reports delivered in?",
    answer:
      "Deliverables are provided in Word (.docx), PowerPoint (.pptx), PDF, or Excel (.xlsx) formats depending on the type of output. All documents are professionally formatted and presentation-ready.",
  },
  {
    question: "Do you work with startups or only large enterprises?",
    answer:
      "We serve both. RnDWorkZone is built for any organization that needs quality intelligence — from early-stage startups validating a market to large enterprises benchmarking competitors or tracking sector trends.",
  },
  {
    question: "What is your engagement model?",
    answer:
      "We offer flexible models: one-time report requests, project engagements with milestone delivery, ongoing retainer support, and white-label packs for agencies. Every engagement begins with a free scoping discussion.",
  },
  {
    question: "Can you deliver research on a very tight deadline?",
    answer:
      "Yes. Our AI-augmented research pipeline is designed for speed without sacrificing quality. For urgent requirements, contact us directly and we will assess feasibility and fast-track options.",
  },
  {
    question: "How do I submit a research requirement?",
    answer:
      "Simply fill out our research submission form on the website, book a free discovery call, or email us directly. We will respond within a few hours to confirm scope, format, and timeline.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
  };

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section py-section-gap-lg" id="faq">
      <div className="max-w-container-max mx-auto px-gutter relative z-10">
        <div className="faq-header">
          <h2 className="font-headline-md text-headline-md mb-2 dark:text-white">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-slate-muted dark:text-on-surface-variant">
            Everything you need to know before you start
          </p>
        </div>

        <div className="relative">
          {/* Dynamic Fade Overlay */}
          <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 dark:from-dark-navy dark:via-dark-navy/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${isAtBottom ? 'opacity-0' : 'opacity-100'}`}></div>

          <div 
            className="max-h-[360px] overflow-y-auto pr-4 custom-scrollbar"
            onScroll={handleScroll}
          >
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${activeIndex === index ? "active" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="question-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="question-text">{faq.question}</span>
                  <span className="question-icon">+</span>
                </button>

                <div
                  className="faq-answer"
                  style={{ maxHeight: activeIndex === index ? "500px" : "0px" }}
                >
                  <div className="answer-inner">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="py-6 text-center text-xs text-on-surface-variant/50 dark:text-white/30 font-bold uppercase tracking-widest mt-4 flex items-center justify-center gap-3">
            <span className="w-12 h-[1px] bg-border-slate/50 dark:bg-white/10"></span>
            End of FAQ
            <span className="w-12 h-[1px] bg-border-slate/50 dark:bg-white/10"></span>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

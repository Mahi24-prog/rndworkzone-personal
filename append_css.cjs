const fs = require('fs');

const css = `
/* =========================
   FAQ SECTION (Custom HTML Match)
========================= */

.faq-header {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 55px;
}

.faq-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 15px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #129eff;
    background: rgba(18,158,255,.1);
    border: 1px solid rgba(18,158,255,.2);
    box-shadow: 0 0 20px rgba(18,158,255,.1);
    margin-bottom: 20px;
}
.dark .faq-badge {
    color: #73cfff;
    background: rgba(24,169,255,.08);
    border: 1px solid rgba(24,169,255,.25);
    box-shadow: 0 0 25px rgba(24,169,255,.08);
}
.faq-badge::before {
    content: "";
    width: 7px;
    height: 7px;
    background: #21c4ff;
    border-radius: 50%;
    box-shadow: 0 0 12px #21c4ff;
}

.faq-header h1 {
    font-size: clamp(38px, 5vw, 62px);
    line-height: 1.05;
    letter-spacing: -2.5px;
    margin-bottom: 18px;
}

.gradient-text {
    background: linear-gradient(90deg, #101828 10%, #129eff 50%, #7545ff 90%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}
.dark .gradient-text {
    background: linear-gradient(90deg, #ffffff 10%, #55c8ff 50%, #8c6cff 90%);
    -webkit-background-clip: text;
}

.faq-subtitle {
    font-size: 18px;
    font-weight: 500;
    color: var(--on-surface-variant);
    margin-bottom: 14px;
}
.dark .faq-subtitle {
    color: #d4dced;
}

.header-description {
    max-width: 680px;
    margin: auto;
    color: var(--on-surface-variant);
    font-size: 15px;
    line-height: 1.8;
}

.faq-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.faq-item {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--border-light);
    border-radius: 18px;
    background: var(--surface-container-lowest);
    transition: transform .3s ease, border-color .3s ease, background .3s ease, box-shadow .3s ease;
}
.dark .faq-item {
    border-color: rgba(123,150,220,.18);
    background: linear-gradient(135deg, rgba(17,31,58,.78), rgba(8,17,35,.88));
    backdrop-filter: blur(15px);
}

.faq-item:hover {
    transform: translateY(-2px);
    border-color: var(--accent-blue);
    background: var(--surface-container-highest);
    box-shadow: 0 10px 30px rgba(0,0,0,.05);
}
.dark .faq-item:hover {
    border-color: rgba(44,167,255,.38);
    background: rgba(22,38,70,.9);
    box-shadow: 0 18px 50px rgba(0,0,0,.25);
}

.faq-item.active {
    border-color: var(--accent-blue);
    box-shadow: 0 10px 30px rgba(0,0,0,.08);
}
.dark .faq-item.active {
    border-color: rgba(75,118,255,.5);
    box-shadow: 0 18px 55px rgba(0,0,0,.3), 0 0 35px rgba(57,100,255,.07);
}

.faq-question {
    width: 100%;
    border: 0;
    outline: none;
    cursor: pointer;
    padding: 23px 25px;
    display: flex;
    align-items: center;
    gap: 18px;
    text-align: left;
    color: var(--primary);
    background: transparent;
    font-family: inherit;
}
.dark .faq-question {
    color: white;
}

.question-number {
    flex: none;
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 11px;
    font-size: 12px;
    font-weight: 700;
    color: #129eff;
    background: rgba(18,158,255,.1);
    border: 1px solid rgba(18,158,255,.2);
}
.dark .question-number {
    color: #69c8ff;
    background: rgba(24,169,255,.08);
    border: 1px solid rgba(24,169,255,.18);
}

.question-text {
    flex: 1;
    font-size: 16px;
    line-height: 1.5;
    font-weight: 600;
}

.question-icon {
    flex: none;
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: var(--on-surface-variant);
    background: rgba(0,0,0,.04);
    border: 1px solid rgba(0,0,0,.08);
    font-size: 20px;
    transition: transform .3s ease, color .3s ease, background .3s ease;
}
.dark .question-icon {
    color: #8da5ca;
    background: rgba(255,255,255,.035);
    border: 1px solid rgba(255,255,255,.08);
}

.faq-item.active .question-icon {
    transform: rotate(45deg);
    color: white;
    background: linear-gradient(135deg, #129eff, #7545ff);
    border-color: transparent;
}

.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height .4s ease;
}

.answer-inner {
    padding: 0 25px 25px 81px;
    color: var(--on-surface-variant);
    font-size: 14px;
    line-height: 1.85;
    max-width: 950px;
}

.answer-inner::before {
    content: "";
    display: block;
    height: 1px;
    background: linear-gradient(90deg, rgba(18,158,255,.2), transparent);
    margin-bottom: 18px;
}
.dark .answer-inner::before {
    background: linear-gradient(90deg, rgba(80,140,255,.3), transparent);
}
`;

fs.appendFileSync('src/index.css', css);
console.log('Appended CSS to src/index.css');

#!/usr/bin/env node

import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "docs", "hackathon-pdfs");
const TMP_DIR = path.join(OUT_DIR, ".tmp");
const TEAM = "TraversalAI";
const MEMBERS = "Ahmad Alfaqeih, Mustafa Maisara";
const COACH = "Ms. Amal Qutairi";
const LOGO = path.join(ROOT, "IMG_٢٠٢٦٠٢٢٣_١١١٣٤٧ (1).jpg");
const LOGO_SQUARE = path.join(ROOT, "assets", "hackathon", "logo-square.png");
const P10 = path.join(ROOT, "P_10.pdf");
const PRIMARY_REPO = "https://github.com/xplasma0/traversalai-v2.git";
const FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf";
const FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";
const FONT_DISPLAY = "/usr/share/fonts/truetype/quicksand/Quicksand-Bold.ttf";
const FONT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf";

function e(v) {
  return v
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function commandCatalog() {
  return `acp, agent, agents, approvals, browser, channels, chat, completion, config,
configure, cron, dashboard, devices, directory, dns, docs, doctor, gateway, health,
hooks, logs, memory, message, models, node, nodes, onboard, pairing, plugins, qr,
reset, sandbox, secrets, security, sessions, setup, skills, status, system, tui,
uninstall, update, webhooks`;
}

function scoreSvg(lang) {
  const t =
    lang === "ar"
      ? ["التصميم", "الابتكار", "الإلكترونيات", "البرمجة", "العرض", "الأثر"]
      : ["Design", "Innovation", "Electronics", "Programming", "Presentation", "Impact"];
  return `<svg viewBox="0 0 680 290" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <circle cx="340" cy="145" r="74" fill="#f7efe8" stroke="#17344c" stroke-width="8"/>
    <text x="340" y="152" text-anchor="middle" class="svg-label">TraversalAI</text>
    <circle cx="340" cy="25" r="34" fill="#0f5f74"/><text x="340" y="31" text-anchor="middle" class="svg-light">${t[0]}</text>
    <circle cx="455" cy="85" r="34" fill="#1b8870"/><text x="455" y="91" text-anchor="middle" class="svg-light">${t[1]}</text>
    <circle cx="455" cy="205" r="34" fill="#cf6d47"/><text x="455" y="211" text-anchor="middle" class="svg-light">${t[2]}</text>
    <circle cx="340" cy="265" r="34" fill="#8d5aa6"/><text x="340" y="271" text-anchor="middle" class="svg-light">${t[3]}</text>
    <circle cx="225" cy="205" r="34" fill="#cb9a2e"/><text x="225" y="211" text-anchor="middle" class="svg-light">${t[4]}</text>
    <circle cx="225" cy="85" r="34" fill="#355c9a"/><text x="225" y="91" text-anchor="middle" class="svg-light">${t[5]}</text>
  </svg>`;
}

function hardwareSvg(lang) {
  const t =
    lang === "ar"
      ? ["ميكروفون", "Raspberry Pi 5", "بوابة TraversalAI", "سماعة"]
      : ["Microphone", "Raspberry Pi 5", "TraversalAI Gateway", "Speaker"];
  return `<svg viewBox="0 0 680 220" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="75" width="140" height="70" rx="18" fill="#e7f1f4"/>
    <rect x="255" y="45" width="170" height="130" rx="24" fill="#0f5f74"/>
    <rect x="510" y="75" width="140" height="70" rx="18" fill="#e7f1f4"/>
    <path d="M170 110 H255 M425 110 H510" stroke="#17344c" stroke-width="6" stroke-linecap="round"/>
    <text x="100" y="116" text-anchor="middle" class="svg-label">${t[0]}</text>
    <text x="340" y="95" text-anchor="middle" class="svg-title">${t[1]}</text>
    <text x="340" y="128" text-anchor="middle" class="svg-sub">${t[2]}</text>
    <text x="580" y="116" text-anchor="middle" class="svg-label">${t[3]}</text>
  </svg>`;
}

function softwareSvg(lang) {
  const t =
    lang === "ar"
      ? ["واجهة المحادثة وCLI", "البوابة", "الوكلاء", "الأدوات والمهارات", "الجلسات والحالة"]
      : ["Chat UI + CLI", "Gateway", "Agents", "Tools + Skills", "Sessions + State"];
  return `<svg viewBox="0 0 680 260" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <rect x="120" y="20" width="440" height="38" rx="15" fill="#18263f"/><text x="340" y="44" text-anchor="middle" class="svg-light">${t[0]}</text>
    <rect x="140" y="74" width="400" height="38" rx="15" fill="#0f5f74"/><text x="340" y="98" text-anchor="middle" class="svg-light">${t[1]}</text>
    <rect x="160" y="128" width="360" height="38" rx="15" fill="#1b8870"/><text x="340" y="152" text-anchor="middle" class="svg-light">${t[2]}</text>
    <rect x="180" y="182" width="320" height="34" rx="15" fill="#cf6d47"/><text x="340" y="204" text-anchor="middle" class="svg-light">${t[3]}</text>
    <rect x="220" y="228" width="240" height="18" rx="9" fill="#f0d4c3"/><text x="340" y="241" text-anchor="middle" class="svg-chip">${t[4]}</text>
  </svg>`;
}

function flowSvg(lang) {
  const t =
    lang === "ar"
      ? ["مشكلة", "طلب", "قرار", "تنفيذ", "نتيجة"]
      : ["Problem", "Request", "Decision", "Execution", "Outcome"];
  return `<svg viewBox="0 0 680 150" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    ${t.map((label, i) => `<rect x="${20 + i * 132}" y="52" width="112" height="44" rx="16" fill="${["#183247", "#0f5f74", "#1b8870", "#cf6d47", "#8d5aa6"][i]}"/><text x="${76 + i * 132}" y="80" text-anchor="middle" class="svg-light">${label}</text>`).join("")}
  </svg>`;
}

function documentationSections(lang) {
  if (lang === "ar") {
    return [
      [
        "ملخص المشروع",
        "TraversalAI منصة عملية تجمع واجهة محادثة، بوابة مركزية، ووكلاء متخصصين ضمن نموذج أولي واضح وقابل للعرض. في سياق التحدي يمكن توجيهها لخدمة سيناريوهات السياحة والضيافة مثل الإرشاد الذكي، إدارة الطلبات، والتفاعل متعدد القنوات.",
        scoreSvg(lang),
      ],
      [
        "الارتباط بمعايير التحكيم",
        "<ul><li>التصميم: توضيح المشكلة، التدفق، وحدود النظام.</li><li>الابتكار: دمج الوكلاء والأدوات والمهارات في تجربة واحدة.</li><li>الإلكترونيات: تشغيل حقيقي على Raspberry Pi 5 مع ميكروفون وسماعة.</li><li>البرمجة: التنفيذ يمر عبر البوابة والجلسات وتبديل النماذج.</li><li>العرض: المحتوى منظم ليخدم العرض والمقابلة.</li><li>الأثر: ربط الحل بمشكلة فعلية في السياحة والضيافة.</li></ul>",
        "",
      ],
      [
        "التثبيت من المصدر",
        `<pre>git clone ${PRIMARY_REPO}\ncd traversalai-v2\ncorepack pnpm install\ncorepack pnpm build\nnode traversalai.mjs --help</pre><p>هذا المسار مناسب للمطورين أو للمراجعة المحلية الكاملة قبل التثبيت العالمي.</p>`,
        "",
      ],
      [
        "التثبيت كأداة طرفية",
        "<pre>npm install -g .\ntraversalai --help\ntraversalai onboard\ntraversalai chat --no-open</pre><p>بعد التثبيت يصبح الأمر <code>traversalai</code> متاحاً مباشرة. ابدأ بـ <code>onboard</code> ثم افتح <code>chat</code> أو شغّل <code>gateway</code>.</p>",
        "",
      ],
      [
        "تشغيل التطبيق",
        "<pre>traversalai onboard\ntraversalai gateway --force\ntraversalai chat --no-open\ntraversalai status\ntraversalai models --help\ntraversalai agents --help</pre><p>سير العمل المعتاد: إعداد أولي، تشغيل البوابة، فتح واجهة المحادثة، ثم فحص الوكلاء والنماذج والحالة.</p>",
        flowSvg(lang),
      ],
      [
        "معمارية النظام",
        "البوابة هي نقطة الربط المركزية. من خلالها يتم تبديل الوكلاء والنماذج، تنفيذ الأدوات والمهارات، وحفظ الجلسات للعودة إليها لاحقاً.",
        softwareSvg(lang),
      ],
      [
        "المنصة المادية",
        "النموذج الأولي مصمم ليعمل محلياً على Raspberry Pi 5 مع ميكروفون لالتقاط المدخلات وسماعة لإخراج النتائج، ما يمنح المشروع بعد AI + IoT واضح.",
        hardwareSvg(lang),
      ],
      [
        "فهرس أوامر البرنامج",
        `<pre>${commandCatalog()}</pre><p>هذه أوامر البرنامج العليا. كل أمر منها يدعم <code>--help</code> لتفاصيل إضافية.</p>`,
        "",
      ],
      [
        "أمثلة استخدام عملية",
        "<ul><li>مساعد سياحي ذكي يجيب عن أسئلة الزوار قبل الوصول وأثناء الزيارة وبعدها.</li><li>وكيل بريد ينظم الردود والطلبات المرتبطة بالحجوزات أو الخدمة.</li><li>وكيل تواصل اجتماعي ينشر تحديثات ويراقب التفاعل على القنوات.</li><li>تجربة ميدانية على Raspberry Pi 5 باستخدام الميكروفون والسماعة في العرض المباشر.</li><li>جلسات محفوظة تسمح بمتابعة نفس المهمة عبر أكثر من تفاعل.</li></ul>",
        "",
      ],
      [
        "استكشاف الأخطاء وإصلاحها",
        "<pre>traversalai doctor\ntraversalai status\ntraversalai gateway --force\ntraversalai chat --no-open\ntraversalai config --help</pre><ul><li>إذا لم تعمل الواجهة، تأكد أن البوابة تعمل وأن الرابط المحلي صحيح.</li><li>إذا غابت النماذج أو الوكلاء، استخدم <code>status</code> و<code>doctor</code>.</li><li>إذا تعطل البناء من المصدر، أعد تنفيذ <code>corepack pnpm install</code> ثم <code>corepack pnpm build</code>.</li><li>إذا ظهرت مشكلة في الجلسات، افتح محادثة جديدة واختبر المسار عبر البوابة مرة أخرى.</li></ul>",
        "",
      ],
      [
        "جاهزية العرض",
        "<pre>1. ابدأ بالمشكلة خلال 30 ثانية\n2. اعرض الجهاز أو البيئة المستضيفة\n3. نفّذ سيناريو قصير من الطلب إلى النتيجة\n4. أظهر نشاط الأداة أو المهارة أثناء التنفيذ\n5. اختم بالأثر وقابلية التوسع</pre><p>هذه الوثيقة مبنية على guidebook_en_2025.pdf كمرجع فقط وليست بديلاً عنه.</p>",
        "",
      ],
    ];
  }
  return [
    [
      "Project Snapshot",
      "TraversalAI is a practical prototype that combines a chat interface, a central gateway, and specialized agents in one visible system. In the challenge context it can be directed at tourism and hospitality scenarios such as smart guidance, service coordination, and multi-channel assistance.",
      scoreSvg(lang),
    ],
    [
      "Alignment With Judging Criteria",
      "<ul><li>Design: clarifies the problem, flow, and boundaries.</li><li>Innovation: combines agents, tools, and skills in one coherent workflow.</li><li>Electronics: uses Raspberry Pi 5 with microphone and speaker for a real AI + IoT setup.</li><li>Programming: routes execution through the gateway, saved sessions, and model switching.</li><li>Presentation: organized to support a short clear live explanation.</li><li>Impact: ties the system to a real tourism or hospitality problem.</li></ul>",
      "",
    ],
    [
      "Install From Source",
      `<pre>git clone ${PRIMARY_REPO}\ncd traversalai-v2\ncorepack pnpm install\ncorepack pnpm build\nnode traversalai.mjs --help</pre><p>This is the right path for developers, judges reviewing the repository, or anyone validating the project locally before a global install.</p>`,
      "",
    ],
    [
      "Install As a CLI Program",
      "<pre>npm install -g .\ntraversalai --help\ntraversalai onboard\ntraversalai chat --no-open</pre><p>After installation, the <code>traversalai</code> command becomes available system-wide. The normal first-run path is onboarding, then chat or gateway commands.</p>",
      "",
    ],
    [
      "Starting the App",
      "<pre>traversalai onboard\ntraversalai gateway --force\ntraversalai chat --no-open\ntraversalai status\ntraversalai models --help\ntraversalai agents --help</pre><p>A typical startup sequence is: complete onboarding, start the gateway, open the chat interface, then inspect status, models, and agents.</p>",
      flowSvg(lang),
    ],
    [
      "Software Platform",
      "The gateway is the main integration boundary. Through it, the system switches agents and models, executes tools and skills, and preserves saved chats for later continuation.",
      softwareSvg(lang),
    ],
    [
      "Hardware Platform",
      "The prototype is designed to run locally on a Raspberry Pi 5 with microphone input and speaker output. That gives the project a concrete AI + IoT shape and makes it suitable for a live demonstration.",
      hardwareSvg(lang),
    ],
    [
      "Program Command Catalog",
      `<pre>${commandCatalog()}</pre><p>These are the top-level commands exposed by the binary. Each one supports <code>--help</code> for more detail.</p>`,
      "",
    ],
    [
      "Example Use Cases",
      "<ul><li>A tourism assistant that answers visitor questions before arrival, on site, and after the trip.</li><li>An email agent that drafts, organizes, and tracks service responses.</li><li>A social media agent that posts updates and monitors engagement channels.</li><li>A Raspberry Pi 5 field kiosk with microphone and speaker for a live demonstration workflow.</li><li>Saved sessions that let the operator resume the same task across multiple interactions.</li></ul>",
      "",
    ],
    [
      "Troubleshooting",
      "<pre>traversalai doctor\ntraversalai status\ntraversalai gateway --force\ntraversalai chat --no-open\ntraversalai config --help</pre><ul><li>If the UI does not open correctly, confirm that the gateway is running and use the printed local URL.</li><li>If models or agents are missing, inspect gateway setup and rerun <code>status</code> or <code>doctor</code>.</li><li>If source installation fails, rerun <code>corepack pnpm install</code> followed by <code>corepack pnpm build</code>.</li><li>If sessions behave unexpectedly, open a new chat and retest through the gateway-backed path.</li></ul>",
      "",
    ],
    [
      "Demo Readiness",
      "<pre>1. State the problem in under 30 seconds\n2. Show the device or hosted runtime\n3. Run one short scenario from request to outcome\n4. Expose tool or skill activity during execution\n5. Close with impact and scalability</pre><p>This document uses guidebook_en_2025.pdf as a reference framework and does not replace it.</p>",
      "",
    ],
  ];
}

function introductionEnglishPages() {
  return [
    {
      title: "Project Introduction - Traversal AI Team Invincibles",
      paragraphs: [
        "In light of the unprecedented acceleration in the market of artificial intelligence tools, these technologies are no longer merely a luxury option; rather, they have become a strategic necessity imposed by the demands of the age, and a pivotal tool that has opened broad horizons to reshape various sectors and raise their efficiency and effectiveness. The tourism sector in particular, which is one of the main pillars of the national economy and an important source in Jordan specifically, has increasingly relied on intelligent systems and predictive analysis to improve service quality, regulate tourist movement, and reinforce the civilizational and cultural exchange that naturally characterizes this sector. This is reflected to a large extent in the efficiency of the companies and tourist offices that form the first interface of the tourist experience, as the planning, organization, and speed of response of these entities determine the visitor's impression from the very first moment of contact with the tourism destination until after the visit ends, ensuring visitor satisfaction and the sustainability of the relationship with it.",
        "Despite the central role played by these companies, they face multiple challenges that negatively affect the quality of the tourism experience and make it incomplete. Tourism today is no longer merely a traditional visits program; it has become a comprehensive experience that begins when the visitor thinks about the destination and continues through the cultural and service details surrounding them, where one poor interaction can be enough to distort the full impression. Here, the importance of artificial intelligence techniques emerges in elevating the hospitality sector, not only by providing an integrated tourism experience, but also by improving it in a complete and professional manner.",
        "The challenges facing the tourism sector can be classified into two main axes. The first axis represents cultural differences between employees and tourists from multiple nationalities, which often lead to intentional or unintentional errors in the style of communication, whether in the appropriate tone, timing, language, or even in understanding the tourist's needs and customs. These mistakes, even if they are simple, directly affect the tourist's satisfaction and their overall impression of the experience. The second axis is the issue of searching, planning, and organizing tourism programs, as this consumes great effort and very long time, and results in programs that are often not fully aligned with tourist preferences or are inaccurate in details.",
        "Based on these challenges, the Traversal AI project aims to design an integrated smart system based on artificial intelligence agents (AI Agents), helping companies improve customer service, provide reliable recommendations, analyze available data, and assist in building diverse and precise tourism programs. In practical terms, the system relies on intelligent agents specialized in task execution, and the project is built on a compact Raspberry Pi computer, giving it high flexibility and low cost, with the ability to access results and guidance quickly and effectively.",
      ],
    },
    {
      title: "Project Introduction - Traversal AI Team Invincibles",
      paragraphs: [
        "The project relies on a set of specialized agents, where each agent has a specific role that serves a particular aspect of tourism work. For example, there is an agent specialized in responding to the company's email messages professionally and quickly, and another agent that provides direct support to the employee while dealing with customers, especially in situations that require cultural understanding or sensitive handling. This specialization has been intelligently achieved by building independent knowledge bases for each agent, and by supplying tools (Tools) and skills (Skills) specific to each one, so that every agent can perform its tasks efficiently, with the possibility of creating an integrated artificial intelligence model that identifies the user and their needs.",
        "Because the type and function of agents differ, the tools and technical resources used vary according to the nature of the task carried out by each one, which grants the project high flexibility and future scalability. The system is designed so that an agent can be added or existing agents can be developed without the need to rebuild the whole system, which contributes to reducing costs and increasing operational efficiency.",
        "From the software perspective, the project relies on TypeScript and JavaScript to ensure the greatest possible compatibility with the widest range of devices, including mobile phones, tablets, and computers. Modern libraries such as Vite and React were used to build the user interface and guarantee smooth use, in addition to Kotlin for Android applications and Swift for iOS applications. This guarantees wide deployment and a consistent user experience across all these devices. Furthermore, the high compatibility between the different technologies enhances the strength of the system, and tourism companies can use it easily within diverse operating environments.",
        "From the economic perspective, Traversal AI is truly an effective solution in terms of cost, as it helps companies improve performance without the need for large investments in human resources or expensive equipment. It also offers a clear advantage in the Jordanian context to support emerging projects, by enabling companies to provide an integrated and professional tourism experience at a lower cost. In addition, the project supports the principles of sustainable development by improving the efficiency of resource use, reducing operational errors, and raising the quality of services provided.",
        "In the end, Traversal AI does not seek merely to be another technical tool added to the list of tourism companies. Rather, it aspires to be the bridge that connects technology to the heart of the tourism and hospitality experience; a platform that deeply understands differences between cultures and turns operational challenges into opportunities for development and distinction. We do not only look at the present as it is; we seek to create a richer, more professional, and more humane tourism experience.",
      ],
    },
  ];
}

function pageHeader(title, lang, logo) {
  return `<header class="page-header"><div class="brand-lockup"><img src="${logo}" class="logo-small" alt="TraversalAI logo"/><div><div class="brand-name">${TEAM}</div><div class="brand-meta">${MEMBERS} · ${COACH}</div></div></div><div class="doc-meta"><div class="doc-title">${e(title)}</div><div class="doc-sub">${lang === "ar" ? "نسخة عربية" : "English Version"}</div></div></header>`;
}

function baseCss() {
  return `@page { size: A4; margin: 0; }
    @font-face { font-family: TraversalBody; src: url("file://${FONT_REGULAR}"); }
    @font-face { font-family: TraversalBold; src: url("file://${FONT_BOLD}"); }
    @font-face { font-family: TraversalDisplay; src: url("file://${FONT_DISPLAY}"); }
    @font-face { font-family: TraversalMono; src: url("file://${FONT_MONO}"); }
    :root { --ink:#162129; --muted:#62717d; --accent:#0f5f74; --paper:#f6f0e8; --line:rgba(15,95,116,.18); }
    * { box-sizing:border-box; } body { margin:0; background:#d8dee5; color:var(--ink); font-family:TraversalBody, sans-serif; }
    .page { width:210mm; height:297mm; page-break-after:always; position:relative; overflow:hidden; background:radial-gradient(circle at top right, rgba(15,95,116,.14), transparent 28%), linear-gradient(180deg, #fffdfb, var(--paper)); }
    .cover { background:radial-gradient(circle at 80% 20%, rgba(207,109,71,.22), transparent 28%), linear-gradient(135deg, #0f1726, #17344c 52%, #245f73 100%); color:white; }
    .cover-grid { display:grid; grid-template-columns:1.15fr .85fr; gap:24px; padding:90px 70px 70px; height:100%; align-items:center; }
    .cover-tag { display:inline-block; padding:8px 14px; border-radius:999px; background:rgba(255,255,255,.12); font-size:12px; letter-spacing:.14em; text-transform:uppercase; }
    h1 { font-family:TraversalDisplay, TraversalBold, sans-serif; font-size:44px; line-height:1.1; margin:18px 0 16px; }
    .cover-subtitle { font-size:17px; line-height:1.7; color:rgba(255,255,255,.88); max-width:520px; }
    .cover-meta { margin-top:26px; display:grid; gap:10px; font-size:14px; }
    .logo-hero { width:100%; max-width:280px; border-radius:28px; box-shadow:0 28px 60px rgba(0,0,0,.28); justify-self:center; }
    .page-header,.page-footer { position:absolute; left:48px; right:48px; display:flex; align-items:center; justify-content:space-between; }
    .page-header { top:26px; padding-bottom:16px; border-bottom:1px solid var(--line); }
    .page-footer { bottom:24px; color:var(--muted); font-size:11px; border-top:1px solid var(--line); padding-top:10px; }
    .brand-lockup { display:flex; align-items:center; gap:14px; } .logo-small { width:44px; height:44px; border-radius:14px; object-fit:cover; }
    .brand-name { font-family:TraversalDisplay, TraversalBold, sans-serif; font-size:18px; } .brand-meta,.doc-sub { font-size:11px; color:var(--muted); }
    .doc-meta { text-align:right; } .rtl .doc-meta { text-align:left; }
    .doc-title { font-family:TraversalBold, sans-serif; font-size:16px; }
    .page-body { position:absolute; top:110px; left:56px; right:56px; bottom:56px; }
    .section-header { margin-bottom:18px; padding:20px 24px; border-radius:24px; background:linear-gradient(135deg, rgba(15,95,116,.1), rgba(207,109,71,.08)); border:1px solid rgba(15,95,116,.16); }
    .section-kicker { color:var(--accent); font-size:11px; letter-spacing:.18em; text-transform:uppercase; margin-bottom:8px; }
    h2 { margin:0; font-family:TraversalDisplay, TraversalBold, sans-serif; font-size:28px; }
    p,li { font-size:14px; line-height:1.7; margin:0 0 12px; }
    .panel { padding:18px 20px; border-radius:24px; background:rgba(255,255,255,.82); border:1px solid rgba(15,95,116,.14); box-shadow:0 12px 28px rgba(15,23,38,.06); }
    .panel ul { margin:0; padding-inline-start:22px; } .panel pre { margin:10px 0 16px; padding:18px 20px; border-radius:18px; background:#eef2f5; border:1px solid #d8e2ea; font-family:TraversalMono, monospace; font-size:12px; line-height:1.6; white-space:pre-wrap; }
    .diagram-svg { width:100%; height:auto; display:block; margin-top:10px; } .svg-label,.svg-light,.svg-title,.svg-sub,.svg-chip { font-family:TraversalBold, sans-serif; } .svg-label{fill:#17344c;font-size:24px;} .svg-light{fill:#fff;font-size:14px;} .svg-title{fill:#fff;font-size:24px;} .svg-sub{fill:rgba(255,255,255,.86);font-size:15px;} .svg-chip{fill:#17344c;font-size:12px;}
    .toc-list { display:grid; gap:12px; } .toc-row { display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center; color:inherit; text-decoration:none; padding:10px 14px; border-radius:14px; background:rgba(255,255,255,.7); border:1px solid rgba(15,95,116,.10); } .toc-dots { border-bottom:1px dashed rgba(15,95,116,.3); transform:translateY(1px); }
    .rtl { direction:rtl; text-align:right; } .ltr { direction:ltr; text-align:left; }`;
}

function htmlForDocument({ filename, lang, title, subtitle, parts }, hero, square) {
  const rtl = lang === "ar";
  const toc = parts
    .map(
      ([t], i) =>
        `<a class="toc-row" href="#section-${i + 1}"><span>${e(t)}</span><span class="toc-dots"></span><span>${i + 3}</span></a>`,
    )
    .join("");
  const pages = parts
    .map(
      ([t, body, svg], i) =>
        `<section class="page ${rtl ? "rtl" : "ltr"}">${pageHeader(title, lang, square)}<main class="page-body"><section class="section-header" id="section-${i + 1}"><div class="section-kicker">${rtl ? "قسم" : "Section"}</div><h2>${e(t)}</h2></section><div class="panel">${body}${svg}</div></main><footer class="page-footer"><span>${TEAM} Hackathon Submission</span><span>${i + 3}</span></footer></section>`,
    )
    .join("\n");
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"/><title>${e(title)}</title><style>${baseCss()}</style></head><body>
    <section class="page cover ${rtl ? "rtl" : "ltr"}"><div class="cover-grid"><div><div class="cover-tag">${rtl ? "وثيقة مرجعية" : "Reference Document"}</div><h1>${e(title)}</h1><p class="cover-subtitle">${e(subtitle)}</p><div class="cover-meta"><div><strong>${rtl ? "الفريق" : "Team"}:</strong> ${TEAM}</div><div><strong>${rtl ? "الأعضاء" : "Members"}:</strong> ${e(MEMBERS)}</div><div><strong>${rtl ? "المدربة" : "Coach"}:</strong> ${e(COACH)}</div></div></div><div><img src="${hero}" class="logo-hero" alt="TraversalAI logo"/></div></div></section>
    <section class="page ${rtl ? "rtl" : "ltr"}">${pageHeader(title, lang, square)}<main class="page-body"><section class="section-header"><div class="section-kicker">${rtl ? "فهرس" : "Contents"}</div><h2>${rtl ? "جدول المحتويات" : "Table of Contents"}</h2></section><div class="toc-list">${toc}</div></main><footer class="page-footer"><span>${TEAM} Hackathon Submission</span><span>2</span></footer></section>
    ${pages}
  </body></html>`;
}

async function renderDocument({ filename, lang, title, subtitle, parts }, hero, square) {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(TMP_DIR, { recursive: true });
  const html = htmlForDocument({ filename, lang, title, subtitle, parts }, hero, square);
  const htmlPath = path.join(TMP_DIR, `${filename.replace(/\.pdf$/, "")}.html`);
  const pdfPath = path.join(OUT_DIR, filename);
  await fs.writeFile(htmlPath, html);
  await execFileAsync(
    "chromium",
    [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      `--print-to-pdf=${pdfPath}`,
      "--print-to-pdf-no-header",
      htmlPath,
    ],
    { cwd: ROOT },
  );
  console.log(`Wrote ${path.relative(ROOT, pdfPath).replaceAll(path.sep, "/")}`);
}

async function renderArabicIntro(hero, square) {
  const dir = path.join(TMP_DIR, "introduction-ar-v3");
  await fs.mkdir(dir, { recursive: true });
  await execFileAsync("gs", [
    "-q",
    "-dNOPAUSE",
    "-dBATCH",
    "-sDEVICE=pngalpha",
    "-r160",
    `-sOutputFile=${path.join(dir, "page-%02d.png")}`,
    P10,
  ]);
  const imageNames = (await fs.readdir(dir)).filter((x) => x.endsWith(".png")).sort();
  const images = await Promise.all(
    imageNames.map(
      async (name) =>
        `data:image/png;base64,${(await fs.readFile(path.join(dir, name))).toString("base64")}`,
    ),
  );
  const pages = images
    .map(
      (src, i) =>
        `<section class="page rtl">${pageHeader("Introduction", "ar", square)}<main class="page-body"><div class="panel"><img src="${src}" alt="Arabic introduction page ${i + 1}" style="width:100%;height:auto;border-radius:18px;box-shadow:0 12px 28px rgba(15,23,38,.08)"/></div></main><footer class="page-footer"><span>${TEAM} Hackathon Submission</span><span>${i + 1}</span></footer></section>`,
    )
    .join("\n");
  const html = `<!doctype html><html lang="ar"><head><meta charset="utf-8"/><title>Introduction</title><style>${baseCss()}</style></head><body>
    ${pages}
  </body></html>`;
  const htmlPath = path.join(TMP_DIR, "introduction.ar.v3.html");
  const pdfPath = path.join(OUT_DIR, "introduction.ar.v3.pdf");
  await fs.writeFile(htmlPath, html);
  await execFileAsync(
    "chromium",
    [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      `--print-to-pdf=${pdfPath}`,
      "--print-to-pdf-no-header",
      htmlPath,
    ],
    { cwd: ROOT },
  );
  console.log(`Wrote ${path.relative(ROOT, pdfPath).replaceAll(path.sep, "/")}`);
}

async function renderEnglishIntro(square) {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(TMP_DIR, { recursive: true });
  const pages = introductionEnglishPages()
    .map(
      ({ title, paragraphs }, i) =>
        `<section class="page ltr">${pageHeader("Introduction", "en", square)}<main class="page-body"><section class="section-header"><h2>${e(title)}</h2></section><div class="panel">${paragraphs.map((p) => `<p>${e(p)}</p>`).join("")}</div></main><footer class="page-footer"><span>${TEAM} Hackathon Submission</span><span>${i + 1}</span></footer></section>`,
    )
    .join("\n");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><title>Introduction</title><style>${baseCss()}</style></head><body>${pages}</body></html>`;
  const htmlPath = path.join(TMP_DIR, "introduction.en.v3.html");
  const pdfPath = path.join(OUT_DIR, "introduction.en.v3.pdf");
  await fs.writeFile(htmlPath, html);
  await execFileAsync(
    "chromium",
    [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      `--print-to-pdf=${pdfPath}`,
      "--print-to-pdf-no-header",
      htmlPath,
    ],
    { cwd: ROOT },
  );
  console.log(`Wrote ${path.relative(ROOT, pdfPath).replaceAll(path.sep, "/")}`);
}

const hero = `data:image/jpeg;base64,${(await fs.readFile(LOGO)).toString("base64")}`;
const square = `data:image/png;base64,${(await fs.readFile(LOGO_SQUARE)).toString("base64")}`;

await renderDocument(
  {
    filename: "documentation.en.v3.pdf",
    lang: "en",
    title: "Documentation",
    subtitle: "Detailed install, run, command, troubleshooting, and use-case guide",
    parts: documentationSections("en"),
  },
  hero,
  square,
);
await renderDocument(
  {
    filename: "documentation.ar.v3.pdf",
    lang: "ar",
    title: "Documentation",
    subtitle: "دليل تفصيلي للتثبيت والتشغيل والأوامر واستكشاف الأخطاء وحالات الاستخدام",
    parts: documentationSections("ar"),
  },
  hero,
  square,
);
await renderEnglishIntro(square);
await renderArabicIntro(hero, square);

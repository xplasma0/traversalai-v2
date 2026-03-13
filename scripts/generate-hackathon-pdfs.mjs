#!/usr/bin/env node

import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "docs", "hackathon-pdfs");
const TMP_DIR = path.join(OUTPUT_DIR, ".tmp");
const PAGE_HEIGHT = 1123;
const PAGE_WIDTH = 794;
const CONTENT_HEIGHT = 900;
const TEAM_NAME = "TraversalAI";
const TEAM_MEMBERS = "Ahmad Alfaqeih, Mustafa Maisara";
const COACH = "Ms. Amal Qutairi";
const LOGO_PATH = path.join(ROOT, "IMG_٢٠٢٦٠٢٢٣_١١١٣٤٧ (1).jpg");
const LOGO_SQUARE_PATH = path.join(ROOT, "assets", "hackathon", "logo-square.png");

const FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf";
const FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";
const FONT_DISPLAY = "/usr/share/fonts/truetype/quicksand/Quicksand-Bold.ttf";
const FONT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf";

function rel(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, "/");
}

function submissionLabel(value) {
  return value
    .replaceAll("TraversalAI", "TraversalAI")
    .replaceAll("traversalai", "traversalai")
    .replaceAll("TRAVERSALAI", "TRAVERSALAI");
}

async function walk(dir, matcher) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full, matcher)));
      continue;
    }
    if (matcher(full)) {
      out.push(full);
    }
  }
  return out;
}

async function listDirs(dir) {
  const out = [];
  async function visit(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      const full = path.join(current, entry.name);
      out.push(rel(full));
      await visit(full);
    }
  }
  await visit(dir);
  return out.sort();
}

function groupDocFiles(files) {
  const groups = new Map();
  for (const file of files) {
    const parts = file.split("/");
    const group = parts[1] ?? "root";
    const list = groups.get(group) ?? [];
    list.push(file);
    groups.set(group, list);
  }
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function moduleSummary(files) {
  const groups = new Map();
  for (const file of files) {
    const parts = file.split("/");
    const key = parts.length >= 3 ? `${parts[1]}/${parts[2]}` : (parts[1] ?? file);
    groups.set(key, (groups.get(key) ?? 0) + 1);
  }
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function wrapText(text, limit) {
  if (!text) {
    return [""];
  }
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= limit) {
      current = candidate;
      continue;
    }
    if (current) {
      lines.push(current);
    }
    current = word;
  }
  if (current) {
    lines.push(current);
  }
  return lines.length ? lines : [text];
}

function diagramCard(title, subtitle, svg, height = 320) {
  return { type: "diagram", title, subtitle, svg, height };
}

function section(id, title, blocks, options = {}) {
  return { id, title, blocks, ...options };
}

function judgingCriteriaSection(lang, focus) {
  const ar = lang === "ar";
  const focusText = {
    operator: ar
      ? "هذا المجلد يوضح كيف يخدم التشغيل الفعلي معايير العرض، الأثر، والجاهزية للمقابلة."
      : "This volume emphasizes live operation, presentation quality, impact, and interview readiness.",
    developer: ar
      ? "هذا المجلد يربط البنية البرمجية بمعايير التصميم، البرمجة، والابتكار القابل للتبرير."
      : "This volume maps the engineering structure to design, programming, and defensible innovation criteria.",
    architecture: ar
      ? "هذا المجلد يثبت جانب الإلكترونيات وAI + IoT من خلال Raspberry Pi 5 والميكروفون والسماعة وتدفق النظام."
      : "This volume demonstrates the electronics and AI + IoT dimension through Raspberry Pi 5, microphone, speaker, and system flow.",
    code: ar
      ? "هذا المجلد يشرح كيف تتحول الفكرة إلى تنفيذ قابل للفحص، وهو ما يدعم معايير البرمجة والتصميم والأثر."
      : "This volume explains how the idea becomes inspectable implementation, directly supporting programming, design, and impact criteria.",
  }[focus];
  return section(
    ar ? "alignment" : "alignment",
    ar ? "مواءمة معايير التحكيم" : "Judging Criteria Alignment",
    [
      {
        type: "lead",
        text: focusText,
      },
      {
        type: "bullets",
        items: ar
          ? [
              "التصميم: توضيح المشكلة، التدفق، وحدود المسؤوليات.",
              "الابتكار: إبراز تعدد الوكلاء، الأدوات، والمهارات ضمن حل واحد.",
              "الإلكترونيات: ربط النظام بتشغيل مادي على Raspberry Pi 5 ومدخلات/مخرجات فعلية.",
              "البرمجة: إظهار البوابة، الجلسات، والنماذج كتنفيذ حقيقي لا كمفهوم نظري.",
              "العرض والتواصل: تجهيز قصة عرض قصيرة وواضحة أمام المحكمين.",
              "الأثر: ربط الحل بمشكلة عملية في السياحة والضيافة وقابلية عرضه كنموذج أولي.",
            ]
          : [
              "Design: make the problem, flow, and component boundaries easy to understand.",
              "Innovation: show the multi-agent, tools, and skills model as one coherent solution.",
              "Electronics: anchor the system to Raspberry Pi 5 with real input/output hardware.",
              "Programming: demonstrate the gateway, sessions, and model orchestration as implemented code.",
              "Presentation and communication: support a short, clear live narrative for judges.",
              "Impact: connect the solution to a real tourism or hospitality problem with a working prototype.",
            ],
      },
    ],
  );
}

function diagramHardware(lang) {
  const t =
    lang === "ar"
      ? {
          title: "مخطط العتاد",
          subtitle: "ميكروفون، سماعة، وRaspberry Pi 5 كعقدة تشغيل ميدانية",
          mic: "ميكروفون",
          spk: "سماعة",
          pi: "Raspberry Pi 5",
          gateway: "بوابة TraversalAI",
          cloud: "مزودات النماذج",
          users: "المشغلون",
        }
      : {
          title: "Hardware Block Diagram",
          subtitle: "Microphone, speaker, and Raspberry Pi 5 as the field runtime host",
          mic: "Microphone",
          spk: "Speaker",
          pi: "Raspberry Pi 5",
          gateway: "TraversalAI Gateway",
          cloud: "Model Providers",
          users: "Operators",
        };
  return diagramCard(
    t.title,
    t.subtitle,
    `
    <svg viewBox="0 0 680 280" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f5f74"/>
          <stop offset="100%" stop-color="#18a7b8"/>
        </linearGradient>
      </defs>
      <rect x="40" y="90" width="120" height="80" rx="20" fill="#e8f3f6"/>
      <rect x="520" y="90" width="120" height="80" rx="20" fill="#e8f3f6"/>
      <rect x="220" y="60" width="240" height="140" rx="28" fill="url(#g1)"/>
      <rect x="500" y="24" width="140" height="40" rx="20" fill="#ffe8cf"/>
      <rect x="40" y="24" width="140" height="40" rx="20" fill="#ffe8cf"/>
      <path d="M160 130 H220" stroke="#0f5f74" stroke-width="6" stroke-linecap="round"/>
      <path d="M460 130 H520" stroke="#0f5f74" stroke-width="6" stroke-linecap="round"/>
      <path d="M460 90 C520 90 540 60 570 44" stroke="#0f5f74" stroke-width="4" fill="none" stroke-dasharray="10 8"/>
      <path d="M220 90 C160 90 150 60 110 44" stroke="#0f5f74" stroke-width="4" fill="none" stroke-dasharray="10 8"/>
      <text x="100" y="137" text-anchor="middle" class="svg-label">${t.mic}</text>
      <text x="580" y="137" text-anchor="middle" class="svg-label">${t.spk}</text>
      <text x="340" y="112" text-anchor="middle" class="svg-title">${t.pi}</text>
      <text x="340" y="145" text-anchor="middle" class="svg-sub">${t.gateway}</text>
      <text x="340" y="172" text-anchor="middle" class="svg-sub">${t.cloud}</text>
      <text x="110" y="49" text-anchor="middle" class="svg-chip">${t.users}</text>
      <text x="570" y="49" text-anchor="middle" class="svg-chip">${t.cloud}</text>
    </svg>`,
    300,
  );
}

function diagramSoftware(lang) {
  const t =
    lang === "ar"
      ? {
          title: "طبقات البرمجيات",
          subtitle: "واجهة المستخدم، البوابة، وقت التشغيل، والتكاملات",
          ui: "واجهات المستخدم",
          gateway: "طبقة البوابة",
          runtime: "طبقة الوكلاء",
          channels: "القنوات والامتدادات",
          infra: "البنية التحتية والأمان",
        }
      : {
          title: "Software Layers",
          subtitle: "UI surfaces, gateway services, agent runtime, and integrations",
          ui: "UI Surfaces",
          gateway: "Gateway Layer",
          runtime: "Agent Runtime",
          channels: "Channels & Extensions",
          infra: "Infra & Security",
        };
  return diagramCard(
    t.title,
    t.subtitle,
    `
    <svg viewBox="0 0 680 300" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="90" y="24" width="500" height="44" rx="18" fill="#18263f"/>
      <rect x="110" y="82" width="460" height="48" rx="18" fill="#0f5f74"/>
      <rect x="130" y="144" width="420" height="48" rx="18" fill="#1b8870"/>
      <rect x="150" y="206" width="380" height="40" rx="18" fill="#cf6d47"/>
      <rect x="170" y="258" width="340" height="24" rx="12" fill="#f0d4c3"/>
      <text x="340" y="51" text-anchor="middle" class="svg-title-light">${t.ui}</text>
      <text x="340" y="112" text-anchor="middle" class="svg-title-light">${t.gateway}</text>
      <text x="340" y="174" text-anchor="middle" class="svg-title-light">${t.runtime}</text>
      <text x="340" y="231" text-anchor="middle" class="svg-title-light">${t.channels}</text>
      <text x="340" y="275" text-anchor="middle" class="svg-chip">${t.infra}</text>
    </svg>`,
    320,
  );
}

function diagramFlow(lang) {
  const t =
    lang === "ar"
      ? {
          title: "تدفق البيانات",
          subtitle: "من الرسالة إلى النتيجة عبر البوابة والوكيل والأدوات",
          a: "رسالة",
          b: "توجيه",
          c: "قرار الوكيل",
          d: "تنفيذ الأدوات",
          e: "الاستجابة",
        }
      : {
          title: "End-to-End Flow",
          subtitle: "From user message through routing, agent execution, tools, and final response",
          a: "Message",
          b: "Routing",
          c: "Agent Decision",
          d: "Tool Execution",
          e: "Response",
        };
  return diagramCard(
    t.title,
    t.subtitle,
    `
    <svg viewBox="0 0 680 210" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      ${[
        [40, t.a, "#e8f3f6"],
        [170, t.b, "#d5f0f5"],
        [300, t.c, "#c7eadb"],
        [430, t.d, "#ffe8cf"],
        [560, t.e, "#f0d4c3"],
      ]
        .map(
          ([x, label, fill]) => `
          <rect x="${x}" y="70" width="100" height="70" rx="20" fill="${fill}"/>
          <text x="${Number(x) + 50}" y="112" text-anchor="middle" class="svg-label">${label}</text>`,
        )
        .join("")}
      <path d="M140 105 H170 M270 105 H300 M400 105 H430 M530 105 H560" stroke="#0f5f74" stroke-width="6" stroke-linecap="round"/>
    </svg>`,
    250,
  );
}

function diagramAgents(lang) {
  const t =
    lang === "ar"
      ? {
          title: "تنسيق الوكلاء المدمجين",
          subtitle: "الوكيل الرئيسي ينسق البريد الإلكتروني ووسائل التواصل",
          main: "الوكيل الرئيسي",
          email: "وكيل البريد",
          social: "وكيل التواصل",
        }
      : {
          title: "Built-in Agent Orchestration",
          subtitle: "The main agent coordinates the email and social media specialists",
          main: "Master Control Agent",
          email: "Email Agent",
          social: "Social Media Agent",
        };
  return diagramCard(
    t.title,
    t.subtitle,
    `
    <svg viewBox="0 0 680 250" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <circle cx="340" cy="70" r="54" fill="#18263f"/>
      <circle cx="190" cy="190" r="46" fill="#0f5f74"/>
      <circle cx="490" cy="190" r="46" fill="#cf6d47"/>
      <path d="M305 110 L226 156" stroke="#0f5f74" stroke-width="6" stroke-linecap="round"/>
      <path d="M375 110 L454 156" stroke="#cf6d47" stroke-width="6" stroke-linecap="round"/>
      <text x="340" y="66" text-anchor="middle" class="svg-title-light">${t.main}</text>
      <text x="190" y="195" text-anchor="middle" class="svg-label-light">${t.email}</text>
      <text x="490" y="195" text-anchor="middle" class="svg-label-light">${t.social}</text>
    </svg>`,
    280,
  );
}

function operatorDocument(data, lang) {
  const ar = lang === "ar";
  return {
    id: `operator-manual-${lang}`,
    filename: `operator-manual.${lang}.v2.pdf`,
    title: ar ? "المجلد الأول — دليل التشغيل" : "Volume 1 — Operator Manual",
    subtitle: ar
      ? "للمشغلين والمستخدمين النهائيين: الإعداد، التشغيل اليومي، وأفضل الممارسات"
      : "For operators and end users: setup, daily workflows, and operating practice",
    sections: [
      section("mission", ar ? "هوية المشروع ونطاقه" : "Project Identity and Scope", [
        {
          type: "lead",
          text: ar
            ? `هذا الدليل يعرّف TraversalAI كمنصة تشغيل ذكية للهاكاثون، مع هوية الفريق ${TEAM_NAME} وأعضاء الفريق ${TEAM_MEMBERS} وإشراف ${COACH}.`
            : `This manual presents TraversalAI as a hackathon-ready intelligent operations platform under team ${TEAM_NAME}, built by ${TEAM_MEMBERS}, coached by ${COACH}.`,
        },
        {
          type: "bullets",
          items: ar
            ? [
                "الوكلاء المدمجون يتم تجهيزهم تلقائياً أثناء الإعداد الأولي.",
                "واجهة المحادثة الرسومية تعمل عبر البوابة فقط.",
                "التشغيل المستهدف محلياً على Raspberry Pi 5 أو بيئة Node متوافقة.",
              ]
            : [
                "Built-in agents are provisioned automatically during first-run setup.",
                "The standalone chat UI routes through the gateway only.",
                "Primary runtime targets are Raspberry Pi 5 and compatible Node environments.",
              ],
        },
        diagramAgents(lang),
      ]),
      judgingCriteriaSection(lang, "operator"),
      section("setup", ar ? "الإعداد والتشغيل الأولي" : "Setup and First Run", [
        {
          type: "paragraph",
          text: ar
            ? "ابدأ بتثبيت التطبيق، ثم نفّذ أمر الإعداد لتجهيز الوكلاء، مساحة العمل، ملفات الجلسات، ومفاتيح الوصول إلى البوابة."
            : "Install the application, then run onboarding to prepare agents, workspaces, session stores, and gateway credentials.",
        },
        {
          type: "code",
          lines: ar
            ? [
                "npm install -g traversalai@latest",
                "traversalai onboard --install-daemon",
                "traversalai chat --no-open",
              ]
            : [
                "npm install -g traversalai@latest",
                "traversalai onboard --install-daemon",
                "traversalai chat --no-open",
              ],
        },
        {
          type: "bullets",
          items: ar
            ? [
                "الوكيل الرئيسي: التنسيق، التفويض، ومتابعة الجلسات.",
                "وكيل البريد: الرسائل، المسودات، التنظيم.",
                "وكيل التواصل الاجتماعي: النشر، المتابعة، والتفاعل.",
              ]
            : [
                "Master Control Agent: coordination, delegation, and session oversight.",
                "Email Agent: inbox tasks, drafting, and organization.",
                "Social Media Agent: posting, monitoring, and engagement.",
              ],
        },
      ]),
      section("daily", ar ? "التشغيل اليومي" : "Daily Operations", [
        {
          type: "paragraph",
          text: ar
            ? "في التشغيل اليومي، يستخدم المشغلون واجهة المحادثة أو أوامر الطرفية لإرسال المهام، تبديل النماذج، تبديل الوكلاء، ومراجعة السجل المحفوظ."
            : "In daily use, operators interact through the chat UI or CLI commands to send tasks, switch models, switch agents, and revisit saved sessions.",
        },
        {
          type: "bullets",
          items: ar
            ? [
                "استخدم السجل المحفوظ لاستكمال المحادثات السابقة.",
                "بدّل الوكيل وفق المهمة المطلوبة بدلاً من مزج المهام في جلسة واحدة.",
                "راجع أحداث الأدوات قبل اعتماد النتائج التنفيذية.",
              ]
            : [
                "Use saved chats to resume prior work instead of restarting context.",
                "Switch agents by task domain rather than mixing unrelated work in one session.",
                "Review tool activity before trusting an automated execution result.",
              ],
        },
        diagramFlow(lang),
      ]),
      section("safety", ar ? "السلامة التشغيلية" : "Operational Safety", [
        {
          type: "lead",
          text: ar
            ? "المنصة شخصية افتراضياً وليست بيئة متعددة المستأجرين بشكل عدائي. يجب تفعيل الضوابط عندما يشارك أكثر من مستخدم نفس القناة أو نفس الأدوات."
            : "The platform is personal-by-default, not a hostile multi-tenant boundary. Tighten controls when more than one user can reach the same tool-enabled surface.",
        },
        {
          type: "bullets",
          items: ar
            ? [
                "استخدم allowlists وpairing قبل فتح الوصول البعيد.",
                "قلّل صلاحيات الأدوات للوكلاء المتخصصين.",
                "نفّذ فحوصات health وsecurity audit بشكل دوري.",
              ]
            : [
                "Use allowlists and pairing before enabling remote access.",
                "Keep specialized agents on least-privilege tool profiles.",
                "Run health and security audit checks regularly.",
              ],
        },
      ]),
      section("help", ar ? "خريطة المراجع التشغيلية" : "Operator Reference Map", [
        {
          type: "fileList",
          intro: ar ? "ملفات التوثيق ذات الصلة بالمشغل:" : "Operator-relevant documentation files:",
          items: data.operatorDocs.map(submissionLabel),
        },
      ]),
    ],
  };
}

function developerDocument(data, lang) {
  const ar = lang === "ar";
  return {
    id: `developer-guide-${lang}`,
    filename: `developer-guide.${lang}.v2.pdf`,
    title: ar ? "المجلد الثاني — دليل المطور" : "Volume 2 — Developer Guide",
    subtitle: ar
      ? "هيكل الكود، البناء، التكامل، ومرجع الوثائق البرمجية"
      : "Code structure, build workflows, integration details, and technical references",
    sections: [
      section("repo", ar ? "بنية المستودع" : "Repository Structure", [
        {
          type: "lead",
          text: ar
            ? "الكود موزع بين وقت تشغيل الوكلاء، أوامر الطرفية، البوابة، القنوات، والتطبيقات العميلة. هذا الفصل يلخص المناطق الرئيسية للمطورين."
            : "The repository spans agent runtime, CLI commands, gateway services, channels, and client applications. This section summarizes the major areas a developer needs to navigate.",
        },
        {
          type: "fileList",
          intro: ar ? "ملخص الوحدات البرمجية:" : "Module summary:",
          items: data.moduleSummary.map(([name, count]) => `${submissionLabel(name)} (${count})`),
        },
      ]),
      judgingCriteriaSection(lang, "developer"),
      section("build", ar ? "البناء والتحقق" : "Build and Validation", [
        {
          type: "code",
          lines: [
            "corepack pnpm install",
            "corepack pnpm build",
            "corepack pnpm test",
            "corepack pnpm check",
          ],
        },
        {
          type: "bullets",
          items: ar
            ? [
                "بناء الحزمة يحدّث المخرجات المترجمة وواجهة المحادثة المستقلة.",
                "الاختبارات الحالية تغطي تجهيز الوكلاء المدمجين ومسارات الإعداد الأساسية.",
                "ملفات GitHub workflow موجودة مسبقاً وتخدم قابلية النشر والمراجعة.",
              ]
            : [
                "The main build refreshes compiled outputs and the standalone chat packaging.",
                "Current targeted tests cover built-in agent provisioning and core onboarding paths.",
                "GitHub workflows already exist for CI, smoke checks, and release support.",
              ],
        },
      ]),
      section("gateway", ar ? "طبقة البوابة والواجهات" : "Gateway and UI Integration", [
        {
          type: "paragraph",
          text: ar
            ? "البوابة هي حد التكامل الأساسي. واجهة المحادثة المستقلة، واجهة التحكم، وأوامر الصحة والجلسات تعتمد عليها لعرض الوكلاء والنماذج والمهارات والأدوات."
            : "The gateway is the primary integration boundary. Standalone chat, control UI, and operational commands rely on it for agents, models, skills, tools, and session history.",
        },
        diagramSoftware(lang),
        {
          type: "fileList",
          intro: ar ? "ملفات مرجعية للبوابة وCLI:" : "Gateway and CLI reference docs:",
          items: [...data.gatewayDocs, ...data.cliDocs].map(submissionLabel),
        },
      ]),
      section("agents", ar ? "تجهيز الوكلاء ووقت التشغيل" : "Agent Provisioning and Runtime", [
        {
          type: "lead",
          text: ar
            ? "أُضيف تجهيز تلقائي لثلاثة وكلاء مدمجين في مسار setup/onboard. يتم حفظ التخصيصات الحالية للمستخدم عند الدمج."
            : "Automatic provisioning for three built-in agents is now injected into setup and onboarding. Existing user customizations are preserved during the merge.",
        },
        {
          type: "code",
          lines: [
            "src/agents/builtins.ts",
            "src/commands/onboard-config.ts",
            "src/commands/onboard-helpers.ts",
            "src/wizard/onboarding.ts",
          ],
        },
        diagramAgents(lang),
      ]),
      section("docs", ar ? "فهرس التوثيق الكامل" : "Full Documentation Index", [
        {
          type: "fileList",
          intro: ar ? "جميع ملفات docs/:" : "All docs/ files:",
          items: data.docFiles.map(submissionLabel),
        },
      ]),
    ],
  };
}

function architectureDocument(data, lang) {
  const ar = lang === "ar";
  return {
    id: `architecture-${lang}`,
    filename: `architecture-document.${lang}.v2.pdf`,
    title: ar ? "المجلد الثالث — وثيقة المعمارية" : "Volume 3 — Architecture Document",
    subtitle: ar
      ? "القسم أ: معمارية العتاد. القسم ب: معمارية البرمجيات."
      : "Section A: Hardware Architecture. Section B: Software Architecture.",
    sections: [
      judgingCriteriaSection(lang, "architecture"),
      section("hardware", ar ? "القسم أ — معمارية العتاد" : "Section A — Hardware Architecture", [
        {
          type: "lead",
          text: ar
            ? "المنصة الميدانية مبنية حول Raspberry Pi 5 مع ميكروفون كمدخل صوتي وسماعة كمخرج صوتي، مع تشغيل البوابة والوكيل محلياً."
            : "The field deployment centers on a Raspberry Pi 5 with a microphone as the audio input and a speaker as the audio output, hosting the gateway and agent runtime locally.",
        },
        diagramHardware(lang),
        {
          type: "bullets",
          items: ar
            ? [
                "الميكروفون يلتقط أوامر المستخدم والمحيط.",
                "السماعة تعيد المخرجات الصوتية والتنبيهات.",
                "Raspberry Pi 5 يستضيف البوابة، الجلسات، والوكلاء المحليين.",
              ]
            : [
                "The microphone captures user speech and environmental input.",
                "The speaker returns speech output and system feedback.",
                "The Raspberry Pi 5 hosts the gateway, session state, and local agent services.",
              ],
        },
      ]),
      section(
        "software",
        ar ? "القسم ب — معمارية البرمجيات" : "Section B — Software Architecture",
        [
          {
            type: "paragraph",
            text: ar
              ? "البرنامج مقسم إلى طبقات واضحة: واجهات المستخدم، البوابة، وقت تشغيل الوكلاء، التكاملات، والبنية الأمنية. كل طبقة لها مسؤولية محددة وحدود تكامل واضحة."
              : "The software is divided into clear layers: UI surfaces, gateway services, agent runtime, integrations, and security infrastructure. Each layer has a defined responsibility and explicit integration boundaries.",
          },
          diagramSoftware(lang),
          diagramFlow(lang),
          {
            type: "fileList",
            intro: ar ? "ملخص بنية الشيفرة:" : "Code structure summary:",
            items: data.moduleSummary.map(([name, count]) => `${submissionLabel(name)} (${count})`),
          },
        ],
      ),
    ],
  };
}

function codeExplanationDocument(data, lang) {
  const ar = lang === "ar";
  return {
    id: `code-explanation-${lang}`,
    filename: `code-explanation.${lang}.v2.pdf`,
    title: ar ? "شرح الكود الكامل" : "Full Code Explanation",
    subtitle: ar
      ? "شرح معماري ووظيفي مع ملاحق تغطي ملفات الكود الأساسية"
      : "Architectural and functional explanation with appendices covering the core source inventory",
    sections: [
      section("overview", ar ? "نظرة عامة" : "Overview", [
        {
          type: "lead",
          text: ar
            ? "TraversalAI عبارة عن منصة تشغيل محلية أولاً تجمع البوابة، الوكلاء، الجلسات، القنوات، والواجهات الرسومية في بنية واحدة."
            : "TraversalAI is a local-first operations platform that combines the gateway, agents, sessions, channels, and UI surfaces into one runtime architecture.",
        },
        {
          type: "bullets",
          items: ar
            ? [
                "src/config يسيطر على التهيئة والتحقق والهجرات.",
                "src/agents يسيطر على منطق الوكلاء والأدوات والسندبوكس.",
                "src/gateway يوفّر واجهات RPC والتدفق الحي.",
                "src/commands وsrc/cli يقدمان تجربة التشغيل للمستخدم.",
              ]
            : [
                "src/config owns configuration, validation, and migrations.",
                "src/agents owns agent logic, tools, sandboxing, and workspaces.",
                "src/gateway exposes RPC, streaming, and UI integration methods.",
                "src/commands and src/cli provide the operational command surface.",
              ],
        },
      ]),
      judgingCriteriaSection(lang, "code"),
      section("flow", ar ? "التدفق البرمجي" : "Execution Flow", [
        {
          type: "paragraph",
          text: ar
            ? "تدخل الرسالة عبر قناة أو واجهة، تُوجّه إلى وكيل وجلسة، ثم تُنفذ عبر وقت التشغيل مع سياسات الأدوات والسندبوكس قبل العودة إلى البوابة والواجهة."
            : "A message enters through a channel or UI, is routed to an agent and session, executes through the runtime under tool and sandbox policy, and returns through the gateway to the caller.",
        },
        diagramFlow(lang),
      ]),
      section("builtin-agents", ar ? "الوكلاء المدمجون" : "Built-in Agents", [
        {
          type: "paragraph",
          text: ar
            ? "يوفر النظام الآن ثلاثة وكلاء افتراضيين: الوكيل الرئيسي، وكيل البريد، ووكيل التواصل الاجتماعي. يتم تجهيزهم في setup/onboard وتُنشأ لهم مساحات العمل والجلسات المرتبطة."
            : "The system now provisions three default agents: the main orchestrator, the email specialist, and the social media specialist. They are injected during setup/onboarding with matching workspace and session directories.",
        },
        {
          type: "code",
          lines: [
            "src/agents/builtins.ts",
            "src/commands/setup.ts",
            "src/commands/onboard-config.ts",
            "src/commands/onboard-helpers.ts",
            "src/wizard/onboarding.ts",
          ],
        },
        diagramAgents(lang),
      ]),
      section("apps", ar ? "الواجهات والتطبيقات" : "Apps and Surfaces", [
        {
          type: "fileList",
          intro: ar ? "الأدلة المهمة تحت apps/:" : "Important apps/ directories:",
          items: data.appDirs.map(submissionLabel),
        },
      ]),
      section(
        "source-index",
        ar ? "ملحق فهرس الكود" : "Source Inventory Appendix",
        [
          {
            type: "fileList",
            intro: ar ? "ملفات المصدر الأساسية:" : "Primary source files:",
            items: data.sourceFiles.map(submissionLabel),
          },
        ],
        { noPageBreakBefore: false },
      ),
    ],
  };
}

function blockHeight(block, lang) {
  if (block.type === "lead") {
    return wrapText(block.text, lang === "ar" ? 64 : 74).length * 24 + 40;
  }
  if (block.type === "paragraph") {
    return wrapText(block.text, lang === "ar" ? 66 : 78).length * 20 + 20;
  }
  if (block.type === "bullets") {
    return (
      block.items.reduce(
        (sum, item) => sum + wrapText(item, lang === "ar" ? 60 : 70).length * 18 + 10,
        0,
      ) + 18
    );
  }
  if (block.type === "code") {
    return block.lines.length * 18 + 36;
  }
  if (block.type === "diagram") {
    return block.height + 58;
  }
  if (block.type === "fileList") {
    return 30 + block.items.length * 17 + 30;
  }
  return 60;
}

function splitFileListBlock(block, lang, remainingHeight) {
  const headerHeight = 34;
  const itemHeight = 17;
  const capacity = Math.max(1, Math.floor((remainingHeight - headerHeight - 10) / itemHeight));
  const firstItems = block.items.slice(0, capacity);
  const restItems = block.items.slice(capacity);
  const first = { ...block, items: firstItems };
  const rest = restItems.length > 0 ? { ...block, items: restItems } : null;
  return [first, rest];
}

function paginateDocument(doc, lang) {
  const contentPages = [];
  let page = [];
  let used = 0;
  const tocEntries = [];
  let pageNumber = 3;

  for (const sec of doc.sections) {
    const sectionAnchor = `${doc.id}-${sec.id}`;
    let firstBlockOnSection = true;

    const sectionHeader = {
      type: "sectionHeader",
      title: sec.title,
      anchor: sectionAnchor,
    };

    const blocks = [sectionHeader, ...sec.blocks];
    let queue = [...blocks];

    while (queue.length > 0) {
      const block = queue.shift();
      const height = block.type === "sectionHeader" ? 86 : blockHeight(block, lang);
      const remaining = CONTENT_HEIGHT - used;

      if (block.type === "sectionHeader") {
        if (used > 0 && remaining < 120) {
          contentPages.push(page);
          page = [];
          used = 0;
          pageNumber += 1;
        }
        tocEntries.push({ title: sec.title, page: pageNumber, anchor: sectionAnchor });
      }

      if (height <= remaining) {
        page.push(block);
        used += height;
        firstBlockOnSection = false;
        continue;
      }

      if (block.type === "fileList") {
        const [first, rest] = splitFileListBlock(
          block,
          lang,
          remaining > 140 ? remaining : CONTENT_HEIGHT,
        );
        if (remaining <= 140 && used > 0) {
          contentPages.push(page);
          page = [];
          used = 0;
          pageNumber += 1;
          queue.unshift(block);
          continue;
        }
        page.push(first);
        used += blockHeight(first, lang);
        if (rest) {
          contentPages.push(page);
          page = [];
          used = 0;
          pageNumber += 1;
          queue.unshift(rest);
        }
        continue;
      }

      if (used > 0) {
        contentPages.push(page);
        page = [];
        used = 0;
        pageNumber += 1;
        queue.unshift(block);
      } else {
        page.push(block);
        used += height;
      }
      firstBlockOnSection = false;
    }
  }

  if (page.length > 0) {
    contentPages.push(page);
  }

  return { tocEntries, contentPages };
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderBlock(block, lang) {
  if (block.type === "sectionHeader") {
    return `<section class="section-header" id="${escapeHtml(block.anchor)}"><div class="section-kicker">${lang === "ar" ? "قسم" : "Section"}</div><h2>${escapeHtml(block.title)}</h2></section>`;
  }
  if (block.type === "lead") {
    return `<p class="lead">${escapeHtml(block.text)}</p>`;
  }
  if (block.type === "paragraph") {
    return `<p>${escapeHtml(block.text)}</p>`;
  }
  if (block.type === "bullets") {
    return `<ul class="bullet-list">${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }
  if (block.type === "code") {
    return `<pre class="code-block">${block.lines.map(escapeHtml).join("\n")}</pre>`;
  }
  if (block.type === "diagram") {
    return `<div class="diagram-card"><div class="diagram-meta"><h3>${escapeHtml(block.title)}</h3><p>${escapeHtml(block.subtitle)}</p></div>${block.svg}</div>`;
  }
  if (block.type === "fileList") {
    return `<div class="file-list"><h3>${escapeHtml(block.intro)}</h3><ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>`;
  }
  return "";
}

function renderPage(doc, lang, pageNumber, totalPages, blocks, logoDataUrl) {
  const rtl = lang === "ar";
  return `
    <section class="page ${rtl ? "rtl" : "ltr"}" id="${escapeHtml(`${doc.id}-page-${pageNumber}`)}">
      <header class="page-header">
        <div class="brand-lockup">
          <img src="${logoDataUrl}" alt="TraversalAI logo" class="logo-small"/>
          <div>
            <div class="brand-name">${TEAM_NAME}</div>
            <div class="brand-meta">${escapeHtml(TEAM_MEMBERS)} · ${escapeHtml(COACH)}</div>
          </div>
        </div>
        <div class="doc-meta">
          <div class="doc-title">${escapeHtml(doc.title)}</div>
          <div class="doc-sub">${rtl ? "نسخة عربية" : "English / Arabic Hackathon Edition"}</div>
        </div>
      </header>
      <main class="page-body">
        ${blocks.map((block) => renderBlock(block, lang)).join("")}
      </main>
      <footer class="page-footer">
        <span>${rtl ? "فريق TraversalAI" : "TraversalAI Hackathon Submission"}</span>
        <span>${pageNumber} / ${totalPages}</span>
      </footer>
    </section>`;
}

function renderCover(doc, lang, logoHeroDataUrl) {
  const rtl = lang === "ar";
  return `
    <section class="page cover ${rtl ? "rtl" : "ltr"}" id="${escapeHtml(`${doc.id}-cover`)}">
      <div class="cover-grid">
        <div class="cover-copy">
          <div class="cover-tag">${rtl ? "تسليم هاكاثون" : "Hackathon Submission"}</div>
          <h1>${escapeHtml(doc.title)}</h1>
          <p class="cover-subtitle">${escapeHtml(doc.subtitle)}</p>
          <div class="cover-meta">
            <div><strong>${rtl ? "الفريق" : "Team"}:</strong> ${TEAM_NAME}</div>
            <div><strong>${rtl ? "الأعضاء" : "Members"}:</strong> ${escapeHtml(TEAM_MEMBERS)}</div>
            <div><strong>${rtl ? "المدربة" : "Coach"}:</strong> ${escapeHtml(COACH)}</div>
          </div>
        </div>
        <div class="cover-art">
          <img src="${logoHeroDataUrl}" alt="TraversalAI logo" class="logo-hero"/>
        </div>
      </div>
    </section>`;
}

function renderToc(doc, lang, tocEntries, logoDataUrl, totalPages) {
  const rtl = lang === "ar";
  return `
    <section class="page toc ${rtl ? "rtl" : "ltr"}" id="${escapeHtml(`${doc.id}-toc`)}">
      <header class="page-header">
        <div class="brand-lockup">
          <img src="${logoDataUrl}" alt="TraversalAI logo" class="logo-small"/>
          <div>
            <div class="brand-name">${TEAM_NAME}</div>
            <div class="brand-meta">${escapeHtml(TEAM_MEMBERS)} · ${escapeHtml(COACH)}</div>
          </div>
        </div>
        <div class="doc-meta">
          <div class="doc-title">${rtl ? "جدول المحتويات" : "Table of Contents"}</div>
          <div class="doc-sub">${escapeHtml(doc.title)}</div>
        </div>
      </header>
      <main class="page-body">
        <div class="toc-list">
          ${tocEntries
            .map(
              (entry) => `
              <a class="toc-row" href="#${escapeHtml(entry.anchor)}">
                <span>${escapeHtml(entry.title)}</span>
                <span class="toc-dots"></span>
                <span>${entry.page}</span>
              </a>`,
            )
            .join("")}
        </div>
      </main>
      <footer class="page-footer">
        <span>${rtl ? "فريق TraversalAI" : "TraversalAI Hackathon Submission"}</span>
        <span>2 / ${totalPages}</span>
      </footer>
    </section>`;
}

async function renderDocument(doc, lang, data) {
  const logoSquare = await fs.readFile(LOGO_SQUARE_PATH);
  const logoHero = await fs.readFile(LOGO_PATH);
  const logoSquareDataUrl = `data:image/png;base64,${logoSquare.toString("base64")}`;
  const logoHeroDataUrl = `data:image/jpeg;base64,${logoHero.toString("base64")}`;

  const { tocEntries, contentPages } = paginateDocument(doc, lang);
  const totalPages = contentPages.length + 2;
  const pages = [
    renderCover(doc, lang, logoHeroDataUrl),
    renderToc(doc, lang, tocEntries, logoSquareDataUrl, totalPages),
    ...contentPages.map((blocks, index) =>
      renderPage(doc, lang, index + 3, totalPages, blocks, logoSquareDataUrl),
    ),
  ];

  const dir = path.join(TMP_DIR, doc.id);
  await fs.mkdir(dir, { recursive: true });
  const htmlPath = path.join(dir, `${doc.filename.replace(/\.pdf$/, "")}.html`);
  const pdfPath = path.join(OUTPUT_DIR, doc.filename);
  const html = `<!doctype html>
  <html lang="${lang}">
    <head>
      <meta charset="utf-8"/>
      <title>${escapeHtml(doc.title)}</title>
      <style>
        @page { size: A4; margin: 0; }
        @font-face { font-family: TraversalBody; src: url("file://${FONT_REGULAR}"); }
        @font-face { font-family: TraversalBold; src: url("file://${FONT_BOLD}"); }
        @font-face { font-family: TraversalDisplay; src: url("file://${FONT_DISPLAY}"); }
        @font-face { font-family: TraversalMono; src: url("file://${FONT_MONO}"); }
        :root {
          --ink: #162129;
          --muted: #62717d;
          --accent: #0f5f74;
          --accent-2: #cf6d47;
          --paper: #f6f0e8;
          --panel: #fffaf5;
          --panel-alt: #e6f0f3;
          --line: rgba(15,95,116,.18);
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          background: #d8dee5;
          font-family: TraversalBody, "DejaVu Sans", sans-serif;
          color: var(--ink);
        }
        .page {
          width: 210mm;
          height: 297mm;
          page-break-after: always;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at top right, rgba(15,95,116,.14), transparent 28%),
            linear-gradient(180deg, #fffdfb, var(--paper));
        }
        .cover {
          background:
            radial-gradient(circle at 80% 20%, rgba(207,109,71,.22), transparent 28%),
            linear-gradient(135deg, #0f1726, #17344c 52%, #245f73 100%);
          color: white;
        }
        .cover-grid {
          display: grid;
          grid-template-columns: 1.2fr .8fr;
          gap: 24px;
          padding: 90px 70px 70px;
          height: 100%;
          align-items: center;
        }
        .cover.rtl .cover-grid { grid-template-columns: .8fr 1.2fr; }
        .cover-tag {
          display: inline-block;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,.12);
          font-size: 12px;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .cover h1 {
          font-family: TraversalDisplay, TraversalBold, sans-serif;
          font-size: 44px;
          line-height: 1.12;
          margin: 18px 0 16px;
        }
        .cover-subtitle {
          font-size: 17px;
          line-height: 1.7;
          color: rgba(255,255,255,.88);
          max-width: 540px;
        }
        .cover-meta {
          margin-top: 28px;
          display: grid;
          gap: 10px;
          font-size: 14px;
          color: rgba(255,255,255,.92);
        }
        .logo-hero {
          width: 100%;
          max-width: 280px;
          border-radius: 28px;
          box-shadow: 0 28px 60px rgba(0,0,0,.28);
          justify-self: center;
        }
        .page-header, .page-footer {
          position: absolute;
          left: 48px;
          right: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .page-header {
          top: 26px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--line);
        }
        .page-footer {
          bottom: 24px;
          color: var(--muted);
          font-size: 11px;
          border-top: 1px solid var(--line);
          padding-top: 10px;
        }
        .brand-lockup {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .logo-small {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          object-fit: cover;
          box-shadow: 0 8px 22px rgba(0,0,0,.12);
        }
        .brand-name {
          font-family: TraversalDisplay, TraversalBold, sans-serif;
          font-size: 18px;
        }
        .brand-meta, .doc-sub {
          font-size: 11px;
          color: var(--muted);
        }
        .doc-meta {
          text-align: right;
        }
        .rtl .doc-meta { text-align: left; }
        .doc-title {
          font-family: TraversalBold, sans-serif;
          font-size: 16px;
        }
        .page-body {
          position: absolute;
          top: 110px;
          left: 56px;
          right: 56px;
          bottom: 56px;
        }
        .section-header {
          margin-bottom: 18px;
          padding: 20px 24px;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(15,95,116,.1), rgba(207,109,71,.08));
          border: 1px solid rgba(15,95,116,.16);
        }
        .section-kicker {
          color: var(--accent);
          font-size: 11px;
          letter-spacing: .18em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        h2, h3 {
          margin: 0;
          font-family: TraversalDisplay, TraversalBold, sans-serif;
        }
        h2 { font-size: 28px; }
        h3 { font-size: 16px; margin-bottom: 10px; }
        p, li {
          font-size: 14px;
          line-height: 1.7;
          margin: 0 0 12px;
        }
        .lead {
          font-size: 18px;
          line-height: 1.7;
          font-family: TraversalBold, TraversalBody, sans-serif;
          color: #20313b;
          margin-bottom: 18px;
        }
        .bullet-list {
          margin: 0 0 18px;
          padding-inline-start: 22px;
        }
        .rtl .bullet-list {
          padding-inline-start: 0;
          padding-inline-end: 22px;
        }
        .code-block {
          margin: 0 0 18px;
          padding: 18px 20px;
          border-radius: 18px;
          background: #eef2f5;
          border: 1px solid #d8e2ea;
          font-family: TraversalMono, monospace;
          font-size: 12px;
          line-height: 1.6;
          white-space: pre-wrap;
        }
        .diagram-card, .file-list {
          margin: 0 0 18px;
          padding: 18px 20px;
          border-radius: 24px;
          background: rgba(255,255,255,.82);
          border: 1px solid rgba(15,95,116,.14);
          box-shadow: 0 12px 28px rgba(15,23,38,.06);
        }
        .diagram-meta p { color: var(--muted); margin-bottom: 12px; }
        .diagram-svg { width: 100%; height: auto; display: block; }
        .svg-title, .svg-title-light, .svg-label, .svg-label-light, .svg-chip, .svg-sub {
          font-family: TraversalBold, TraversalBody, sans-serif;
        }
        .svg-title { fill: #fff; font-size: 24px; }
        .svg-title-light { fill: #fff; font-size: 20px; }
        .svg-sub { fill: rgba(255,255,255,.86); font-size: 15px; }
        .svg-label { fill: #17344c; font-size: 18px; }
        .svg-label-light { fill: #fff; font-size: 16px; }
        .svg-chip { fill: #17344c; font-size: 15px; }
        .file-list ul {
          margin: 0;
          padding-inline-start: 18px;
          columns: 1;
        }
        .file-list li {
          font-family: TraversalMono, monospace;
          font-size: 11.5px;
          line-height: 1.45;
          margin-bottom: 4px;
          word-break: break-word;
        }
        .toc-list {
          display: grid;
          gap: 12px;
        }
        .toc-row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 12px;
          align-items: center;
          color: inherit;
          text-decoration: none;
          padding: 10px 14px;
          border-radius: 14px;
          background: rgba(255,255,255,.7);
          border: 1px solid rgba(15,95,116,.10);
        }
        .toc-dots {
          border-bottom: 1px dashed rgba(15,95,116,.3);
          transform: translateY(1px);
        }
        .rtl {
          direction: rtl;
          text-align: right;
          font-family: TraversalBody, "Droid Sans Fallback", "DejaVu Sans", sans-serif;
        }
        .ltr {
          direction: ltr;
          text-align: left;
        }
      </style>
    </head>
    <body>
      ${pages.join("\n")}
    </body>
  </html>`;
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
  return { htmlPath, pdfPath };
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(TMP_DIR, { recursive: true });

  const docFiles = (
    await walk(path.join(ROOT, "docs"), (f) => f.endsWith(".md") || f.endsWith(".mdx"))
  )
    .map(rel)
    .filter((file) => !file.startsWith("docs/zh-CN/"))
    .sort();
  const sourceFiles = (
    await walk(
      path.join(ROOT, "src"),
      (f) => f.endsWith(".ts") || f.endsWith(".tsx") || f.endsWith(".mjs"),
    )
  )
    .map(rel)
    .sort();
  const appDirs = await listDirs(path.join(ROOT, "apps"));
  const moduleSummaryData = moduleSummary(sourceFiles);
  const groupedDocs = groupDocFiles(docFiles);

  const data = {
    docFiles,
    sourceFiles,
    appDirs,
    moduleSummary: moduleSummaryData,
    operatorDocs: docFiles.filter(
      (file) =>
        file.startsWith("docs/install/") ||
        file.startsWith("docs/gateway/") ||
        file.startsWith("docs/cli/") ||
        file.startsWith("docs/channels/") ||
        file.startsWith("docs/help/"),
    ),
    cliDocs: docFiles.filter((file) => file.startsWith("docs/cli/")),
    gatewayDocs: docFiles.filter((file) => file.startsWith("docs/gateway/")),
    groupedDocs,
  };

  const documents = [
    operatorDocument(data, "en"),
    operatorDocument(data, "ar"),
    developerDocument(data, "en"),
    developerDocument(data, "ar"),
    architectureDocument(data, "en"),
    architectureDocument(data, "ar"),
    codeExplanationDocument(data, "en"),
    codeExplanationDocument(data, "ar"),
  ];

  for (const doc of documents) {
    const lang = doc.filename.includes(".ar.") ? "ar" : "en";
    const { pdfPath } = await renderDocument(doc, lang, data);
    console.log(`Wrote ${rel(pdfPath)}`);
  }
}

await main();

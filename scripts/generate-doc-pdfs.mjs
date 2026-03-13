#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_X = 54;
const MARGIN_TOP = 88;
const MARGIN_BOTTOM = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const COLORS = {
  ink: [22, 28, 36],
  muted: [92, 105, 122],
  accent: [16, 143, 183],
  accentSoft: [213, 241, 247],
  surface: [247, 248, 250],
  surfaceAlt: [233, 237, 242],
  codeBg: [239, 243, 248],
  white: [255, 255, 255],
  coverBg: [15, 21, 32],
};

const MODULE_DESCRIPTIONS = {
  acp: "agent control plane protocol and runtime surfaces",
  agents: "agent runtime, tools, models, workspaces, identities, and sandbox policies",
  "auto-reply": "reply orchestration and automation entry points",
  browser: "browser automation and browser-facing routes",
  "canvas-host": "canvas and embedded UI host surfaces",
  channels: "shared channel abstractions and plugins",
  "chat-server": "standalone chat GUI backend bridge",
  cli: "command registration, command context, and CLI UX helpers",
  commands: "user-facing command implementations",
  config: "config schema, validation, migrations, IO, and session path resolution",
  cron: "scheduled and isolated-agent job execution",
  daemon: "background service install and lifecycle logic",
  discord: "Discord provider, monitor, and voice integration",
  docs: "internal docs helpers used by the CLI and site toolchain",
  gateway: "gateway RPC server, protocol, methods, and transports",
  hooks: "hook runtime and bundled hook handlers",
  imessage: "iMessage provider and monitor integration",
  infra: "shared infrastructure, formatting, TLS, and outbound helpers",
  logging: "runtime logging primitives and subsystem loggers",
  markdown: "markdown formatting helpers and parsing support",
  media: "media processing primitives",
  "media-understanding": "vision, audio, and video understanding providers",
  memory: "memory search and persistence primitives",
  "node-host": "node execution host and transport",
  pairing: "pairing and trust bootstrap flows",
  "plugin-sdk": "extension and plugin SDK surface",
  plugins: "plugin runtime and registration",
  process: "subprocess execution and supervisor helpers",
  providers: "LLM provider integrations",
  routing: "session and agent routing logic",
  secrets: "secret storage and resolution helpers",
  security: "security audits, fixes, and policy analysis",
  sessions: "session runtime helpers",
  signal: "Signal provider integration",
  slack: "Slack provider integration",
  telegram: "Telegram provider integration",
  terminal: "TTY formatting, tables, palette, and prompts",
  tts: "text-to-speech runtime",
  tui: "terminal UI components and themes",
  utils: "cross-cutting utility helpers",
  web: "web provider and web auto-reply flows",
  whatsapp: "WhatsApp-oriented helpers and runtime glue",
  wizard: "interactive onboarding and configuration wizard flows",
};

const DOC_GROUP_DESCRIPTIONS = {
  automation: "automation, hooks, cron, webhook, and event-driven workflow docs",
  channels: "channel-specific setup, routing, pairing, and troubleshooting",
  cli: "CLI command reference by feature area",
  concepts: "architecture and conceptual model explanations",
  debug: "debugging and diagnosis notes",
  design: "design notes and integration proposals",
  diagnostics: "diagnostic flags and runtime debug behavior",
  gateway: "gateway operation, API, configuration, health, security, and networking",
  help: "operator FAQs, scripts, environment, and testing help",
  install: "installation guides across environments",
  nodes: "node runtime, media, voice, and device docs",
  platforms: "OS and hosting platform guides",
  plugins: "plugin, extension, and community package docs",
  providers: "provider-specific auth, models, and runtime guidance",
};

async function walkFiles(dir, matcher) {
  const output = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      output.push(...(await walkFiles(fullPath, matcher)));
      continue;
    }
    if (matcher(fullPath)) {
      output.push(fullPath);
    }
  }
  return output;
}

function relativeList(paths) {
  return paths.map((file) => path.relative(ROOT, file).replaceAll(path.sep, "/")).sort();
}

function groupByFirstSegment(paths) {
  const groups = new Map();
  for (const item of paths) {
    const [, first = "root"] = item.split("/");
    const list = groups.get(first) ?? [];
    list.push(item);
    groups.set(first, list);
  }
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function buildTreeSummary(paths, basePrefix) {
  const grouped = new Map();
  for (const item of paths) {
    const relative = item.startsWith(`${basePrefix}/`) ? item.slice(basePrefix.length + 1) : item;
    const [first = "root", second] = relative.split("/");
    const key = second ? `${first}/${second}` : first;
    grouped.set(key, (grouped.get(key) ?? 0) + 1);
  }
  return [...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function nowIso() {
  return new Date().toISOString();
}

function codeFence(lines) {
  return ["```text", ...lines, "```"];
}

function buildCodeExplanationMarkdown(input) {
  const lines = [
    "# TraversalAI Full Codebase Explanation",
    "",
    `Generated: ${nowIso()}`,
    "",
    "## Executive Summary",
    "",
    "TraversalAI is a local-first AI gateway and multi-surface agent runtime. This bundle explains the codebase as a system instead of treating it as a loose collection of commands and integrations.",
    "",
    "The architecture is organized around a few stable layers:",
    "",
    "- configuration and migrations in `src/config`",
    "- runtime agents, tools, sandboxing, and workspaces in `src/agents`",
    "- gateway transport and RPC in `src/gateway`",
    "- command orchestration in `src/commands` and `src/cli`",
    "- app surfaces such as the standalone chat GUI in `apps/standalone-chat` and `src/chat-server`",
    "",
    "## Runtime Design",
    "",
    "### Entry and Boot",
    "",
    "- `traversalai.mjs` sets TraversalAI-branded runtime variables and delegates to `traversalai.mjs`",
    "- `traversalai.mjs` loads the compiled runtime from `dist/entry.js`",
    "- the compiled runtime fans into CLI, gateway, automation, UI, and channel services depending on the chosen command",
    "",
    "### Configuration and State",
    "",
    "- config schema, migrations, validation, and writes are centralized in `src/config`",
    "- workspace paths and session stores derive from state directory resolution",
    "- runtime code consumes normalized config rather than ad hoc env lookups",
    "",
    "### Agent Execution",
    "",
    "- agents have identities, workspaces, tool policies, model settings, skill filters, and sandbox controls",
    "- session keys and agent scope determine where conversations and artifacts live",
    "- tools and model execution are mediated by the gateway/runtime boundary, not by UI-specific code",
    "",
    "### Gateway and UI",
    "",
    "- the gateway is the stable RPC boundary for sessions, chat, tools, skills, agents, and models",
    "- the standalone GUI now routes strictly through the gateway-backed chat server bridge",
    "- history, switching, tools, and skills are all surfaced through gateway methods and streamed events",
    "",
    "## Built-in Agent Provisioning",
    "",
    "TraversalAI now provisions three built-in agents automatically during setup and onboarding when the TraversalAI runtime is active:",
    "",
    "- `main` -> `Master Control Agent`",
    "- `email` -> `Email Agent`",
    "- `social-media` -> `Social Media Agent`",
    "",
    "Provisioning is additive and preserves operator overrides. Missing built-ins are inserted, missing defaults are filled in, and the related workspaces and session directories are created during setup and onboarding.",
    "",
    "## Data Flow",
    "",
    "### Message to Model",
    "",
    "1. inbound message or UI send event enters a command, channel provider, or gateway method",
    "2. routing resolves session key, agent id, and effective runtime policy",
    "3. config and agent-scope helpers resolve model, workspace, tool profile, and skill filter",
    "4. model execution occurs inside the embedded agent runtime",
    "5. tool requests are validated through policy and sandbox layers",
    "6. transcript updates and session state are persisted",
    "7. final text and tool events stream back to the caller",
    "",
    "### Standalone Chat",
    "",
    "1. browser connects to the local chat server over HTTP and WebSocket",
    "2. chat server proxies all RPC and event traffic through the gateway",
    "3. browser state is updated from gateway session history and gateway event streams",
    "4. saved chats, tools, skills, agents, and models stay in sync with gateway state",
    "",
    "## Security and Control Model",
    "",
    "- TraversalAI is personal-by-default, not a hostile multi-tenant boundary by default",
    "- tool access is controlled by explicit config and per-runtime policy",
    "- exec and filesystem actions are mediated by sandbox and safety policy layers",
    "- session visibility and agent routing are explicit, not implicit",
    "",
    "## Source Tree Inventory",
    "",
    "The following sections list the codebase structure so the explanation remains exhaustive and current.",
    "",
    "### Top-Level Source Modules",
    "",
  ];

  for (const [name, count] of input.srcSummary) {
    const top = name.split("/")[0];
    const description = MODULE_DESCRIPTIONS[top] ?? "supporting runtime logic";
    lines.push(`- \`${name}\` (${count} entries): ${description}`);
  }

  lines.push(
    "",
    "### App Surfaces",
    "",
    ...input.appDirs.map((dir) => `- \`${dir}\``),
    "",
    "### Extension Packages",
    "",
    ...input.extensionDirs.map((dir) => `- \`${dir}\``),
    "",
    "### Full Source Directory Appendix",
    "",
    ...codeFence(input.srcDirs),
    "",
    "## Code Explanation Coverage Map",
    "",
    ...codeFence(input.codeFiles),
    "",
    "## Documentation Cross-Reference",
    "",
    "The codebase documentation set that accompanies this explanation is listed below and compiled separately into the documentation bundle PDF.",
    "",
    ...input.docGroups.flatMap(([group, files]) => [
      `### ${group}`,
      "",
      DOC_GROUP_DESCRIPTIONS[group] ?? "documentation group",
      "",
      ...files.map((file) => `- \`${file}\``),
      "",
    ]),
  );

  return `${lines.join("\n")}\n`;
}

function buildFullDocumentationMarkdown(input) {
  const lines = [
    "# TraversalAI Full Documentation Bundle",
    "",
    `Generated: ${nowIso()}`,
    "",
    "## Reader Guide",
    "",
    "This bundle compiles the documentation surface of the repository into a single reference-oriented document. It is not a verbatim copy of every page; it is a structured master guide plus an exhaustive catalog of the shipped docs.",
    "",
    "## Product and Installation",
    "",
    "- product-facing brand: TraversalAI",
    "- compatibility wrapper and many internals still use TraversalAI naming",
    "- primary install path: `npm install -g traversalai@latest`",
    "- source workflow: `corepack pnpm install`, `corepack pnpm build`, `node traversalai.mjs onboard`",
    "",
    "## Built-in Agents",
    "",
    "TraversalAI now provisions the following built-ins during setup and onboarding:",
    "",
    "1. Master Control Agent",
    "2. Email Agent",
    "3. Social Media Agent",
    "",
    "They are created through config-backed provisioning, not through UI-only defaults, so they appear consistently in the gateway and runtime surfaces.",
    "",
    "## Key Operator Commands",
    "",
    ...codeFence([
      "traversalai onboard",
      "traversalai chat --no-open",
      "traversalai gateway --force",
      "traversalai agents list",
      "traversalai health",
      "traversalai security audit --deep",
      "node scripts/generate-doc-pdfs.mjs",
    ]),
    "",
    "## Documentation Map",
    "",
  ];

  for (const [group, files] of input.docGroups) {
    lines.push(`### ${group}`, "");
    lines.push(DOC_GROUP_DESCRIPTIONS[group] ?? "documentation group", "");
    for (const file of files) {
      lines.push(`- \`${file}\``);
    }
    lines.push("");
  }

  lines.push(
    "## CLI Documentation Coverage",
    "",
    ...input.cliDocs.map((file) => `- \`${file}\``),
    "",
    "## Gateway Documentation Coverage",
    "",
    ...input.gatewayDocs.map((file) => `- \`${file}\``),
    "",
    "## Concepts Documentation Coverage",
    "",
    ...input.conceptDocs.map((file) => `- \`${file}\``),
    "",
    "## Channel Documentation Coverage",
    "",
    ...input.channelDocs.map((file) => `- \`${file}\``),
    "",
    "## Provider Documentation Coverage",
    "",
    ...input.providerDocs.map((file) => `- \`${file}\``),
    "",
    "## Full Documentation Appendix",
    "",
    ...codeFence(input.docFiles),
    "",
    "## Source Cross-Reference",
    "",
    "Use the code explanation bundle for runtime architecture and source-layer rationale. This documentation bundle focuses on operator setup, configuration, and discoverability.",
  );

  return `${lines.join("\n")}\n`;
}

function pdfColor([r, g, b]) {
  return `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)}`;
}

function escapePdfText(value) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function lineWidthBudget(size, weight = "body") {
  const ratio = weight === "mono" ? 0.6 : weight === "bold" ? 0.57 : 0.53;
  return Math.max(20, Math.floor(CONTENT_WIDTH / (size * ratio)));
}

function wrapText(text, size, weight) {
  const limit = lineWidthBudget(size, weight);
  const words = text.split(/\s+/);
  const out = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= limit) {
      current = candidate;
      continue;
    }
    if (current) {
      out.push(current);
    }
    current = word;
  }
  if (current) {
    out.push(current);
  }
  return out.length > 0 ? out : [text];
}

function parseMarkdown(text) {
  const blocks = [];
  const lines = text.replaceAll("\r\n", "\n").split("\n");
  let inCode = false;
  let codeLines = [];

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) {
        blocks.push({ type: "code", lines: codeLines });
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      blocks.push({ type: "space" });
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      continue;
    }

    const bulletMatch = line.match(/^(\d+\.\s+|- )(.+)$/);
    if (bulletMatch) {
      blocks.push({ type: "bullet", marker: bulletMatch[1].trim(), text: bulletMatch[2] });
      continue;
    }

    blocks.push({ type: "paragraph", text: line });
  }

  return blocks;
}

function createPageBase(title, pageNumber) {
  const ops = [];
  ops.push(`${pdfColor(COLORS.surface)} rg 0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT} re f`);
  ops.push(`${pdfColor(COLORS.accentSoft)} rg 0 ${PAGE_HEIGHT - 28} ${PAGE_WIDTH} 28 re f`);
  ops.push(`${pdfColor(COLORS.accent)} rg 0 ${PAGE_HEIGHT - 28} 180 28 re f`);
  ops.push(
    `BT /F2 10 Tf ${pdfColor(COLORS.white)} rg ${MARGIN_X} ${PAGE_HEIGHT - 18} Td (${escapePdfText(title)}) Tj ET`,
  );
  ops.push(
    `BT /F1 9 Tf ${pdfColor(COLORS.muted)} rg ${PAGE_WIDTH - 110} 26 Td (Page ${pageNumber}) Tj ET`,
  );
  ops.push(`${pdfColor(COLORS.surfaceAlt)} rg ${MARGIN_X} 42 ${CONTENT_WIDTH} 1 re f`);
  return ops;
}

function createCoverPage(title, subtitle) {
  const ops = [];
  ops.push(`${pdfColor(COLORS.coverBg)} rg 0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT} re f`);
  ops.push(`${pdfColor(COLORS.accent)} rg 54 650 220 8 re f`);
  ops.push(
    `BT /F1 11 Tf ${pdfColor(COLORS.accentSoft)} rg 54 685 Td (TraversalAI Documentation Artifact) Tj ET`,
  );
  ops.push(`BT /F2 28 Tf ${pdfColor(COLORS.white)} rg 54 612 Td (${escapePdfText(title)}) Tj ET`);
  for (const [index, line] of wrapText(subtitle, 13, "body").entries()) {
    ops.push(
      `BT /F1 13 Tf ${pdfColor(COLORS.accentSoft)} rg 54 ${570 - index * 18} Td (${escapePdfText(line)}) Tj ET`,
    );
  }
  ops.push(`${pdfColor(COLORS.accentSoft)} rg 54 120 504 1 re f`);
  ops.push(
    `BT /F1 10 Tf ${pdfColor(COLORS.accentSoft)} rg 54 96 Td (Generated ${escapePdfText(nowIso())}) Tj ET`,
  );
  return ops;
}

function renderBlocksToPages(title, markdown) {
  const blocks = parseMarkdown(markdown);
  const pages = [
    {
      ops: createCoverPage(
        title,
        "Generated from the live repository structure and documentation inventory.",
      ),
      pageNumber: 1,
    },
  ];
  let current = { ops: createPageBase(title, 2), y: PAGE_HEIGHT - MARGIN_TOP, pageNumber: 2 };

  const ensurePage = (neededHeight) => {
    if (current.y - neededHeight >= MARGIN_BOTTOM) {
      return;
    }
    pages.push({ ops: current.ops, pageNumber: current.pageNumber });
    current = {
      ops: createPageBase(title, current.pageNumber + 1),
      y: PAGE_HEIGHT - MARGIN_TOP,
      pageNumber: current.pageNumber + 1,
    };
  };

  const drawLine = (text, options) => {
    const font = options.font === "bold" ? "F2" : options.font === "mono" ? "F3" : "F1";
    current.ops.push(
      `BT /${font} ${options.size} Tf ${pdfColor(options.color)} rg ${options.x} ${current.y} Td (${escapePdfText(text)}) Tj ET`,
    );
    current.y -= options.leading;
  };

  for (const block of blocks) {
    if (block.type === "space") {
      current.y -= 6;
      continue;
    }

    if (block.type === "heading") {
      const style =
        block.level === 1
          ? { size: 20, leading: 26 }
          : block.level === 2
            ? { size: 15, leading: 22 }
            : { size: 12, leading: 18 };
      ensurePage(style.leading + 10);
      drawLine(block.text, {
        x: MARGIN_X,
        size: style.size,
        leading: style.leading,
        color: block.level === 1 ? COLORS.accent : COLORS.ink,
        font: "bold",
      });
      current.y -= 2;
      continue;
    }

    if (block.type === "code") {
      const rendered = block.lines.flatMap((line) => wrapText(line || " ", 9, "mono"));
      const height = rendered.length * 13 + 18;
      ensurePage(height);
      current.ops.push(
        `${pdfColor(COLORS.codeBg)} rg ${MARGIN_X - 8} ${current.y - height + 10} ${CONTENT_WIDTH + 16} ${height} re f`,
      );
      current.y -= 6;
      for (const line of rendered) {
        drawLine(line, {
          x: MARGIN_X,
          size: 9,
          leading: 13,
          color: COLORS.ink,
          font: "mono",
        });
      }
      current.y -= 4;
      continue;
    }

    if (block.type === "bullet") {
      const bulletText = `${block.marker} ${block.text}`;
      const lines = wrapText(bulletText, 10.5, "body");
      ensurePage(lines.length * 15 + 4);
      for (const line of lines) {
        drawLine(line, {
          x: MARGIN_X + 8,
          size: 10.5,
          leading: 15,
          color: COLORS.ink,
          font: "body",
        });
      }
      current.y -= 1;
      continue;
    }

    if (block.type === "paragraph") {
      const lines = wrapText(block.text, 10.5, "body");
      ensurePage(lines.length * 15 + 3);
      for (const line of lines) {
        drawLine(line, {
          x: MARGIN_X,
          size: 10.5,
          leading: 15,
          color: COLORS.ink,
          font: "body",
        });
      }
      current.y -= 1;
    }
  }

  pages.push({ ops: current.ops, pageNumber: current.pageNumber });
  return pages;
}

function buildPdf(title, pages) {
  const objects = [];
  const pushObject = (body) => {
    objects.push(body);
    return objects.length;
  };

  const fontBody = pushObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const fontBold = pushObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const fontMono = pushObject("<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>");

  const contentIds = pages.map((page) =>
    pushObject(
      `<< /Length ${Buffer.byteLength(page.ops.join("\n"), "utf8")} >>\nstream\n${page.ops.join("\n")}\nendstream`,
    ),
  );

  const pagesId = pushObject("<< /Type /Pages /Kids [] /Count 0 >>");
  const pageIds = pages.map((_, index) =>
    pushObject(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontBody} 0 R /F2 ${fontBold} 0 R /F3 ${fontMono} 0 R >> >> /Contents ${contentIds[index]} 0 R >>`,
    ),
  );

  objects[pagesId - 1] =
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  const catalogId = pushObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
  const infoId = pushObject(
    `<< /Title (${escapePdfText(title)}) /Producer (TraversalAI PDF Builder) >>`,
  );

  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R /Info ${infoId} 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, "utf8");
}

async function main() {
  const docFiles = relativeList(
    await walkFiles(
      path.join(ROOT, "docs"),
      (file) => file.endsWith(".md") || file.endsWith(".mdx"),
    ),
  );
  const srcDirectoryInventory = [];
  async function collectDirs(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      srcDirectoryInventory.push(path.relative(ROOT, fullPath).replaceAll(path.sep, "/"));
      await collectDirs(fullPath);
    }
  }
  await collectDirs(path.join(ROOT, "src"));

  const codeFiles = relativeList(
    await walkFiles(
      path.join(ROOT, "src"),
      (file) => file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".mjs"),
    ),
  );
  const appDirs = [];
  async function collectAppDirs(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      appDirs.push(path.relative(ROOT, fullPath).replaceAll(path.sep, "/"));
      await collectAppDirs(fullPath);
    }
  }
  await collectAppDirs(path.join(ROOT, "apps"));

  const extensionDirs = [];
  try {
    const entries = await fs.readdir(path.join(ROOT, "extensions"), { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        extensionDirs.push(`extensions/${entry.name}`);
      }
    }
  } catch {
    // ignore if extensions are absent
  }

  const docGroups = groupByFirstSegment(docFiles);
  const explanationMarkdown = buildCodeExplanationMarkdown({
    srcSummary: buildTreeSummary(codeFiles, "src"),
    srcDirs: srcDirectoryInventory.sort(),
    codeFiles,
    appDirs: appDirs.sort(),
    extensionDirs: extensionDirs.sort(),
    docGroups,
  });
  const documentationMarkdown = buildFullDocumentationMarkdown({
    docFiles,
    docGroups,
    cliDocs: docFiles.filter((file) => file.startsWith("docs/cli/")),
    gatewayDocs: docFiles.filter((file) => file.startsWith("docs/gateway/")),
    conceptDocs: docFiles.filter((file) => file.startsWith("docs/concepts/")),
    channelDocs: docFiles.filter((file) => file.startsWith("docs/channels/")),
    providerDocs: docFiles.filter((file) => file.startsWith("docs/providers/")),
  });

  const codeExplanationPath = path.join(ROOT, "code-explanation", "README.md");
  const docsOverviewPath = path.join(ROOT, "docs", "reference", "codebase-overview.md");
  const docsBundlePath = path.join(ROOT, "docs", "FULL_DOCUMENTATION.md");

  await fs.mkdir(path.dirname(codeExplanationPath), { recursive: true });
  await fs.mkdir(path.dirname(docsOverviewPath), { recursive: true });

  await fs.writeFile(codeExplanationPath, explanationMarkdown);
  await fs.writeFile(docsOverviewPath, documentationMarkdown);
  await fs.writeFile(docsBundlePath, documentationMarkdown);

  const codePdf = buildPdf(
    "TraversalAI Full Codebase Explanation",
    renderBlocksToPages("Code Explanation", explanationMarkdown),
  );
  const docsPdf = buildPdf(
    "TraversalAI Full Documentation Bundle",
    renderBlocksToPages("Documentation", documentationMarkdown),
  );

  await fs.writeFile(path.join(ROOT, "code-explanation", "codebase-explanation.pdf"), codePdf);
  await fs.writeFile(path.join(ROOT, "docs", "full-documentation.pdf"), docsPdf);
  await fs.writeFile(path.join(ROOT, "docs", "reference", "codebase-overview.pdf"), docsPdf);

  console.log("Wrote code-explanation/README.md");
  console.log("Wrote code-explanation/codebase-explanation.pdf");
  console.log("Wrote docs/FULL_DOCUMENTATION.md");
  console.log("Wrote docs/full-documentation.pdf");
  console.log("Wrote docs/reference/codebase-overview.md");
  console.log("Wrote docs/reference/codebase-overview.pdf");
}

await main();

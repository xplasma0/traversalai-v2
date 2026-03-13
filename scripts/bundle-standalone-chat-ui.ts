import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const sourceDir = path.join(repoRoot, "apps", "standalone-chat", "dist");
const targetDir = path.join(repoRoot, "dist", "standalone-chat-ui");

function removeDir(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(source: string, target: string) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDir(sourcePath, targetPath);
      continue;
    }
    fs.copyFileSync(sourcePath, targetPath);
  }
}

if (!fs.existsSync(path.join(sourceDir, "index.html"))) {
  throw new Error(
    "standalone chat UI build missing at apps/standalone-chat/dist. Run the frontend build first.",
  );
}

removeDir(targetDir);
copyDir(sourceDir, targetDir);

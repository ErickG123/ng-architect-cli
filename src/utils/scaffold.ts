import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CliAnswers } from "../types/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITIGNORE_CONTENT = `# Compiled output
/dist
/tmp
/out-tsc
/bazel-out

# Node
/node_modules
npm-debug.log
yarn-error.log

# Angular cache
.angular/

# IDEs and editors
.idea/
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.history/*

# Environment files
.env
.env.*
!.env.example

# Miscellaneous
/.sass-cache
/connect.lock
/coverage
/libpeerconnection.log
testem.log
/typings
`;

function buildNpmrc(
  packageManager: CliAnswers["packageManager"],
): string | null {
  if (packageManager === "pnpm") {
    return (
      ["auto-install-peers=true", "strict-peer-dependencies=false"].join("\n") +
      "\n"
    );
  }
  if (packageManager === "npm") {
    return `legacy-peer-deps=true\n`;
  }
  return null;
}

export function scaffoldProject(answers: CliAnswers, targetDir: string): void {
  const templateDir = path.resolve(__dirname, "../template");

  fs.copySync(templateDir, targetDir);

  fs.writeFileSync(path.join(targetDir, ".gitignore"), GITIGNORE_CONTENT);

  const npmrcContent = buildNpmrc(answers.packageManager);
  if (npmrcContent) {
    fs.writeFileSync(path.join(targetDir, ".npmrc"), npmrcContent);
  }

  if (answers.packageManager === "pnpm") {
    const pnpmWorkspaceContent = `packages:
  - "."
allowBuilds:
  '@parcel/watcher': true
  esbuild: true
  lmdb: true
  msgpackr-extract: true
`;
    fs.writeFileSync(
      path.join(targetDir, "pnpm-workspace.yaml"),
      pnpmWorkspaceContent,
    );
  }

  const pkgPath = path.join(targetDir, "package.json");

  if (fs.existsSync(pkgPath)) {
    const pkg = fs.readJsonSync(pkgPath);

    pkg.name = answers.projectName;

    pkg.dependencies = pkg.dependencies || {};
    pkg.devDependencies = pkg.devDependencies || {};

    if (answers.zoneless) {
      delete pkg.dependencies["zone.js"];
    }

    if (answers.uiLibrary === "tailwind" || answers.uiLibrary === "primeng") {
      pkg.devDependencies["tailwindcss"] = "^3.4.0";
      pkg.devDependencies["postcss"] = "^8.4.0";
      pkg.devDependencies["autoprefixer"] = "^10.4.0";
    }
    if (answers.uiLibrary === "primeng") {
      pkg.dependencies["primeng"] = "latest";
      pkg.dependencies["primeicons"] = "latest";
    } else if (answers.uiLibrary === "material") {
      pkg.dependencies["@angular/material"] = "latest";
    }

    if (answers.stateManagement === "ngrx-signals") {
      pkg.dependencies["@ngrx/signals"] = "latest";
    }

    fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });

    if (answers.stateManagement === "none") {
      const storeFolderPath = path.join(
        targetDir,
        "src/app/features/demo-feature/store",
      );
      fs.removeSync(storeFolderPath);
    }
  }
}

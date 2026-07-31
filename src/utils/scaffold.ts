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

    if (answers.linting) {
      pkg.scripts = pkg.scripts || {};
      pkg.scripts["lint"] = "eslint \"src/**/*.{ts,html}\"";
      pkg.scripts["format"] = "prettier --write \"src/**/*.{ts,html,scss}\"";
      pkg.scripts["prepare"] = "husky";

      pkg.devDependencies["prettier"] = "latest";
      pkg.devDependencies["eslint"] = "latest";
      pkg.devDependencies["eslint-config-prettier"] = "latest";
      pkg.devDependencies["eslint-plugin-prettier"] = "latest";
      pkg.devDependencies["@angular-eslint/builder"] = "latest";
      pkg.devDependencies["@angular-eslint/eslint-plugin"] = "latest";
      pkg.devDependencies["@angular-eslint/eslint-plugin-template"] = "latest";
      pkg.devDependencies["@angular-eslint/schematics"] = "latest";
      pkg.devDependencies["@angular-eslint/template-parser"] = "latest";
      pkg.devDependencies["typescript-eslint"] = "latest";
      pkg.devDependencies["husky"] = "latest";
      pkg.devDependencies["lint-staged"] = "latest";
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

  const appConfigPath = path.join(targetDir, "src/app/app.config.ts");
  if (fs.existsSync(appConfigPath)) {
    let appConfigStr = fs.readFileSync(appConfigPath, "utf-8");

    if (answers.zoneless) {
      appConfigStr = appConfigStr.replace(
        "/* ZONE_CHANGE_DETECTION */",
        "import { provideExperimentalZonelessChangeDetection } from '@angular/core';"
      );
      appConfigStr = appConfigStr.replace(
        "/* ZONE_CHANGE_DETECTION_PROVIDER */",
        "provideExperimentalZonelessChangeDetection(),"
      );
    } else {
      appConfigStr = appConfigStr.replace(
        "/* ZONE_CHANGE_DETECTION */",
        ""
      );
      appConfigStr = appConfigStr.replace(
        "/* ZONE_CHANGE_DETECTION_PROVIDER */",
        "provideZoneChangeDetection({ eventCoalescing: true }),"
      );
    }

    if (answers.stateManagement === "ngrx-signals") {
      appConfigStr = appConfigStr.replace(
        "/* NGRX_IMPORTS */",
        "// SignalStore base setup",
      );
      appConfigStr = appConfigStr.replace("/* NGRX_PROVIDERS */", "");
    } else {
      appConfigStr = appConfigStr.replace("/* NGRX_IMPORTS */", "");
      appConfigStr = appConfigStr.replace("/* NGRX_PROVIDERS */", "");
    }

    if (answers.uiLibrary === "primeng") {
      const primeNgImports =
        "import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';\n" +
        "import { providePrimeNG } from 'primeng/config';\n" +
        "import Aura from '@primeng/themes/aura';";
      const primeNgProviders =
        "provideAnimationsAsync(),\n    providePrimeNG({ \n      theme: { \n        preset: Aura \n      } \n    }),";

      appConfigStr = appConfigStr.replace("/* UI_IMPORTS */", primeNgImports);
      appConfigStr = appConfigStr.replace("/* UI_PROVIDERS */", primeNgProviders);
    } else {
      appConfigStr = appConfigStr.replace("/* UI_IMPORTS */", "");
      appConfigStr = appConfigStr.replace("/* UI_PROVIDERS */", "");
    }

    // Injeta o HttpClient e o Interceptor Base
    appConfigStr =
      `import { provideHttpClient, withInterceptors } from '@angular/common/http';\n` +
      `import { baseInterceptor } from './core/interceptors/base.interceptor';\n` +
      appConfigStr;

    appConfigStr = appConfigStr.replace(
      "providers: [",
      "providers: [\n    provideHttpClient(withInterceptors([baseInterceptor])),"
    );

    fs.writeFileSync(appConfigPath, appConfigStr, "utf-8");
  }

  if (answers.uiLibrary === "tailwind" || answers.uiLibrary === "primeng") {
    const tailwindConfigPath = path.join(targetDir, "tailwind.config.js");
    const tailwindConfigContent = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
    fs.writeFileSync(tailwindConfigPath, tailwindConfigContent, "utf-8");

    const stylesPath = path.join(targetDir, "src/styles.scss");
    if (fs.existsSync(stylesPath)) {
      const currentStyles = fs.readFileSync(stylesPath, "utf-8");
      const tailwindDirectives = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n`;
      fs.writeFileSync(stylesPath, tailwindDirectives + currentStyles, "utf-8");
    }
  }

  if (answers.docker) {
    const dockerignorePath = path.join(targetDir, ".dockerignore");
    const dockerignoreContent = `node_modules
dist
.git
.gitignore
*.md
`;
    fs.writeFileSync(dockerignorePath, dockerignoreContent, "utf-8");

    const dockerfilePath = path.join(targetDir, "Dockerfile");
    const dockerfileContent = `# Estágio 1: Build da aplicação
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build --configuration=production

# Estágio 2: Servidor Nginx
FROM nginx:alpine

# Copia os arquivos compilados do estágio anterior para a pasta do Nginx (ajuste o caminho 'browser' conforme a estrutura do Angular 17+)
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

    # Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
`;
    fs.writeFileSync(dockerfilePath, dockerfileContent, "utf-8");
  }

  // Gera o .nvmrc para padronizar a versão do Node.js
  const nvmrcPath = path.join(targetDir, ".nvmrc");
  fs.writeFileSync(nvmrcPath, "v20\n", "utf-8");

  if (answers.linting) {
    const prettierrcPath = path.join(targetDir, ".prettierrc");
    const prettierrcContent = `{
  "printWidth": 100,
  "singleQuote": true,
  "useTabs": false,
  "tabWidth": 2,
  "semi": true,
  "bracketSpacing": true,
  "trailingComma": "es5"
}
`;
    fs.writeFileSync(prettierrcPath, prettierrcContent, "utf-8");

    const prettierignorePath = path.join(targetDir, ".prettierignore");
    const prettierignoreContent = `dist
coverage
node_modules
.angular
*.html
`;
    fs.writeFileSync(prettierignorePath, prettierignoreContent, "utf-8");

    const lintstagedrcPath = path.join(targetDir, ".lintstagedrc");
    const lintstagedrcContent = `{
  "src/**/*.{ts,html}": [
    "eslint --fix",
    "prettier --write"
  ],
  "src/**/*.scss": [
    "prettier --write"
  ]
}
`;
    fs.writeFileSync(lintstagedrcPath, lintstagedrcContent, "utf-8");

    const huskyDirPath = path.join(targetDir, ".husky");
    fs.ensureDirSync(huskyDirPath);
    
    const preCommitPath = path.join(huskyDirPath, "pre-commit");
    // O hook de pre-commit deve ter permissão de execução
    const preCommitContent = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
`;
    fs.writeFileSync(preCommitPath, preCommitContent, { encoding: "utf-8", mode: 0o755 });
  }

  if (answers.ci) {
    const workflowsDirPath = path.join(targetDir, ".github/workflows");
    fs.ensureDirSync(workflowsDirPath);

    const ciWorkflowPath = path.join(workflowsDirPath, "ci.yml");
    const ciWorkflowContent = `name: CI Pipeline

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - name: Instalar Dependências
        run: npm ci
      - name: Validar Formatação (Lint)
        run: npm run lint
      - name: Build de Produção
        run: npm run build --configuration=production
`;
    fs.writeFileSync(ciWorkflowPath, ciWorkflowContent, "utf-8");
  }

  // Restauração da arquitetura de environments corporativa
  const envDirPath = path.join(targetDir, "src/environments");
  fs.ensureDirSync(envDirPath);

  const envProdPath = path.join(envDirPath, "environment.ts");
  const envProdContent = `export const environment = {\n  production: true\n};\n`;
  fs.writeFileSync(envProdPath, envProdContent, "utf-8");

  const envDevPath = path.join(envDirPath, "environment.development.ts");
  const envDevContent = `export const environment = {\n  production: false\n};\n`;
  fs.writeFileSync(envDevPath, envDevContent, "utf-8");

  const angularJsonPath = path.join(targetDir, "angular.json");
  if (fs.existsSync(angularJsonPath)) {
    const angularJson = fs.readJsonSync(angularJsonPath);
    // Recupera a chave do primeiro projeto do workspace
    const projectName = Object.keys(angularJson.projects)[0];
    const project = angularJson.projects[projectName];

    if (
      project &&
      project.architect &&
      project.architect.build &&
      project.architect.build.configurations
    ) {
      // Injeta no build de desenvolvimento
      if (project.architect.build.configurations.development) {
        project.architect.build.configurations.development.fileReplacements = [
          {
            replace: "src/environments/environment.ts",
            with: "src/environments/environment.development.ts",
          },
        ];
      } else {
        // Se a config de development não existir, fallback para a produção
        if (!project.architect.build.configurations.production.fileReplacements) {
            project.architect.build.configurations.production.fileReplacements = [];
        }
        project.architect.build.configurations.production.fileReplacements.push({
          replace: "src/environments/environment.development.ts",
          with: "src/environments/environment.ts",
        });
      }

      fs.writeJsonSync(angularJsonPath, angularJson, { spaces: 2 });
    }
  }

  // Configuração de Path Aliases (Melhoria de DX)
  const tsconfigPath = path.join(targetDir, "tsconfig.json");
  if (fs.existsSync(tsconfigPath)) {
    // Angular 17/18 tsconfig pode ter comentários JSONC (o fs-extra readJsonSync pode falhar se não removermos ou usarmos um parser de jsonc). 
    // Como a maioria dos geradores mantêm limpo, vamos usar readJsonSync. Se houver falhas, pode ser necessário um regex.
    try {
      const tsconfig = fs.readJsonSync(tsconfigPath);
      
      tsconfig.compilerOptions = tsconfig.compilerOptions || {};
      tsconfig.compilerOptions.baseUrl = "./";
      tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};
      
      Object.assign(tsconfig.compilerOptions.paths, {
        "@app/*": ["src/app/*"],
        "@core/*": ["src/app/core/*"],
        "@shared/*": ["src/app/shared/*"],
        "@environments/*": ["src/environments/*"]
      });

      fs.writeJsonSync(tsconfigPath, tsconfig, { spaces: 2 });
    } catch (e) {
      console.warn("Aviso: Não foi possível realizar o parse do tsconfig.json (possivelmente devido a comentários no arquivo).");
    }
  }

  // Criação do Interceptor Base
  const interceptorsDirPath = path.join(targetDir, "src/app/core/interceptors");
  fs.ensureDirSync(interceptorsDirPath);

  const baseInterceptorPath = path.join(interceptorsDirPath, "base.interceptor.ts");
  const baseInterceptorContent = `import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const baseInterceptor: HttpInterceptorFn = (req, next) => {
  // Exemplo de injeção de token:
  // const cloneReq = req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } });
  
  return next(req).pipe(
    catchError((error) => {
      console.error('Erro interceptado na requisição:', error);
      return throwError(() => error);
    })
  );
};
`;
  fs.writeFileSync(baseInterceptorPath, baseInterceptorContent, "utf-8");

  // Geração do README.md Profissional
  const readmePath = path.join(targetDir, "README.md");
  const readmeContent = `# ${answers.projectName}

Este projeto foi gerado com uma arquitetura corporativa padronizada, focado em alta performance e escalabilidade.

## 🚀 Tecnologias Base
- **Angular:** (Modo Zoneless)
- **Estilização:** Tailwind CSS + PrimeNG
- **Estado:** NgRx SignalStore
- **Qualidade de Código:** ESLint, Prettier e Husky configurados.

## 🛠️ Como Iniciar

### Pré-requisitos
Certifique-se de estar utilizando a versão correta do Node.js (conforme definido no arquivo \`.nvmrc\`):
\`\`\`bash
nvm use
\`\`\`

### Rodando o projeto
1. Instale as dependências: \`npm install\`
2. Inicie o servidor de desenvolvimento: \`npm start\`
3. Acesse em \`http://localhost:4200\`

## 🐳 Docker
O projeto conta com um \`Dockerfile\` multi-stage otimizado. Para gerar a imagem e rodar via container:
\`\`\`bash
docker build -t ${answers.projectName} .
docker run -p 8080:80 ${answers.projectName}
\`\`\`
`;
  fs.writeFileSync(readmePath, readmeContent, "utf-8");

  // Criação do Guardião de Rotas (Auth Guard)
  const guardsDirPath = path.join(targetDir, "src/app/core/guards");
  fs.ensureDirSync(guardsDirPath);

  const authGuardPath = path.join(guardsDirPath, "auth.guard.ts");
  const authGuardContent = `import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // TODO: Substituir por injeção do seu serviço de autenticação real
  const isAuthenticated = false; 

  if (!isAuthenticated) {
    console.warn('Acesso negado. Redirecionando para login...');
    // router.navigate(['/login']);
    return false;
  }

  return true;
};
`;
  fs.writeFileSync(authGuardPath, authGuardContent, "utf-8");

  // Criação do Serviço de Dark Mode (Tailwind + PrimeNG)
  if (answers.uiLibrary === "primeng") {
    const servicesDirPath = path.join(targetDir, "src/app/core/services");
    fs.mkdirSync(servicesDirPath, { recursive: true });

    const themeServicePath = path.join(servicesDirPath, "theme.service.ts");
    const themeServiceContent = `import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);

  toggleTheme() {
    this.isDarkMode.update((dark) => !dark);
    const htmlElement = document.querySelector('html');
    
    if (this.isDarkMode()) {
      htmlElement?.classList.add('p-dark', 'dark'); // Suporte ao PrimeNG e Tailwind
    } else {
      htmlElement?.classList.remove('p-dark', 'dark');
    }
  }
}
`;
    fs.writeFileSync(themeServicePath, themeServiceContent, "utf-8");

    const appComponentPath = path.join(targetDir, "src/app/app.component.ts");
    if (fs.existsSync(appComponentPath)) {
      let appComponentStr = fs.readFileSync(appComponentPath, "utf-8");
      
      appComponentStr = `import { inject } from '@angular/core';\nimport { ThemeService } from './core/services/theme.service';\n` + appComponentStr;
      
      appComponentStr = appComponentStr.replace(
        "export class AppComponent {",
        "export class AppComponent {\n  themeService = inject(ThemeService);"
      );
      
      fs.writeFileSync(appComponentPath, appComponentStr, "utf-8");
    }

    const appComponentHtmlPath = path.join(targetDir, "src/app/app.component.html");
    const appComponentHtmlContent = `<div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center transition-colors duration-300">
  <h1 class="text-3xl font-bold mb-4">Bem-vindo à sua nova arquitetura corporativa!</h1>
  <button 
    (click)="themeService.toggleTheme()" 
    class="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition">
    Alternar Dark Mode
  </button>
</div>
`;
    fs.writeFileSync(appComponentHtmlPath, appComponentHtmlContent, "utf-8");
  }
}

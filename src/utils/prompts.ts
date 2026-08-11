import * as p from "@clack/prompts";
import type { CliAnswers } from "../types/index.js";

export async function askUserPrompts(): Promise<CliAnswers> {
  const projectName = await p.text({
    message: "Qual é o nome do seu projeto?",
    placeholder: "meu-app-angular",
    validate: (value) => {
      if (!value) return "Por favor, insira um nome válido.";
      if (value.includes(" ")) return "O nome não pode conter espaços.";
    },
  });

  if (p.isCancel(projectName)) {
    p.cancel("Operação cancelada pelo usuário.");
    process.exit(0);
  }

  const packageManager = await p.select<
    Array<{ value: CliAnswers["packageManager"]; label: string }>,
    CliAnswers["packageManager"]
  >({
    message: "Qual gerenciador de pacotes você deseja usar?",
    options: [
      { value: "npm", label: "NPM" },
      { value: "pnpm", label: "PNPM (Recomendado pela rapidez)" },
      { value: "yarn", label: "Yarn" },
    ],
  });

  if (p.isCancel(packageManager)) {
    p.cancel("Operação cancelada pelo usuário.");
    process.exit(0);
  }

  const zoneless = await p.confirm({
    message:
      "Deseja habilitar o modo Zoneless? (Recomendado para máxima performance)",
    initialValue: true,
  });

  if (p.isCancel(zoneless)) {
    p.cancel("Operação cancelada pelo usuário.");
    process.exit(0);
  }

  const uiLibrary = await p.select<
    Array<{ value: CliAnswers["uiLibrary"]; label: string }>,
    CliAnswers["uiLibrary"]
  >({
    message: "Qual biblioteca de UI / Estilização você deseja configurar?",
    options: [
      { value: "tailwind", label: "Tailwind CSS puro" },
      { value: "primeng", label: "PrimeNG + Tailwind" },
      { value: "material", label: "Angular Material" },
      { value: "none", label: "Nenhuma (CSS/SCSS padrão)" },
    ],
  });

  if (p.isCancel(uiLibrary)) {
    p.cancel("Operação cancelada pelo usuário.");
    process.exit(0);
  }

  const stateManagement = await p.select<
    Array<{ value: CliAnswers["stateManagement"]; label: string }>,
    CliAnswers["stateManagement"]
  >({
    message: "Deseja configurar o NgRx SignalStore para gerenciamento de estado?",
    options: [
      {
        value: "ngrx-signals",
        label: "Sim (Combo perfeito com Zoneless)",
      },
      { value: "none", label: "Não (Usarei apenas services nativos)" },
    ],
  });

  if (p.isCancel(stateManagement)) {
    p.cancel("Operação cancelada pelo usuário.");
    process.exit(0);
  }

  const initialTemplate = await p.select<
    Array<{ value: CliAnswers["initialTemplate"]; label: string }>,
    CliAnswers["initialTemplate"]
  >({
    message: "Deseja gerar um Template Inicial?",
    options: [
      { value: "blank", label: "Projeto em Branco" },
      { value: "dashboard", label: "Dashboard Dinâmico (Requer PrimeNG + Tailwind)" },
    ],
  });

  if (p.isCancel(initialTemplate)) {
    p.cancel("Operação cancelada pelo usuário.");
    process.exit(0);
  }

  const docker = await p.confirm({
    message: "Deseja gerar um Dockerfile multi-stage para a aplicação? (Ideal para deploy)",
    initialValue: true,
  });

  if (p.isCancel(docker)) {
    p.cancel("Operação cancelada pelo usuário.");
    process.exit(0);
  }

  const linting = await p.confirm({
    message: "Deseja configurar o ESLint e o Prettier para padronização de código?",
    initialValue: true,
  });

  if (p.isCancel(linting)) {
    p.cancel("Operação cancelada pelo usuário.");
    process.exit(0);
  }

  const ci = await p.confirm({
    message: "Deseja gerar um workflow de CI básico (GitHub Actions) para validação de PRs?",
    initialValue: true,
  });

  if (p.isCancel(ci)) {
    p.cancel("Operação cancelada pelo usuário.");
    process.exit(0);
  }

  const modernTests = await p.confirm({
    message: "Deseja configurar uma infraestrutura de Testes Modernos (Vitest + Playwright)?",
    initialValue: true,
  });

  if (p.isCancel(modernTests)) {
    p.cancel("Operação cancelada pelo usuário.");
    process.exit(0);
  }

  const storybook = await p.confirm({
    message: "Deseja adicionar o Storybook para documentação de componentes (Design System)?",
    initialValue: true,
  });

  if (p.isCancel(storybook)) {
    p.cancel("Operação cancelada pelo usuário.");
    process.exit(0);
  }

  return {
    projectName: projectName as string,
    packageManager: packageManager as CliAnswers["packageManager"],
    zoneless: zoneless as boolean,
    uiLibrary: uiLibrary as CliAnswers["uiLibrary"],
    stateManagement: stateManagement as CliAnswers["stateManagement"],
    initialTemplate: initialTemplate as CliAnswers["initialTemplate"],
    docker: docker as boolean,
    linting: linting as boolean,
    ci: ci as boolean,
    modernTests: modernTests as boolean,
    storybook: storybook as boolean,
  };
}

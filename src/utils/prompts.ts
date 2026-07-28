import * as p from "@clack/prompts";
import type { CliAnswers } from "../types/index.js";

export async function askUserPrompts(): Promise<CliAnswers> {
  const answers = (await p.group(
    {
      projectName: () =>
        p.text({
          message: "Qual é o nome do seu projeto?",
          placeholder: "meu-app-angular",
          validate: (value) => {
            if (!value) return "Por favor, insira um nome válido.";
            if (value.includes(" ")) return "O nome não pode conter espaços.";
          },
        }),

      packageManager: () =>
        p.select<
          Array<{ value: CliAnswers["packageManager"]; label: string }>,
          CliAnswers["packageManager"]
        >({
          message: "Qual gerenciador de pacotes você deseja usar?",
          options: [
            { value: "npm", label: "NPM" },
            { value: "pnpm", label: "PNPM (Recomendado pela rapidez)" },
            { value: "yarn", label: "Yarn" },
          ],
        }),

      zoneless: () =>
        p.confirm({
          message:
            "Deseja habilitar o modo Zoneless? (Recomendado para máxima performance)",
          initialValue: true,
        }),

      uiLibrary: () =>
        p.select<
          Array<{ value: CliAnswers["uiLibrary"]; label: string }>,
          CliAnswers["uiLibrary"]
        >({
          message:
            "Qual biblioteca de UI / Estilização você deseja configurar?",
          options: [
            { value: "tailwind", label: "Tailwind CSS puro" },
            { value: "primeng", label: "PrimeNG + Tailwind" },
            { value: "material", label: "Angular Material" },
            { value: "none", label: "Nenhuma (CSS/SCSS padrão)" },
          ],
        }),

      stateManagement: () =>
        p.select<
          Array<{ value: CliAnswers["stateManagement"]; label: string }>,
          CliAnswers["stateManagement"]
        >({
          message:
            "Deseja configurar o NgRx SignalStore para gerenciamento de estado?",
          options: [
            {
              value: "ngrx-signals",
              label: "Sim (Combo perfeito com Zoneless)",
            },
            { value: "none", label: "Não (Usarei apenas services nativos)" },
          ],
        }),
    },
    {
      onCancel: () => {
        p.cancel("Operação cancelada pelo usuário.");
        process.exit(0);
      },
    },
  )) as CliAnswers;

  return answers;
}

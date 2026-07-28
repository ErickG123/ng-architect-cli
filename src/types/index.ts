export interface CliAnswers {
  projectName: string;
  packageManager: "npm" | "pnpm" | "yarn";
  zoneless: boolean;
  uiLibrary: "tailwind" | "primeng" | "material" | "none";
  stateManagement: "ngrx-signals" | "none";
}

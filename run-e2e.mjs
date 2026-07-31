import path from 'node:path';
import { scaffoldProject } from './dist/utils/scaffold.js';
import { initGit, installDependencies } from './dist/utils/system.js';

async function run() {
  const project = {
    projectName: 'app-teste-final',
    packageManager: 'npm',
    zoneless: true,
    uiLibrary: 'primeng',
    stateManagement: 'ngrx-signals',
    initialTemplate: 'blank',
    docker: true,
    linting: true,
    ci: true
  };

  const targetDir = path.join(process.cwd(), '.temp-test', project.projectName);

  console.log(`Criando o projeto em ${targetDir}...`);
  try {
    scaffoldProject(project, targetDir);
    console.log('Arquivos gerados com sucesso.');
    
    console.log('Iniciando git...');
    await initGit(targetDir);
    
    console.log('Instalando dependências...');
    // Only install if npm is available and fast, let's just do it
    await installDependencies(project.packageManager, targetDir);
    console.log('Teste E2E finalizado com sucesso.');
  } catch(e) {
    console.error('Erro no E2E:', e);
    process.exit(1);
  }
}

run();

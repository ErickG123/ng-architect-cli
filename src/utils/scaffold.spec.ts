import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import { scaffoldProject } from './scaffold.js';
import type { CliAnswers } from '../types/index.js';

vi.mock('fs-extra', () => {
  return {
    default: {
      copySync: vi.fn(),
      writeFileSync: vi.fn(),
      existsSync: vi.fn(),
      readJsonSync: vi.fn(),
      writeJsonSync: vi.fn(),
      removeSync: vi.fn(),
      readFileSync: vi.fn(),
      ensureDirSync: vi.fn(),
      mkdirSync: vi.fn(),
    }
  };
});

describe('scaffoldProject', () => {
  const targetDir = '/mock/target/dir';
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Simula a existência dos arquivos
    vi.mocked(fs.existsSync).mockReturnValue(true);
    
    // Simula o conteúdo do package.json e angular.json
    vi.mocked(fs.readJsonSync).mockImplementation((filePath) => {
      if (filePath.toString().includes('angular.json')) {
        return {
          projects: {
            'template': {
              architect: {
                build: {
                  options: {
                    assets: [],
                    styles: []
                  }
                }
              }
            }
          }
        };
      }
      return {
        name: 'template',
        dependencies: {},
        devDependencies: {}
      };
    });

    // Simula o conteúdo do app.config.ts inicial contendo as âncoras
    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      if (filePath.toString().includes('app.config.ts')) {
        return `import { ApplicationConfig } from '@angular/core';
/* ZONE_CHANGE_DETECTION */
/* UI_IMPORTS */
/* NGRX_IMPORTS */

export const appConfig: ApplicationConfig = {
  providers: [
    /* ZONE_CHANGE_DETECTION_PROVIDER */
    /* UI_PROVIDERS */
    /* NGRX_PROVIDERS */
  ]
};`;
      }
      return '';
    });
  });

  it('deve injetar provideExperimentalZonelessChangeDetection quando zoneless for true', () => {
    const answers: CliAnswers = {
      projectName: 'meu-app',
      packageManager: 'npm',
      zoneless: true,
      uiLibrary: 'none',
      stateManagement: 'none',
      initialTemplate: 'blank',
      docker: false,
      linting: false,
      ci: false
    };

    scaffoldProject(answers, targetDir);

    const appConfigPath = path.join(targetDir, 'src/app/app.config.ts');
    
    // Verifica se a gravação de arquivo foi chamada no app.config.ts
    // e se o novo conteúdo contém a API Zoneless
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      appConfigPath,
      expect.stringContaining('provideExperimentalZonelessChangeDetection()'),
      'utf-8'
    );
  });

  it('deve configurar os providers do PrimeNG quando a uiLibrary for primeng', () => {
    const answers: CliAnswers = {
      projectName: 'meu-app',
      packageManager: 'npm',
      zoneless: true,
      uiLibrary: 'primeng',
      stateManagement: 'none',
      initialTemplate: 'blank',
      docker: false,
      linting: false,
      ci: false
    };

    scaffoldProject(answers, targetDir);

    const appConfigPath = path.join(targetDir, 'src/app/app.config.ts');
    
    // Verifica se a chamada do writeFileSync injetou os providers e imports
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      appConfigPath,
      expect.stringContaining("import { providePrimeNG } from 'primeng/config';"),
      'utf-8'
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      appConfigPath,
      expect.stringContaining('providePrimeNG({'),
      'utf-8'
    );
  });
});

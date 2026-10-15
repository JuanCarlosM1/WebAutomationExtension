import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

async function build() {
  const distDir = path.resolve('dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  console.log('Compilando Extensão WebAutomations...');

  // 1. Background Service Worker
  await esbuild.build({
    entryPoints: ['src/background/serviceWorker.ts'],
    outfile: 'dist/background.js',
    bundle: true,
    format: 'esm',
    target: 'chrome110',
    sourcemap: true,
  });
  console.log('✓ dist/background.js gerado');

  // 2. Content Driver (Script de injeção DOM - IIFE para não colidir com a página)
  await esbuild.build({
    entryPoints: ['src/content/contentDriver.ts'],
    outfile: 'dist/contentDriver.js',
    bundle: true,
    format: 'iife',
    target: 'chrome110',
    sourcemap: true,
  });
  console.log('✓ dist/contentDriver.js gerado');

  // 3. Visual Flow Studio (Editor App)
  await esbuild.build({
    entryPoints: ['src/editor/editorApp.ts'],
    outfile: 'dist/editorApp.js',
    bundle: true,
    format: 'esm',
    target: 'chrome110',
    sourcemap: true,
  });
  console.log('✓ dist/editorApp.js gerado');

  // 4. Popup Script
  await esbuild.build({
    entryPoints: ['src/popup/popup.ts'],
    outfile: 'dist/popup.js',
    bundle: true,
    format: 'esm',
    target: 'chrome110',
    sourcemap: true,
  });
  console.log('✓ dist/popup.js gerado');

  // 5. Settings App
  await esbuild.build({
    entryPoints: ['src/settings/settingsApp.ts'],
    outfile: 'dist/settingsApp.js',
    bundle: true,
    format: 'esm',
    target: 'chrome110',
    sourcemap: true,
  });
  console.log('✓ dist/settingsApp.js gerado');

  // 6. Analyzer App
  await esbuild.build({
    entryPoints: ['src/analyzer/analyzerApp.ts'],
    outfile: 'dist/analyzerApp.js',
    bundle: true,
    format: 'esm',
    target: 'chrome110',
    sourcemap: true,
  });
  console.log('✓ dist/analyzerApp.js gerado');

  // 7. Page Script Bridge (Injetado via <script> na página web)
  await esbuild.build({
    entryPoints: ['src/content/pageScriptBridge.ts'],
    outfile: 'dist/pageScriptBridge.js',
    bundle: true,
    format: 'iife',
    target: 'chrome110',
    sourcemap: true,
  });
  console.log('✓ dist/pageScriptBridge.js gerado');

  console.log('🎉 Compilação da extensão concluída com sucesso!');
}

build().catch((err) => {
  console.error('Erro na compilação:', err);
  process.exit(1);
});

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

  console.log('🎉 Compilação da extensão concluída com sucesso!');
}

build().catch((err) => {
  console.error('Erro na compilação:', err);
  process.exit(1);
});

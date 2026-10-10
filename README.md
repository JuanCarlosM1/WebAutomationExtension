# 🎨 @webautomations/browser-extension (ExtensãoDeBrowser)

> **Versão:** `0.1.0`  
> **Manifest:** V3 (Chrome, Edge, Brave, navegadores baseados em Chromium)  
> **Papel:** Interface visual para criação (Visual Flow Studio), gerenciamento e execução local de automações no navegador.

---

## 🎯 Visão Geral

A **ExtensãoDeBrowser** é o ambiente visual e runtime de navegação do ecossistema WebAutomations. Ela reúne:

1. **Visual Flow Studio (`editor.html`)**:
   - Canvas infinito com arraste, zoom e nós estilizados por categorias.
   - Conexões com curvas Bézier dinâmicas e múltiplas portas de saída (`true/false`, `loop_body/done`, `try/catch`, múltiplos casos do `switch`).
   - Painel Inspector para edição de propriedades de cada bloco em tempo real.
   - Gerenciamento de abas de fluxos, biblioteca de automações locais e suporte a importação/exportação de arquivos `.webautomation.json`.
2. **Background Service Worker (`background.js`)**:
   - Ponte com o motor de automação, agendamento via alarms, atalhos de teclado e comunicação com content scripts.
   - Suporte a conexão WebSocket com o servidor MCP (`ws://localhost:3001`).
3. **Content Scripts (`contentDriver.js`)**:
   - Ações simuladas na página: cliques reais, digitação humanizada com atrasos naturais, scraping estruturado e injeção de scripts/estilos.
4. **Popup (`popup.html`)**:
   - Menu rápido para disparar automações ativas, inspecionar status e abrir o editor.

---

## 🚀 Como Compilar e Carregar no Navegador

### 1. Compilação dos Bundles

Dentro do diretório `ExtensãoDeBrowser`:

```bash
# Instalar dependências de build (esbuild, typescript)
npm install

# Compilar todos os pontos de entrada para dist/
npm run build
```

O comando compilará para a pasta `dist/`:
- `dist/background.js`
- `dist/contentDriver.js`
- `dist/editorApp.js`
- `dist/popup.js`

### 2. Carregando no Chrome / Chromium

1. Abra seu navegador e acesse: `chrome://extensions/`.
2. Ative a chave **"Modo do desenvolvedor"** no canto superior direito.
3. Clique no botão **"Carregar sem compactação"**.
4. Selecione a pasta raiz da extensão:  
   `c:\Users\juanc\Documents\GitHub\WebAutomations\ExtensãoDeBrowser`

---

## 📂 Estrutura do Módulo

```
ExtensãoDeBrowser/
├── src/
│   ├── background/
│   │   └── serviceWorker.ts       # Service worker em Manifest V3
│   ├── driver/
│   │   ├── ChromeBrowserDriver.ts # Driver de comandos no navegador
│   │   └── contentDriver.ts       # Injetor DOM na página
│   ├── editor/
│   │   ├── modules/
│   │   │   ├── blockCatalog.ts    # Definição e ícones dos blocos
│   │   │   ├── canvasManager.ts   # Renderização do canvas, nós e portas
│   │   │   ├── inspectorManager.ts# Painel de propriedades e inputs
│   │   │   ├── tabManager.ts      # Abas e listagem de automações
│   │   │   └── colorPickerManager.ts
│   │   └── editorApp.ts           # Orquestrador da aplicação do editor
│   └── popup/
│       └── popup.ts               # Lógica do popup de controle
├── dist/                          # Arquivos compilados para execução
├── editor.html                    # Interface do Studio
├── popup.html                     # Interface do popup
├── manifest.json                  # Manifesto V3 (versão 0.1.0)
├── build.js                       # Script de empacotamento com esbuild
└── package.json                   # Versão 0.1.0
```

---

## 🏷️ Regras de Versionamento

- **Fix (`0.1.x`)**: Correções de interface, renderização de conexões, ajustes no content driver ou background worker.
- **Minor (`0.x.0`)**: Inclusão de novas ferramentas no editor, novos recursos de canvas ou novas permissões e recursos de extensão.

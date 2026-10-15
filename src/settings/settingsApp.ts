/**
 * Script da Página Dedicada de Configurações (settings.html)
 */

import { showToast } from '../editor/modules/editorUtils';
import { DialogMenu } from '../editor/modules/dialogUtils';
import { FloatingContainerLayoutConfig } from '../../../BibliotecaDeDev/src/types/schema';

document.addEventListener('DOMContentLoaded', async () => {
  const stackDirection = document.getElementById('stackDirection') as HTMLSelectElement;
  const gapInput = document.getElementById('gapInput') as HTMLInputElement;
  const maxColumnsInput = document.getElementById('maxColumnsInput') as HTMLInputElement;
  const maxRowsInput = document.getElementById('maxRowsInput') as HTMLInputElement;
  const btnResetPositions = document.getElementById('btnResetPositions');

  const autoSaveInterval = document.getElementById('autoSaveInterval') as HTMLSelectElement;
  const defaultEdgeType = document.getElementById('defaultEdgeType') as HTMLSelectElement;
  const showMinimapDefault = document.getElementById('showMinimapDefault') as HTMLInputElement;
  const snapToGridDefault = document.getElementById('snapToGridDefault') as HTMLInputElement;

  const mcpEnabled = document.getElementById('mcpEnabled') as HTMLInputElement;
  const mcpPortInput = document.getElementById('mcpPortInput') as HTMLInputElement;

  const storageSummaryText = document.getElementById('storageSummaryText');
  const btnExportAllData = document.getElementById('btnExportAllData');
  const btnImportAllData = document.getElementById('btnImportAllData');
  const backupFileInput = document.getElementById('backupFileInput') as HTMLInputElement;
  const btnSaveAllSettings = document.getElementById('btnSaveAllSettings');
  const btnOpenStudioFromSettings = document.getElementById('btnOpenStudioFromSettings');

  // Abrir estúdio
  btnOpenStudioFromSettings?.addEventListener('click', () => {
    if (chrome.tabs?.create) {
      chrome.tabs.create({ url: chrome.runtime.getURL('editor.html?tab=settings') });
    } else {
      window.open('editor.html?tab=settings', '_blank');
    }
  });

  // Carregar dados salvos
  if (chrome.storage?.local) {
    chrome.storage.local.get(
      [
        'floating_buttons_layout_settings',
        'visual_studio_preferences',
        'mcp_config',
        'web_automations',
      ],
      (data) => {
        // 1. Floating layout
        const layout: FloatingContainerLayoutConfig = data.floating_buttons_layout_settings || {
          stackDirection: 'vertical',
          gap: 10,
          maxColumns: 3,
          maxRows: 5,
        };
        if (stackDirection) stackDirection.value = layout.stackDirection || 'vertical';
        if (gapInput) gapInput.value = String(layout.gap ?? 10);
        if (maxColumnsInput) maxColumnsInput.value = String(layout.maxColumns ?? 3);
        if (maxRowsInput) maxRowsInput.value = String(layout.maxRows ?? 5);

        // 2. Preferences
        const prefs = data.visual_studio_preferences || {
          autoSave: 'always',
          edgeType: 'bezier',
          minimap: true,
          snapGrid: true,
        };
        if (autoSaveInterval) autoSaveInterval.value = prefs.autoSave || 'always';
        if (defaultEdgeType) defaultEdgeType.value = prefs.edgeType || 'bezier';
        if (showMinimapDefault) showMinimapDefault.checked = prefs.minimap !== false;
        if (snapToGridDefault) snapToGridDefault.checked = prefs.snapGrid !== false;

        // 3. MCP Config
        const mcp = data.mcp_config || { enabled: false, port: 3001 };
        if (mcpEnabled) mcpEnabled.checked = !!mcp.enabled;
        if (mcpPortInput) mcpPortInput.value = String(mcp.port || 3001);

        // 4. Summary
        const automations = data.web_automations || [];
        if (storageSummaryText) {
          storageSummaryText.textContent = `${automations.length} fluxo(s) de automação armazenados localmente.`;
        }
      }
    );
  }

  // Redefinir posições arrastadas
  btnResetPositions?.addEventListener('click', async () => {
    const confirmed = await DialogMenu.confirm({
      title: 'Restaurar Posições',
      message: 'Deseja redefinir as posições manuais de todos os botões flutuantes arrastados em páginas da web?',
      confirmText: 'Restaurar',
      isDanger: false,
    });
    if (confirmed && chrome.storage?.local) {
      await chrome.storage.local.remove('floating_buttons_dragged_positions');
      showToast('Posições dos botões flutuantes redefinidas com sucesso!', 'success');
    }
  });

  // Salvar tudo
  btnSaveAllSettings?.addEventListener('click', async () => {
    const layoutConfig: FloatingContainerLayoutConfig = {
      stackDirection: (stackDirection?.value as any) || 'vertical',
      gap: Number(gapInput?.value) || 10,
      maxColumns: Number(maxColumnsInput?.value) || 3,
      maxRows: Number(maxRowsInput?.value) || 5,
    };

    const studioPrefs = {
      autoSave: autoSaveInterval?.value || 'always',
      edgeType: defaultEdgeType?.value || 'bezier',
      minimap: showMinimapDefault?.checked ?? true,
      snapGrid: snapToGridDefault?.checked ?? true,
    };

    const mcpConfig = {
      enabled: mcpEnabled?.checked ?? false,
      port: Number(mcpPortInput?.value) || 3001,
    };

    if (chrome.storage?.local) {
      await chrome.storage.local.set({
        floating_buttons_layout_settings: layoutConfig,
        visual_studio_preferences: studioPrefs,
        mcp_config: mcpConfig,
      });

      // Atualiza o service worker caso o MCP tenha mudado
      if (chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({
          action: 'SET_MCP_CONFIG',
          payload: mcpConfig,
        });
      }

      showToast('Configurações salvas e sincronizadas com sucesso!', 'success');
    }
  });

  // Exportar Backup Completo
  btnExportAllData?.addEventListener('click', () => {
    if (!chrome.storage?.local) return;
    chrome.storage.local.get(null, (allData) => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `webautomations_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Backup exportado com sucesso!', 'success');
    });
  });

  // Importar Backup
  btnImportAllData?.addEventListener('click', () => {
    backupFileInput?.click();
  });

  backupFileInput?.addEventListener('change', (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const imported = JSON.parse(evt.target?.result as string);
        if (!imported || typeof imported !== 'object') {
          throw new Error('Conteúdo do arquivo inválido');
        }

        const confirmed = await DialogMenu.confirm({
          title: 'Restaurar Backup Completo',
          message: 'A restauração irá mesclar e atualizar os dados da extensão com o arquivo selecionado. Deseja continuar?',
          confirmText: 'Restaurar Dados',
          isDanger: true,
        });

        if (confirmed && chrome.storage?.local) {
          await chrome.storage.local.set(imported);
          showToast('Backup restaurado com sucesso! Recarregando dados...', 'success');
          setTimeout(() => window.location.reload(), 1200);
        }
      } catch (err: any) {
        DialogMenu.alert({
          title: 'Erro na Restauração',
          message: 'Falha ao processar o arquivo de backup: ' + err.message,
          type: 'error',
        });
      }
    };
    reader.readAsText(file);
  });
});

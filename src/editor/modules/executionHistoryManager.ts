/**
 * Gerenciador e Repositório do Histórico e Log de Execuções das Automações
 * Armazena no chrome.storage.local os dados de cada execução para auditoria,
 * filtros avançados (status, data, nome, automação) e inspeção em Modo Fantasma.
 */

import { WebAutomationGraph } from '../../../../BibliotecaDeDev/src/types/schema';

export interface BlockExecutionSnapshot {
  nodeId: string;
  nodeType: string;
  nodeLabel: string;
  status: 'completed' | 'failed' | 'running' | 'skipped';
  config: any; // Cópia das propriedades configuradas no nó no momento da execução
  inputData?: any; // Dados recebidos nas entradas do bloco
  outputData?: any; // Dados gerados na saída do bloco
  durationMs?: number;
  error?: string;
  executedAt: number;
}

export interface ExecutionHistoryItem {
  id: string; // Ex: run_1730000000000_abc12
  automationId: string;
  automationName: string;
  timestamp: number; // Data/hora em milissegundos
  isoDate: string; // Data ISO formatada
  durationMs: number;
  status: 'completed' | 'failed' | 'cancelled';
  error?: string;
  triggerType: 'manual' | 'debug' | 'floating_button' | 'shortcut' | 'schedule' | 'date_schedule' | 'context_menu' | 'mcp' | 'unknown';
  targetTabUrl?: string;
  targetTabTitle?: string;
  graphSnapshot: WebAutomationGraph; // Cópia exata do fluxo no momento da execução (para o Modo Fantasma)
  initialVariables?: Record<string, any>;
  finalVariables?: Record<string, any>;
  blockSnapshots: Record<string, BlockExecutionSnapshot>; // nodeId -> BlockExecutionSnapshot
  logs: Array<{ timestamp: number; level: string; message: string; nodeId?: string }>;
}

export interface ExecutionFilterOptions {
  automationId?: string; // Se fornecido, filtra estritamente por esse fluxo
  status?: string; // 'all' | 'completed' | 'failed' | 'cancelled'
  query?: string; // Busca textual em nome, trigger ou erro
  dateRange?: 'all' | 'today' | 'last7days' | 'last30days';
}

const STORAGE_KEY = 'web_automations_history';
const MAX_HISTORY_ITEMS = 100; // Limite para evitar estouro de cota do chrome.storage

export class ExecutionHistoryManager {
  /**
   * Obtém todo o histórico de execuções armazenado localmente
   */
  public static async getAll(): Promise<ExecutionHistoryItem[]> {
    if (!chrome.storage?.local) return [];
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEY, (res) => {
        const list: ExecutionHistoryItem[] = res?.[STORAGE_KEY] || [];
        // Ordena do mais recente para o mais antigo
        list.sort((a, b) => b.timestamp - a.timestamp);
        resolve(list);
      });
    });
  }

  /**
   * Obtém execuções filtradas
   */
  public static async getFiltered(filters: ExecutionFilterOptions): Promise<ExecutionHistoryItem[]> {
    const all = await this.getAll();
    return this.applyFilters(all, filters);
  }

  /**
   * Aplica filtros em uma lista de execuções em memória
   */
  public static applyFilters(items: ExecutionHistoryItem[], filters: ExecutionFilterOptions): ExecutionHistoryItem[] {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    return items.filter((item) => {
      // 1. Filtro por Automação Específica (usado no Studio durante a edição)
      if (filters.automationId && item.automationId !== filters.automationId) {
        return false;
      }

      // 2. Filtro por Status Final
      if (filters.status && filters.status !== 'all') {
        if (item.status !== filters.status) return false;
      }

      // 3. Filtro por Período de Data
      if (filters.dateRange && filters.dateRange !== 'all') {
        if (filters.dateRange === 'today') {
          const itemDate = new Date(item.timestamp).toDateString();
          const todayDate = new Date().toDateString();
          if (itemDate !== todayDate) return false;
        } else if (filters.dateRange === 'last7days') {
          if (now - item.timestamp > 7 * oneDayMs) return false;
        } else if (filters.dateRange === 'last30days') {
          if (now - item.timestamp > 30 * oneDayMs) return false;
        }
      }

      // 4. Filtro por Texto / Busca (Nome da automação, mensagem de erro ou gatilho)
      if (filters.query && filters.query.trim()) {
        const q = filters.query.toLowerCase().trim();
        const matchName = (item.automationName || '').toLowerCase().includes(q);
        const matchError = (item.error || '').toLowerCase().includes(q);
        const matchTrigger = (item.triggerType || '').toLowerCase().includes(q);
        const matchTab = (item.targetTabTitle || item.targetTabUrl || '').toLowerCase().includes(q);
        if (!matchName && !matchError && !matchTrigger && !matchTab) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Busca uma execução específica pelo seu ID único
   */
  public static async getById(id: string): Promise<ExecutionHistoryItem | undefined> {
    const all = await this.getAll();
    return all.find((item) => item.id === id);
  }

  /**
   * Salva um novo registro de execução
   */
  public static async save(item: ExecutionHistoryItem): Promise<void> {
    if (!chrome.storage?.local) return;
    const all = await this.getAll();
    // Remove eventual duplicata e adiciona no início
    const updated = [item, ...all.filter((i) => i.id !== item.id)].slice(0, MAX_HISTORY_ITEMS);
    await chrome.storage.local.set({ [STORAGE_KEY]: updated });
  }

  /**
   * Remove uma execução pelo ID
   */
  public static async delete(id: string): Promise<void> {
    if (!chrome.storage?.local) return;
    const all = await this.getAll();
    const updated = all.filter((i) => i.id !== id);
    await chrome.storage.local.set({ [STORAGE_KEY]: updated });
  }

  /**
   * Limpa todo o histórico de execuções
   */
  public static async clearAll(): Promise<void> {
    if (!chrome.storage?.local) return;
    await chrome.storage.local.remove(STORAGE_KEY);
  }

  /**
   * Limpa o histórico de execuções de uma automação específica
   */
  public static async clearForAutomation(automationId: string): Promise<void> {
    if (!chrome.storage?.local) return;
    const all = await this.getAll();
    const updated = all.filter((i) => i.automationId !== automationId);
    await chrome.storage.local.set({ [STORAGE_KEY]: updated });
  }
}

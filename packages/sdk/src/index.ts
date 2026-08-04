import { BIToolProviderType, DashboardAST, PluginManifest } from '@dcaps/types';

export interface BIProviderAdapter {
  providerType: BIToolProviderType;
  parseReportToAST(fileBuffer: ArrayBuffer): Promise<DashboardAST>;
}

export interface CustomVisualPlugin {
  visualType: string;
  renderCanvasNode(container: HTMLElement, data: any): void;
}

export class CapsulePluginSDK {
  private biAdapters: Map<BIToolProviderType, BIProviderAdapter> = new Map();
  private customVisuals: Map<string, CustomVisualPlugin> = new Map();

  registerBIToolAdapter(adapter: BIProviderAdapter): void {
    this.biAdapters.set(adapter.providerType, adapter);
  }

  registerCustomVisual(plugin: CustomVisualPlugin): void {
    this.customVisuals.set(plugin.visualType, plugin);
  }

  getAdapter(provider: BIToolProviderType): BIProviderAdapter | undefined {
    return this.biAdapters.get(provider);
  }

  getRegisteredVisualsCount(): number {
    return this.customVisuals.size;
  }
}

export const sdk = new CapsulePluginSDK();

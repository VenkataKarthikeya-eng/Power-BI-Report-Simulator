import { CapsulePluginSDK, BIProviderAdapter } from './index';
import { DashboardAST } from '@dcaps/types';

describe('CapsulePluginSDK Unit Tests', () => {
  it('should register and retrieve custom BI Tool adapters', () => {
    const sdk = new CapsulePluginSDK();

    const mockTableauAdapter: BIProviderAdapter = {
      providerType: 'TABLEAU',
      async parseReportToAST(): Promise<DashboardAST> {
        return {
          id: 'dash_tab_01',
          name: 'Tableau_Sales.twbx',
          pbixFingerprintSha256: 'abc123hash',
          fileSizeBytes: 1024,
          pages: [],
          parsedAt: new Date().toISOString(),
        };
      },
    };

    sdk.registerBIToolAdapter(mockTableauAdapter);

    const adapter = sdk.getAdapter('TABLEAU');
    expect(adapter).toBeDefined();
    expect(adapter?.providerType).toBe('TABLEAU');
  });

  it('should register custom visual plugins', () => {
    const sdk = new CapsulePluginSDK();

    sdk.registerCustomVisual({
      visualType: 'sankeyDiagram',
      renderCanvasNode: () => {},
    });

    expect(sdk.getRegisteredVisualsCount()).toBe(1);
  });
});

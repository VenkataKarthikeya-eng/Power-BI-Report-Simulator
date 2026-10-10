import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';

/**
 * Encodes a string as UTF-16LE byte buffer (standard for Power BI Report/Layout streams)
 */
function encodeUTF16LE(str: string): Buffer {
  const buf = Buffer.alloc(str.length * 2);
  for (let i = 0; i < str.length; i++) {
    buf.writeUInt16LE(str.charCodeAt(i), i * 2);
  }
  return buf;
}

async function createPBIXFile(name: string, layoutData: any, outputPath: string) {
  const zip = new JSZip();

  // 1. Content Types XML
  const contentTypesXML = `<?xml version="1.0" encoding="utf-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="json" ContentType="application/json"/><Default Extension="xml" ContentType="application/xml"/></Types>`;
  zip.file('[Content_Types].xml', contentTypesXML);

  // 2. Version
  zip.file('Version', '2.128.0');

  // 3. Settings
  zip.file('Settings', JSON.stringify({ version: '2.0', customVisualsAllowed: true }));

  // 4. Report/Layout (encoded in UTF-16LE)
  const layoutStr = JSON.stringify(layoutData, null, 2);
  const layoutBytes = encodeUTF16LE(layoutStr);
  zip.file('Report/Layout', layoutBytes);

  // Generate binary zip
  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, content);
  console.log(`✅ Generated .pbix file: ${outputPath} (${(content.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log('Generating demo .pbix files for repository...');

  // Preset 1: Logistics & Supply Chain
  const logisticsLayout = {
    id: 1,
    theme: 'DarkBlue',
    sections: [
      {
        name: 'ReportSection_Overview',
        displayName: 'Global Logistics Briefing',
        ordinal: 1,
        width: 1280,
        height: 720,
        visualContainers: [
          {
            x: 40,
            y: 40,
            width: 380,
            height: 140,
            z: 1,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'card',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Total Freight Margin'" } } } } }] },
                projections: { Values: [{ queryRef: 'Logistics.FreightMargin' }] },
              },
            }),
          },
          {
            x: 440,
            y: 40,
            width: 380,
            height: 140,
            z: 2,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'card',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Avg Transit Delay'" } } } } }] },
                projections: { Values: [{ queryRef: 'Logistics.DelayHours' }] },
              },
            }),
          },
          {
            x: 840,
            y: 40,
            width: 380,
            height: 140,
            z: 3,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'card',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Active Global Fleet'" } } } } }] },
                projections: { Values: [{ queryRef: 'Logistics.Shipments' }] },
              },
            }),
          },
          {
            x: 40,
            y: 200,
            width: 580,
            height: 320,
            z: 4,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'barChart',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Carrier Freight Cost Allocation'" } } } } }] },
                projections: { Category: [{ queryRef: 'Carriers.Name' }], Y: [{ queryRef: 'Logistics.FreightCost' }] },
              },
            }),
          },
          {
            x: 640,
            y: 200,
            width: 580,
            height: 320,
            z: 5,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'lineChart',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Transit Delay Trajectory (Hours)'" } } } } }] },
                projections: { Category: [{ queryRef: 'Calendar.Month' }], Y: [{ queryRef: 'Logistics.DelayTrend' }] },
              },
            }),
          },
          {
            x: 40,
            y: 540,
            width: 1180,
            height: 280,
            z: 6,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'matrix',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Carrier Operational Performance Matrix'" } } } } }] },
                projections: { Rows: [{ queryRef: 'Carriers.Name' }], Values: [{ queryRef: 'Logistics.Delay' }, { queryRef: 'Logistics.Cost' }] },
              },
            }),
          },
          {
            x: 40,
            y: 10,
            width: 300,
            height: 80,
            z: 7,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'slicer',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Geographic Region'" } } } } }] },
                projections: { Values: [{ queryRef: 'Geography.Region' }] },
              },
            }),
          },
        ],
      },
    ],
  };

  // Preset 2: SaaS ARR Financials
  const saasLayout = {
    id: 2,
    theme: 'ExecutiveDark',
    sections: [
      {
        name: 'ReportSection_SaaS',
        displayName: 'ARR & Customer Dynamics',
        ordinal: 1,
        width: 1280,
        height: 720,
        visualContainers: [
          {
            x: 40,
            y: 40,
            width: 380,
            height: 140,
            z: 1,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'card',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Annual Recurring Revenue (ARR)'" } } } } }] },
                projections: { Values: [{ queryRef: 'Finance.ARR' }] },
              },
            }),
          },
          {
            x: 440,
            y: 40,
            width: 380,
            height: 140,
            z: 2,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'card',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Net Dollar Retention'" } } } } }] },
                projections: { Values: [{ queryRef: 'Finance.NDR' }] },
              },
            }),
          },
          {
            x: 840,
            y: 40,
            width: 380,
            height: 140,
            z: 3,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'card',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'LTV / CAC Ratio'" } } } } }] },
                projections: { Values: [{ queryRef: 'Finance.LTV_CAC' }] },
              },
            }),
          },
          {
            x: 40,
            y: 200,
            width: 580,
            height: 320,
            z: 4,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'barChart',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'ARR Breakdown by Customer Segment'" } } } } }] },
                projections: { Category: [{ queryRef: 'Segments.Tier' }], Y: [{ queryRef: 'Finance.ARR' }] },
              },
            }),
          },
          {
            x: 640,
            y: 200,
            width: 580,
            height: 320,
            z: 5,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'lineChart',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Monthly Expansion Trend ($K)'" } } } } }] },
                projections: { Category: [{ queryRef: 'Calendar.Month' }], Y: [{ queryRef: 'Finance.Expansion' }] },
              },
            }),
          },
          {
            x: 40,
            y: 540,
            width: 1180,
            height: 280,
            z: 6,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'matrix',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Cohort Retention Performance Matrix'" } } } } }] },
                projections: { Rows: [{ queryRef: 'Cohorts.Vintage' }], Values: [{ queryRef: 'Finance.NetRetention' }] },
              },
            }),
          },
        ],
      },
    ],
  };

  // Preset 3: Retail Omnichannel
  const retailLayout = {
    id: 3,
    theme: 'ModernCommerce',
    sections: [
      {
        name: 'ReportSection_Retail',
        displayName: 'Retail Omnichannel Performance',
        ordinal: 1,
        width: 1280,
        height: 720,
        visualContainers: [
          {
            x: 40,
            y: 40,
            width: 380,
            height: 140,
            z: 1,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'card',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Gross Merchandise Value (GMV)'" } } } } }] },
                projections: { Values: [{ queryRef: 'Sales.GMV' }] },
              },
            }),
          },
          {
            x: 440,
            y: 40,
            width: 380,
            height: 140,
            z: 2,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'card',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Average Order Value (AOV)'" } } } } }] },
                projections: { Values: [{ queryRef: 'Sales.AOV' }] },
              },
            }),
          },
          {
            x: 840,
            y: 40,
            width: 380,
            height: 140,
            z: 3,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'card',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Return & Claim Rate'" } } } } }] },
                projections: { Values: [{ queryRef: 'Sales.ReturnRate' }] },
              },
            }),
          },
          {
            x: 40,
            y: 200,
            width: 580,
            height: 320,
            z: 4,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'barChart',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Merchandise Category Revenue'" } } } } }] },
                projections: { Category: [{ queryRef: 'Products.Category' }], Y: [{ queryRef: 'Sales.GMV' }] },
              },
            }),
          },
          {
            x: 640,
            y: 200,
            width: 580,
            height: 320,
            z: 5,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'lineChart',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Weekly Conversion Rate Curve'" } } } } }] },
                projections: { Category: [{ queryRef: 'Calendar.Week' }], Y: [{ queryRef: 'Sales.Conversion' }] },
              },
            }),
          },
          {
            x: 40,
            y: 540,
            width: 1180,
            height: 280,
            z: 6,
            config: JSON.stringify({
              singleVisual: {
                visualType: 'matrix',
                vcObjects: { title: [{ properties: { text: { expr: { Literal: { Value: "'Channel Contribution Matrix'" } } } } }] },
                projections: { Rows: [{ queryRef: 'Channels.Name' }], Values: [{ queryRef: 'Sales.Margin' }] },
              },
            }),
          },
        ],
      },
    ],
  };

  // Destination directories: both in app public and root demo folder
  const publicDir = path.resolve(__dirname, '../apps/app-dashboard/public/demo-files');
  const rootDemoDir = path.resolve(__dirname, '../demo-pbix-files');

  for (const dir of [publicDir, rootDemoDir]) {
    await createPBIXFile('Global_Supply_Chain_Logistics.pbix', logisticsLayout, path.join(dir, 'Global_Supply_Chain_Logistics.pbix'));
    await createPBIXFile('Executive_SaaS_Financials.pbix', saasLayout, path.join(dir, 'Executive_SaaS_Financials.pbix'));
    await createPBIXFile('Retail_Omnichannel_Sales.pbix', retailLayout, path.join(dir, 'Retail_Omnichannel_Sales.pbix'));
  }

  console.log('🎉 All demo .pbix files generated successfully!');
}

main().catch(console.error);

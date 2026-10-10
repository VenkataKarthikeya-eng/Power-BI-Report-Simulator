'use client';

import React from 'react';
import { NormalizedVisual } from '@/lib/parser/types';
import { ComputedVisualData } from '@/lib/simulation/types';
import { MetricCardVisual } from './MetricCardVisual';
import { BarChartVisual } from './BarChartVisual';
import { LineChartVisual } from './LineChartVisual';
import { DonutChartVisual } from './DonutChartVisual';
import { TableVisual } from './TableVisual';
import { SlicerVisual } from './SlicerVisual';
import { UnsupportedVisual } from './UnsupportedVisual';

interface VisualRendererProps {
  visual: NormalizedVisual;
  data?: ComputedVisualData;
  onToggleSlicer?: (field: string, value: string) => void;
  onClearSlicer?: (field: string) => void;
}

export function VisualRenderer({
  visual,
  data,
  onToggleSlicer,
  onClearSlicer,
}: VisualRendererProps) {
  const title = data?.title || visual.title || visual.name;

  // 1. If data state is unsupported_data or no data computed
  if (!data || data.status === 'unsupported_data') {
    return (
      <UnsupportedVisual
        title={title}
        visual={visual}
        isDataModelMissing={true}
        warnings={data?.warnings}
      />
    );
  }

  // 2. If visual is unsupported
  if (data.status === 'unsupported_visual') {
    return (
      <UnsupportedVisual
        title={title}
        visual={visual}
        isDataModelMissing={false}
        warnings={data.warnings}
      />
    );
  }

  // 3. Slicer Visual
  if (visual.isSlicer) {
    // Extract field from title e.g. "Slicer (Region)"
    const match = title.match(/\((.*?)\)/);
    const field = match ? match[1] : 'Region';

    return (
      <SlicerVisual
        title={title}
        items={data.slicerItems}
        isDemoData={data.isDemoData}
        onToggle={(val) => onToggleSlicer && onToggleSlicer(field, val)}
        onClear={() => onClearSlicer && onClearSlicer(field)}
      />
    );
  }

  // 4. KPI & Metric Card
  if (visual.visualType === 'card' || visual.visualType === 'multiRowCard' || visual.visualType === 'kpi') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs h-full">
        <MetricCardVisual
          title={title}
          metric={data.metric}
          isDemoData={data.isDemoData}
        />
      </div>
    );
  }

  // 5. Column & Bar Charts
  if (visual.visualType === 'barChart' || visual.visualType === 'columnChart') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs h-full">
        <BarChartVisual
          title={title}
          items={data.chartItems}
          isDemoData={data.isDemoData}
          isColumn={visual.visualType === 'columnChart'}
        />
      </div>
    );
  }

  // 6. Line & Area Charts
  if (visual.visualType === 'lineChart' || visual.visualType === 'areaChart') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs h-full">
        <LineChartVisual
          title={title}
          items={data.timelineItems}
          isDemoData={data.isDemoData}
        />
      </div>
    );
  }

  // 7. Pie & Donut Charts
  if (visual.visualType === 'pieChart' || visual.visualType === 'donutChart') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs h-full">
        <DonutChartVisual
          title={title}
          items={data.chartItems}
          isDemoData={data.isDemoData}
        />
      </div>
    );
  }

  // 8. Tables and Matrices
  if (visual.visualType === 'table' || visual.visualType === 'matrix') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs h-full">
        <TableVisual
          title={title}
          columns={data.tableColumns}
          rows={data.tableRows}
          isDemoData={data.isDemoData}
        />
      </div>
    );
  }

  // Fallback to unsupported visual
  return (
    <UnsupportedVisual
      title={title}
      visual={visual}
      isDataModelMissing={false}
      warnings={data.warnings}
    />
  );
}

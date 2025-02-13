"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function BarChartCustom({
  chartData,
  chartConfig,
  xAxisName,
}: {
  chartData: any[];
  chartConfig: ChartConfig;
  xAxisName: string;
}) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xAxisName}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {Object.entries(chartConfig).map(([configName, val]) => (
          <Bar
            dataKey={configName}
            fill={`var(--color-${configName})`}
            radius={4}
            key={configName}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}


import React from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart";

export interface ChartProps {
  data: any[];
  categories?: string[];
  index?: string;
  className?: string;
  yAxisWidth?: number;
  showLegend?: boolean;
  valueFormatter?: (value: number) => string;
  showYAxis?: boolean;
  showXAxis?: boolean;
  showGrid?: boolean;
}

export function AreaChart({
  data,
  categories,
  index = "x",
  className,
  yAxisWidth = 40,
  showLegend = true,
  valueFormatter = (value: number) => value.toString(),
  showYAxis = true,
  showXAxis = true,
  showGrid = true,
}: ChartProps) {
  const config = {};
  data.forEach((item) => {
    if (item.name) {
      config[item.name] = {
        label: item.name,
        color: item.color || getColorForIndex(data.indexOf(item)),
      };
    }
  });

  return (
    <ChartContainer className={cn("h-full w-full", className)} config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data[0]?.data || []}
          margin={{ top: 16, right: 16, bottom: 16, left: yAxisWidth }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          )}
          {showXAxis && (
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => String(value)}
              categories={categories}
            />
          )}
          {showYAxis && (
            <YAxis
              width={yAxisWidth}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => valueFormatter(value)}
            />
          )}
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value: number, name: string) => [
                  valueFormatter(value),
                  name,
                ]}
              />
            }
          />
          {showLegend && <Legend />}

          {data.map((item, index) => (
            <Area
              key={item.name || index}
              type="monotone"
              dataKey="y"
              name={item.name}
              fill={item.color || getColorForIndex(index)}
              stroke={item.color || getColorForIndex(index)}
              fillOpacity={0.15}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function BarChart({
  data,
  categories,
  index = "x",
  className,
  yAxisWidth = 40,
  showLegend = true,
  valueFormatter = (value: number) => value.toString(),
  showYAxis = true,
  showXAxis = true,
  showGrid = true,
}: ChartProps) {
  const config = {};
  data.forEach((item) => {
    if (item.name) {
      config[item.name] = {
        label: item.name,
        color: item.color || getColorForIndex(data.indexOf(item)),
      };
    }
  });

  return (
    <ChartContainer className={cn("h-full w-full", className)} config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data[0]?.data || []}
          margin={{ top: 16, right: 16, bottom: 16, left: yAxisWidth }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          )}
          {showXAxis && (
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => String(value)}
              categories={categories}
            />
          )}
          {showYAxis && (
            <YAxis
              width={yAxisWidth}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => valueFormatter(value)}
            />
          )}
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value: number, name: string) => [
                  valueFormatter(value),
                  name,
                ]}
              />
            }
          />
          {showLegend && <Legend />}

          {data.map((item, index) => (
            <Bar
              key={item.name || index}
              dataKey="y"
              name={item.name}
              fill={item.color || getColorForIndex(index)}
              stroke={item.color || getColorForIndex(index)}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function LineChart({
  data,
  categories,
  index = "x",
  className,
  yAxisWidth = 40,
  showLegend = true,
  valueFormatter = (value: number) => value.toString(),
  showYAxis = true,
  showXAxis = true,
  showGrid = true,
}: ChartProps) {
  const config = {};
  data.forEach((item) => {
    if (item.name) {
      config[item.name] = {
        label: item.name,
        color: item.color || getColorForIndex(data.indexOf(item)),
      };
    }
  });

  return (
    <ChartContainer className={cn("h-full w-full", className)} config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data[0]?.data || []}
          margin={{ top: 16, right: 16, bottom: 16, left: yAxisWidth }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          )}
          {showXAxis && (
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => String(value)}
              categories={categories}
            />
          )}
          {showYAxis && (
            <YAxis
              width={yAxisWidth}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => valueFormatter(value)}
            />
          )}
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value: number, name: string) => [
                  valueFormatter(value),
                  name,
                ]}
              />
            }
          />
          {showLegend && <Legend />}

          {data.map((item, index) => (
            <Line
              key={item.name || index}
              type="monotone"
              dataKey="y"
              name={item.name}
              stroke={item.color || getColorForIndex(index)}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
  className?: string;
  label?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export function DonutChart({
  data,
  className,
  label,
  labelClassName,
  valueClassName,
}: DonutChartProps) {
  const config = {};
  data.forEach((item) => {
    if (item.name) {
      config[item.name] = {
        label: item.name,
        color: item.color || getColorForIndex(data.indexOf(item)),
      };
    }
  });

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartContainer className={cn("h-full w-full", className)} config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || getColorForIndex(index)}
              />
            ))}
          </Pie>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value: number, name: string) => [
                  `${value} (${((value / total) * 100).toFixed(1)}%)`,
                  name,
                ]}
              />
            }
          />
          <Legend />
          {label && (
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className={cn("fill-foreground text-lg font-medium", labelClassName)}
            >
              {label}
            </text>
          )}
          {total && (
            <text
              x="50%"
              y="57%"
              textAnchor="middle"
              dominantBaseline="middle"
              className={cn("fill-muted-foreground text-sm", valueClassName)}
            >
              {total}
            </text>
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// Helper function to generate colors based on index
function getColorForIndex(index: number) {
  const colors = [
    "#ea384c", // Pinterest red
    "#9f1239", // Darker red
    "#f43f5e", // Rose
    "#ec4899", // Pink
    "#d946ef", // Fuchsia
    "#a855f7", // Purple
    "#8b5cf6", // Violet
    "#6366f1", // Indigo
    "#3b82f6", // Blue
    "#0ea5e9", // Sky
    "#22d3ee", // Cyan
    "#14b8a6", // Teal
  ];
  
  return colors[index % colors.length];
}

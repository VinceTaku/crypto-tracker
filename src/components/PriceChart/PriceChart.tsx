import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MarketChartData, Currency, TimeRange, ChartMetric } from '../../types/crypto';
import { formatPrice, formatMarketCap } from '../../utils/formatters';

// I register only the Chart.js modules we actually use to keep bundle size down
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface Props {
  chartData: MarketChartData;
  currency: Currency;
  days: TimeRange;
  metric: ChartMetric;
}

/**
 * I render the full interactive price/market cap/volume chart on the detail page.
 * We use Chart.js via react-chartjs-2 for its rich tooltip and animation support.
 */
const PriceChart: React.FC<Props> = ({ chartData, currency, days, metric }) => {
  const rawData = chartData[metric];

  if (!rawData?.length) {
    return <div className="chart-empty">No chart data available</div>;
  }

  // I format the X-axis labels differently depending on the time range
  const labels = rawData.map(([timestamp]) => {
    const date = new Date(timestamp);
    if (days === '1') {
      return date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
  });

  const values = rawData.map(([, value]) => value);
  const isPositive = values[values.length - 1] >= values[0];
  const lineColor = isPositive ? '#16a34a' : '#dc2626';

  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: lineColor,
        backgroundColor: lineColor + '18',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        titleColor: '#6b7280',
        bodyColor: '#111827',
        padding: 10,
        callbacks: {
          // I format tooltip values based on the active metric
          label: (ctx: any) => {
            if (metric === 'prices') return `Price: ${formatPrice(ctx.raw, currency)}`;
            return `Value: ${formatMarketCap(ctx.raw, currency)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: '#f3f4f6' },
        ticks: { color: '#9ca3af', maxTicksLimit: 8, font: { size: 11 } },
        border: { color: '#e5e7eb' },
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          callback: (v: any) =>
            metric === 'prices' ? formatPrice(v, currency) : formatMarketCap(v, currency),
        },
        border: { color: '#e5e7eb' },
      },
    },
    interaction: { mode: 'index' as const, intersect: false },
  };

  return (
    <div style={{ height: '320px', position: 'relative' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceChart;
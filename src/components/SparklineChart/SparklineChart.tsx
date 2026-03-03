import React, { useRef, useEffect, useMemo } from 'react';

interface Props {
  data: number[];
  positive: boolean;
}

/**
 * I render a lightweight 7-day sparkline using the raw Canvas API.
 * We avoid Chart.js here to keep the bundle lighter for the dashboard list
 * since we render one of these per coin row.
 */
const SparklineChart: React.FC<Props> = ({ data, positive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // I memoize the min/max calculation so we only recompute when data changes,
  // not on every parent re-render
  const { min, max } = useMemo(() => ({
    min: Math.min(...data),
    max: Math.max(...data),
  }), [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data?.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const range = max - min || 1;

    ctx.clearRect(0, 0, w, h);

    // I calculate pixel coordinates for each data point
    const points = data.map((value, i) => ({
      x: (i / (data.length - 1)) * w,
      y: h - ((value - min) / range) * h * 0.8 - h * 0.1,
    }));

    const color = positive ? '#16a34a' : '#dc2626';

    // I draw the fill area under the line for visual depth
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, color + '33');
    gradient.addColorStop(1, color + '00');

    ctx.beginPath();
    ctx.moveTo(points[0].x, h);
    points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // I draw the line on top of the fill
    ctx.beginPath();
    points.forEach((p, i) =>
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
    );
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [data, positive, min, max]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={48}
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-label="7-day price sparkline"
    />
  );
};

export default SparklineChart;
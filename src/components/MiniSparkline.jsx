export default function MiniSparkline({ data, color = '#006A4E', width = 80, height = 30 }) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} style={{display:'block',overflow:'visible'}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle
        cx={data.length > 0 ? width : 0}
        cy={height - ((data[data.length-1] - min) / range) * (height-4) - 2}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}

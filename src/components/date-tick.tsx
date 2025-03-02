export default function DateTick(props: any) {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={5} fill="#666">
        <tspan textAnchor="middle" x="0">
          {payload.value.toLocaleDateString()}
        </tspan>
        <tspan textAnchor="middle" x="0" dy="14">
          {payload.value.toLocaleTimeString()}
        </tspan>
      </text>
    </g>
  );
}

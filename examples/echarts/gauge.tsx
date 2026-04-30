import { GaugeChart, GaugeChartData, GaugeChartOption } from 'web-chart';

function GaugeExample() {
  const source: GaugeChartData = { name: '生产完成率', value: 74, total: 100 };
  const option: GaugeChartOption = {};

  return (
    <div>
      <h1>仪表盘</h1>
      <GaugeChart height={400} option={option} source={source} />
    </div>
  );
}
export default GaugeExample;

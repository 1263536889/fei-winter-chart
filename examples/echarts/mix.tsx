import { ChartSource, MixChart, MixChartOption } from 'web-chart';

type Data = { x: string; b1: number; b2: number; b3: number; l: number };

function MixExample() {
  const option: MixChartOption = {
    x: { name: '名称', formatter: '序列-{value}' },
    y: { name: '单位：%' },
    zoom: { show: true, startValue: 0, endValue: 10 },
    series: [
      { type: 'bar', name: '柱一', key: { x: 'x', y: 'b1' } },
      { type: 'bar', name: '柱二', key: { x: 'x', y: 'b2' } },
      { type: 'bar', name: '柱三', key: { x: 'x', y: 'b3' } },
      { type: 'line', name: '折线', key: { x: 'x', y: 'l' } },
    ],
  };

  const source: ChartSource<Data> = Array.from({ length: 100 }, (v, i) => ({
    x: `${i + 1}`,
    b1: Math.random() * 100,
    b2: Math.random() * 100,
    b3: Math.random() * 100,
    l: Math.random() * 100,
  }));

  return (
    <div>
      <h1>折柱混合图</h1>
      <MixChart height={400} option={option} source={source} />
    </div>
  );
}
export default MixExample;

import BarExample from './bar';
import GaugeExample from './gauge';
import LineExample from './line';
import MixExample from './mix';
import PieExample from './pie';
import RangeExample from './range';

function EChartsExample() {
  return (
    <div>
      <LineExample />
      <BarExample />
      <PieExample />
      <GaugeExample />

      <MixExample />
      <RangeExample />
    </div>
  );
}
export default EChartsExample;

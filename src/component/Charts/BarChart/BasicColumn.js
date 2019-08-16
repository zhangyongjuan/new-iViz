import React from 'react';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts';

class BasicColumn extends React.Component {
  render() {
    const { data = [], xAxis = '', yAxis = '' } = this.props.params;
    return (
      <div style={{ width: '100%' }}>
        <Chart height={400} data={data} forceFit>
          <Axis name={xAxis}/>
          <Axis name={yAxis}/>
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom type="interval" position={`${xAxis}*${yAxis}`}/>
        </Chart>
      </div>
    );
  }
}

export default BasicColumn;

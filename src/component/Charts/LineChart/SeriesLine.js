import React from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from 'bizcharts';


class SeriesLine extends React.Component {
  render() {
    const { data = [], name = '', xAxis = '', yAxis = '' } = this.props.params;
    return (
      <div>
        <Chart height={400} data={data}  forceFit>
          <Legend scroll={true} height={50}/>
          <Axis name={xAxis}/>
          <Axis
            name={yAxis}
            label={{
              formatter: val => `${val}`,
            }}
          />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom type="line" position={`${xAxis}*${yAxis}`} size={2} color={name}/>
          <Geom
            type="point"
            position={`${xAxis}*${yAxis}`}
            size={4}
            shape={'circle'}
            color={name}
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default SeriesLine;

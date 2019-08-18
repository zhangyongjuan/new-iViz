import React from 'react';
import { Spin } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from 'bizcharts';
import NoData from '../../NoData';


class SeriesLine extends React.Component {
  render() {
    const { data = [], name = '', xAxis = '', yAxis = '', loading } = this.props.params;
    return (
      <Spin spinning={loading}>
        <div>
          {
            data && data.length !== 0 || loading ? (
              <Chart height={400} data={data} forceFit>
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
            ) : <NoData height={400}/>
          }

        </div>
      </Spin>
    );
  }
}

export default SeriesLine;

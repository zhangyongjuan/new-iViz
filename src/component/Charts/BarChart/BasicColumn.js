import React from 'react';
import { Spin } from 'antd';
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
import NoData from '../../NoData';

class BasicColumn extends React.Component {
  render() {
    const { data = [], xAxis = '', yAxis = '', loading } = this.props.params;
    return (
      <div style={{ width: '100%' }}>
        <Spin spinning={loading}>
          {
            data && data.length !== 0 || loading ? (
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
            ) : <NoData height={400}/>
          }
        </Spin>
      </div>
    );
  }
}

export default BasicColumn;

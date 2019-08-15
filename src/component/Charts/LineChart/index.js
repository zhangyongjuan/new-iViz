import React from 'react';
import {Spin} from 'antd';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import styles from './index.less';

class BasicLineChart extends React.Component {
  render() {
    const { params } = this.props;
    const { data, xAxis, yAxis,loading } = params;
    const cols = {
      [yAxis]: {
        min: 0,
      },
      [xAxis]: {
        range: [0, 1],
      },
    };
    return (
      <Spin spinning={loading}>
        <div className={styles.main}>
          <div className={styles.chartTitle}>Pre Inster Molding Input</div>
          <Chart height={400} data={data || []} scale={cols} forceFit>
            <Axis name={xAxis}/>
            <Axis name={yAxis}/>
            <Tooltip
              crosshairs={{
                type: 'y',
              }}
            />
            <Geom type="line" position={`${xAxis}*${yAxis}`} size={2}/>
            <Geom
              type="point"
              position={`${xAxis}*${yAxis}`}
              size={4}
              shape={'circle'}
              style={{
                stroke: '#fff',
                lineWidth: 1,
              }}
            />
          </Chart>
        </div>
      </Spin>
    );
  }
}

export default BasicLineChart;

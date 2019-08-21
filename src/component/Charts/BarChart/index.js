import React from 'react';
import { Spin } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label
} from 'bizcharts';
import _ from 'lodash';
import DataSet from '@antv/data-set';
import NoData from '../../NoData';
import styles from './index.less';

class BasicBarChart extends React.Component {
  handleClick = ({ data }) => {
    console.log(data);
  };

  transData = (data) => {
    return _.map(data, (k) => ({
      spc: k.spc,
      yield: 1 - k.yield,
    }));
  };

  render() {
    const { params } = this.props;
    const { data: Data = [], xAxis, yAxis, clickBar, loading } = params;
    const data = this.transData(Data);
    const ds = new DataSet();
    const dv = ds.createView().source(_.reverse(data));
    dv.source(data).transform({
      type: 'sort',

      callback(a, b) {
        // 排序依据，和原生js的排序callback一致
        return Number(a[yAxis]) - Number(b[yAxis]) > 0;
      },
    });
    const cols = {
      [yAxis]: {
        // min: 0,
        formatter: val => {
          val = (val * 100).toFixed(2) + '%';
          return val;
        },
      },
      // [xAxis]: {
      //   range: [0, 1],
      // },
    };
    return (
      <Spin spinning={loading}>
        {data && data.length !== 0 || loading ? (
          <div className={styles.main}>
            <Chart padding={['auto', '80', 'auto', 'auto']} scale={cols} style={{ minHeight: 400 }} height={400}
                   data={dv} forceFit onPlotClick={clickBar}>
              <Coord transpose/>
              <Axis
                name={xAxis}
                label={{
                  offset: 12,
                }}
              />
              <Axis name={yAxis}/>
              <Tooltip
                itemTpl= '<li data-index={index}><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>Failure Rate: {value}</li>'
              />
              <Geom
                color="#F5BD27" type="interval" position={`${xAxis}*${yAxis}`}>
                <Label content={yAxis}/>
              </Geom>
            </Chart>
          </div>
        ) : <NoData height={400}/>
        }
      </Spin>
    );
  }
}

export default BasicBarChart;

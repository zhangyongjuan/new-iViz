import React from 'react';
import {Spin} from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
} from 'bizcharts';
import DataSet from '@antv/data-set';

class BasicBarChart extends React.Component {
  handleClick = ({data}) => {
    console.log(data);
  };

  render() {
    const { params } = this.props;
    const { data, xAxis, yAxis,clickBar,loading } = params;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.source(data).transform({
      type: 'sort',

      callback(a, b) {
        // 排序依据，和原生js的排序callback一致
        return Number(a[yAxis]) - Number(b[yAxis]) > 0;
      },
    });
    return (
      <Spin spinning={loading}>
        <Chart height={400} data={dv} forceFit onPlotClick={clickBar}>
          <Coord transpose/>
          <Axis
            name={xAxis}
            label={{
              offset: 12,
            }}
          />
          <Axis name={yAxis}/>
          <Tooltip/>
          <Geom
            select={[true, {
              mode: 'single' , // 选中模式，单选、多选
              style: {color:'#000'}, // 选中后 shape 的样式
            }]}
            color="#F5BD27" type="interval" position={`${xAxis}*${yAxis}`}/>
        </Chart>
      </Spin>
    );
  }
}

export default BasicBarChart;

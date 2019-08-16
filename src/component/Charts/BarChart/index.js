import React from 'react';
import { Spin } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
} from 'bizcharts';
import DataSet from '@antv/data-set';
import NoData from '../../NoData';

class BasicBarChart extends React.Component {
  handleClick = ({ data }) => {
    console.log(data);
  };

  render() {
    const { params } = this.props;
    const { data, xAxis, yAxis, clickBar, loading } = params;
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
        {data && data.length !== 0 || loading ? (
         <div style={{height:400,overflow:'scroll',overflowX:'hidden'}}>
           <Chart style={{minHeight:400}} height={40*data.length} data={dv} forceFit onPlotClick={clickBar}>
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
               color="#F5BD27" type="interval" position={`${xAxis}*${yAxis}`}/>
           </Chart>
         </div>
        ) : <NoData height={400}/>
        }
      </Spin>
    );
  }
}

export default BasicBarChart;

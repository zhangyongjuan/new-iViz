// import React from 'react';
// import { Spin } from 'antd';
// import {
//   G2,
//   Chart,
//   Geom,
//   Axis,
//   Tooltip,
//   Coord,
//   Label,
//   Legend,
//   View,
//   Guide,
//   Shape,
//   Facet,
//   Util,
// } from 'bizcharts';
// import NoData from '../../NoData';
//
// class BasicColumn extends React.Component {
//   render() {
//     const { data = [], xAxis = '', yAxis = '', loading } = this.props.params;
//     return (
//       <div style={{ width: '100%' }}>
//         <Spin spinning={loading}>
//           {
//             data && data.length !== 0 || loading ? (
//               <Chart height={400} data={data} forceFit>
//                 <Axis name={xAxis}/>
//                 <Axis name={yAxis} label={{
//                   formatter:(text, item, index)=> {
//                     return `${Number(text)*100}%`
//                   }
//                 }}/>
//                 <Tooltip
//                   crosshairs={{
//                     type: 'y',
//                   }}
//                   // itemTpl= '<li data-index={index}><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>{name}: {Number(value)*100}%</li>'
//                 />
//                 <Geom  tooltip={[`${xAxis}*${yAxis}`, (month, tem) => {
//                   console.log(month.tem)
//                   return  {
//                     [month]: tem*100 + "%" , // 在这里格式化。
//                   }
//                 }]} type="interval" position={`${xAxis}*${yAxis}`}/>
//               </Chart>
//             ) : <NoData height={400}/>
//           }
//         </Spin>
//       </div>
//     );
//   }
// }
//
// export default BasicColumn;

import React from 'react';
import { Spin } from 'antd';

// 导入echarts
import echarts from 'echarts/lib/echarts';
import _ from 'lodash';
import NoData from '../../NoData';

require('echarts/lib/chart/bar');
import('echarts/lib/component/title');
import('echarts/lib/component/tooltip');
import('echarts/lib/component/legend');

export class SeriesLine extends React.Component {
  constructor(props) {
    super(props);
    // this.PieRef = React.createRef();
  }

  componentDidMount() {
    this.initPie();
  }

  componentDidUpdate() {
    this.initPie();
  }

  initPie = () => {
    // 外部传入的data数据
    const { data } = this.props.params;
    // 初始化echarts
    const myChart = echarts.init(this.PieRef);

    // 我们要定义一个setPieOption函数将data传入option里面
    const options = this.setPieOption(this.transSeries(data));
    // 设置options
    myChart.setOption(options);

    window.addEventListener('resize', () => {
      myChart.resize();
    });

  };


  // 一个基本的echarts图表配置函数
  setPieOption = (data) => ({
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: (params) => {
        console.log(params);
        let content = '';
        _.forEach(params, (k) => {
          content = content + `<div><span style="display:inline-block;border-radius:10px;width:10px;height:10px;background-color:${k.color};"></span><span style="margin-left: 5px;display: inline-block">${k.name}：${(k.value*100).toFixed(2)}%</span></div>`;
        });
        return content;
      },
    },
    dataZoom: [{
      type:'inside',
      start: 1,
      end: 16
    },{
      type: 'slider',
      show: true,
      xAxisIndex: 0,
      start: 1,
      end: 16
    }],
    // grid: {
    //   left: '3%',
    //   right: '4%',
    //   bottom: '3%',
    //   containLabel: true,
    // },
    xAxis: [
      {
        type: 'category',
        data: data.xAxis,
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name:'Yield/%',
        axisLabel: {
          formatter: function(v) {
            return `${v * 100}%`;
          },
        },
        scale: true,
        max:1
      },
    ],
    series: [
      {
        type: 'bar',
        barWidth: '60%',
        data: data.seriesData,
        label: {
          normal: {
            show: true,
            position: 'top',
            color:'#000',
            formatter:(x)=>`${(Number(x.value)*100).toFixed(2)}%`
          }
        },
      },
    ],
  });

  transSeries = (data) => {
    const newSeries = {
      xAxis: [],
      seriesData: [],
    };
    _.forEach(data, (k) => {
      newSeries.xAxis.push(k.time);
      newSeries.seriesData.push(k.value);
    });
    return newSeries;
  };

  render() {
    const { loading } = this.props.params;
    return (
      <Spin spinning={loading}>
        <div ref={ips=>this.PieRef=ips} style={{ width: '100%', height: '500px' }}/>
      </Spin>
    );
  }
}

export default SeriesLine;

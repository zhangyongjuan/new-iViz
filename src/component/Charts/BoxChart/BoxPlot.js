import React from 'react';

// 导入echarts
import echarts from 'echarts/lib/echarts';
import { prepareBoxplotData } from 'echarts/extension/dataTool';
import _ from 'lodash';
import styles from "../HeatMapChart/index.less";
import {Spin} from "antd";

require('echarts/lib/chart/boxplot');

import('echarts/lib/component/title');
import('echarts/lib/component/tooltip');
import('echarts/lib/component/legend');

export default class BoxPlot extends React.Component {
  constructor(props) {
    super(props);
    // this.PieRef = React.createRef();
  }

  componentDidMount() {
    this.initPie();
    this.handleClick();
  }

  componentDidUpdate() {
    this.initPie();
    this.handleClick();
  }
  shouldComponentUpdate(nextProps) {
    if(JSON.stringify(nextProps) === JSON.stringify(this.props)) {
      return false
    }else {
      return true
    }
  }

  handleClick(){
    const { clickBoxPlot } = this.props.params;
    const myChart = echarts.init(this.PieRef);
    if(clickBoxPlot){
      //防止多次点击事件
      if(myChart._$handlers.click){
        myChart._$handlers.click.length = 0;
      }
      myChart.on('click', (e)=> {
        clickBoxPlot(e);
      })
    }
  }

  initPie = () => {
    // 外部传入的data数据
    const { data } = this.props.params;
    // 初始化echarts
    const myChart = echarts.init(this.PieRef);

    // 我们要定义一个setPieOption函数将data传入option里面
    const options = this.setPieOption(this.transformData(data));
    // 设置options
    myChart.setOption(options);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  transformData = (data) => {
    const newData = {
      axisData: [],
      boxData: [],
      outliers: [],
      up_limit: [],
      low_limit: [],
    };
    if (data && data.length !== 0) {
      data.forEach((k, i) => {
        newData.axisData.push(k.name);
        newData.low_limit = k.low_limit;
        newData.up_limit = k.up_limit;
        newData.boxData.push([k.low, k.q1, k.q2, k.q3, k.upper]);
        if (k.errData && k.errData.length !== 0) {
          _.forEach(k.errData, (value) => {
            newData.outliers.push([i, value]);
          });
        }
      });
      return newData;
    }
    return newData;
  };

  // 一个基本的echarts图表配置函数
  setPieOption = data => ({
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '10%',
      right: '5%',
      bottom: '10%',
    },
    xAxis: {
      type: 'category',
      data: data.axisData,
      boundaryGap: true,
      nameGap: 30,
      splitArea: {
        show: false,
      },
      axisLabel: {
        formatter: '{value}',
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      // name: 'km/s minus 299,000',
      splitArea: {
        show: true,
      },
      scale: true,
      min:function (value) {   //value是包含min和max的对象，分别表示数据的最大最小值，这个函数应该返回坐标轴的最小值
        return value.min < data.low_limit ? value.min : data.low_limit;
      },
      max:function (value) {
        return value.max > data.up_limit ? value.max : data.up_limit;
      }
    },
    series: [
      {
        name: 'boxplot',
        type: 'boxplot',
        data: data.boxData,
        tooltip: {
          formatter: function(param) {
            return [
              'name：' + param.name,
              'upper: ' + param.data[5].toFixed(2),
              'Q3: ' + param.data[4].toFixed(2),
              'median: ' + param.data[3].toFixed(2),
              'Q1: ' + param.data[2].toFixed(2),
              'lower: ' + param.data[1].toFixed(2),
            ].join('<br/>');
          },
        },
        markLine: {
          data: [
            {
              name: 'low_limit',
              yAxis: data.low_limit,
            },
            {
              name: 'up_limit',
              yAxis: data.up_limit,
            },
          ],
        },
        // itemStyle:{
        //   opacity:(x)=>{
        //     console.log(x)
        //   }
        // }
      },
      {
        name: 'outlier',
        type: 'scatter',
        data: data.outliers,
      },
    ],
  });

  render() {
    const { loading, title } = this.props.params;
    // return <div ref={this.PieRef} style={{ width: '100%', height: '500px' }}/>;
    return (
      <Spin spinning={loading}>
        <div className={styles.main}>
          <div className={styles.chartTitle}>{title || ''}</div>
          <div ref={(input) => {
            this.PieRef = input;
          }} style={{ width: '100%', height: '500px' }}/>
        </div>

      </Spin>
    )
  }
}

import React from 'react';
import { Spin } from 'antd';
// 导入echarts
import echarts from 'echarts/lib/echarts';
// import { prepareBoxplotData } from 'echarts/extension/dataTool';
import _ from 'lodash';
import styles from './index.less';

require('echarts/lib/chart/heatmap');

import('echarts/lib/component/title');
import('echarts/lib/component/tooltip');
import('echarts/lib/component/legend');

export default class HeatMapChart extends React.Component {
  constructor(props) {
    super(props);
    // this.PieRef = React.createRef();
    this.state={
      xAxis: [],
      yAxis: [],
      //  隐藏的x和y轴，用于颜色展示.默认值为空
      xHideAxis: [],
      yHideAxis: [],
    }
  }

  componentDidMount() {
    this.initPie();
    this.handleClick();
  }

  componentDidUpdate() {
    this.setState({xHideAxis: [], yHideAxis: []},this.initPie);
    // this.initPie();
  }
  shouldComponentUpdate(nextProps) {
    if(JSON.stringify(nextProps) === JSON.stringify(this.props)) {
      return false
    }else {
      return true
    }
  }

  handleClick = () => {
    // this.setState({xHideAxis: [], yHideAxis: []});
    //设置X，Y，value区间是否可点击
    const { clickHeatMap ,triggerEventX,triggerEventY,triggerEventSeries} = this.props.params;
    const myChart = echarts.init(this.PieRef);
    if(clickHeatMap){
      //防止多次点击事件
      if(myChart._$handlers.click){
        myChart._$handlers.click.length = 0;
      }
      myChart.on('click', (e)=> {
       if(triggerEventX !==true && triggerEventY !==true && triggerEventSeries !==true){
         return false;
       }else {
         const flag = this.changeHeatMapStyle(e);
         if(flag !== false){
           clickHeatMap(e);
         }

        }
      });
    }
  };
  // 点击热力图后，需要更改x，y轴的背景颜色
  changeHeatMapStyle = (e)=>{
    const { triggerEventX,triggerEventY,triggerEventSeries} = this.props.params;
    const xHightLight= this.state.xAxis.map((v,i)=>{return ''});
    const yHightLight = this.state.yAxis.map((v,i)=>{return ''});
    if(triggerEventX === true && e.componentType === 'xAxis'){        // X轴设置可点击，且点击的是X轴
      //1.改变背景颜色
      for (var i = 0; i < xHightLight.length; i++) {        //对应的x轴背景变色
        if (e.value === this.state.xAxis[i]) {
          xHightLight[i] = e.value;
        } else {
          xHightLight[i] = '';
        }
      }
      //y轴若有选中状态，则取消，变为全未选中状态
      for (var o = 0; o < yHightLight.length; o++) {
        yHightLight[o] = '';
      }
    }
    else if(triggerEventY === true && e.componentType === 'yAxis'){    // X轴设置可点击，且点击的是X轴
      for (var j = 0; j < yHightLight.length; j++) {    //y轴对应字段背景变色
        if (e.value === this.state.yAxis[j]) {
          yHightLight[j] = e.value;
        } else {
          yHightLight[j] = '';
        }
      }
      //x轴若有选中状态，则取消，变为全未选中状态
      for (var k = 0; k < xHightLight.length; k++) {
        xHightLight[k] = '';
      }
    }
    else if(triggerEventSeries === true && e.componentType === 'series'){       // 值设置可点击，且点击的是value
      for (var m = 0; m < xHightLight.length; m++) {            // 对应的x轴背景变红色
        if (e.name === this.state.xAxis[m]) {
          xHightLight[m] = e.name;
        } else {
          xHightLight[m] = '';
        }
      }
      for (var n = 0; n < yHightLight.length; n++) {        // 对应的y轴背景变红色
        if (e.value[1] === n) {
          yHightLight[n] = this.state.yAxis[n];
        } else {
          yHightLight[n] = '';
        }
      }
    }
    else{
      return false;
    }
    this.setState({xHideAxis:xHightLight,yHideAxis:yHightLight},this.initPie);
  }

  initPie = () => {
    // 外部传入的data数据
    const { data,triggerEventX, triggerEventY,triggerEventSeries} = this.props.params;
    // 初始化echarts
    const myChart = echarts.init(this.PieRef);

    // 我们要定义一个setPieOption函数将data传入option里面
    const options = this.setPieOption(this.transformData(data,triggerEventX, triggerEventY,triggerEventSeries));
    // 设置options
    myChart.setOption(options);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  transformData = (data,triggerEventX, triggerEventY,triggerEventSeries) => {
    //热力图的数据结构为[0,0,5],即[x轴坐标，y轴坐标，值]的格式，且从左下角[0,0]开始画图
    const newData = {
      //是否可以点击
      triggerEventX:triggerEventX,
      triggerEventY:triggerEventY,
      triggerEventSeries:triggerEventSeries,
      seriesData:[],
      // tooltipContent:[],
      sumYield:[],
      xAxis: [],
      yAxis: [],
    };

    //  1、整理热力图x坐标
    newData.xAxis = data.columnsName;
    // 2、整理y轴坐标,行总不良率，画图数值，tooltip显示内容
    _.forEach(data.rowList,(dataset,index)=> {
      //1.y轴名称,行总不良率
      newData.yAxis.push(dataset.rowName);
      newData.sumYield.push(dataset.sumValue);
    //  2.toolTip显示的内容  数值/总数
      _.forEach(dataset.columns,(d,i)=>{
        if(d.defect !== null){
          const oneNumber = {};
          const defectyield = (d.defect*100).toFixed(2);
          oneNumber.tooltipContent=`${d.ng} / ${d.all}`;   //toolTip显示的内容
          oneNumber.value = [i,index,defectyield];
          // 因为点击series时，得不到对应的Y轴名称，因此需要把对应的Y轴名称加上
          oneNumber.yAxisName = dataset.rowName;
          newData.seriesData.push(oneNumber);
        }

      })
    });
    this.setState({xAxis: newData.xAxis, yAxis: newData.yAxis});
    return newData;
  };

  // 一个基本的echarts图表配置函数
  setPieOption = data => ({
    tooltip: {
      position: function (pos, params, dom, rect, size) {
        return [ pos[0]+10,pos[1]+10];
      },
      backgroundColor:'#fff',
      textStyle:{
        color:'#000',
        fontSize:'12px'
      },
      formatter:function (params) {
        // console.log(params);
        // return `toolTip`
        return params.data.tooltipContent
      }
    },
    grid: {
      left: '17%',
      right: '5%',
      bottom: '10%',
      // containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        // name:'value/%',
        data: data.xAxis,
        axisTick:{
          interval:0
        },
        splitArea: {
          show: true
        },
        position:'top',
        triggerEvent:data.triggerEventX,
        axisLabel:{
          interval:0,
          rich:{},
          // width:40,
          // height:10,
          padding:10,
          // backgroundColor:'red',
        },
      },
      {
        //不能点击的话不显示折叠的x轴
        show:data.triggerEventSeries !== true ? data.triggerEventX : data.triggerEventSeries,
        type: 'category',
        data: this.state.xHideAxis,
        axisTick:{
          // show:false,
          interval:0
        },
        splitArea: {
          show: true
        },

        position:'top',
        triggerEvent:data.triggerEventX,
        axisLabel:{
          interval:0,
          rich:{},
          width:80,
          // // height:10,
          padding:10,
          backgroundColor:'red',
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        data: data.yAxis,
        // axisTick:{
        //   interval:0
        // },
        splitArea: {
          show: true,
        },
        axisLabel:{
          padding:10,
          interval:0,
          rich:{},
          height:10,
          backgroundColor:'white',
          lineHeight:10,
          formatter: function(value,index){
            return(
              `${value}    ${(data.sumYield[index]*100).toFixed(2)+'%'}`
            )
          }
        },
        triggerEvent:data.triggerEventY,
      },
      {
        //不能点击的话不显示折叠的y轴
        show:data.triggerEventSeries !== true ? data.triggerEventY : data.triggerEventSeries,
        type: 'category',
        data: this.state.yHideAxis,
        axisTick:{
          interval:0
        },
        splitArea: {
          show: true
        },
        position:'left',
        axisLabel:{
          padding:10,
          interval:0,
          rich:{},
          height:10,
          // width:100,
          lineHeight:10,
          backgroundColor:'red',
          showMinLabel:true,
          formatter: function (value,index) {
            return(
              value !== ''? `${value}    ${(data.sumYield[index]*100).toFixed(2)+'%'}`:``
            )
          }
        },
        triggerEvent:data.triggerEventY,
      }
    ],
    visualMap: {
      // min: 0,
      // max: 100,
      splitNumber: 4,
      color: ['#d94e5d','#eac736','#50a3ba'],
      orient: 'horizontal',
      align:'left',
      left: 'center',
      bottom: '0%',
      textStyle: {
        color: '#000',
      },
      pieces: [
        {min: 0,max:0,color: 'green'}, // 不指定 max，表示 max 为无限大（Infinity）。
        {min: 0, max: 1,color: 'yellow'},
        {min: 1, color: 'red'},
      ]
    },
    series: [{
      type: 'heatmap',
      data: data.seriesData,
      label: {
        normal: {
          show: true,
          color:'#000',
          formatter:v=>`${v.value[2]}%`
        },
      },
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
    }]
  });

  render() {
    const { loading, title } = this.props.params;
    return (
      <Spin spinning={loading}>
        <div className={styles.main}>
          <div className={styles.chartTitle}>{title || ''}</div>
          <div ref={(input) => {
            this.PieRef = input;
          }} style={{ width: '100%', height: '500px' }}/>
        </div>

      </Spin>
    );
  }
}

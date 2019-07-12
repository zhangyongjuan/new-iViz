import React,{ Component } from 'react';
import {Button} from 'antd/lib/index';
import echarts from 'echarts';
import NewHeader from './Condition'
import styles from './index.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
import reqwest from "reqwest";
import '../global'
import {connect} from "react-redux";
moment.locale('zh-cn');

@connect(({global}) => ({
  global
}))
class DrawChart extends Component{
  state = {
    select:[],
    submitFlag:false,
    selectD:{},
    drawchartRequest:{},
    lineChart:{},
    reactChart:{},
    hexuChart:{},
    hexuLimitmin:'',
    hexuLimitmax:'',
    type:'',
    themcolor:[ '#c377a9', '#90006d','#9ad1ba','#ddd900', '#ebd5ef', '#fef88a', '#ab88b9', '#ef7d6b', '#c377a9', '#f6b498', '#ddd900', '#9e9b00', '#c37dac', '#00804c', '#5ebf79', '#9ed2bc', '#67c080', '#ffefb2', '#fec78a', '#f9ffa2'],
    timeRange:{},
  }
  newChart =()=>{
    document.getElementById('rectchart').style.height='400px';
    document.getElementById('linechart').style.height='400px';
    document.getElementById('hexuchart').style.height='400px';
    const lineChart = echarts.init(document.getElementById('linechart'));
    lineChart.clear();
    const rectChart = echarts.init(document.getElementById('rectchart'));
    rectChart.clear();
    const hexuChart = echarts.init(document.getElementById('hexuchart'));
    hexuChart.clear();
    if(this.state.type === '2'){
      document.getElementById('hexuchart').style.height='0px';
      if(JSON.stringify(this.state.lineChart) !== '{}'){
        // console.log('linechart----',this.state.lineChart);
        const lineoption = {
          legend:{
            bottom: 'bottom',
            data:this.state.lineChart.legend.data
          },
          color:this.state.themcolor,
          title: [{
            left: 'center',
            text: this.state.lineChart.title.text
          }],
          tooltip: {
            trigger: 'axis'
          },
          xAxis: this.state.lineChart.xAxis,
          yAxis: [{
            type: 'value',
            splitLine: {show: true}
          }],
          // toolbox: {
          //   show: true,
          //   orient: 'vertical',
          //   left: 'right',
          //   top: 'center',
          //   feature: {
          //     mark: {show: true},
          //     dataView: {show: true, readOnly: false},
          //     magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          //     restore: {show: true},
          //     saveAsImage: {show: true}
          //   }
          // },
          grid: [{
            top:'10%',
            bottom: '25%'
          }],
          series: this.state.lineChart.series
        };
        lineChart.setOption(lineoption);
      }
      if(JSON.stringify(this.state.reactChart) !== '{}'){
        const rectoption = {
          color: '#666',
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            // left: '3%',
            // right: '4%',
            bottom: '20%',
            // containLabel: true
          },
          title: [{
            left: 'center',
            text: this.state.reactChart.title.text
          }],
          xAxis : [
            {
              type : 'category',
              data : this.state.reactChart.xAxis.data,
              axisTick: {
                alignWithLabel: true,
                interval:0
              },
              axisLabel:{
                rich:{},
                interval: 0,
                // rotate:-10,
                align:'center',
                margin:20,
              }
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 0,
              end: 100,
            },
            {
              type: 'inside',
              realtime: true,
              start: 0,
              end: 100,
            }
          ],
          series : this.state.reactChart.series,
          label: {
            show: true,
            position: 'insideTop'
          },
        };
        rectChart.setOption(rectoption);
      }
    }else{
      document.getElementById('linechart').style.height='0px';
      document.getElementById('rectchart').style.height='0px';
      if(JSON.stringify(this.state.hexuChart) !== '{}'){
        // let hexudata = dataTool.prepareBoxplotData(this.state.hexuChart.data);
        let hexudata = this.state.hexuChart;
        hexudata.count=[];
        hexudata.count.push(['0','100'])
        let limit_min = hexudata.low_limit;
        let limit_max = hexudata.up_limit;
        const hexuoption = {
          title: [
            {
              text: hexudata.title.text,
              left: 'center',
            },
            // {
            //   text: 'IQR:Q3 - Q1 \nupper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
            //   borderColor: '#999',
            //   borderWidth: 1,
            //   textStyle: {
            //     fontSize: 14
            //   },
            //   left: '10%',
            //   top: '85%'
            // }
          ],

          itemStyle:{
            borderColor:'#333',
            color:'#333'
          },
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '20%'
          },
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 0,
              end: 100,

            },
            {
              type: 'inside',
              realtime: true,
              start: 0,
              end: 100,

            }
          ],
          xAxis: {
            type: 'category',
            // show:false,
            data: hexudata.xAxis.data,
            boundaryGap: true,
            nameGap: 30,
            splitArea: {
              show: false
            },
            axisLabel: {
              formatter: '{value}',
              interval: 0,
              // rotate:-90,
              align:'center',
            },
            axisLine:{
              show:false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              alignWithLabel: true,
              interval:0
            },
          },
          yAxis: {
            type: 'value',
            name: hexudata.yAxis.name,
            // splitArea: {
            //   show: true
            // },
            splitLine:{
              show:false,
            },
            scale:true,              //当设置min和max后，自适应设置无效
            min:function (value) {   //value是包含min和max的对象，分别表示数据的最大最小值，这个函数应该返回坐标轴的最小值
              return value.min < limit_min ? value.min : limit_min;
            },
            max:function (value) {
              return value.max > limit_max ? value.max : limit_max;
            }
          },
          series: [
            {
              name: 'boxplot',
              type: 'boxplot',
              data: hexudata.series[0].data,
              tooltip: {
                formatter: function (param) {
                  // console.log('盒须图param===========',param)
                  return [
                    'Experiment ' + param.name + ': ',
                    'upper: ' + param.data[5],
                    'Q3: ' + param.data[4],
                    'median: ' + param.data[3],
                    'Q1: ' + param.data[2],
                    'lower: ' + param.data[1],
                    'errorCount: '+hexudata.series[0].errNum[param.dataIndex],
                    'totalCount: '+hexudata.series[0].total[param.dataIndex],
                    // 'count:' + hexudata.count[0][1]
                  ].join('<br/>');
                }
              },
              markLine : {
                data:[
                  {
                    name: '最小值',
                    yAxis: hexudata.low_limit
                  },
                  {
                    name: '最大值',
                    yAxis: hexudata.up_limit
                  },
                ],
                lineStyle:{
                  type:'dashed',
                  width:2,
                  color:'#333',
                }
              }
            },
            {
              name: 'outlier',
              type: 'scatter',
              data: hexudata.series[1].data
            },
          ]
        };
        hexuChart.setOption(hexuoption);
      }
    }
  }
  submit=()=>{
    // console.log('可以提交选项信息了！',this.state.drawchartRequest);            //拿到数据啦，可以和后台交互啦，赶紧去获取chart数据吧
    // console.log('时间及6个条件',this.props.global.topSelectItem,this.props.global.dateTime);
    let now = {};
    now.timeRange= this.props.global.dateTime;
    let selectData = Object.assign({},{mapping:this.props.global.topSelectItem},now,this.state.drawchartRequest);
    console.log('selectData',selectData)
    const container = {};
    container.data = JSON.stringify(selectData);
    reqwest({
      url:`http://${global.constants.ip}:${global.constants.port}/condition/goChart`,
      method:'get',
      type:'json',
      data:container
    })
      .then(data=>{
        // console.log('图表数据---',data);
        // react data
        if(data.blockChart !== null && data.blockChart !== undefined){
          data.blockChart.series[0].data = data.blockChart.series[0].data.map((num,i)=>{
            return parseFloat(num).toFixed(2);
          })
          this.setState({reactChart:data.blockChart})
        }else{
          this.setState({reactChart:{}})
        }
        if(data.lineChart !== null && data.lineChart !== undefined){
          this.setState({lineChart:data.lineChart})
        }else{
          this.setState({lineChart:{}})
        }
        if(data.boxChart !== null && data.boxChart !== undefined){
          this.setState({hexuChart:data.boxChart,hexuLimitmin:data.boxChart.low_limit,hexuLimitmax:data.boxChart.up_limit})
        }else{
          this.setState({hexuChart:{}})
        }
        this.newChart();

      })
  }
  updateDrawChart(data){
    if (data.condition1.length === 0 ){
      this.setState({drawchartRequest:data})
      return;
    }
    if(data.condition1[0] === "Distribution"){     //选择的是Distribution，只展示盒须图，否则只展示柱状图和线图
      this.setState({drawchartRequest:data,type:'1'})
    }else{
      this.setState({drawchartRequest:data,type:'2'})
    }
  }

  render(){
    // console.log("父组件拿到的画图的参数---",this.state.drawchartRequest)
    return (
      <div className={styles.normal}>
        <div className='rightcontent' style={{width:'100%',float:'right'}}>
          {/*目录栏*/}
          <div className={styles.header}>
            {/*<Header pfn = {(flag,selectData)=>this.fn(flag,selectData)} ></Header>*/}
            <NewHeader fun={this.updateDrawChart.bind(this)} />
            <Button style={{background:'#1890ff',color:'#fff',marginTop:'10px'}} disabled={this.state.submitFlag} onClick={this.submit}>OK</Button>
          </div>
          {/*  chart */}
          <div className='drawChart'>
            <div id='rectchart' style={{width:'100%',height:'100px',marginTop:'100px'}}></div>
            <div id='linechart' style={{width:'100%',height:'100px'}}></div>
            <div id='hexuchart' style={{width:'100%',height:'100px'}}></div>
            {/*<div id='table2'>*/}
            {/*  <table style={{width:'100%'}}>*/}
            {/*    <thead>*/}
            {/*    <tr>*/}
            {/*      <th></th>*/}
            {/*    </tr>*/}
            {/*    </thead>*/}
            {/*  </table>*/}
            {/*</div>*/}
          </div>
        </div>


      </div>
    );
  }
}

export default DrawChart;

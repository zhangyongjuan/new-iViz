import React,{ Component } from 'react';
import {Button,DatePicker} from 'antd/lib/index';
import echarts from 'echarts';
import NewHeader from './Condition'
import styles from './index.css';
import dataTool from 'echarts/dist/extension/dataTool'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import reqwest from "reqwest";
import '../global'
moment.locale('zh-cn');

const {RangePicker} = DatePicker;

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
    vendor:'',
    productcode:''
  }
  componentDidMount() {}
  newChart =()=>{
    document.getElementById('linechart').style.height='400px';
    document.getElementById('rectchart').style.height='400px';
    document.getElementById('hexuchart').style.height='400px';
    const lineChart = echarts.init(document.getElementById('linechart'))
    lineChart.clear();
    const rectChart = echarts.init(document.getElementById('rectchart'));
    rectChart.clear();
    const hexuChart = echarts.init(document.getElementById('hexuchart'));
    hexuChart.clear();
    if(this.state.type === '2'){
      document.getElementById('hexuchart').style.height='0px';
      if(JSON.stringify(this.state.lineChart) !== '{}'){
        const lineoption = {
          // Make gradient line here
          // visualMap: [{
          //   show: false,
          //   type: 'continuous',
          //   min: 0,
          //   max: 0
          // }],
          legend:{
            bottom: 'bottom',
          },
          color:this.state.themcolor,
          title: [{
            left: 'center',
            text: this.state.lineChart.title.text
          }],
          tooltip: {
            trigger: 'axis'
          },
          xAxis: [{
            type: 'category',
            // boundaryGap: false,
            data: this.state.lineChart.xAxis.data,
            // axisLabel:{
            //   align:'left',
            // }
          }],
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
            bottom: '15%'
          }],
          series: this.state.lineChart.series
        };
        lineChart.setOption(lineoption);
      }
      if(JSON.stringify(this.state.reactChart) !== '{}'){
        console.log('blockchart----',this.state.reactChart)
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
        let hexudata = dataTool.prepareBoxplotData(this.state.hexuChart.data);
        hexudata.count=[];
        hexudata.count.push(['0','100'])
        console.log('计算后的盒须图数据',hexudata)
        let limit_min = this.state.hexuLimitmin;
        let limit_max = this.state.hexuLimitmax;
        const hexuoption = {
          title: [
            {
              text: this.state.hexuChart.title.text,
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
            data: this.state.hexuChart.xAxis.data,
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
            name: ' ',
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
              data: hexudata.boxData,
              tooltip: {
                formatter: function (param) {
                  // console.log('盒须图hexudata.boxData===========',hexudata.boxData)
                  return [
                    'Experiment ' + param.name + ': ',
                    'upper: ' + param.data[5],
                    'Q3: ' + param.data[4],
                    'median: ' + param.data[3],
                    'Q1: ' + param.data[2],
                    'lower: ' + param.data[1],
                    // 'count:' + hexudata.count[0][1]
                  ].join('<br/>');
                }
              },
              markLine : {
                data:[
                  {
                    name: '最小值',
                    yAxis: this.state.hexuChart.low_limit
                  },
                  {
                    name: '最大值',
                    yAxis: this.state.hexuChart.up_limit
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
              data: hexudata.outliers
            },
          ]
        };
        hexuChart.setOption(hexuoption);
      }
    }
  }
  submit=()=>{
    console.log('可以提交选项信息了！',this.state.drawchartRequest)            //拿到数据啦，可以和后台交互啦，赶紧去获取chart数据吧
    let now = {};
    now.timeRange = {};
    if(JSON.stringify(this.state.timeRange) === '{}'){
      now.timeRange.startTime=new Date('2019-5-14 00:00:00').getTime();       //默认时间是当前时间前6小时
      now.timeRange.endTime=new Date('2019-5-15 23:59:59').getTime();
      now.timeRange.span = '8';
    }else {
      now.timeRange = Object.assign({},now,this.state.timeRange);
    }
    const str = {};
    str.vendor = this.state.vendor;
    str.productcode = this.state.productcode;
    let selectData = Object.assign({},str,now,this.state.drawchartRequest);
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
        console.log('图表数据---',data);
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
  // fn(flag,selectData){
  //   this.setState({submitFlag:flag,selectD:selectData})
  // }
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
  timeChange=(value, dateString)=> {
    // console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    const startT = new Date(dateString[0]).getTime();        //开始时间的毫秒
    const endT = new Date(dateString[1]).getTime();          //截止时间的毫秒
    const timeR = {};
    timeR.startTime = startT;
    timeR.endTime = endT;
    timeR.span = '8';
    this.setState({timeRange:timeR})
  }

  onOk=(value)=> {
    // console.log('onOk: ', value);
  }
  vendorChange = e =>{
    e.target.value !== 'Vendor' ? this.setState({vendor:e.target.value}): this.setState({vendor:''})

  }
  productChange = e =>{
    e.target.value !== 'Product Code' ? this.setState({productcode:e.target.value}) : this.setState({productcode:''})
  }
  render(){
    // console.log("父组件拿到的画图的参数---",this.state.drawchartRequest)
    return (
      <div className={styles.normal}>
        <div className='bighead' style={{width:'100%',height:'70px',lineHeight: '70px',textAlign: 'left',paddingLeft:'10%'}}>
          <div style={{float:'right',marginRight:'60px'}}>
            <RangePicker
              format="YYYY-MM-DD HH:mm:ss"
              onChange={this.timeChange}
              onOk={this.onOk}
              showTime={{
                hideDisabledOptions: true,
                // defaultValue: [moment('2019-5-14 00:00:00', 'YYYY-MM-DD HH:mm:ss'), moment('2019-5-15 11:59:59', 'YYYY-MM-DD HH:mm:ss')],
                defaultValue:[moment('2019-5-14 00:00:00', 'YYYY-MM-DD HH:mm:ss'), moment('2019-5-15 23:59:59', 'YYYY-MM-DD HH:mm:ss')]
              }}
              defaultValue={[moment('2019-5-14 00:00:00', 'YYYY-MM-DD HH:mm:ss'), moment('2019-5-15 23:59:59', 'YYYY-MM-DD HH:mm:ss')]}
              style={{marginRight:'20px',fontSize:'12px'}} locale={locale}
            />
            <select style={{height:'32px',width:'120px',border:'1px lightgray solid',marginRight:'20px',borderRadius: '4px',fontSize:'12px'}} onChange={this.vendorChange}>
              <option>Vendor</option>
              <option value="rt">RT</option>
              <option value="ctc">CTC</option>
              <option value="mceg">McEG</option>
            </select>
            <select style={{height:'32px',width:'120px',border:'1px lightgray solid',borderRadius: '4px',fontSize:'12px'}} onChange={this.productChange}>
              <option>Product Code</option>
              <option value="stanford">Stanford</option>
            </select>
          </div>
        </div>

        <div className='rightcontent' style={{width:'100%',float:'right'}}>
          {/*目录栏*/}
          <div className={styles.header}>
            {/*<Header pfn = {(flag,selectData)=>this.fn(flag,selectData)} ></Header>*/}
            <NewHeader fun={this.updateDrawChart.bind(this)} time={this.state.timeRange} />
            <Button style={{background:'#1890ff',color:'#fff',marginTop:'10px'}} disabled={this.state.submitFlag} onClick={this.submit}>OK</Button>
          </div>
          {/*  chart */}
          <div className='drawChart'>
            <div id='rectchart' style={{width:'100%',height:'100px',marginTop:'100px'}}></div>
            <div id='table'>

            </div>
            <div id='linechart' style={{width:'100%',height:'100px'}}></div>
            <div id='hexuchart' style={{width:'100%',height:'100px'}}></div>
            <div id='table2'>
              <table style={{width:'100%'}}>
                <thead>
                <tr>
                  <th></th>
                </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>


      </div>
    );
  }
}

export default DrawChart;

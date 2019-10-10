import React,{ Component } from 'react';
import {Button, Icon, Drawer, Popover, Table, Row, Col, Spin} from 'antd';
import echarts from 'echarts';
import NewHeader from './Condition';
import styles from '../index.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
import reqwest from "reqwest";
import '../../global';
import {connect} from "react-redux";
import _ from "lodash";
import ToolTips from "../Tooltips/tooltip";
moment.locale('zh-cn');
const boxPlotHead = [
  {
    key:'name',
    title:'Name',
    dataIndex:'name',
    width:100,
    render:(text)=><span style={{fontWeight:'bold',color:'rgba(0, 0, 0, 0.85)'}}>{text}</span>
  },{
    key:'lsl',
    title:<Popover content={ToolTips('AimDashboard','table','lsl')} ><span>LSL</span></Popover>,
    dataIndex:'lsl',
    width:120,
  },{
    key:'norminal',
    title:'Norminal',
    dataIndex:'norminal',
    width:100,
  },{
    key:'usl',
    title:<Popover content={ToolTips('AimDashboard','table','usl')} ><span>USL</span></Popover>,
    dataIndex:'usl',
    width:120,
  },{
    key:'yield',
    title:<Popover content={ToolTips('AimDashboard','table','failureRate')} ><span>Failure Rate</span></Popover>,
    dataIndex:'yield',
    width:100,
  },{
    key:'std',
    title:<Popover content={ToolTips('formulaShows','showInfo','std')} ><span>Std</span></Popover>,
    dataIndex:'std',
    width:100,
  }
];

@connect(({global}) => ({
  global
}))
class DrawChart extends Component{
  state = {
    //是否能画图提示
    canDrawChart:'none',
    //提示信息;
    alertMSG:'',
    showRect:'none',
    showBoxPlot:'none',
    select:[],
    submitFlag:false,
    selectD:{},
    drawchartRequest:{},
    lineChart:{},
    //柱状图及对应表格
    reactChart:{},
    rectTableTitle:[],
    rectTableDataSource:[],
    //盒须图以及对应表格
    hexuChart:{},
    boxPlotTableSource:[],
    hexuLimitmin:'',
    hexuLimitmax:'',
    type:'',
    themcolor:[ '#c377a9', '#90006d','#9ad1ba','#ddd900', '#ebd5ef', '#fef88a', '#ab88b9', '#ef7d6b', '#c377a9', '#f6b498', '#ddd900', '#9e9b00', '#c37dac', '#00804c', '#5ebf79', '#9ed2bc', '#67c080', '#ffefb2', '#fec78a', '#f9ffa2'],
    timeRange:{},
  //  loading status
    loading:false
  }
  newChart =()=>{
    this.setState({loading:false});
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
            data:this.state.lineChart.legend.data,
            type:'scroll'
          },
          color:this.state.themcolor,
          title: [{
            left: 'center',
            text: this.state.lineChart.title.text
          }],
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              let content = '';
              _.forEach(params, (k) => {
                if (k.value !== 0 && !k.value) return;
                content = content + `<div><span style="display:inline-block;border-radius:10px;width:10px;height:10px;background-color:${k.color};"></span><span style="margin-left: 5px;display: inline-block">${k.name}：${k.value}%</span></div>`;
              });
              return content;
            },
          },
          xAxis: this.state.lineChart.xAxis,
          yAxis: [{
            type: 'value',
            name: 'yield',
            splitLine: {show: true},
            scale: true,
            axisLabel: {
              formatter:`{value}%`
            }
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
                margin:10,
              }
            }
          ],
          yAxis : [
            {
              name: 'yield / %',
              type : 'value',
              scale: true
            }
          ],
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 0,
              end: 70,
              showDataShadow: false,
              height:15,
              handleSize:20,
              handleStyle:{
                color:'gray'
              }
            },
            {
              type: 'inside',
              realtime: true,
              start: 0,
              end: 70,
            }
          ],
          series : this.state.reactChart.series,
          label: {
            show: true,
            position: 'top'
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
        // console.log('hexudata.series[0].data',hexudata.series[0].data)
        const hexuoption = {
          title: [
            {
              // text: hexudata.title.text,
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
              bottom:40,
              xAxisIndex:[0],
              showDataShadow: false,
              height:15,
              handleSize:20,
              handleStyle:{
                color:'gray'
              }

            },
            {
              type: 'inside',
              realtime: true,
              xAxisIndex:[0],
              start: 0,
              end: 100,
            },
            {
              type: 'slider',
              showDetail:false,
              show: true,
              yAxisIndex: 0,
              // filterMode: 'empty',
              width: 15,
              handleSize:20,
              showDataShadow: false,
              left: '6%',
              handleStyle:{
                color:'gray'
              }
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
                     param.name + ': ',
                    'upper: ' + param.data[5].toFixed(3),
                    'Q3: ' + param.data[4].toFixed(3),
                    'median: ' + param.data[3].toFixed(3),
                    'Q1: ' + param.data[2].toFixed(3),
                    'lower: ' + param.data[1].toFixed(3),
                    'errorCount: '+hexudata.series[0].errNum[param.dataIndex],
                    'totalCount: '+hexudata.series[0].total[param.dataIndex],
                    // 'count:' + hexudata.count[0][1]
                  ].join('<br/>');
                }
              },
              markLine : {
                data:[
                  {
                    name: 'low_limit',
                    yAxis: hexudata.low_limit
                  },
                  {
                    name: 'up_limit',
                    yAxis: hexudata.up_limit
                  },
                  {
                    name: 'normal',
                    yAxis: hexudata.norminal,
                    lineStyle:{
                      type:'dashed',
                      width:1,
                      color:'#666',
                    }
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
    // console.log('画图的条件===',this.state.drawchartRequest);
    const condition1 = this.state.drawchartRequest.condition1;
    const condition2 = this.state.drawchartRequest.condition2;
    const condition3 = this.state.drawchartRequest.condition3;
    const condition3_4 = this.state.drawchartRequest.condition3_4;
    const condition4 = this.state.drawchartRequest.condition4;
    const condition5 = this.state.drawchartRequest.condition5;
    const condition6 = this.state.drawchartRequest.condition6;
    const condition7 = this.state.drawchartRequest.condition7;
    if(condition1.length === 0 || condition2.length === 0 || condition3.length === 0 || condition3_4.length === 0){    //前三个条件必不能为空
      this.setState({canDrawChart:'inline-block',alertMSG:'The required condition cannot be empty！'});
      return;
    }else{
    /* 条件1,2,3,3_4不为空时，需要判断3_4是什么条件，以此来判断后面的条件是否为非空
    *   3_4 为line，aim,shift时，condition4为非空
    *   3_4 为cnc时，condition4,5,6为非空
    *   3_4 为spm时，condition4,5,6,7为非空
    * */
      if(condition3_4[0] === 'Line' || condition3_4[0] === 'AIM' || condition3_4[0] === 'Shift'){
        if(condition4.length === 0 ){
          this.setState({canDrawChart:'inline-block',alertMSG:'The required condition cannot be empty！'});
          return;
        }else{
          this.setState({canDrawChart:'none',alertMSG:''});
        }
      }else if(condition3_4[0] === 'CNC'){
        if(condition4.length === 0 || condition5.length === 0 || condition6.length === 0){
          this.setState({canDrawChart:'inline-block',alertMSG:'The required condition cannot be empty！'});
          return;
        }else{
          this.setState({canDrawChart:'none'});
        }
      }else if(condition3_4[0] === 'SPM'){
        if(condition4.length === 0 || condition5.length === 0 || condition6.length === 0|| condition7.length === 0){
          this.setState({canDrawChart:'inline-block',alertMSG:'The required condition cannot be empty！'});
          return;
        }else{
          this.setState({canDrawChart:'none'});
        }
      }
    }
    this.setState({loading:true})
    // console.log('可以提交选项信息了！',this.state.drawchartRequest);            //拿到数据啦，可以和后台交互啦，赶紧去获取chart数据吧
    // console.log('时间及6个条件',this.props.global.topSelectItem,this.props.global.dateTime);
    let now = {};
    now.timeRange= this.props.global.dateTime;
    let selectData = Object.assign({},{mapping:this.props.global.topSelectItem},now,this.state.drawchartRequest);
    // console.log('selectData',selectData)
    const container = {};
    container.data = JSON.stringify(selectData);
    reqwest({
      url:`${global.constants.ip}/condition/goChart`,
      method:'get',
      type:'json',
      data:container
    })
      .then(data=>{
        // console.log('图表数据---',data);
        this.setState({canDrawChart:'none'});
        // react data
        if(data.blockChart !== null && data.blockChart !== undefined){
          //整理柱状图表格的数据
          const rectTableTitle=[],rectTableHead = [],rectTableDataSource=[];
          const columnTitle1 = {},columnTitle2={},columnTitle3 = {},columnTitle4={};
          columnTitle1.type='Input';
          columnTitle1.key=1;
          columnTitle2.type='OK';
          columnTitle2.key=2;
          columnTitle3.type='NG';
          columnTitle3.key=3;
          columnTitle4.type='Failure Rate';
          columnTitle4.key=4;
          rectTableTitle.push('type');
          data.blockChart.spcYieldList.map((v,i)=>{
            rectTableTitle.push(v.name);
            columnTitle1[v.name]=v.input;
            columnTitle2[v.name]=v.ok;
            columnTitle3[v.name]=v.ng;
            columnTitle4[v.name]=(((1-v.yield)*100).toPrecision(2))+'%';
            return ;
          })
          rectTableTitle.map((title,j)=>{
            const column = {};
            if(title === 'type'){
              column.title='';
              column.render = (text)=><Popover content={ToolTips('AimDashboard','dashboard',`${text}`)} ><span>{text}</span></Popover>
            }else{
              column.title=`${title}`;
              column.render = (text)=><span>{text}</span>
            }
            column.key=title;
            column.dataIndex = title;
            rectTableHead.push(column)
          })
          rectTableDataSource.push(columnTitle1,columnTitle2,columnTitle3,columnTitle4);
          this.setState({rectTableTitle:rectTableHead,rectTableDataSource:rectTableDataSource,boxPlotTableSource:[],showRect:'block',showBoxPlot:'none'});

          data.blockChart.series[0].data = data.blockChart.series[0].data.map((num,i)=>{
            return (parseFloat(num)*100).toFixed(3);
          })
          //柱子宽度改为30%
          data.blockChart.series[0].barWidth='30%';
          //柱状图的目录值过长，奇数坐标添加\n
          data.blockChart.xAxis.data = data.blockChart.xAxis.data.map((categroy,j)=>{
            if(j % 2 === 1)
              return `\n${categroy}`
            else
              return categroy
          })
          this.setState({reactChart:data.blockChart})
        }else{
          this.setState({reactChart:{}})
        }
        if(data.lineChart !== null && data.lineChart !== undefined){
          data.lineChart.series.map((item,i)=>{
            item.data = item.data.map((d,j)=>{
              return (parseFloat(d)*100).toFixed(2);
               // console.log(item)
            })
          })
          this.setState({lineChart:data.lineChart})
        }else{
          this.setState({lineChart:{}})
        }
        if(data.boxChart !== null && data.boxChart !== undefined){
          //盒须图的不良率变成百分比形式
          data.boxChart.spcYieldList.map((item,i)=>{
            item.key=i;
            return item.yield = (((item.yield)*100).toFixed(2))+'%';
          })
          this.setState({hexuChart:data.boxChart,hexuLimitmin:data.boxChart.low_limit,hexuLimitmax:data.boxChart.up_limit,boxPlotTableSource:data.boxChart.spcYieldList,
            rectTableDataSource:[],showRect:'none',showBoxPlot:'block'})
        }else{
          this.setState({hexuChart:{}})
        }
        this.newChart();

      },(error)=>{
        console.log('错误了',error,error.status);
        this.setState({loading:false,alertMSG:'The request timeout!',canDrawChart:'inline-block'});
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
    const showBoxPlot = this.state.showBoxPlot;
    const showRect = this.state.showRect;
    const canDrawChart = this.state.canDrawChart;
    return (
      <div className={styles.normal}>
        <div className='rightcontent' style={{width:'100%',float:'right'}}>
            {/*目录栏*/}
            <div className={styles.header}>
              {/*<Header pfn = {(flag,selectData)=>this.fn(flag,selectData)} ></Header>*/}
              <NewHeader fun={this.updateDrawChart.bind(this)} />
              <Button style={{background:'#1890ff',color:'#fff',marginTop:'10px'}} disabled={this.state.submitFlag} onClick={this.submit}>OK</Button>
              <span style={{color:'red',display:canDrawChart}}>{this.state.alertMSG}</span>
            </div>
            {/*  chart */}
          <Spin spinning={this.state.loading} delay={500}>
            <div className='drawChart'>
              {/*<div id='rectchart' style={{width:'100%',height:'100px',marginTop:'100px'}}></div>*/}
              {/*<div id='linechart' style={{width:'100%',height:'100px'}}></div>*/}
              <div>
                <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
                  <Col span={22}>
                    <div id='rectchart' style={{width:'100%',height:'100px',marginTop:'100px'}} />
                  </Col>
                </Row>
                <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto',display:`${showRect}`}}>
                  <Col span={22}>
                    <Table size="small"  columns={this.state.rectTableTitle} dataSource={this.state.rectTableDataSource} scroll={{x: 'max-content'}} pagination={false} />                </Col>
                </Row>
                <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
                  <Col span={22}>
                    <div id='linechart' style={{width:'100%',height:'100px'}} />
                  </Col>
                </Row>
              </div>
              <div style={{display:`block`}}>
                <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
                 <Col span={22}>
                    <div id='hexuchart' style={{width:'100%',height:'100px'}} />
                  </Col>
                </Row>
                <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto',display:`${showBoxPlot}`}} >
                  <Col span={22}>
                    <Table size="small"  columns={boxPlotHead} dataSource={this.state.boxPlotTableSource} scroll={{x: 'max-content'}} pagination={false} />                </Col>
                </Row>
              </div>

            </div>
          </Spin>
        </div>
        <DownLoadList />
      </div>
    );
  }
}
class DownLoadList extends Component{
  state = {
    visible: false,
    placement: 'right'
  };
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    return(
      <div>
        <div className={styles.downloadIcon} onClick={this.showDrawer}>
          <Icon type="download" />
        </div>
        <Drawer
          title="Download List"
          placement={this.state.placement}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
            <ul>
              <li>2019.7.25 15:30:30 downloading...</li>
              <li>2019.7.25 15:30:31 downloading...</li>
              <li>2019.7.25 15:30:32 downloading...</li>
            </ul>
        </Drawer>
      </div>
    )
  }
}

export default DrawChart;

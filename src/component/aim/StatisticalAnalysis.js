import React,{Component} from 'react';
import echarts from 'echarts';
import {Select, Button, Col, Card, Statistic, Row, Spin,Popover} from 'antd';
import reqwest from 'reqwest';
import {connect} from "react-redux";
import styles from './AimTablePage.less'
import ToolTips from "../Tooltips/tooltip";

const { Option } = Select;

@connect(({global}) => ({
  global
}))

class Statistical extends Component{
  state={
    loading:false,
    showChart:'none',
    selectStation:'',
    process:'',
    selectSpc:'',
    station:[],
    spcInfo:[],
  //  chart data
    boxplot:[],
    capabilityChart:[],
    IChart:[],
    MRChart:[],
    lastLineChart:[]
  }
  componentDidMount() {
    this.fetch(this.props);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.global.timeRangeComplete === true){
      this.fetch(nextProps);
    }
  }
  fetch=(Props)=>{
    const requestCon = {};
    const param = Object.assign({},Props.global.dateTime,{mapping:Props.global.topSelectItem});
    requestCon.data = JSON.stringify(param);
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'global/saveAllStation',
    //   payload: requestCon,
    // });
    reqwest({
      url:`${global.constants.ip}/spc/getStations`,
      method:'post',
      type:'json',
      data:requestCon
    })
      .then(data=>{
        // console.log('统计分析station--',data);
        this.setState({station:data.stations})
      })
  }
  stationChange=(stationValue)=> {
    // console.log(`selected ${JSON.stringify(stationValue)}`);
    const labelInput = stationValue;
    const process = labelInput.label[0];
    const selectStation = labelInput.label[2];
    this.setState({process:process,selectStation:selectStation,spcInfo:[]});
  //  修改了station的选项，重新获取spc的可选项
    let requsetSpc = {};
    const sta={},stations=[];
    requsetSpc.data={};
    sta.process=process;
    sta.station=selectStation;
    stations.push(sta);
    const param = Object.assign({},this.props.global.dateTime,{mapping:this.props.global.topSelectItem});
    param.stations=stations;
    requsetSpc.data = JSON.stringify(param);
    reqwest({
      url:`${global.constants.ip}/spc/getSpcs`,
      method: 'post',
      type:'json',
      data:requsetSpc
    })
      .then((data)=>{
          // console.log('spc==',data);
        this.setState({spcInfo:data.spcs})
      })
  }
  spcChange = (spcValue)=>{
    this.setState({selectSpc:spcValue});
  }
  drawStatisticalChart=()=>{
    if(this.state.selectStation === '' || this.state.selectSpc === ''){
      return;
    }
    this.setState({loading:true})
    const requestCon = {};
    const param = Object.assign({},this.props.global.dateTime,{mapping:this.props.global.topSelectItem},
      {station:this.state.selectStation,spc:this.state.selectSpc,process:this.state.process});
    requestCon.data = JSON.stringify(param);
    reqwest({
      url:`${global.constants.ip}/spc/getSigmaChart`,
      method:'post',
      type:'json',
      data:requestCon
    })
      .then(data=>{
        // console.log('统计分析的所有chart数据--',data);
        if(data === null){
          this.setState({showChart:'none'})
        }else{
          //分布图
          data.gaussChart.series.map((item,i)=>{
            item.data = item.data.map((value,j)=>{
              return (value*100).toFixed(3)
            })
          });
          this.setState({loading:false,showChart:'block',boxplot:data.boxChart,capabilityChart:data.gaussChart,IChart:data.iChart,MRChart:data.mrChart,lastLineChart:data.lastChart},this.drawChart)
        }

      })

  }
  drawChart=()=>{
    //boxPlot
    const boxplotD= this.state.boxplot;
    // console.log('统计分析盒须图数据==',boxplotD);
    const boxPlotOption = {
      color:['#0096ff'],
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%'
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          left: '2%',
          start: 0,
          end: 100,
          yAxisIndex:[0],
          showDataShadow: false,
          handleSize:20,
          width:15,
          handleStyle:{
            color:'gray'
          }

        },
        {
          type: 'inside',
          realtime: true,
          yAxisIndex:[0],
          start: 0,
          end: 100,
        },
        // {
        //   show: true,
        //   type: 'slider',
        //   realtime: true,
        //   left: '6%',
        //   start: 0,
        //   end: 100,
        //   // bottom:40,
        //   yAxisIndex:[0],
        //   showDataShadow: false,
        //   width:15,
        //   handleSize:20,
        //   handleStyle:{
        //     color:'gray'
        //   }
        // },
      ],
      xAxis: {
        type: 'category',
        data: boxplotD.xAxis.data,
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
        // name: 'km/s minus 299,000',
        splitArea: {
          show: true
        },
        splitLine:{
          show:false
        },
        scale:true,

      },
      series: [
        {
          name: '',
          type: 'boxplot',
          data: boxplotD.series[0].data,
          tooltip: {
            formatter: function (param) {
              return [
                // param.name + ': ',
                'upper: ' + param.data[5].toFixed(3),
                'Q3: ' + param.data[4].toFixed(3),
                'median: ' + param.data[3].toFixed(3),
                'Q1: ' + param.data[2].toFixed(3),
                'lower: ' + param.data[1].toFixed(3),
                'errorCount: '+boxplotD.series[0].errNum[param.dataIndex],
                'totalCount: '+boxplotD.series[0].total[param.dataIndex],
              ].join('<br/>');
            }
          },
          markLine : {
            data:[
              {
                name: 'low_limit',
                yAxis: Number(boxplotD.low_limit).toFixed(3),
                lineStyle:{
                  type:'dashed',
                  width:1,
                  color:'#666',
                }
              },
              {
                name: 'up_limit',
                yAxis: Number(boxplotD.up_limit).toFixed(3),
                lineStyle:{
                  type:'dashed',
                  width:1,
                  color:'#666',
                }
              },
              {
                name: 'normal',
                yAxis: Number(boxplotD.norminal).toFixed(3),
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
            },
            tooltip: {
              formatter:function (d) {
                return `${d.name} : ${d.value}`
              }
            }
          }
        },
        {
          name: 'outlier',
          type: 'scatter',
          data: boxplotD.series[1].data
        }
      ]
    };
    const statisticalBoxplot = echarts.init(document.getElementById('statisticalBoxplot'));
    statisticalBoxplot.setOption(boxPlotOption);
    //分布图
    const xAxisLength = this.state.capabilityChart.xAxis.data.length;
    const XminValue = Number(this.state.capabilityChart.xAxis.data[0]);
    const XmaxValue = Number(this.state.capabilityChart.xAxis.data[xAxisLength-1]);
    const statisticalCapabilityOption = {
      color:['#0096ff'],
      tooltip:{},
      grid: [{
        bottom: '10%'
      }, {
        top: '60%'
      }],
      xAxis: [
        {
        type: 'category',
        data: this.state.capabilityChart.xAxis.data,
        gridIndex:0
      },{
          type: 'value',
          min:XminValue,
          max:XmaxValue,
          splitLine:{
            show:false
          },
          axisLine:{
            show:false
          },
          axisTick:{
            show:false,
          },
          axisLabel:{
            show:false,
          }
        }
      ],
      yAxis: [
        {
        type: 'value',
        gridIndex:0,
        show:false,
        // interval: 0.1,
        // max: 100,
        // min: 0,
        // name: "Gauss",
        scale:true,
        splitLine:{
          show:false
        },
        axisTick:{
          show:false
        },
        axisLabel:{
          show:false
        },
      },
        {
          show:false,
          gridIndex:1
        }
      ],
      series: [
        {
          type:'bar',
          data:this.state.capabilityChart.series[0].data,
          xAxisIndex:0,
          yAxisIndex:0
        },{
          type:'line',
          data:this.state.capabilityChart.series[1].data,
          smooth:true,
          xAxisIndex:0,
          yAxisIndex:0,
        },{
          type:'line',
          xAxisIndex:1,
          markLine : {
            data:[
              {
                name: 'LSL',
                xAxis: (this.state.capabilityChart.lsl).toFixed(3),
                // label: this.state.capabilityChart.lsl
              },
              {
                name: 'USL',
                xAxis: (this.state.capabilityChart.usl).toFixed(3),
              },
              {
                name: 'Target',
                xAxis: (this.state.capabilityChart.target).toFixed(3),
              },
            ],
            lineStyle:{
              type:'dashed',
              width:1,
              color:'#666',
            },
            tooltip: {
              formatter:function (d) {
                console.log(d)
                return `${d.name} : ${d.data.xAxis}`
              }
            }
          }
        }
      ]
    };
    const statisticalCapability = echarts.init(document.getElementById('statisticalCapability'));
    statisticalCapability.setOption(statisticalCapabilityOption)
    // I Chart
    const IchartOption = {
      color:['#0096ff'],
      title : {
        text: 'I Chart',
        x: 'center',
        align: 'right'
      },
      tooltip:{
        axisPointer: {
          type: 'cross',
        }
      },
      xAxis: {
        type: 'category',
        data: this.state.IChart.xAxis.data,
      },
      yAxis: {
        type: 'value',
        name:'value',
        splitLine:{
          show:false
        },
        scale:true,
      },
      series:[{
        data:this.state.IChart.series[0].data,
        type:'line',
        lineStyle:{
          width:1
        },
        symbol:'circle',
        symbolSize:8,
        markLine : {
          data:[
            {
              name: 'UCL',
              yAxis: this.state.IChart.ucl,
              lineStyle:{
                type:'dashed',
                width:1,
                color:'#666',
              }
            },
            {
              name: 'Mean',
              yAxis: this.state.IChart.mean,
              lineStyle:{
                type:'dashed',
                width:1,
                color:'#666',
              }
            },
            {
              name: 'LCL',
              yAxis: this.state.IChart.lcl,
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
          },
          tooltip: {
            formatter:function (d) {
              return `${d.name} : ${d.value}`
            }
          }
        }
      }]
    };
    const Ichart = echarts.init(document.getElementById('IChart'));
    Ichart.setOption(IchartOption);
  //   MR chart
    const MrchartOption = {
      color:['#0096ff'],
      title : {
        text: 'MR Chart',
        x: 'center',
        align: 'right'
      },
      tooltip:{
        axisPointer: {
          type: 'cross',
        }
      },
      xAxis: {
        type: 'category',
        data: this.state.MRChart.xAxis.data,
      },
      yAxis: {
        type: 'value',
        name:'value',
        splitLine:{
          show:false
        },
        scale:true,
      },
      series: [{
        data:this.state.MRChart.series[0].data,
        type:'line',
        lineStyle:{
          width:1
        },
        symbol:'circle',
        symbolSize:8,
        markLine : {
          data:[
            {
              name: 'USL',
              yAxis: this.state.MRChart.usl,
              lineStyle:{
                type:'dashed',
                width:1,
                color:'#666',
              }
            },
            {
              name: 'CL',
              yAxis: this.state.MRChart.cl,
              lineStyle:{
                type:'dashed',
                width:1,
                color:'#666',
              }
            },
            {
              name: 'LSL',
              yAxis: this.state.MRChart.lsl,
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
          },
          tooltip: {
            formatter:function (d) {
              return `${d.name} : ${d.value}`
            }
          }
        }
      }]
    };
    const mrchart = echarts.init(document.getElementById('MRChart'));
    mrchart.setOption(MrchartOption);
  //  last 25 point chart
    const lastLineChartOption = {
      color:['#188fff'],
      tooltip:{},
      xAxis: {
        type: 'category',
        data: this.state.lastLineChart.xAxis.data
      },
      yAxis: {
        type: 'value',
        name: 'value',
        axisLine:{
          show:false
        },
        splitLine:{
          show:false
        },
        scale:true,
      },
      series: [{
        data: this.state.lastLineChart.series[0].data,
        type: 'line',
        symbol:'circle',
        symbolSize:8,
        itemStyle:{
          normal:{
            borderColor:'white',  //拐点边框颜色
            borderWidth:2
          }
        },
        label: {
          normal: {
            show: true,
            position: 'top',
            color:'#000',
            formatter:function (data) {
              return Number(data.value)
            }
          }
        },
      }]
    };
    const lastLine = echarts.init(document.getElementById('lastLineChart'));
    lastLine.setOption(lastLineChartOption)
  }
  render(){
    const stationL = this.state.station.length || [];
    return(
      <div style={{paddingBottom:'20px'}}>
        {/* select station and spc */}
        <div style={{marginBottom:'10px'}}>
          <span style={{marginLeft:'50px'}}>Station: </span>
          <Select labelInValue defaultValue={{key:'title',label:''}} style={{ width: 350 }} onChange={this.stationChange}>
            <Option value='title' disabled>Please choose!</Option>
            {
              stationL !==0 ?
              this.state.station.map((station,i)=>(
                <Option key={i} process={station.process} value={`${station.process}_${station.station}`}>{station.process}_{station.station}</Option>
                )
              ):''
            }
          </Select>
          <span style={{marginLeft:'50px'}}>SPC: </span>
          <Select defaultValue="title" style={{ width: 400 }} onChange={this.spcChange}>
            <Option value='title' disabled>Please choose!</Option>
            {
              this.state.spcInfo.map((spcItem,i)=>(
                <Option key={i} station={spcItem.station} value={spcItem.spcName}>{this.state.process}_{spcItem.station}_{spcItem.spcName}</Option>
                )
              )
            }
          </Select>
          <Button type='primary' style={{marginLeft:'50px'}} onClick={this.drawStatisticalChart}>OK</Button>
        </div>
        {/* 箱线图 和 分布图 */}
        <Spin spinning={this.state.loading}>
          <div style={{display:this.state.showChart}}>
            <div>
              <p className={styles.tableName}>
                Test Point Analysis
              </p>
              <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
                <Col span={11}>
                  <div id='statisticalBoxplot' style={{width:'100%',height:'400px'}} />
                </Col>
                <Col span={11}>
                  <div id='statisticalCapability' style={{width:'100%',height:'400px'}} />
                </Col>
              </Row>
              {/* 分布chart下面的字段解释 */}
              <Row  gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
                <Col span={11}>
                </Col>
                <CapabilityData value={this.state.capabilityChart} />
              </Row>
            </div>
            {/* MR Chart and I Chart */}
            <div>
              <p className={styles.tableName}>
                I-MR Chart Analysis
              </p>
              <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
                <Col span={20}>
                  <div id='IChart' style={{width:'100%',height:'400px'}} />
                </Col>
              </Row>
              {/* Ichart下面的字段解释 */}
              <Row  gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
                <IchartData value={this.state.IChart} />
              </Row>
              <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
                <Col span={20}>
                  <div id='MRChart' style={{width:'100%',height:'400px'}} />
                </Col>
              </Row>
            </div>
            {/* line chart */}
            <div>
              <p className={styles.tableName}>
                Last 25 points run chart
              </p>
              <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
                <Col span={20}>
                  <div id='lastLineChart' style={{width:'100%',height:'400px'}} />
                </Col>
              </Row>
            </div>
          </div>
        </Spin>
      </div>
    )
  }
}
//分布图的解释字段
function CapabilityData(data) {
  const Data = data.value;
  if(Data.length === 0)
    return '';
  return(
    <Col span={11}>
      <ul className={styles.capabilityUl}>
        <li><Popover content={ToolTips('spcStatisticalAnalysis','Capability','sampleNum')}><span>Sample N = {Data.numberOfObs}</span></Popover></li>
        <li><Popover content={ToolTips('spcStatisticalAnalysis','Capability','mean')}><span>Mean = {Data.mean.toFixed(3)}</span></Popover></li>
        <li><Popover content={ToolTips('formulaShows','showInfo','std')}><span>StdDev = {Data.stdDev.toFixed(3)}</span></Popover></li>
      </ul>
      <ul className={styles.capabilityUl}>
        <li>Target = {Data.target.toFixed(3)}</li>
        <li><Popover content={ToolTips('AimDashboard','table','lsl')}><span>LSL = {Data.lsl.toFixed(3)}</span></Popover></li>
        <li><Popover content={ToolTips('AimDashboard','table','usl')}><span>USL = {Data.usl.toFixed(3)}</span></Popover></li>
      </ul>
      <ul className={styles.capabilityUl}>
        <li><Popover content={ToolTips('formulaShows','showInfo','cp')}><span>Cp = {Data.cp.toFixed(3)}</span></Popover></li>
        <li><Popover content={ToolTips('formulaShows','showInfo','cpl')}><span>CPL = {Data.cpl.toFixed(3)}</span></Popover></li>
        <li><Popover content={ToolTips('formulaShows','showInfo','cpu')}><span>CPU = {Data.cpu.toFixed(3)}</span></Popover></li>
        <li><Popover content={ToolTips('formulaShows','showInfo','cpk')}><span>Cpk = {Data.cpk.toFixed(3)}</span></Popover></li>
        <li><Popover content={ToolTips('formulaShows','showInfo','cpm')}><span>Cpm = {Data.cpm.toFixed(3)}</span></Popover></li>
      </ul>
      <ul className={styles.capabilityUl}>
        <li><Popover content={ToolTips('spcStatisticalAnalysis','Capability','exp<lsl')}><span>Exp &lt; LSL {(Data.expLtLsl * 100).toFixed(3)+'%'}</span></Popover></li>
        <li><Popover content={ToolTips('spcStatisticalAnalysis','Capability','exp>usl')}><span>Exp &gt; USL {(Data.expGtUsl* 100).toFixed(3)+'%'}</span></Popover></li>
        <li><Popover content={ToolTips('spcStatisticalAnalysis','Capability','obs<lsl')}><span>Obs &lt; LSL {Data.obsLtLsl}</span></Popover></li>
        <li><Popover content={ToolTips('spcStatisticalAnalysis','Capability','obs>usl')}><span>Obs &gt; USL {Data.obsGtUsl}</span></Popover></li>
      </ul>
    </Col>
  )
}
// IChart的解释字段
function IchartData(data) {
  const Data = data.value;
  if(Data.length === 0)
    return '';
  return(
    <Col span={20}>
      <ul className={styles.capabilityUl}>
        <li><Popover content={ToolTips('spcStatisticalAnalysis','Capability','sampleNum')}><span>Sample N = {Data.numberOfObs}</span></Popover></li>
        <li><Popover content={ToolTips('spcStatisticalAnalysis','Capability','mean')}><span>Mean = {Data.mean.toFixed(3)}</span></Popover></li>
        <li><Popover content={ToolTips('formulaShows','showInfo','std')}><span>StdDev = {Data.stdDev.toFixed(3)}</span></Popover></li>
      </ul>
      <ul className={styles.capabilityUl}>
        <li><Popover content={ToolTips('spcStatisticalAnalysis','IChart','lcl')}><span>LCL = {Data.lcl.toFixed(3)}</span></Popover></li>
        <li><Popover content={ToolTips('spcStatisticalAnalysis','IChart','ucl')}><span>UCL = {Data.ucl.toFixed(3)}</span></Popover></li>
      </ul>
      <ul className={styles.capabilityUl}>
        <li><Popover content={ToolTips('spcStatisticalAnalysis','IChart','numberBeyondLimits')}><span>Number beyond limits = {Data.numberBeyondLimits}</span></Popover></li>
      </ul>
    </Col>
  )
}

export default Statistical;

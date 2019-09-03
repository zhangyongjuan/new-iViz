import React,{Component} from 'react';
import echarts from 'echarts';
import {Select, Button, Col, Table, Row,Spin} from 'antd';
import reqwest from 'reqwest';
import {connect} from "react-redux";
import styles from './AimTablePage.less'

const { Option } = Select;
const dataSource = [
  {
    key: '1',
    testPoint: 'G-P OR1',
    n: 352,
    min: 0,
    max:1324,
    mean:0.44,
    median:0.043,
    std:0.54,
    cp:2.3,
    cpu:4.5,
    cpl:1.7,
    cpk:5.6,
    ppm:43
  },
  {
    key: '2',
    testPoint: 'G-P OR1',
    n: 352,
    min: 0,
    max:1324,
    mean:0.44,
    median:0.043,
    std:0.54,
    cp:2.3,
    cpu:4.5,
    cpl:1.7,
    cpk:5.6,
    ppm:43
  },
];
const columns = [
  {
    title: 'SPC',
    dataIndex: 'test_point',
    key: 'testPoint',
  },
  {
    title: 'Sample N',
    dataIndex: 'number',
    key: 'n',
  },
  {
    title: 'Min',
    dataIndex: 'min',
    key: 'min',
    render:(v)=>v.toFixed(3)
  },
  {
    title: 'Max',
    dataIndex: 'max',
    key: 'max',
    render:(v)=>v.toFixed(3)
  },
  {
    title: 'Mean',
    dataIndex: 'mean',
    key: 'mean',
    render:(v)=>v.toFixed(3)
  },
  {
    title: 'Median',
    dataIndex: 'median',
    key: 'median',
    render:(v)=>v.toFixed(3)
  },
  {
    title: 'Std',
    dataIndex: 'std',
    key: 'std',
    render:(v)=>v.toFixed(3)
  },
  {
    title: 'Cp',
    dataIndex: 'cp',
    key: 'cp',
    render:(v)=>v.toFixed(3)
  },
  {
    title: 'CPU',
    dataIndex: 'cpu',
    key: 'cpu',
    render:(v)=>v.toFixed(3)
  },
  {
    title: 'CPL',
    dataIndex: 'cpl',
    key: 'cpl',
    render:(v)=>v.toFixed(3)
  },
  {
    title: 'Cpk',
    dataIndex: 'cpk',
    key: 'cpk',
    render:(v)=>v.toFixed(3)
  },
  {
    title: 'PPM',
    dataIndex: 'ppm',
    key: 'ppm',
    render:(v)=>v.toFixed(3)
  },
];

@connect(({global}) => ({
  global
}))
class Comparative extends Component{
  state={
    //loading
    loading:false,
    showChart:'none',
    selectStation:'',
    selectSpc:'',
    // station 以及 spc 的所有选择项
    station:[],
    spcInfo:[],
    //spc 选项为多选，每个对象有spc和对应的station
    requestSpcs:[],
    //  chart data
    boxplot:[],
  //  table source
    tableData:[]
  }
  componentDidMount() {
    const requestCon = {};
    const param = Object.assign({},this.props.global.dateTime,{mapping:this.props.global.topSelectItem});
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
        // console.log('终于拿到数据了--',data);
        this.setState({station:data.stations})
      })
  }

  stationChange=(stationValue)=> {
    // console.log(`selected station-- ${stationValue}`);
    this.setState({selectStation:stationValue,spcInfo:[]});
    //  修改了station的选项，重新获取spc的可选项
    let requsetSpc = {};
    const sta={};
    requsetSpc.data={};
    sta.stations=[stationValue];
    requsetSpc.data = JSON.stringify(sta);
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
    // console.log(`selected spc-- ${spcValue}`);
    const spcs = [];
    spcValue.map((item,i)=>{
      const oneItem = {};
      oneItem.station=spcValue[i].label[0];
      oneItem.spc=item.key;
      spcs.push(oneItem);
    })
    // console.log('已经选好的station和spc===',spcs);
    this.setState({requestSpcs:spcs});
  }
  drawStatisticalChart=()=>{
    if(this.state.requestSpcs.length === 0){
      return;
    }
    this.setState({loading:true});
    const requestCon = {};
    const param = Object.assign({},this.props.global.dateTime,{mapping:this.props.global.topSelectItem},{spcs:this.state.requestSpcs});
    requestCon.data = JSON.stringify(param);
    reqwest({
      url:`${global.constants.ip}/spc/getDisChart`,
      method:'post',
      type:'json',
      data:requestCon
    })
      .then(data=>{
        console.log('对比分析的boxchart数据--',data);
        if(data === null){
          this.setState({showChart:'none'})
        }else{
          this.setState({showChart:'block',loading:false,boxplot:data,tableData:data.spcData},this.drawChart)
        }

      })

  }
  drawChart=()=>{
    //   boxplot chart
    let boxplotData = this.state.boxplot;
    const boxplotOption = {
      color:['#54c7fc'],
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
          start: 0,
          end: 100,
          bottom:10,
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
          show: true,
          type: 'slider',
          realtime: true,
          left: '6%',
          start: 0,
          end: 100,
          // bottom:40,
          yAxisIndex:[0],
          showDataShadow: false,
          width:15,
          handleSize:20,
          handleStyle:{
            color:'gray'
          }
        },
      ],
      xAxis: {
        type: 'category',
        data: boxplotData.xAxis.data,
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
        name: 'value',
        splitArea: {
          show: true
        },
        splitLine: {
          show:false
        },
        scale:true
      },
      series: [
        {
          // name: 'boxplot',
          type: 'boxplot',
          data: boxplotData.series[0].data,
          tooltip: {
            formatter: function (param) {
              return [
                 // param.name + ': ',
                'upper: ' + param.data[5].toFixed(3),
                'Q3: ' + param.data[4].toFixed(3),
                'median: ' + param.data[3].toFixed(3),
                'Q1: ' + param.data[2].toFixed(3),
                'lower: ' + param.data[1].toFixed(3),
                'errorCount: '+boxplotData.series[0].errNum[param.dataIndex],
                'totalCount: '+boxplotData.series[0].total[param.dataIndex],
              ].join('<br/>');
            }
          },
          markLine : {
            data:[
              {
                name: 'low_limit',
                yAxis: Number(boxplotData.low_limit).toFixed(3),
                lineStyle:{
                  type:'dashed',
                  width:1,
                  color:'#666',
                }
              },
              {
                name: 'up_limit',
                yAxis: Number(boxplotData.up_limit).toFixed(3),
                lineStyle:{
                  type:'dashed',
                  width:1,
                  color:'#666',
                }
              },
              {
                name: 'normal',
                yAxis: Number(boxplotData.norminal).toFixed(3),
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
          data: this.state.boxplot.series[1].data
        }
      ]
    };
    const boxplotchart = echarts.init(document.getElementById('comparativeBoxplot'));
    boxplotchart.setOption(boxplotOption);
  }
  render(){
    const stationL = this.state.station.length;
    return(
      <div style={{paddingBottom:'20px'}}>
        {/* select station and spc */}
        <div style={{marginBottom:'10px'}}>
          <span style={{marginLeft:'50px'}}>Station: </span>
          <Select defaultValue="title" style={{ width: 300 }} onChange={this.stationChange}>
            <Option value='title' disabled>Please choose!</Option>
            {
              stationL !== 0 ?
              this.state.station.map((station,i)=>(
                  <Option key={i} value={station}>{station}</Option>
                )
              ):''
            }
          </Select>
          <span style={{marginLeft:'50px'}}>SPC: </span>
          <Select style={{ width: 800 }} mode="multiple" labelInValue={true} onChange={this.spcChange}>
            {
              this.state.spcInfo.map((spcItem,i)=>(
                  <Option key={i} station={spcItem.station} value={spcItem.spcName}>{this.state.selectStation}_{spcItem.spcName}</Option>
                )
              )
            }
          </Select>
          <Button type='primary' style={{marginLeft:'50px'}} onClick={this.drawStatisticalChart}>OK</Button>
        </div>
        {/* 箱线图 */}
        <Spin spinning={this.state.loading}>
          <div style={{display:this.state.showChart}}>
              <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
                <Col span={20}>
                  <div id='comparativeBoxplot' style={{width:'100%',height:'400px'}} />
                </Col>
              </Row>
              <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
                <Col span={20}>
                  <Table size="small"  columns={columns} dataSource={this.state.tableData} pagination={false} />
                </Col>
              </Row>
          </div>
        </Spin>

      </div>
    )
  }
}

export default Comparative;

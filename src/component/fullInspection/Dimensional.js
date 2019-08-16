import React ,{ Component }from 'react';
import echarts from 'echarts';
import {Select,Spin} from "antd";
import styles from "./fullInspection.less";
import reqwest from "reqwest";
import {connect} from "react-redux";

const { Option } = Select;

@connect(({global}) => ({
  global
}))
class Dimensional extends Component{
  state={
    loading:false,
    showParticularHeatmap:'none',
    showParticularLine:'none',
    //  overall sumYield,
    overallChart:[],
    heatmapYield:[],
    overallStation:[],
    overallDefectName:[],
    overallData:[],
    //  Particular heatmap
    particularChart:[],
    particularXData:[],
    particularYData:[],
    particularData:[],
    //  线图数据
    lineChartData:[],
    //  点击的各个字段名
    clickDefectName:'',
    clickStationName:'',
    machineName:'CNC-7',
    //  点击particularChart的值
    clickParticularX:'',
    clickParticularY:''
  }
  componentDidMount() {
    this.fetch();
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.global.timeRangeComplete === true){
      this.fetch();
    }
  }
  fetch=()=>{
    this.setState({loading:true});
    const requestCon = {};
    const param = Object.assign({}, this.props.global.dateTime, {mapping: this.props.global.topSelectItem});
    requestCon.data = JSON.stringify(param);
    // console.log('requestCon---', requestCon);
    reqwest({
      url: `${global.constants.ip}/full/dimensional/home`,
      method:'post',
      type:'json',
      data:requestCon
    })
      .then(data=>{
        console.log('dimensional 数据==',data);
        //整理overallData数据
        const defectYield = [],defectName=[],chartData=[];
        //  1.overall总不良率,不良类型
        data.defectLines.map((item,i)=>{
          defectYield.push(item.sumYield);
          return defectName.push(item.defectName);
        })

        data.defectLines.map((item,n)=>{
          item.defectYields.map((v,i)=>{
            const defectyield = (v.yield*100).toFixed(2);
            return chartData.push([i,n,defectyield])
          })
        })
        // console.log('热力图表格数据---',chartData);
        this.setState({overallChart:data.defectLines,overallStation:data.stations,heatmapYield:defectYield,overallDefectName:defectName,overallData:chartData,loading:false},this.drawOverallHeatmap)
      })
  }
  drawOverallHeatmap=()=>{
    //overallXHighlightData和overallYHighlightData是用于隐藏的x，y轴做准备，点击热力图时使用
    const overallXHighlightData = this.state.overallStation.map((v,i)=>{
      return ''
    });
    const overallYHighlightData = this.state.overallDefectName.map((v,i)=>{
      return ''
    });
    const overallHeatmap = echarts.init(document.getElementById('DimOverallHeatmap'));
    const sumYield = this.state.heatmapYield;
    const overallOption = {
      tooltip: {
        position: 'bottom'
      },
      animation: false,
      grid: {
        height: '80%',
        y: '10%',
        left:'25%',
        top:'10%',
        bottom:'10%'
      },
      // dataZoom: [
      //   {
      //     show: true,
      //     realtime: true,
      //     start: 0,
      //     end: 60,
      //     top:0,
      //     xAxisIndex:[0,1],
      //     // handleStyle: {
      //     //   color: '#ff0000' ,
      //     //   borderWidth: 0 ,
      //     // },
      //     height:15,
      //     showDetail:false
      //   },
      //   {
      //     type: 'inside',
      //     realtime: true,
      //     start: 0,
      //     end: 60,
      //   },
      //
      // ],
      xAxis: [
        {
          type: 'category',
          name:'value/%',
          data: this.state.overallStation,
          axisTick:{
            interval:0
          },
          splitArea: {
            show: true
          },

          position:'top',
          triggerEvent:true,
          axisLabel:{
            interval:0,
            rich:{},
            // width:40,
            // height:10,
            padding:10,
            // backgroundColor:'red',
          }
        },
        {
          type: 'category',
          data: overallXHighlightData,
          axisTick:{
            // show:false,
            interval:0
          },
          splitArea: {
            show: true
          },

          position:'top',
          triggerEvent:true,
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
          data: this.state.overallDefectName,
          axisTick:{
            interval:0
          },
          splitArea: {
            show: true,
          },
          axisLabel:{
            padding:5,
            interval:0,
            rich:{},
            height:10,
            backgroundColor:'white',
            lineHeight:10,
            formatter: function(value,index){
              return(
                `${value}    ${(sumYield[index]*100).toFixed(2)+'%'}`
              )
            }
          },
          triggerEvent:true,
        },
        {
          type: 'category',
          data: overallYHighlightData,
          axisTick:{
            interval:0
          },
          splitArea: {
            show: true
          },
          position:'left',
          axisLabel:{
            padding:5,
            interval:0,
            rich:{},
            height:10,
            // width:100,
            lineHeight:10,
            backgroundColor:'red',
            showMinLabel:true,
            formatter: function (value,index) {
              return(
                value !== ''? `${value}    ${(sumYield[index]*100).toFixed(2)+'%'}`:``
              )
            }
          },
          triggerEvent:true,
        }
      ],
      visualMap: {
        min: 0,
        max: 100,
        splitNumber: 4,
        color: ['#d94e5d','#eac736','#50a3ba'],
        orient: 'horizontal',
        align:'left',
        left: 'center',
        bottom: '0%',
        textStyle: {
          color: '#000',

        }
      },
      series: [{
        name: 'Punch Card',
        type: 'heatmap',
        data: this.state.overallData,
        label: {
          normal: {
            show: true
          }
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    overallHeatmap.setOption(overallOption);
    //Axis添加点击事件
    overallHeatmap.on('click',(e)=>{
      if(e.componentType === 'xAxis' || e.componentType === 'series'){
        if(e.componentType === 'xAxis'){
          //cnc8_wcnc4_qc站点可以有CNC-7，CNC-8;   cnc10_wcnc4_qc 和 laser_qc 站点可以有CNC-7，CNC-8,CNC-9，CNC-10
          if(e.value == 'cnc8_wcnc4_qc' || e.value == 'cnc10_wcnc5_qc' || e.value == 'laser_qc'){
            this.setState({machineName:'CNC7 Machine#'})
          }else{
            return;
          }
          for (var i = 0; i < overallXHighlightData.length; i++) {
            if (e.value === this.state.overallStation[i]) {
              overallXHighlightData[i] = e.value;
            }
            else {
              overallXHighlightData[i] = '';
            }
          }
          //y轴若有选中状态，则取消，变为全未选中状态
          for (var k = 0; k < overallYHighlightData.length; k++) {
            overallYHighlightData[k] = '';
          }
          this.setState({clickStationName:e.value,clickDefectName:''});
        }
        else{              //点击的值
          if(e.name == 'cnc8_wcnc4_qc' || e.name == 'cnc10_wcnc5_qc' || e.name == 'laser_qc'){
            this.setState({machineName:'CNC7 Machine#'})
          }else{
            return;
          }
          let clickY = '';
          for (var m = 0; m < overallXHighlightData.length; m++) {            // 对应的x轴背景变红色
            if (e.name === this.state.overallStation[m]) {
              overallXHighlightData[m] = e.name;
            }
            else {
              overallXHighlightData[m] = '';
            }
          }
          for (var n = 0; n < overallYHighlightData.length; n++) {        // 对应的y轴背景变红色
            if (e.value[1] === n) {
              overallYHighlightData[n] = this.state.overallDefectName[n];
              clickY = this.state.overallDefectName[n]
            }
            else {
              overallYHighlightData[n] = '';
            }
          }
          this.setState({clickDefectName:clickY,clickStationName:e.name});
        }
        this.clickChartRequest('clickOverallHeatmapX');
      }
      else if(e.componentType === 'yAxis'){
        for (var j = 0; j < overallYHighlightData.length; j++) {
          if (e.value === this.state.overallDefectName[j]) {
            overallYHighlightData[j] = e.value;
          }
          else {
            overallYHighlightData[j] = '';
          }
        }
        //x轴若有选中状态，则取消，变为全未选中状态
        for (var k = 0; k < overallXHighlightData.length; k++) {
          overallXHighlightData[k] = '';
        }
        this.setState({clickStationName:'',clickDefectName:e.value});
        this.clickChartRequest('clickOverallHeatmapY')
      }
      overallHeatmap.setOption(overallOption, true);
    })
  }
  clickChartRequest = (type)=>{
    this.setState({loading:true});
    if(type === 'clickOverallHeatmapX'){
      const requestCon = {};
      const param = Object.assign({}, this.props.global.dateTime, {mapping: this.props.global.topSelectItem},
        {stationName: this.state.clickStationName, machineName: this.state.machineName, defectName: this.state.clickDefectName});
      requestCon.data = JSON.stringify(param);
      // console.log('requestCon---', requestCon);
      reqwest({
        url:`${global.constants.ip}/full/dimensional/oneStation`,
        method:'post',
        type:'json',
        data:requestCon,
      })
        .then(data=>{
          console.log('点击x轴或者值后，获得的图表数据==',data);
          //整理overallData数据
          const chartData=[];
          data.machineTable.yields.map((item,n)=>{
            item.map((v,i)=>{
              const defectyield = (v.yield*100).toFixed(2);
              return chartData.push([n,i,defectyield])
            })
          })
          this.setState({lineChartData:data.lineChart,showParticularLine:'particularLine'},this.drawLineChart);
          this.setState({particularChart:data.machineTable,particularXData:data.machineTable.cells,
            particularYData:data.machineTable.mcs,particularData:chartData,showParticularHeatmap:'particularHeatmap',loading:false},this.drawParticularChart)
        })
    }
    else if(type === 'clickOverallHeatmapY'){
      const requestCon = {};
      const param = Object.assign({}, this.props.global.dateTime, {mapping: this.props.global.topSelectItem},{defectName:this.state.clickDefectName});
      requestCon.data = JSON.stringify(param);
      // console.log('requestCon---', requestCon);
      reqwest({
        url:`${global.constants.ip}/full/dimensional/oneDefect`,
        method:'post',
        type:'json',
        data:requestCon,
      })
        .then(data=>{
          // console.log('点击Y轴后，获得的lineChart数据==',data);
          this.setState({lineChartData:data,showParticularLine:'particularLine',showParticularHeatmap:'none',loading:false},this.drawLineChart)
        })
    }
    else if(type === 'clickParticularHeatmapValue'){
      const requestCon = {},condition={};
      condition.defectName = this.state.clickDefectName;
      condition.stationName = this.state.clickStationName;
      condition.machineName = this.state.machineName;
      condition.cell = this.state.clickParticularX;
      condition.mc = this.state.clickParticularY;
      const param = Object.assign({}, this.props.global.dateTime, {mapping: this.props.global.topSelectItem},condition);
      requestCon.data = JSON.stringify(param);
      reqwest({
        url:`${global.constants.ip}/full/dimensional/oneMachine`,
        method:'post',
        type:'json',
        data:requestCon,
      })
        .then(data=>{
          console.log('点击Particular heatmap后，获得的lineChart数据==',data);
          this.setState({lineChartData:data,loading:false},this.drawLineChart)
        })
    }
  }
  drawParticularChart=()=>{
    //ParticularHeatmap
    const particularXHighlightData = this.state.particularXData.map((v,i)=>{
      return ''
    });
    const particularYHighlightData = this.state.particularYData.map((v,i)=>{
      return ''
    });
    const particularHeatmap = echarts.init(document.getElementById('DimParticularHeatmap'));
    const particularOption = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '80%',
        y: '10%',
        left:'15%',
        top:'10%',
        bottom:'10%'
      },
      // dataZoom: [
      //   {
      //     show: true,
      //     realtime: true,
      //     start: 0,
      //     end: 100,
      //     top:0,
      //     xAxisIndex:[0,1]
      //   },
      //   {
      //     type: 'inside',
      //     realtime: true,
      //     start: 0,
      //     end: 100,
      //   },
      //
      // ],
      xAxis: [
        {
          type: 'category',
          name:'value/%',
          data: this.state.particularXData,
          axisTick:{
            interval:0
          },
          splitArea: {
            show: true
          },

          position:'top',
          triggerEvent:true,
          axisLabel:{
            interval:0,
            rich:{},
            // width:40,
            // height:10,
            padding:10,
            // backgroundColor:'red',
          }
        },{
          type: 'category',
          data: particularXHighlightData,
          axisTick:{
            // show:false,
            interval:0
          },
          splitArea: {
            show: true
          },

          position:'top',
          triggerEvent:true,
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
          data: this.state.particularYData,
          axisTick:{
            interval:0
          },
          splitArea: {
            show: true
          },
          axisLabel:{
            padding:10,
            interval:0,
            rich:{},
            height:10,
            // width:100,
            lineHeight:10,
          },
          triggerEvent:true,
        },{
          type: 'category',
          data: particularYHighlightData,
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
            showMinLabel:true
          },
          triggerEvent:true,
        }],
      visualMap: {
        min: 0,
        max: 100,
        splitNumber: 4,
        color: ['#d94e5d','#eac736','#50a3ba'],
        orient: 'horizontal',
        align:'left',
        left: 'center',
        bottom: '0%',
        textStyle: {
          color: '#000',

        }
      },
      series: [{
        name: 'Punch Card',
        type: 'heatmap',
        data: this.state.particularData,
        label: {
          normal: {
            show: true
          }
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    particularHeatmap.setOption(particularOption);
    particularHeatmap.on('click',(e)=>{
      let clickparticularY = '';
      if(e.componentType === 'series'){       //只能点击值，获取线图数据
        for (var m = 0; m < particularXHighlightData.length; m++) {            // 对应的x轴背景变红色
          if (e.name === this.state.particularXData[m]) {
            particularXHighlightData[m] = e.name;
          }
          else {
            particularXHighlightData[m] = '';
          }
        }
        for (var n = 0; n < particularYHighlightData.length; n++) {        // 对应的x轴背景变红色
          if (e.value[1] === n) {
            particularYHighlightData[n] = this.state.particularYData[n];
            clickparticularY = this.state.particularYData[n]
          }
          else {
            particularYHighlightData[n] = '';
          }
        }
        this.setState({clickParticularX:e.name, clickParticularY:clickparticularY});
        this.clickChartRequest('clickParticularHeatmapValue');
      }
      particularHeatmap.setOption(particularOption, true);
    });
  }
  drawLineChart = ()=>{
    //  Particular Line chart
    const lineD =this.state.lineChartData;
    // lineD.series[0].data = lineD.series[0].data.map((v,i)=>{
    //   return (Number(v)*100).toFixed(2)
    // })
    const particularLine = echarts.init(document.getElementById('DimPaiticularLine'));
    const particularLineOption = {
      color:['#188fff'],
      tooltip:{},
      xAxis: {
        type: 'category',
        data:  lineD.xAxis.data
      },
      yAxis: {
        type: 'value',
        name: 'yield / %',
        axisLine:{
          show:false
        },
        splitLine:{
          show:false
        },
        scale:true,
      },
      series: [{
        data: lineD.series[0].data,
        type: 'line',
        symbol:'circle',
        symbolSize:8,
        itemStyle:{
          normal:{
            borderColor:'white',  //拐点边框颜色
            borderWidth:2
          }
        }
      }]
    };
    particularLine.setOption(particularLineOption);
    //防止多次点击事件
    // if(particularLine._$handlers.click){
    //   particularLine._$handlers.click.length = 0;
    // }
    // particularLine.on('click',(param)=>{
    //   alert('被点击了！！')
    // })
  }
  handleChange=(value)=> {
    console.log(`selected ${value}`);
    this.setState({machineName:value});
    this.clickChartRequest('clickOverallHeatmapX');
  }
  render(){
    return (
      <div>
        <Spin spinning={this.state.loading}>
        <div>
          <p className={styles.title} >
            Overall heatmap
          </p>
          <div>
            <div id='DimOverallHeatmap' style={{display:'inline-block'}} className={styles.overallHeatmap} />
          </div>
        </div>
        {/* 下级热力图 */}
        <div id={styles.particularHeatmapCon} className={this.state.showParticularHeatmap}>
          <p className={styles.title} >
            Heatmap by CNC
          </p>
          <Select defaultValue='title' value={this.state.machineName} style={{ width: 180,zIndex:1 }} onChange={this.handleChange}>
            <Option value='title' disabled>Please choose one</Option>
            <Option value="CNC7 Machine#">CNC-7</Option>
            <Option value="CNC8 Machine#">CNC-8</Option>
            <Option value="CNC9 Machine#">CNC-9</Option>
            <Option value="CNC10 Machine#">CNC-10</Option>
          </Select>
          <div id='DimParticularHeatmap' style={{width:'95%',margin:'0 auto',top:'-30px'}} className={styles.particularHeatmap} />
        </div>
        {/* line chart  Trend analysis of paiticular defect and machine*/}
        <div id={styles.particularLineCon} className={this.state.showParticularLine}>
          <p className={styles.title} >
            Yield trend
          </p>
          <div id='DimPaiticularLine' className={styles.particularLine} />
        </div>
        </Spin>
      </div>
    )
  }
}
export default Dimensional;

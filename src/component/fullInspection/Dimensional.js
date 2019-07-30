import React ,{ Component }from 'react';
import echarts from 'echarts';
import {Select} from "antd";
import styles from "./fullInspection.less";

const { Option } = Select;

var hours = ['2d-bc-qc', 'cnc5-qc', 'tri-qc', '2d-bc-le', 'im-qc', 'sf-qc', 'cnc8-wcnc4-qc',
  'sb-qc', 'ano-qc', 'cnc10-wcnc5-qc','laser-qc','fqc'];
var days = ['Under Milling@Inner Surface', 'Under Milling@Screw Hole', 'DDS@Bottom',
  'DDS@Datum A', 'DDS@Inner surface', 'DDS@Lip', 'DDS@Logo','DDS@Scorpius Cover','DDS@Sidewall',
  'DDS@Volcano Base','DDS@Woofer','DDS@Magnet','Al impurity to Split','Split Bright Edge','Split Chalkiness','Split Extra Plastic'];
const heatmapYield = ['11.40%','2.22%','34.46%','3.65%','4.56%','11.40%','2.22%','34.46%','3.65%','4.56%','11.40%','2.22%','34.46%','3.65%','4.56%','6.45%']
// [y坐标,x坐标,value]
var data = [[0,0,5],[0,1,1],[0,2,10],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],
  [1,0,0],[1,1,0],[1,2,0],[1,3,0],[1,4,0], [1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[1,11,2],
  [2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],
  [3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],
  [4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2], [4,10,4],[4,11,4],
  [5,0,9], [5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,10,4],[5,11,1],
  [6,0,0],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0], [6,9,0],[6,10,1],[6,11,0],
  [7,0,5], [7,2,0],[7,3,3],[7,4,6],[7,5,0],[7,6,2],[7,11,8],
  [8,0,1],[8,1,0],[8,2,0],[8,3,0],[8,4,0],[8,5,0],[8,6,0],[8,7,0],[8,8,0], [8,9,0],[8,11,0],
  [9,3,3],[9,4,0],[9,5,5],[9,6,3],[9,7,0],[9,8,2],[9,11,1],
  [10,0,0],[10,1,0],[10,2,0], [10,11,0],
  [11,0,5], [11,2,0],[11,3,3],[11,4,6],[11,5,0],[11,6,2],[11,11,8],
  [12,0,1],[12,1,0],[12,2,0],[12,3,0],[12,4,0],[12,5,0],[12,6,0],[12,7,0],
  [13,5,5],[13,6,10],[13,8,8], [13,11,11],
  [14,0,0], [14,2,2],[14,3,3],[14,4,4],[14,5,5],[14,6,10],[14,11,3],
  [15,0,1],[15,1,0],[15,2,0],[15,3,0],[15,4,0],[15,5,0],[15,6,0],[15,7,0],
];
// [x坐标,y坐标,value]
data = data.map(function (item) {
  return [item[1], item[0], item[2] || '-'];
});

class Dimensional extends Component{
  state={
    showParticularHeatmap:'none',
    showParticularLine:'none'
  }
  componentDidMount() {
    const overallXHighlightData = ['', '', '', '', '', '', '', '', '', '','',''];
    const overallYHighlightData = ['', '', '', '', '', '', '','','', '', '', '', '', '', '',''];
    const overallHeatmap = echarts.init(document.getElementById('DimOverallHeatmap'));
    const overallOption = {
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
          data: hours,
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
          data: days,
          axisTick:{
            interval:0
          },
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
                `${value}    ${heatmapYield[index]}`
              )
            }
          },
          triggerEvent:true,
        },{
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
            padding:8,
            interval:0,
            rich:{},
            height:10,
            // width:100,
            lineHeight:10,
            backgroundColor:'red',
            showMinLabel:true,
            formatter: function (value,index) {
              return(
                value !== ''? `${value}    ${heatmapYield[index]}`:``
              )
            }
          },
          triggerEvent:true,
        }],
      visualMap: {
        min: 0,
        max: 10,
        splitNumber: 4,
        color: ['red','#ff6d02','#37A2DA'],
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
        data: data,
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
      if(e.componentType === 'xAxis'){
        for (var i = 0; i < overallXHighlightData.length; i++) {
          if (e.value === hours[i]) {
            overallXHighlightData[i] = e.value;
          }
          else {
            overallXHighlightData[i] = '';
          }
        }
        this.setState({showParticularHeatmap:'particularHeatmap'});
      }else if(e.componentType === 'yAxis'){
        for (var j = 0; j < overallYHighlightData.length; j++) {
          if (e.value === days[j]) {
            overallYHighlightData[j] = e.value;
          }
          else {
            overallYHighlightData[j] = '';
          }
        }
        this.setState({showParticularHeatmap:'none'});
      }else{
        console.log('点击的是值--',e.value)
      }
      overallHeatmap.setOption(overallOption, true);
      this.setState({showParticularLine:'particularLine'},this.drawParticularChart);
    })
  }
  drawParticularChart=()=>{
    //ParticularHeatmap
    const particularXHighlightData = ['', '', '', '', '', '', '', '', '', '','',''];
    const particularYHighlightData = ['', '', '', '', '', '', '','','', '', '', '', '', '', '',''];
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
          data: hours,
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
          data: days,
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
        max: 10,
        splitNumber: 4,
        color: ['red','#ff6d02','#37A2DA'],
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
        data: data,
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
      if(e.componentType === 'xAxis'){
        for (var i = 0; i < particularXHighlightData.length; i++) {
          if (e.value === hours[i]) {
            particularXHighlightData[i] = e.value;
          }
          else {
            particularXHighlightData[i] = '';
          }
        }
      }else if(e.componentType === 'yAxis'){
        for (var j = 0; j < particularYHighlightData.length; j++) {
          if (e.value === days[j]) {
            particularYHighlightData[j] = e.value;
          }
          else {
            particularYHighlightData[j] = '';
          }
        }
      }else{
        console.log('点击的是值--',e.value)
      }
      particularHeatmap.setOption(particularOption, true);
    });

    //  Particular Line chart
    const particularLine = echarts.init(document.getElementById('DimPaiticularLine'));
    const particularLineOption = {
      color:['#188fff'],
      tooltip:{},
      xAxis: {
        type: 'category',
        data:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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
        data: [820, 932, 901, 934, 1290, 1330, 1320],
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
    if(particularLine._$handlers.click){
      particularLine._$handlers.click.length = 0;
    }
    particularLine.on('click',(param)=>{
      alert('被点击了！！')
    })
  }
  handleChange(value) {
    console.log(`selected ${value}`);
  }
  render(){
    return (
      <div>
        <div>
          <p className={styles.title} >
            Defect Analysis - Dimensional Page - Overall dashboard of F/R in process flow
          </p>
          <div>
            <div id='DimOverallHeatmap' style={{display:'inline-block'}} className={styles.overallHeatmap}></div>
          </div>
        </div>
        {/* 下级热力图 */}
        <div id={styles.particularHeatmapCon} className={this.state.showParticularHeatmap}>
          <p className={styles.title} >
            Defect Analysis - Dimensional Page - Particular defect and step defect heatmap
          </p>
          <Select defaultValue='title' style={{ width: 180,zIndex:1 }} onChange={this.handleChange}>
            <Option value='title' disabled>Please choose one</Option>
            <Option value="CNC-7">CNC-7</Option>
            <Option value="CNC-8">CNC-8</Option>
            <Option value="CNC-9">CNC-9</Option>
            <Option value="CNC-10">CNC-10</Option>
          </Select>
          <div id='DimParticularHeatmap' style={{width:'95%',margin:'0 auto',top:'-30px'}} className={styles.particularHeatmap}></div>
        </div>
        {/* line chart  Trend analysis of paiticular defect and machine*/}
        <div id={styles.particularLineCon} className={this.state.showParticularLine}>
          <p className={styles.title} >
            Defect Analysis - Dimensional Page - Trend analysis of paiticular defect and machine
          </p>
          <div id='DimPaiticularLine' className={styles.particularLine}></div>
        </div>
      </div>
    )
  }
}
export default Dimensional;

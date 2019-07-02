import React,{Component} from 'react';
import { Table,Icon } from 'antd';
import echarts from 'echarts';
import styles from './AimTablePage.less'
import {connect} from "react-redux";

//Aim station 表格头部信息
const stationTitle = ['Spline magnet loading force','Orion_gap_offset','RC/Strobe Gap/Offset','Inner XY','Datum A Flatness',
  'Split Width/Offset(4G)','Noodle_gap_offset','HE'];
const plusTableTitle = ['AIM#1','AIM#2','AIM#3','AIM#4','AIM#5','AIM#6'];
const stationDataSource = [
  {
    key: '1',
    type:'Input',
    'Spline magnet loading force': 115,
    'Orion_gap_offset': 32,
    'RC/Strobe Gap/Offset': 45545,
    'Inner XY': 455,
    'Datum A Flatness':54148,
    'Split Width/Offset(4G)':454,
    'Noodle_gap_offset':45889,
    'HE':85258
  },{
    key: '2',
    type:'Ok',
    'Spline magnet loading force': 115,
    'Orion_gap_offset': 32,
    'RC/Strobe Gap/Offset': 45545,
    'Inner XY': 455,
    'Datum A Flatness':54148,
    'Split Width/Offset(4G)':454,
    'Noodle_gap_offset':45889,
    'HE':85258
  },{
    key: '3',
    type:'NG',
    'Spline magnet loading force': 115,
    'Orion_gap_offset': 32,
    'RC/Strobe Gap/Offset': 45545,
    'Inner XY': 455,
    'Datum A Flatness':54148,
    'Split Width/Offset(4G)':454,
    'Noodle_gap_offset':45889,
    'HE':85258
  },{
    key: '4',
    type:'Yield',
    'Spline magnet loading force': 115,
    'Orion_gap_offset': 32,
    'RC/Strobe Gap/Offset': 45545,
    'Inner XY': 455,
    'Datum A Flatness':54148,
    'Split Width/Offset(4G)':454,
    'Noodle_gap_offset':45889,
    'HE':85258
  }
  ];
const plusDataSource = [
  {
    key: '1',
    type:'Input',
    'AIM#1': 115,
    'AIM#2': 32,
    'AIM#3': 45545,
    'AIM#4': 455,
    'AIM#5':54148,
    'AIM#6':454,
  },{
    key: '2',
    type:'Ok',
    'AIM#1': 115,
    'AIM#2': 32,
    'AIM#3': 45545,
    'AIM#4': 455,
    'AIM#5':54148,
    'AIM#6':454,
  },{
    key: '3',
    type:'NG',
    'AIM#1': 115,
    'AIM#2': 32,
    'AIM#3': 45545,
    'AIM#4': 455,
    'AIM#5':54148,
    'AIM#6':454,
  },{
    key: '4',
    type:'Yield',
    'AIM#1': 115,
    'AIM#2': 32,
    'AIM#3': 45545,
    'AIM#4': 455,
    'AIM#5':54148,
    'AIM#6':454,
  }
]

@connect(({global}) => ({
  global
}))
class AimTablePage extends Component{
  state ={
    showAimPlus:'none',
    showBarChart:'none',
    showLineChart:'none'

  }
  componentDidMount() {
    const barOption = {
      color:['#f5bd27'],
      tooltip:{},
      xAxis: {
        type: 'value',
        axisLine:{
          show:false
        },
        splitLine:{
          show:false
        }
      },
      yAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        type: 'category',

      },
      series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        barWidth:'60%'
      }]
    };
    const lineOption = {
      color:['#188fff'],
      tooltip:{},
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value',
        axisLine:{
          show:false
        },
        splitLine:{
          show:false
        }
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
    echarts.init(document.getElementById('barchart')).setOption(barOption);
    const lineChart = echarts.init(document.getElementById('linechart'));
    lineChart.setOption(lineOption);
    lineChart.on('click',(e)=>{
      alert('线图被点击了');
      console.log('线图被点击了===',e)
    })
  }

  clickStationName = e =>{
    console.log('clickStationName====',e.target.innerText);
    this.setState({showAimPlus:'none',showBarChart:'showBarChart',showLineChart:'showLineChart'})
  }
  clickStationPlus = e =>{
    console.log('clickStationPlus====',e.currentTarget.previousElementSibling.innerText);
    this.setState({showAimPlus:'showAimPlus'})
  }

  render(){
    console.log('state----',this.props.global);
    const stationColums =[],plusTableColumns = [];
    stationTitle.map((v,i)=>{
      const column = {};
      column.title=<div><span onClick={this.clickStationName}>{v}</span>&nbsp;&nbsp;&nbsp;<Icon onClick={this.clickStationPlus} type='plus-circle' /></div>;
      column.key=v;
      column.dataIndex = v;
      column.onHeaderCell = function (column) {
        return {
          onMouseMove:(e)=>{
            e.currentTarget.classList.add('hoverHeaderCell');
          },
          onMouseLeave:(e)=>{
            e.currentTarget.classList.remove('hoverHeaderCell')
          },
          onClick:(e)=>{
            const brotherNode = e.currentTarget.parentNode.childNodes;
            for(let i=0;i<brotherNode.length;i++){
              brotherNode[i].classList.remove('ClickHeaderCell');
            }
            e.currentTarget.classList.add('ClickHeaderCell');
          }
        }
      }
      return stationColums.push(column);
    });
    plusTableTitle.map((title,k)=>{
      const column = {};
      column.title=<div><span onClick={this.clickStationName}>{title}</span></div>;
      column.key=title;
      column.dataIndex = title;
      column.onHeaderCell = function (column) {
        return {
          onMouseMove:(e)=>{
            e.currentTarget.classList.add('hoverHeaderCell');
          },
          onMouseLeave:(e)=>{
            e.currentTarget.classList.remove('hoverHeaderCell')
          },
          onClick:(e)=>{
            const brotherNode = e.currentTarget.parentNode.childNodes;
            for(let i=0;i<brotherNode.length;i++){
              brotherNode[i].classList.remove('ClickHeaderCell');
            }
            e.currentTarget.classList.add('ClickHeaderCell');
          }
        }
      }
      return plusTableColumns.push(column);
    })
    const firstColumn = {};
    firstColumn.title ='';
    firstColumn.key='type';
    firstColumn.dataIndex ='type';
    firstColumn.fixed='left';
    stationColums.unshift(firstColumn);
    plusTableColumns.unshift(firstColumn);
    return(
      <div>
        <p className={styles.tableName} >Reactive Table</p>
        {/*
          ** AIM table ，AIM# table ,barchart ,table ,linechart dispaly none;
          ** click station name,barchart ,table and linecahrt will change , for the selected station
          ** click station plus, and click AIM#, barchart ,table and linecahrt will change , for the selected AIM#
        */}
        <div style={{width:'95%',margin:'0 auto'}}>
          <Table size="small" columns={stationColums} dataSource={stationDataSource} scroll={{x: 'max-content'}} pagination={false} />
          <div id={styles.aimPlusTable} className={this.state.showAimPlus}>
            <p className={styles.tableName} >Reactive Table_Breakdown</p>
            <Table size="small" columns={plusTableColumns} dataSource={plusDataSource} scroll={{x: 'max-content'}} pagination={false} />
          </div>
        </div>

        <p className={styles.tableName} >AIM defect MIL</p>
        {/* no click event */}
        <div id={styles.showBarChart} className={this.state.showBarChart}>
          <div style={{height:'400px',margin:'0 auto'}} id='barchart'></div>
          <Table size="small" columns={stationColums} dataSource={stationDataSource} scroll={{x: 'max-content'}} pagination={false} />
        </div>
        <p className={styles.tableName} >AIM yield trend plot</p>
        <div style={{height:'400px',position:'relative',zIndex:'-1',top:'-200px'}} className={this.state.showLineChart} id='linechart'></div>
      </div>
    )
  }
}

export default AimTablePage;

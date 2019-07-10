import React,{Component} from 'react';
import { Table,Icon } from 'antd';
import echarts from 'echarts';
import reqwest from 'reqwest';
import styles from './AimTablePage.less'
import {connect} from "react-redux";

//Aim station 表格头部信息
// const stationTitle = ['Spline magnet loading force','Orion_gap_offset','RC/Strobe Gap/Offset','Inner XY','Datum A Flatness',
//   'Split Width/Offset(4G)','Noodle_gap_offset','HE'];
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
    showLineChart:'none',
    timeRange:{},
    mapping:'RTStanfordSilverDVT-1DVT-DOE14G',
    station:'',
    aimIp:'',
    stationTitle:[],   //station head and source
    stationDataSource:[],
    //plusTitle and source
    plusTitle:[],
    plusDataSource:[],
    spcTitle:[],  //spc head and source,spc yield
    spcDataSource:[],
    spcYield:[],
    spcname:[],
    //line chart yield
    lineTime:[],
    lineData:[],
  //  是否是通过点击线图更改时间
    clickLinePoint:false
  }
  componentDidMount() {
    this.fetch();
  }
  componentWillReceiveProps(nextProps) {
    console.log('条件改变--',nextProps.global)
    let mapping = '';
    Object.keys(nextProps.global.topSelectItem).map((v,i)=>{
      return mapping += nextProps.global.topSelectItem[v];
    })
    if(this.state.clickLinePoint === true){      //如果是通过点击线图更改时间，则不需要把station和aimIp条件置空，及页面显示不变
      if(JSON.stringify(nextProps.global.dateTime) !== JSON.stringify(this.state.timeRange) || mapping!==this.state.mapping){
        this.setState({timeRange:nextProps.global.dateTime,mapping: mapping,clickLinePoint:false},this.fetch)
      }
    }else{  //如果是手动更改顶部条件，一切选择情况清空,切aim下级隐藏不显示
      if(JSON.stringify(nextProps.global.dateTime) !== JSON.stringify(this.state.timeRange) || mapping!==this.state.mapping){
        this.setState({timeRange:nextProps.global.dateTime,mapping: mapping,showAimPlus:'none',station:'',aimIp:''},this.fetch)
      }
    }

  }
  fetch=()=>{
    const initcondition = {};
    initcondition.data = {};
    initcondition.data = JSON.stringify(Object.assign({},this.props.global.dateTime,{mapping:this.state.mapping,station:this.state.station,aimIp:this.state.aimIp}));
  console.log('取数据的条件',initcondition.data);
    reqwest({
      url:`http://${global.constants.ip}:${global.constants.port}/condition/getYield`,
      method:'post',
      type:'json',
      data:initcondition
    })
      .then(data=>{
        console.log("初始条件获得数据",data);
        if(data.stationYield !== null){
          const stationHead = [],stationDataSource=[];
          const columnTitle1 = {},columnTitle2={},columnTitle3 = {},columnTitle4={};
          columnTitle1.type='input';
          columnTitle1.key=1;
          columnTitle2.type='ok';
          columnTitle2.key=2;
          columnTitle3.type='ng';
          columnTitle3.key=3;
          columnTitle4.type='yield';
          columnTitle4.key=4;
          data.stationYield.map((v,i)=>{
            stationHead.push(v.name);
            columnTitle1[v.name]=v.input;
            columnTitle2[v.name]=v.ok;
            columnTitle3[v.name]=v.ng;
            columnTitle4[v.name]=v.yield;
            return ;
          })
          stationDataSource.push(columnTitle1,columnTitle2,columnTitle3,columnTitle4);
          this.setState({stationTitle:stationHead,stationDataSource:stationDataSource})
        }
        if(data.spcYields !== null){      //条形图数据
          //整理出表格头(条形图x轴坐标值)
          const spcHead = [],spcYield=[],spcname=[];
          Object.keys(data.spcYields[0]).map((key,i)=>{
            const object = {
              key:key,
              title:key,
              dataIndex:key
            }
            return spcHead.push(object);
          })
          //给值加唯一的key值
          data.spcYields.map((value,j)=>{
            spcname.push(value.name);
            spcYield.push(value.yield);
            return value.key=j;
          })
          this.setState({spcTitle:spcHead,spcDataSource:data.spcYields,spcYield:spcYield,spcname:spcname},this.drawBarAndLineChart)
        }else {
          this.setState({showBarChart:'none',spcTitle:[],spcDataSource:[],spcYield:[],spcname:[]},this.drawBarAndLineChart)
        }
        if(data.timeYields !== null){     //线图数据
          const linetime=[],linedata=[]
          data.timeYields.map((linevalue,n)=>{
            linetime.push(linevalue.time);
            return linedata.push(linevalue.yield)
          })
          this.setState({lineTime:linetime,lineData:linedata},this.drawBarAndLineChart)
        }else {
          this.setState({showLineChart:'none',lineTime:[],lineData:[]},this.drawBarAndLineChart)
        }
        if(data.aimYield && data.aimYield !== null){       //下级数据
          const plusHead = [],plusDataSource=[];
          const columnTitle1 = {},columnTitle2={},columnTitle3 = {},columnTitle4={};
          columnTitle1.type='input';
          columnTitle1.key=1;
          columnTitle2.type='ok';
          columnTitle2.key=2;
          columnTitle3.type='ng';
          columnTitle3.key=3;
          columnTitle4.type='yield';
          columnTitle4.key=4;
          data.aimYield.map((v,i)=>{
            plusHead.push(v.name);
            columnTitle1[v.name]=v.input;
            columnTitle2[v.name]=v.ok;
            columnTitle3[v.name]=v.ng;
            columnTitle4[v.name]=v.yield;
            return ;
          })
          plusDataSource.push(columnTitle1,columnTitle2,columnTitle3,columnTitle4);
          this.setState({plusTitle:plusHead,plusDataSource:plusDataSource})
        }
      })
  }
  clickStationName = e =>{
    console.log('clickStationName====',e.target.innerText);
    this.setState({showAimPlus:'none',showBarChart:'showBarChart',showLineChart:'showLineChart',station:e.target.innerText,aimIp:''},this.fetch);
  }
  drawBarAndLineChart(){
    //画条形图和线图
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
        data: this.state.spcname,
        type: 'category',

      },
      series: [{
        data: this.state.spcYield,
        type: 'bar',
        barWidth:'60%'
      }]
    };
    // console.log('画图的yield',this.state.spcYield)
    const aimlineOption = {
      color:['#188fff'],
      tooltip:{},
      xAxis: {
        type: 'category',
        data: this.state.lineTime
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
        data: this.state.lineData,
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
    const aimBarchart = echarts.init(document.getElementById('barchart'));
    const aimLineChart = echarts.init(document.getElementById('aimlinechart'));
    aimBarchart.setOption(barOption);
    aimLineChart.setOption(aimlineOption);
    //防止多次点击事件
    if(aimLineChart._$handlers.click){
      aimLineChart._$handlers.click.length = 0;
    }
    aimLineChart.on('click',(params)=>{
      const startT = new Date(params.name).getTime()-8*3600*1000;        //点击的日期，默认开始时间是早8点，需要改为0-23:59:59点
      const endT = new Date(params.name).getTime()+16*3600*1000-1000;
      const timeR = {};
      timeR.startTime = startT;
      timeR.endTime = endT;
      timeR.span = '8';
      this.setState({clickLinePoint:true})
      this.props.dispatch({
        type:'global/saveTime',
        payload:{
          timeR
        }
      })
    })
  }
  clickStationPlus = e =>{
    console.log('clickStationPlus====',e.currentTarget.previousElementSibling.innerText);
    this.setState({showAimPlus:'showAimPlus',station:e.currentTarget.previousElementSibling.innerText,aimIp:''},this.fetch)
  }
  clickPlusName = e =>{
    console.log('clickplusName====',e.target.innerText);
    this.setState({aimIp:e.target.innerText},this.fetch)
  }

  render(){
    // console.log('state----',this.props.global);
    const stationColums =[],plusTableColumns = [];
    this.state.stationTitle.map((v,i)=>{
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
    this.state.plusTitle.map((title,k)=>{
      const column = {};
      column.title=<div><span onClick={this.clickPlusName}>{title}</span></div>;
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
    });
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
          <Table size="small" columns={stationColums} dataSource={this.state.stationDataSource} scroll={{x: 'max-content'}} pagination={false} />
          <div id={styles.aimPlusTable} className={this.state.showAimPlus}>
            <p className={styles.tableName} >Reactive Table_Breakdown</p>
            <Table size="small" columns={plusTableColumns} dataSource={this.state.plusDataSource} scroll={{x: 'max-content'}} pagination={false} />
          </div>
        </div>

        <p className={styles.tableName} >AIM defect MIL</p>
        {/* no click event */}
        <div id={styles.showBarChart} className={this.state.showBarChart}>
          <div style={{height:'400px',margin:'0 auto'}} id='barchart'></div>
          <Table size="small" columns={this.state.spcTitle} dataSource={this.state.spcDataSource} scroll={{x: 'max-content'}} pagination={false} />
        </div>
        <p className={styles.tableName} >AIM yield trend plot</p>
        <div style={{height:'400px',position:'relative',zIndex:'-1',top:'-200px'}} className={this.state.showLineChart} id='aimlinechart'></div>
      </div>
    )
  }
}

export default AimTablePage;

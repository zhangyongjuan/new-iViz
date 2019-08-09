import React,{Component} from 'react';
import { Table,Icon } from 'antd';
import echarts from 'echarts';
import reqwest from 'reqwest';
import styles from './AimTablePage.less'
import {connect} from "react-redux";

//Aim station 表格头部信息
const spcHead = [
  {
    key:'name',
    title:'SPC',
    dataIndex:'name',
    width:100,
    render:(text)=><span style={{fontWeight:'bold',color:'rgba(0, 0, 0, 0.85)'}}>{text}</span>
  },{
    key:'lsl',
    title:'LSL',
    dataIndex:'lsl',
    width:100,
  },{
    key:'norminal',
    title:'Norminal',
    dataIndex:'norminal',
    width:100,
  },{
    key:'usl',
    title:'USL',
    dataIndex:'usl',
    width:100,
  },{
    key:'yield',
    title:'Yield',
    dataIndex:'yield',
    width:100,
  },{
    key:'std',
    title:'std',
    dataIndex:'std',
    width:100,
  }
];
@connect(({global}) => ({
  global
}))
class AimTablePage extends Component{
  state ={
    showAimPlus:'none',
    showBarChart:'none',
    showLineChart:'none',
    timeRange:{},
    mapping:{
      site: "",
      product: "",
      color: [],      //有全选和单选之分，全选时需要列出全部选择项
      build: "",
      special_build:"",
      wifi: []
    },
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
    clickLinePoint:false,
  }
  componentDidMount() {
    this.fetch();
  }
  componentWillReceiveProps(nextProps) {
    if(this.state.clickLinePoint === true){      //如果是通过点击线图更改时间，则不需要把station和aimIp条件置空，及页面显示不变
      if(JSON.stringify(nextProps.global.dateTime) !== JSON.stringify(this.state.timeRange) || JSON.stringify(nextProps.global.topSelectItem) !== JSON.stringify(this.state.mapping)){
        this.setState({timeRange:nextProps.global.dateTime,mapping: nextProps.global.topSelectItem,clickLinePoint:false},this.fetch)
      }
    }else{  //如果是手动更改顶部条件，一切选择情况清空,切aim下级隐藏不显示
      if(JSON.stringify(nextProps.global.dateTime) !== JSON.stringify(this.state.timeRange) || JSON.stringify(nextProps.global.topSelectItem) !== JSON.stringify(this.state.mapping)){
        this.setState({timeRange:nextProps.global.dateTime,mapping: nextProps.global.topSelectItem,showAimPlus:'none',station:'',aimIp:''},this.fetch)
      }
    }

  }
  fetch=()=>{
    const initcondition = {};
    initcondition.data = {};
    initcondition.data = JSON.stringify(Object.assign({},this.props.global.dateTime,{mapping:this.props.global.topSelectItem,station:this.state.station,aimIp:this.state.aimIp}));
    console.log('取数据的条件',initcondition);
    reqwest({
      url:`${global.constants.ip}/condition/getBackYield`,
      method:'post',
      type:'json',
      data:initcondition
    })
      .then(data=>{
        console.log("初始条件获得数据",data);
        if(data.stationYield !== null){
          const stationHead = [],stationDataSource=[];
          const columnTitle1 = {},columnTitle2={},columnTitle3 = {},columnTitle4={};
          columnTitle1.type='Input';
          columnTitle1.key=1;
          columnTitle2.type='OK';
          columnTitle2.key=2;
          columnTitle3.type='NG';
          columnTitle3.key=3;
          columnTitle4.type='Yield';
          columnTitle4.key=4;
          data.stationYield.map((v,i)=>{
            stationHead.push(v.name);
            columnTitle1[v.name]=v.input;
            columnTitle2[v.name]=v.ok;
            columnTitle3[v.name]=v.ng;
            columnTitle4[v.name]=((v.yield*100).toFixed(3))+'%';
            return ;
          })
          stationDataSource.push(columnTitle1,columnTitle2,columnTitle3,columnTitle4);
          this.setState({stationTitle:stationHead,stationDataSource:stationDataSource})
        }
        if(data.spcYields !== null && data.spcYields.length !== 0 ){      //条形图数据
          //首先从大到小排序
          data.spcYields.sort((a,b)=>{
            return b.yield-a.yield
          })
          //整理出表格头(条形图x轴坐标值)
          const spcYield=[],spcname=[];
          // Object.keys(data.spcYields[0]).map((key,i)=>{
          //   const object = {
          //     key:key,
          //     title:key,
          //     dataIndex:key
          //   }
          //   return spcHead.push(object);
          // })
          //给值加唯一的key值,整理条形图的数据
          data.spcYields.map((value,j)=>{
            spcname.push(value.name);
            //条形图不良率计算
            spcYield.push(((1-value.yield)*100).toFixed(3));
            //限制小数位数
            Object.keys(value).map((key,i)=>{
              if(value[key] === null)
                return;
              if(key === 'name'){
                return;
              }else if(key === 'yield'){
                return value[key] = (value[key]*100).toFixed(3) +'%'
              }else{
                return value[key] = value[key].toFixed(3)
              }
            })
            return value.key=j;
          })

          this.setState({spcTitle:spcHead,spcDataSource:data.spcYields,spcYield:spcYield,spcname:spcname},this.drawBarAndLineChart)
        }else {
          this.setState({showBarChart:'none',spcTitle:[],spcDataSource:[],spcYield:[],spcname:[]},this.drawBarAndLineChart)
        }
        if(data.timeYields !== null && data.timeYields.length !== 0){     //线图数据
          let linedata=[]
          data.timeYields.series[0].data.map((v,i)=>{
            linedata.push((v*100).toFixed(3));
          })
          const linetime = data.timeYields.xAxis.data;
          this.setState({lineTime:linetime,lineData:linedata},this.drawBarAndLineChart)
        }else {
          this.setState({showLineChart:'none',lineTime:[],lineData:[]},this.drawBarAndLineChart)
        }
        if(data.aimYield && data.aimYield !== null){       //下级数据
          const plusHead = [],plusDataSource=[];
          const columnTitle1 = {},columnTitle2={},columnTitle3 = {},columnTitle4={};
          columnTitle1.type='Input';
          columnTitle1.key=1;
          columnTitle2.type='OK';
          columnTitle2.key=2;
          columnTitle3.type='NG';
          columnTitle3.key=3;
          columnTitle4.type='Yield';
          columnTitle4.key=4;
          data.aimYield.map((v,i)=>{
            plusHead.push(v.name);
            columnTitle1[v.name]=v.input;
            columnTitle2[v.name]=v.ok;
            columnTitle3[v.name]=v.ng;
            columnTitle4[v.name]=(v.yield*100).toFixed(3)+'%';
            return ;
          })
          plusDataSource.push(columnTitle1,columnTitle2,columnTitle3,columnTitle4);
          this.setState({plusTitle:plusHead,plusDataSource:plusDataSource})
        }
      })
  }
  clickStationName = e =>{
    // console.log('clickStationName====',e.target.innerText);
    this.setState({showAimPlus:'none',showBarChart:'showBarChart',showLineChart:'showLineChart',station:e.target.innerText,aimIp:''},this.fetch);
  }
  drawBarAndLineChart(){
    //画条形图和线图
    const barOption = {
      color:['#f5bd27'],
      tooltip:{},
      grid:{
        top:15
      },
      xAxis: {
        type: 'value',
        name: 'defect yield / %',
        axisLine:{
          show:false
        },
        splitLine:{
          show:false
        },
        scale:true,
      },
      yAxis: {
        data: this.state.spcname,
        type: 'category',
      },
      series: [{
        data: this.state.spcYield,
        type: 'bar',
        barWidth:'60%',
        label: {
          normal: {
            show: true,
              position: 'right',
              color:'#000'
          }
        },
      }]
    };
    const aimlineOption = {
      color:['#188fff'],
      tooltip:{},
      xAxis: {
        type: 'category',
        data: this.state.lineTime
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
      if(params.name.length === 5){     //只有时间到日期格式2019-05-11时才能获取数据，否则不支持点击
        console.log('此时间点不能点击!')
      }else{
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
      }

    })
  }
  clickStationPlus = e =>{
    // console.log('clickStationPlus====',e.currentTarget.previousElementSibling.innerText);
    this.setState({showAimPlus:'showAimPlus',station:e.currentTarget.previousElementSibling.innerText,aimIp:''},this.fetch)
  }
  clickPlusName = e =>{
    // console.log('clickplusName====',e.target.innerText);
    this.setState({aimIp:e.target.innerText,showBarChart:'showBarChart',showLineChart:'showLineChart'},this.fetch)
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
      column.render = (text,record)=>record.type === 'Yield' && Number(text.split('%')[0]) > 95 ? <span style={{color:'green'}}>{text}</span> :<span style={{color:'black'}}>{text}</span>
      
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
    firstColumn.width=10;
    stationColums.unshift(firstColumn);
    plusTableColumns.unshift(firstColumn);
    return(
      <div>
        <p className={styles.tableName} >AIM Dashboard</p>
        {/*
          ** AIM table ，AIM# table ,barchart ,table ,linechart dispaly none;
          ** click station name,barchart ,table and linecahrt will change , for the selected station
          ** click station plus, and click AIM#, barchart ,table and linecahrt will change , for the selected AIM#
        */}
        <div style={{width:'95%',margin:'0 auto'}}>
          <Table size="small" columns={stationColums} dataSource={this.state.stationDataSource} scroll={{x: 'max-content'}} pagination={false} />
          <div id={styles.aimPlusTable} className={this.state.showAimPlus}>
            <p className={styles.tableName} style={{border:'none'}}>Reactive Table_Breakdown</p>
            <Table size="small" columns={plusTableColumns} dataSource={this.state.plusDataSource} scroll={{x: 'max-content'}} pagination={false} />
          </div>
        </div>

        <p className={styles.tableName} >Major issue list</p>
        {/* no click event */}
        <div id={styles.showBarChart} className={this.state.showBarChart}>
          <div style={{height:'400px',overflowY:'scroll'}}>
            <div style={{minHeight:'1000px',margin:'0 auto'}} id='barchart' />
          </div>
          <div style={{marginTop:'10px'}}>
            <Table size="small" columns={this.state.spcTitle} dataSource={this.state.spcDataSource} scroll={{y:370}} pagination={false} />
          </div>
        </div>
        <p className={styles.tableName} >Yield trend</p>
        <div style={{height:'400px',position:'relative',zIndex:'-1',top:'-200px'}} className={this.state.showLineChart} id='aimlinechart' />
      </div>
    )
  }
}

export default AimTablePage;

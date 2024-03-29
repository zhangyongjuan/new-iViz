import React,{Component} from 'react';
import { Table,Icon,Popover ,Spin} from 'antd';
import echarts from 'echarts';
import reqwest from 'reqwest';
import styles from './AimTablePage.less'
import {connect} from "react-redux";
import _ from "lodash";
import ToolTips from '../Tooltips/tooltip'

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
class AimTablePage extends Component{
  state ={
    //加载中
    loading:false,
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
  //  spc柱子被点击名称
    clickbarname:'',
  //  bar chart 鼠标悬浮在yAxis时，显示解释信息
    showbarYAxisName:''
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
    this.setState({loading:true});
    const initcondition = {};
    initcondition.data = {};
    initcondition.data = JSON.stringify(Object.assign({},this.props.global.dateTime,{mapping:this.props.global.topSelectItem,station:this.state.station,aimIp:this.state.aimIp,spc:this.state.clickbarname}));
    // console.log('取数据的条件',initcondition);
    reqwest({
      url:`${global.constants.ip}/condition/getBackYield`,
      method:'post',
      type:'json',
      data:initcondition
    })
      .then(data=>{
        // console.log("aim dashboard获得数据",data);
        if(data.stationYield !== null){
          const stationHead = [],stationDataSource=[];
          const columnTitle1 = {},columnTitle2={},columnTitle3 = {},columnTitle4={};
          columnTitle1.type='Input';
          columnTitle1.key=1;
          columnTitle2.type='OK';
          columnTitle2.key=2;
          columnTitle3.type='NG';
          columnTitle3.key=3;
          columnTitle4.type='Failure Rate';
          columnTitle4.key=4;
          data.stationYield.map((v,i)=>{
            stationHead.push(v.name);
            columnTitle1[v.name]=v.input;
            columnTitle2[v.name]=v.ok;
            columnTitle3[v.name]=v.ng;
            columnTitle4[v.name]=(((1-v.yield)*100).toFixed(2))+'%';
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
            spcYield.push(((1-value.yield)*100).toPrecision(2));
            //限制小数位数
            Object.keys(value).map((key,i)=>{
              if(value[key] === null)
                return;
              if(key === 'name'){
                return;
              }else if(key === 'yield'){
                return value[key] = ((1-value[key])*100).toPrecision(2) +'%'
              }else{
                return value[key] = value[key].toFixed(3)
              }
            })
            return value.key=j;
          })

          this.setState({spcTitle:spcHead,spcDataSource:data.spcYields,spcYield:spcYield,spcname:spcname},this.drawBarChart)
        }else {
          this.setState({showBarChart:'none',spcTitle:[],spcDataSource:[],spcYield:[],spcname:[]},this.drawBarChart)
        }
        if(data.timeYields !== null && data.timeYields.length !== 0){     //线图数据
          let linedata=[]
          data.timeYields.series[0].data.map((v,i)=>{
            linedata.push((1-v)*100);
          })
          const linetime = data.timeYields.xAxis.data;
          this.setState({lineTime:linetime,lineData:linedata},this.drawLineChart)
        }else {
          this.setState({showLineChart:'none',lineTime:[],lineData:[]},this.drawLineChart)
        }
        if(data.aimYield && data.aimYield !== null){       //下级数据
          const plusHead = [],plusDataSource=[];
          const columnTitle0 = {},columnTitle1 = {},columnTitle2={},columnTitle3 = {},columnTitle4={},columnTitle5={};
          columnTitle0.type='Line';
          columnTitle0.key=0;
          columnTitle1.type='Process';
          columnTitle1.key=1;
          columnTitle2.type='Input';
          columnTitle2.key=2;
          columnTitle3.type='OK';
          columnTitle3.key=3;
          columnTitle4.type='NG';
          columnTitle4.key=4;
          columnTitle5.type='Failure Rate';
          columnTitle5.key=5;
          data.aimYield.map((v,i)=>{
            plusHead.push(v.name);
            columnTitle0[v.name]=v.line;
            columnTitle1[v.name]=v.process;
            columnTitle2[v.name]=v.input;
            columnTitle3[v.name]=v.ok;
            columnTitle4[v.name]=v.ng;
            columnTitle5[v.name]=((1-v.yield)*100).toPrecision(2)+'%';
            return ;
          })
          plusDataSource.push(columnTitle0,columnTitle1,columnTitle2,columnTitle3,columnTitle4,columnTitle5);
          this.setState({plusTitle:plusHead,plusDataSource:plusDataSource})
        }
        this.setState({loading:false})
      })
  }
  clickStationName = e =>{
    // console.log('clickStationName====',e.target.innerText);
    this.setState({showAimPlus:'none',showBarChart:'showBarChart',showLineChart:'showLineChart',station:e.target.innerText,aimIp:'',clickbarname:''},this.fetch);
  }
  drawBarChart(){
    //画条形图
    const barOption = {
      color:['#f5bd27'],
      tooltip:{
        axisPointer: {
          type: 'shadow',
        },
        trigger: 'axis',
        formatter: (params) => {
          // console.log(params);
          let content = '';
          _.forEach(params, (k) => {
            if (k.value !== 0 && !k.value) return;
            content = content + `<div><span style="display:inline-block;border-radius:10px;width:10px;height:10px;background-color:${k.color};"></span><span style="margin-left: 5px;display: inline-block">Failure Rate：${k.value}%</span></div>`;
          });
          return `<div>${params && params.length !== 0 ? params[0].axisValue : ''}</div>` + content;
        },
      },
      grid:{
        top:15
      },
      xAxis: {
        type: 'value',
        // name: 'Failure rate / %',
        axisLine:{
          show:false
        },
        splitLine:{
          show:false
        },
        scale:true,
        axisLabel: {
          formatter: function(v) {
            return `${v}%`;
          },
        },
      },
      yAxis: {
        data: this.state.spcname,
        type: 'category',
        axisTick:{
          interval:0
        },
        triggerEvent:true,
        axisLabel:{
          interval:0
        }
      },
      series: [{
        data: this.state.spcYield,
        type: 'bar',
        barWidth:'60%',
        label: {
          normal: {
            show: true,
              position: 'right',
              color:'#000',
              formatter:(data)=> `${data.value}%`
          }
        },
      }]
    };
    const aimBarchart = echarts.init(document.getElementById('barchart'));
    aimBarchart.setOption(barOption);
    var autoHeight = barOption.yAxis.data.length * 50 +100;
    //获取 ECharts 实例容器的 dom 节点。
    aimBarchart.getDom().style.height = autoHeight + "px";
    aimBarchart.getDom().childNodes[0].style.height = autoHeight + "px";
    aimBarchart.getDom().childNodes[0].childNodes[0].setAttribute("height", autoHeight);
    aimBarchart.getDom().childNodes[0].childNodes[0].style.height = autoHeight + "px";
    aimBarchart.resize();
    //防止多次点击事件
    if(aimBarchart._$handlers.click){
      aimBarchart._$handlers.click.length = 0;
    }
  //  新添加的需求，柱子点击，线图改变
    aimBarchart.on('click','series',(params)=>{
      this.setState({clickbarname:params.name,loading:true});
      const initcondition = {};
      initcondition.data = {};
      initcondition.data = JSON.stringify(Object.assign({},this.props.global.dateTime,{mapping:this.props.global.topSelectItem,station:this.state.station,aimIp:this.state.aimIp,spc:params.name}));
      reqwest({
        url:`${global.constants.ip}/condition/getOneSpcLine`,
        method:'post',
        type:'json',
        data:initcondition
      })
        .then(data=>{
          // console.log('barchart 被点击了，获得的线图--',data);
          const linetime = data.xAxis.data;
          const chartD = [];
          data.series[0].data.map((value,i)=>{
            return chartD.push((1-Number(value))*100);
          })
          this.setState({lineTime:linetime,lineData:chartD,loading:false},this.drawLineChart)
        })
    })
  //  显示bar chart 解释信息
    aimBarchart.on('mouseover','yAxis',(e)=>{
      this.setState({showbarYAxisName:'Bar chart shows the failure rate of each SPCsorted from high to low'})
    })
    aimBarchart.on('mouseout','yAxis',(e)=>{
      this.setState({showbarYAxisName:''})
    })
  }
  drawLineChart(){
    //画线图
    const aimlineOption = {
      color:['#188fff'],
      tooltip:{
        formatter:function (data) {
          return `${data.name} :  ${Number(data.value).toFixed(2)}%`
        }
      },
      xAxis: {
        type: 'category',
        data: this.state.lineTime
      },
      yAxis: {
        type: 'value',
        name: 'Failure Rate',
        axisLine:{
          show:false
        },
        splitLine:{
          show:false
        },
        scale:true,
        axisLabel: {
          formatter:`{value}%`
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
            borderWidth:2,
          }
        },
        label: {
          normal: {
            show: true,
            position: 'top',
            color:'#000',
            formatter:function (data) {
              return Number(data.value).toFixed(2)+`%`
            }
          }
        },
      }]
    };
    const aimLineChart = echarts.init(document.getElementById('aimlinechart'));
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
    this.setState({showAimPlus:'showAimPlus',station:e.currentTarget.previousElementSibling.innerText,aimIp:'',clickbarname:''},this.fetch)
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
      column.title=<div style={{cursor:'pointer'}}><span onClick={this.clickStationName}>{v}</span>&nbsp;&nbsp;&nbsp;<Icon onClick={this.clickStationPlus} type='plus-circle' /></div>;
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
      column.title=<div style={{cursor:'pointer'}}><span onClick={this.clickPlusName}>{title}</span></div>;
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
    firstColumn.render = (text)=><Popover content={ToolTips('AimDashboard','dashboard',`${text}`)} ><span>{text}</span></Popover>
    firstColumn.fixed='left';
    firstColumn.width=100;
    stationColums.unshift(firstColumn);
    plusTableColumns.unshift(firstColumn);
    return(
      <Spin spinning={this.state.loading} delay={500}>
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

        <p className={styles.tableName} >Major Issue List</p>
        {/* no click event */}
        <div id={styles.showBarChart} className={this.state.showBarChart}>
          <p className={styles.barYAxisName}>{this.state.showbarYAxisName}</p>
          <div style={{height:'400px',overflowY:'scroll'}}>
            <div style={{margin:'0 auto'}} id='barchart' />
          </div>
          <div style={{marginTop:'10px'}}>
            <Table size="small" columns={this.state.spcTitle} dataSource={this.state.spcDataSource} scroll={{y:370}} pagination={false} />
          </div>
        </div>
        <p className={styles.tableName} >Failure Rate Trend</p>
        <div style={{height:'400px',position:'relative',zIndex:'-1',top:'-200px'}} className={this.state.showLineChart} id='aimlinechart' />
      </div>
      </Spin>

    )
  }
}

export default AimTablePage;

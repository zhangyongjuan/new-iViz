import React ,{ Component }from 'react';
import { Table,Card ,Statistic, Row, Col,Spin,Popover}from 'antd';
import echarts from 'echarts';
import reqwest from 'reqwest';
import TimeRange from '../layouts/TimeRange'
import styles from './summaryChart.less';
import {connect} from "react-redux";
import ToolTips from '../component/Tooltips/tooltip'
import _ from "lodash";


const reactiveTableColumn = [
  {
    title:'Process',
    key:'name',
    dataIndex:'name',
    width:250
  },{
    title:<Popover content={ToolTips('summaryPage','table','th2')} ><span>First Pass Yield</span></Popover>,
    key:'firstPass',
    dataIndex:'firstPass'
  },{
    title:<Popover content={ToolTips('summaryPage','table','th3')}><span>Final Pass Yield</span></Popover>,
    key:'finalPass',
    dataIndex:'finalPass'
  },{
    title:<Popover content={ToolTips('summaryPage','table','th4')}><span>Input</span></Popover>,
    key:'input',
    dataIndex:'input'
  },{
    title:<Popover content={ToolTips('summaryPage','table','th5')} placement="topRight" arrowPointAtCenter><span>Ouput</span></Popover>,
    key:'output',
    dataIndex:'output'
  }
]

@connect(({global}) => ({
  global
}))

class SummaryPage extends Component{
  state={
    loading:false,
    //顶栏
    firstPass:'',
    finalPass:'',
    // table
    stationYileds:[],
    //  pie chart
    pieYield:{},
  //  cosYields and dimYields
    cosYields:[],
    dimYields:[]
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.global.timeRangeComplete === true){
      this.fetch(nextProps);
    }
  }

  // componentDidMount() {
  //     this.fetch();
  //   // const requestCon = {};
  //   // const param = Object.assign({},this.props.global.dateTime,this.props.global.topSelectItem);
  //   // requestCon.data = JSON.stringify(param);
  //   // const { dispatch } = this.props;
  //   // dispatch({
  //   //   type: 'global/saveSummaryPageData',
  //   //   payload: requestCon,
  //   // });
  //   // console.log('test===',this.props)
  // }
  fetch=(Props)=> {
    this.setState({loading:true});
    const requestCon = {};
    const param = Object.assign({}, Props.global.dateTime, {mapping: Props.global.topSelectItem});
    requestCon.data = JSON.stringify(param);
    // console.log('requestCon---', requestCon);
    reqwest({
      url: `${global.constants.ip}/full/getHome`,
      method: 'post',
      type: 'json',
      data: requestCon
    })
      .then(data => {
        // console.log('总结页的数据====', data);
        //整理表格数据，并按照station的固定顺序显示，鸡肋的功能
        const newStation = [];
        data.stationYileds.map((item, i) => {
          item.firstPass = (item.firstPass * 100).toFixed(2) + '%';
          item.finalPass = (item.finalPass * 100).toFixed(2) + '%';
          item.key = i;
          //排序了
          switch (item.name) {
            case '2d-bc-le':
              newStation[0] = item;
              break;
            case 'cnc5-qc':
              newStation[1] = item;
              break;
            case 'tri-qc':
              newStation[2] = item;
              break;
            case 'im-qc':
              newStation[3] = item;
              break;
            case 'sf-qc':
              newStation[4] = item;
              break;
            case 'cnc8-wcnc4-qc':
              newStation[5] = item;
              break;
            case 'sb-qc':
              newStation[6] = item;
              break;
            case 'ano-qc':
              newStation[7] = item;
              break;case 'cnc10-wcnc5-qc':
              newStation[8] = item;
              break;
            case 'laser-qc':
              newStation[9] = item;
              break;
            case 'fqc':
              newStation[10] = item;
              break;
          }
          return newStation
        })
        this.setState({
          firstPass: data.firstPass,
          finalPass: data.finalPass,
          stationYileds: newStation,
          pieYield: data.pieYield,
          cosYields:data.pieYield.cosYields,
          dimYields:data.pieYield.dimYields,
          loading:false
        })
      })
  }
  drawPieChart=()=>{
    // console.log('环形图的数据==',this.state.pieYield);
    const pieVale = this.state.pieYield;
    //内圈类型和数据
    const discribeType=['cosmetic','dimensional'];
    var cosmeticCount = pieVale['cosmetic'];
    let dimensionalCount = pieVale['dimensional'];
    const cosmeticLegend=[{icon:'roundRect',name:'cosmetic'}];
    const dimensionalLegend=[{icon:'roundRect',name:'dimensional'}];
    //首先把cosmetic和dimensional的数据分开，以便每个类型用于取top10
    const cosmeticYield = [],dimensionalYield = [],outerValue=[];
    let dimtop9Sum = 0,costop9Sum = 0;
    pieVale.defectYields.map((item,j)=>{
      const type = (item.type).toLocaleLowerCase();
      if(type === 'cosmetic'){
        cosmeticYield.push(item);
      }else if(type === 'dimensional'){
        dimensionalYield.push(item);
      }
    })
    //对两种类型进行排序
    cosmeticYield.sort((cosA,cosB)=>{
        return cosB.yield - cosA.yield
    })
    dimensionalYield.sort((cosA,cosB)=>{
      return cosB.yield - cosA.yield
    })
    //获取top10
    //外圈的数据整合,图例整合
    cosmeticYield.map((cositem,j)=>{
      const d = {};
      if(j === 9){
        d.name='cosmetic_other';
        d.value=cosmeticCount - costop9Sum;
        outerValue.push(d);
        return cosmeticLegend.push(d.name);
      }else if(j < 9){
        costop9Sum = costop9Sum + cositem.count;
        d.name=cositem.name;
        d.value=cositem.count;
        outerValue.push(d);
        return cosmeticLegend.push(cositem.name);
      }
    })
    dimensionalYield.map((dimitem,i)=>{
      const d = {};
      if(i === 9){
        d.name='dimensional_other';
        d.value=dimensionalCount - dimtop9Sum;
        outerValue.unshift(d);
        return dimensionalLegend.push(d.name);
      }else if(i < 9){
        dimtop9Sum = dimtop9Sum + dimitem.count;
        d.name=dimitem.name;
        d.value=dimitem.count;
        outerValue.unshift(d);
        return dimensionalLegend.push(dimitem.name)
      }
    })
    //所有legend默认全选
    let cosmeticSelect = {},dimensionalSelect={};
    cosmeticLegend.map((legend,i)=>{
      cosmeticSelect[legend] = true
    })
    dimensionalLegend.map((legend,i)=>{
      dimensionalSelect[legend] = true
    })
    // console.log('outerValue---',outerValue)
    const staPie = echarts.init(document.getElementById('topCosmeticIssues'));
    const staPieOption = {
      // color:['#2f4554','#c23531','#6e7074','#61a0a8','#d48265','#B03A5B'],
      tooltip: {
        trigger: 'item',
        // formatter:function(v){
        //   // console.log(v);
        //   const FailureRate = ((1-v.data.yield)*100).toFixed(2);
        //   return `${v.name}: ${v.value}<br/>Failure Rate:${ FailureRate }%`
        // }
        formatter: `{a} <br/>{b}: {c} ({d}%)`
      },
      legend: [
        {
          // type: 'scroll',
          name:'dimensionalLegend',
          right:'0%',
          height:300,
          orient: 'vertical',
          // x: 'left',
          icon:'circle',
          data:dimensionalLegend,
          selected:dimensionalSelect,
          // selectedMode:'single'
        },
        {
          // type: 'scroll',
          name:'cosmeticLegend',
          left:'15%',
          height:300,
          orient: 'vertical',
          x: 'left',
          icon:'circle',
          data:cosmeticLegend,
          selected:cosmeticSelect,
        },
        ],
      series: [
        {
          name:'defect type',
          type:'pie',
          selectedMode: 'single',
          radius: [0, '30%'],
          label: {
            normal: {
              position: 'inner'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data:[
            // 内圈数据
            {value:dimensionalCount, name:'dimensional',yield:'0.11'},
            {value:cosmeticCount, name:'cosmetic',yield:'0.05745'},
          ],
        },
        {
          name:'defect type',
          type:'pie',
          radius: ['40%', '55%'],
          label: {
            normal: {
              show:false,
              // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              formatter: '{b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              // shadowBlur:3,
              // shadowOffsetX: 2,
              // shadowOffsetY: 2,
              // shadowColor: '#999',
              // padding: [0, 7],
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                // abg: {
                //     backgroundColor: '#333',
                //     width: '100%',
                //     align: 'right',
                //     height: 22,
                //     borderRadius: [4, 4, 0, 0]
                // },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 12,
                  lineHeight: 22
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            }
          },
          // 外圈数据，顺序需要手动和内圈对应，代码层面上没有联系
          // 可以重名
          data:outerValue
        }
      ]
    };
    staPie.setOption(staPieOption);
    window.addEventListener('resize', () => {
      staPie.resize();
    });
    //是否是第一次点击legend标志
    let onOff = true;
    const triggerAction = function(action,selected){
      const legend = [];
      for ( let name in selected) {
        if (selected.hasOwnProperty(name)) {
          legend.push({name: selected[name]});
        }
      }
      staPie.dispatchAction({
        type:action,
        batch:legend
      })
    }
    staPie.on('legendselectchanged',(e)=>{
      // console.log(e);
        if(e.name === 'dimensional'){
          staPieOption.series[0].data[0].value = dimensionalCount;
          if(e.selected.dimensional === false) {
            Object.keys(dimensionalSelect).map((v,i)=>{dimensionalSelect[v] = false});
            triggerAction('legendUnSelect',dimensionalLegend);
          }else{
            Object.keys(dimensionalSelect).map((v,i)=>{dimensionalSelect[v] = true});
            triggerAction('legendSelect',dimensionalLegend)
          }
          // staPie.setOption(staPieOption);
        }
        else if(e.name === 'cosmetic'){
          staPieOption.series[0].data[1].value = cosmeticCount;
          if(e.selected.cosmetic === false) {
            Object.keys(cosmeticSelect).map((v,i)=>{cosmeticSelect[v] = false});
            triggerAction('legendUnSelect',cosmeticLegend)
          }else{
            Object.keys(cosmeticSelect).map((v,i)=>{cosmeticSelect[v] = true});
            triggerAction('legendSelect',cosmeticLegend)
          }
          // staPie.setOption(staPieOption);
        }
        else{              //点击子legend时，需要判断父legend是否是选择选中状态，若不是，则不能点击显示子图例
          if(e.selected != undefined){
            // console.log('点的其他的legend--',e);
            let changeValue = 0;
            outerValue.map((v,i)=>{
              if(v.name === e.name){
                return changeValue = v.value
              }
            });
            if(cosmeticLegend.indexOf(e.name) !== -1){
              if(e.selected['cosmetic'] === false){
                cosmeticSelect[e.name] = false;
                // staPie.setOption(staPieOption);
              }else{
                // staPie.dispatchAction({
                //   type: 'legendToggleSelect',
                //   // 图例名称
                //   batch: e.name
                // })
                if(e.selected[e.name] === false){         //外圈数据被点击更改状态时，内部圈数据随着变化
                  staPieOption.series[0].data[1].value = staPieOption.series[0].data[1].value-changeValue;
                  cosmeticSelect[e.name] = false;
                }else{
                  staPieOption.series[0].data[1].value = staPieOption.series[0].data[1].value+changeValue;
                  cosmeticSelect[e.name] = true;
                }
                // staPie.setOption(staPieOption);
                // triggerAction('legendToggleSelect',e.name);
              }
          }
            else if((dimensionalLegend.indexOf(e.name) !== -1)){
            if(e.selected['dimensional'] === false){
              dimensionalSelect[e.name] = false;
              // staPie.setOption(staPieOption);
            }else{
              // staPie.dispatchAction({
              //   type: 'legendToggleSelect',
              //   // 图例名称
              //   batch: e.name
              // })
              if(e.selected[e.name] === false){         //外圈数据被点击更改状态时，内部圈数据随着变化
                staPieOption.series[0].data[0].value = staPieOption.series[0].data[0].value-changeValue;
                dimensionalSelect[e.name] = false;
              }else{
                staPieOption.series[0].data[0].value = staPieOption.series[0].data[0].value+changeValue;
                dimensionalSelect[e.name] = true;
              }
              // triggerAction('legendToggleSelect',e.name)
            }
          }
          }
        onOff = false;
      }
        staPie.setOption(staPieOption);
    })
  }
  render(){
    return (
      <div>
        <div>
          <TimeRange />
        </div>
        <Spin spinning={this.state.loading}>
          {/* overview summary */}
          <div className={styles.container}>
            <p className={styles.tableName}>Yield Overview</p>
            {/*<div style={{display:'inline-block',width:'400px',marginLeft:100}}>*/}
            {/*  <span className={styles.OverviewName}>Final Pass  &nbsp; | &nbsp;  First Pass</span> <br/>*/}
            {/*  <span style={{color:'#F6B300',marginRight:'30px'}} className={styles.OverviewNum}>9.7%</span><span style={{color:'#000'}} className={styles.OverviewNum}>9.75%</span>*/}
            {/*</div>*/}
            {/*<div style={{display:'inline-block'}}>*/}
            {/*  /!*<span style={{marginLeft:'25px'}} className={styles.OverviewName}>Quantity</span> <br/>*!/*/}
            {/*  <span className={styles.OverviewName}>Input Quantity  &nbsp; | &nbsp;  Output Quantity</span> <br/>*/}
            {/*  <span style={{color:'#0079fe'}} className={styles.OverviewNum}>12345</span><span style={{color:'#000',float:'right'}} className={styles.OverviewNum}>45454541</span>*/}
            {/*</div>*/}
            <OverviewSummary overViewValue={{'firstPass':this.state.firstPass,'finalPass':this.state.finalPass}} />
          </div>
        {/*  Reactive Table */}
          <div className={styles.container}>
            <p className={styles.tableName}>Process Yield Dashboard</p>
            <div style={{width:'95%',margin:'0 auto'}}>
              <Table size="small" columns={reactiveTableColumn} dataSource={this.state.stationYileds} pagination={false} />
            </div>
          </div>
          <div className={styles.container}>
            <p className={styles.tableName}>Major Issue Summary</p>
            {/*<div id='topCosmeticIssues' className={styles.summaryChart} />*/}
            {/*  可能会做成柱状图  */}
            <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
              <Col span={12}>
                <div>Top Cosmetic issues</div>
                <MajorIssueBarChart
                  params = {{
                    color:'#3a9fff',
                    data:this.state.cosYields
                  }} />
              </Col>
              <Col span={12}>
                <div>Top Dimensional Issues</div>
                <MajorIssueBarChart params = {{
                  color:'#f7bd26',
                  data:this.state.dimYields
                }} />
              </Col>
            </Row>
          </div>
        </Spin>
      </div>
    )
  }
}

function OverviewSummary(value) {
  const firstContent = ToolTips('summaryPage','overView','firstPass');
  const finalContent = ToolTips('summaryPage','overView','finalPass');
  return(
    <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
      <Col span={6}>
        <Popover content={firstContent}>
        <Card className={styles.overview}>
            <Statistic
              title=" First Pass"
              value={value.overViewValue.firstPass*100}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              // prefix={<Icon type="arrow-down" />}
              suffix="%"
            />
        </Card>
        </Popover>
      </Col>
      <Col span={6}>
        <Popover content={finalContent}>
        <Card className={styles.overview}>
          <Statistic
            title="Final Pass"
            value={value.overViewValue.finalPass*100}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            // prefix={<Icon type="arrow-up" />}
            suffix="%"
          />
        </Card>
        </Popover>
      </Col>

      {/*<Col span={6}>*/}
      {/*  <Card>*/}
      {/*    <Statistic*/}
      {/*      title="Input Quantity"*/}
      {/*      value={58321}*/}
      {/*      precision={2}*/}
      {/*      valueStyle={{ color: '#ff6d02' }}*/}
      {/*    />*/}
      {/*  </Card>*/}
      {/*</Col>*/}
      {/*<Col span={6}>*/}
      {/*  <Card>*/}
      {/*    <Statistic*/}
      {/*      title="Ouput Quantity"*/}
      {/*      value={7912254}*/}
      {/*      precision={2}*/}
      {/*      valueStyle={{ color: '#0079fe' }}*/}
      {/*    />*/}
      {/*  </Card>*/}
      {/*</Col>*/}
    </Row>
  )
}
class MajorIssueBarChart extends Component{
  // constructor(props) {
  //   super(props);
  // }
  state={
    color:[],
  //  xAxis
    yAxis: [],
  //  data
    data:[],
  }
  componentDidMount() {
    this.dataIntegrated(this.props.params);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.params !== this.props.params){
      this.dataIntegrated(nextProps.params);
    }
  }
  dataIntegrated  = (params)=>{
    //截取top 15即可
    const name = [],chartdata=[];
    // console.log('bar数据',params);
    (params.data).sort((itemA,itemB)=>{
      return itemA.yield-itemB.yield
    })
    params.data.map((item,i)=>{
      if(i > params.data.length-16){
        chartdata.push(((item.yield)*100).toPrecision(2));
        return name.push(item.name);
      }
    })
    // console.log(chartdata,name)
    this.setState({color:params.color,yAxis:name,data:chartdata},this.drawChart)
  }
  drawChart = ()=>{
    const barOption = {
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
      color:this.state.color,
      grid:{
        left:'30%',
      },
      xAxis: {
        type: 'value',
        axisLine:{
          show:false
        },
        splitLine:{
          show:false
        },
        scale:true
      },
      yAxis: {
        type: 'category',
        data: this.state.yAxis,
        axisLabel:{
          width:'50%',
          formatter:function (label) {
            // console.log(label.length);
            if(label.length > 25){
              return `${label.substr(0,30)}...`
            }else{
              return `${label}`
            }

          },
        },
      },
      series: [{
        data: this.state.data,
        type: 'bar',
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
    const myChart = echarts.init(this.refs.mybarChart);
    // const myChart = echarts.init(document.getElementById('cosBarChart'));
    myChart.setOption(barOption);
  }
  render() {
    return(
          <div ref="mybarChart" className='cosBarChart' style={{width:'100%',height:'600px'}} />
    )
  }
}

export default SummaryPage;

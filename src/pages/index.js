import React ,{ Component }from 'react';
import { Table,Card ,Statistic, Row, Col,Spin}from 'antd';
import echarts from 'echarts';
import reqwest from 'reqwest';
import TimeRange from '../layouts/TimeRange'
import styles from './summaryChart.less';
import {connect} from "react-redux";

const reactiveTableColumn = [
  {
    title:'Name',
    key:'name',
    dataIndex:'name',
    width:250
  },{
    title:'First Pass Yield',
    key:'firstPass',
    dataIndex:'firstPass'
  },{
    title:'Final Pass Yield',
    key:'finalPass',
    dataIndex:'finalPass'
  },{
    title:'Input',
    key:'input',
    dataIndex:'input'
  },{
    title:'Ouput',
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
    pieYield:{}
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.global.timeRangeComplete === true){
      this.fetch();
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
  fetch=()=> {
    this.setState({loading:true});
    const requestCon = {};
    const param = Object.assign({}, this.props.global.dateTime, {mapping: this.props.global.topSelectItem});
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
        data.stationYileds.map((value, i) => {
          value.firstPass = (value.firstPass * 100).toFixed(2) + '%';
          value.finalPass = (value.finalPass * 100).toFixed(2) + '%';
          return value.key = i;
        })
        this.setState({
          firstPass: data.firstPass,
          finalPass: data.finalPass,
          stationYileds: data.stationYileds,
          pieYield: data.pieYield,
          loading:false
        }, this.drawPieChart)
      })
  }
  drawPieChart=()=>{
    console.log('环形图的数据==',this.state.pieYield);
    const pieVale = this.state.pieYield;
    //内圈类型和数据
    const discribeType=['cosmetic','dimensional'];
    const cosmeticCount = pieVale['cosmetic'];
    const dimensionalCount = pieVale['dimensional'];
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
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: [
        {
          // type: 'scroll',
          name:'dimensionalLegend',
          right:150,
          height:300,
          orient: 'vertical',
          // x: 'left',
          icon:'circle',
          data:dimensionalLegend,
          selected:{},
          // selectedMode:'multiple'
        },
        {
          // type: 'scroll',
          name:'cosmeticLegend',
          left:250,
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
            {value:dimensionalCount, name:'dimensional'},
            {value:cosmeticCount, name:'cosmetic'},
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
    staPie.on('legendselectchanged',(e)=>{
        if(e.name === 'dimensional'){
          console.log(e);
          const selectAll = staPie.getOption().legend[1].data;
          e.selected.dimensional === false ? selectAll.map((v,i)=>{dimensionalSelect[v] = false}) :
            selectAll.map((v,i)=>{dimensionalSelect[v] = true});
          // console.log('dimensionalSelect====',dimensionalSelect)
          staPieOption.legend[1].selected = dimensionalSelect;
          staPie.setOption(staPieOption);
        }
        else if(e.name === 'cosmetic'){
          e.selected.cosmetic === false ? Object.keys(cosmeticSelect).map((v,i)=>{cosmeticSelect[v] = false}) :
            Object.keys(cosmeticSelect).map((v,i)=>{cosmeticSelect[v] = true});
          staPie.setOption(staPieOption);
        }
        else{
          if(e.selected != undefined){
            console.log('点的其他的legend--',e);
            if(cosmeticLegend.indexOf(e.name) !== -1){
              if(e.selected['cosmetic'] === false){
                cosmeticSelect[e.name] = false;
                staPie.setOption(staPieOption);
              }else{
                staPie.dispatchAction({
                  type: 'legendToggleSelect',
                  // 图例名称
                  batch: e.name
                })
              }
          }
            else if((dimensionalLegend.indexOf(e.name) !== -1)){
            if(e.selected['dimensional'] === false){
              dimensionalSelect[e.name] = false;
              staPie.setOption(staPieOption);
            }else{
              staPie.dispatchAction({
                type: 'legendToggleSelect',
                // 图例名称
                batch: e.name
              })
            }
          }
          }
        onOff = false;
      }
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
            <p className={styles.tableName}>Yield overview</p>
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
            <p className={styles.tableName}>Process yield dashboard</p>
            <div style={{width:'95%',margin:'0 auto'}}>
              <Table size="small" columns={reactiveTableColumn} dataSource={this.state.stationYileds} pagination={false} />
            </div>
          </div>
          <div className={styles.container}>
            <p className={styles.tableName}>Major issue summary</p>
            <div id='topCosmeticIssues' className={styles.summaryChart} />
          </div>
        </Spin>
      </div>
    )
  }
}
function OverviewSummary(value) {
  return(
    <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Final Pass"
            value={value.overViewValue.finalPass*100}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            // prefix={<Icon type="arrow-up" />}
            suffix="%"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title=" First Pass"
            value={value.overViewValue.firstPass*100}
            precision={2}
            valueStyle={{ color: '#cf1322' }}
            // prefix={<Icon type="arrow-down" />}
            suffix="%"
          />
        </Card>
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

export default SummaryPage;

import React ,{ Component }from 'react';
import { Table,Card ,Statistic, Row, Col}from 'antd';
import echarts from 'echarts';
import reqwest from 'reqwest';
import TimeRange from '../layouts/TimeRange'
import styles from './summaryChart.less';
import {connect} from "react-redux";

const reactiveTableColumn = [
  {
    title:'Name',
    key:'name',
    dataIndex:'name'
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
    //顶栏
    firstPass:'',
    finalPass:'',
    // table
    stationYileds:[],
    //  pie chart
    pieYield:{}
  }
  componentDidMount() {
    this.fetch();
    // const requestCon = {};
    // const param = Object.assign({},this.props.global.dateTime,this.props.global.topSelectItem);
    // requestCon.data = JSON.stringify(param);
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'global/saveSummaryPageData',
    //   payload: requestCon,
    // });
    // console.log('test===',this.props)
  }
  fetch=()=>{
    const requestCon = {};
    const param = Object.assign({},this.props.global.dateTime,{mapping:this.props.global.topSelectItem});
    requestCon.data = JSON.stringify(param);
    console.log('requestCon---',requestCon);
    reqwest({
      url:`${global.constants.ip}/full/getHome`,
      method:'post',
      type:'json',
      data:requestCon
    })
      .then(data=>{
        console.log('总结页的数据====',data)

      })

    const resulet = {
      "input": 600000,
      "output": 533424,
      "pieYield": {
        "cosmetic": 795894,
        "dimensional": 619324,
        "defectYields": [{
          "yield": 0.062388975,
          "count": 88294,
          "name": "DDS@Lip",
          "type": "cosmetic"
        }, {
          "yield": 0.06261862,
          "count": 88619,
          "name": "DDS@Datum A",
          "type": "cosmetic"
        }, {
          "yield": 0.06232397,
          "count": 88202,
          "name": "DDS@Bottom",
          "type": " dimensional"
        }, {
          "yield": 0.06263841,
          "count": 88647,
          "name": "Under Milling@Screw Hole",
          "type": "dimensional"
        }],
        "tmpDefect": []
      },
      "stationYileds": [{
        "output": 266505,
        "input": 300000,
        "name": "2d_bd_qc",
        "firstPass": 0.66682,
        "finalPass": 0.8716535
      }, {
        "output": 266919,
        "input": 300000,
        "name": "fqc",
        "firstPass": 0.66655,
        "finalPass": 0.8730185
      }],
      "firstPass": 0.44446886,
      "finalPass": 0.76096964
    };
    resulet.stationYileds.map((value,i)=>{
      value.firstPass = (value.firstPass*100).toFixed(2)+'%';
      value.finalPass = (value.finalPass*100).toFixed(2)+'%';
      return value.key=i;
    })
    this.setState({firstPass:resulet.firstPass,finalPass:resulet.finalPass,stationYileds:resulet.stationYileds,pieYield:resulet.pieYield},this.drawPieChart)
  }
  drawPieChart=()=>{
    console.log('环形图的数据==',this.state.pieYield);
    const pieVale = this.state.pieYield;
    //内圈类型和数据
    const discribeType=['cosmetic','dimensional'];
    const cosmeticCount = pieVale['cosmetic'];
    const dimensionalCount = pieVale['dimensional'];
    const cosmeticLegend=['cosmetic'];
    const dimensionalLegend=['dimensional'];
    //外圈的数据整合,图例整合
    const outerValue=[];
    pieVale.defectYields.map((item,i)=>{
      const d = {};
      d.name=item.name;
      d.value=item.count;
      outerValue.push(d);
      return item.type === 'cosmetic' ? cosmeticLegend.push(item.name) : dimensionalLegend.push(item.name)
    })

    //所有legend默认全选
    let cosmeticSelect = {},dimensionalSelect={};
    cosmeticLegend.map((legend,i)=>{
      cosmeticSelect[legend] = true
    })
    dimensionalLegend.map((legend,i)=>{
      dimensionalSelect[legend] = true
    })
    console.log('outerValue---',outerValue)
    const staPie = echarts.init(document.getElementById('topCosmeticIssues'));
    const staPieOption = {
      color:['#2f4554','#c23531','#6e7074','#61a0a8','#d48265','#B03A5B'],
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: [
        {
          type: 'scroll',
          name:'cosmeticLegend',
          right:100,
          height:150,
          orient: 'vertical',
          // x: 'right',
          data:cosmeticLegend,
          selected:cosmeticSelect,
        },
        {
          type: 'scroll',
          name:'dimensionalLegend',
          right:10,
          height:150,
          orient: 'vertical',
          x: 'left',
          data:dimensionalLegend,
          selected:dimensionalSelect,
          selectedMode:true
        }],
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
            {value:cosmeticCount, name:'cosmetic'},
            {value:dimensionalCount, name:'dimensional'}
          ],
        },
        {
          name:'defect type',
          type:'pie',
          radius: ['40%', '55%'],
          label: {
            normal: {
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

    staPie.on('legendselectchanged',(e)=>{
      // console.log(e)
      if(e.name === 'dimensional'){
        e.selected.dimensional === false ? Object.keys(dimensionalSelect).map((v,i)=>{dimensionalSelect[v] = false}) :
          Object.keys(dimensionalSelect).map((v,i)=>{dimensionalSelect[v] = true});
        staPie.setOption(staPieOption);
      }else if(e.name === 'cosmetic'){
        e.selected.cosmetic === false ? Object.keys(cosmeticSelect).map((v,i)=>{cosmeticSelect[v] = false}) :
          Object.keys(cosmeticSelect).map((v,i)=>{cosmeticSelect[v] = true});
        staPie.setOption(staPieOption);
      }else{
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
        }else if((dimensionalLegend.indexOf(e.name) !== -1)){
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
    })
  }
  render(){
    return (
      <div>
        <div>
          <TimeRange />
        </div>
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

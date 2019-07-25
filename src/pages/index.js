import React ,{ Component }from 'react';
import { Table,Card ,Statistic, Row, Col}from 'antd';
import echarts from 'echarts';
import TimeRange from '../layouts/TimeRange'
import styles from './summaryChart.less';

const reactiveTableColumn = [
  {
    title:'Name',
    key:'name',
    dataIndex:'name'
  },{
    title:'First Pass Yield',
    key:'firstYield',
    dataIndex:'firstYield'
  },{
    title:'Final Pass Yield',
    key:'finalYield',
    dataIndex:'finalYield'
  },{
    title:'Input Quantity',
    key:'inputQuantity',
    dataIndex:'inputQuantity'
  },{
    title:'Ouput Quantity',
    key:'ouputQuantity',
    dataIndex:'ouputQuantity'
  }
]
const reactiveTableData = [
  {
    key:0,
    name:'2d-bc-le',
    firstYield:'100%',
    finalYield:'26%',
    inputQuantity:37822,
    ouputQuantity:2331
  },{
    key:1,
    name:'cnc5-qc',
    firstYield:'100%',
    finalYield:'26%',
    inputQuantity:37822,
    ouputQuantity:2331
  }
]

class SummaryPage extends Component{
  componentDidMount() {
    const cosmeticIssuesOption ={
      title: {
        // text: '世界人口总量',
        subtext: 'Top Cosmetic Issues',
        left:'center',
        subtextStyle:{
          fontSize:16
        }
      },
      color:['rgb(56,160,255)'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        splitLine:{
          show:false
        },
        axisLine:{
          show:false
        },
        scale:true
      },
      yAxis: {
        type: 'category',
        data: ['巴西','印尼','美国','印度','中国']
      },
      series: [
        {
          name: '2012年',
          type: 'bar',
          data: [191325, 123438, 310100, 121594, 134141].sort(),
          barWidth:'50%'
        }
      ]
    };
    const dimensionalIssues ={
      title: {
        // text: '世界人口总量',
        subtext: 'Top Dimensional Issues',
        left:'center',
        subtextStyle:{
          fontSize:16
        }
      },
      color:['rgb(245,189,38)'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        splitLine:{
          show:false
        },
        axisLine:{
          show:false
        },
        scale:true
      },
      yAxis: {
        type: 'category',
        data: ['巴西','印尼','印度','中国','世界人口(万)']
      },
      series: [
        {
          name: '2012年',
          type: 'bar',
          data: [191325, 123438, 121594, 134141, 681807].sort(),
          barWidth:'50%'
        }
      ]
    };
    const topCosmeticIssues = echarts.init(document.getElementById('topCosmeticIssues'));
    const topDimensionalIssues = echarts.init(document.getElementById('topDimensionalIssues'));
    topCosmeticIssues.setOption(cosmeticIssuesOption);
    topDimensionalIssues.setOption(dimensionalIssues);
  }
  render(){
    return (
      <div>
        <div>
          <TimeRange />
        </div>
        {/* overview summary */}
        <div className={styles.container}>
          <p className={styles.tableName}>Overview Summary</p>
          {/*<div style={{display:'inline-block',width:'400px',marginLeft:100}}>*/}
          {/*  <span className={styles.OverviewName}>Final Pass  &nbsp; | &nbsp;  First Pass</span> <br/>*/}
          {/*  <span style={{color:'#F6B300',marginRight:'30px'}} className={styles.OverviewNum}>9.7%</span><span style={{color:'#000'}} className={styles.OverviewNum}>9.75%</span>*/}
          {/*</div>*/}
          {/*<div style={{display:'inline-block'}}>*/}
          {/*  /!*<span style={{marginLeft:'25px'}} className={styles.OverviewName}>Quantity</span> <br/>*!/*/}
          {/*  <span className={styles.OverviewName}>Input Quantity  &nbsp; | &nbsp;  Output Quantity</span> <br/>*/}
          {/*  <span style={{color:'#0079fe'}} className={styles.OverviewNum}>12345</span><span style={{color:'#000',float:'right'}} className={styles.OverviewNum}>45454541</span>*/}
          {/*</div>*/}
          <OverviewSummary />
        </div>
      {/*  Reactive Table */}
      <div className={styles.container}>
        <p className={styles.tableName}>Reactive Table</p>
        <div style={{width:'95%',margin:'0 auto'}}>
          <Table size="small" columns={reactiveTableColumn} dataSource={reactiveTableData} pagination={false} />
        </div>
      </div>
        <div className={styles.container}>
          <p className={styles.tableName}>Defect Summary Chart</p>
          <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
            <Col span={12}>
              <div id='topCosmeticIssues' className={styles.summaryChart}></div>
            </Col>
            <Col span={12}>
              <div id='topDimensionalIssues' className={styles.summaryChart}></div>
            </Col>
          </Row>
        </div>
      </div>

    )
  }
}
function OverviewSummary() {
  return(
    <Row gutter={16} style={{textAlign:'center',width:'95%',margin:'0 auto'}}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Final Pass"
            value={99.7}
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
            value={95.6}
            precision={2}
            valueStyle={{ color: '#cf1322' }}
            // prefix={<Icon type="arrow-down" />}
            suffix="%"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Input Quantity"
            value={58321}
            precision={2}
            valueStyle={{ color: '#ff6d02' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Ouput Quantity"
            value={7912254}
            precision={2}
            valueStyle={{ color: '#0079fe' }}
          />
        </Card>
      </Col>
    </Row>
  )
}
export default SummaryPage;

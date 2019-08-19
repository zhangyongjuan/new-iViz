import React, {Component} from 'react';
import {DatePicker, Select,Button} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import reqwest from 'reqwest';
import styles from './index.css'
import locale from 'antd/lib/date-picker/locale/zh_CN';

const {RangePicker} = DatePicker;
const {Option} = Select;

@connect(({global}) => ({
  global
}))
class TimeRange extends Component {
  state = {
    timeRange: {},
    selectOption:{},   //selectOption为所有选择项
    SelectItem:{       //SelectItem为已选择的项
      site: "",
      product: "",
      color: [],      //有全选和单选之分，全选时需要列出全部选择项
      build: "",
      special_build:"",
      wifi: []         //有全选和单选之分，全选时需要列出全部选择项
    },
    selectNowValue:{
      sites: [],
      products: [],
      colors: [],
      builds: [],
      special_builds:[],
      wifis: []
    }
  }
  timeChange = (value, dateString) => {
    // console.log('Selected Time: ', value);
    // console.log('Formatted Selected Time: ', dateString);
    const startT = new Date(dateString[0]).getTime();        //开始时间的毫秒
    const endT = new Date(dateString[1]).getTime();          //截止时间的毫秒
    const timeR = {};
    timeR.startTime = startT;
    timeR.endTime = endT;
    timeR.span = '8';
    this.props.dispatch({
      type:'global/saveTime',
      payload:{
        timeR
      }
    })
    // this.setState({timeRange: timeR},this.fetch)
  }
  componentDidMount() {
    //首先获取顶部六个下拉条件，其中color和wifis是全选和多选两个选项
    this.fetch();
  }
  fetch= ()=>{
    const con = {};
    con.data=JSON.stringify(this.state.timeRange);
    reqwest({
      url:`${global.constants.ip}/condition/getTimeRange`,
      method:'get',
      type:'json',
      data:con
    })
      .then(data=>{
        console.log('获取的顶部时间和下拉框===',data);
        //更新时间段
        const timeR = {};
        timeR.startTime = data.timeStart;
        timeR.endTime = data.timeEnd;
        timeR.span = '8';
        this.setState({timeRange: timeR});
        this.props.dispatch({
          type:'global/saveTime',
          payload:{
            timeR
          }
        });

      //  更新下拉框,selectOption为所有选择项
        if(data.colors.length !== 0){
          data.colors.unshift('all');
        }
        if(data.wifis.length !== 0){
          data.wifis.unshift('all');
        }
        if(data.special_builds.length !== 0){
          data.special_builds.unshift('all');
        }
        const selectOption = Object.assign({},data);
        delete selectOption.timeStart;
        delete selectOption.timeEnd;
        this.setState({selectOption:selectOption});
      //  更新默认选项
        const selectItem = {},nowValue={};
          selectItem.site= data.sites[0];
          selectItem.product= data.products[0];
          selectItem.color= data.colors;
          selectItem.build= data.builds[0];
          selectItem.special_build=data.special_builds;
          selectItem.wifi= data.wifis;
        nowValue.sites= [data.sites[0]];
        nowValue.products= [data.products[0]];
        nowValue.colors= data.colors;
        nowValue.builds= [data.builds[0]];
        nowValue.special_builds=data.special_builds;
        nowValue.wifis= data.wifis;
        this.setState({SelectItem:selectItem,selectNowValue:nowValue});
        // console.log('初始条件--',selectItem)
        //把默认选项存入store中
        this.props.dispatch({
          type:'global/saveSelectCondition',
          payload:{
            selectItem
          }
        })
        this.props.dispatch({
          type:'global/changeTimeRangeStatus',
          payload:{
            status:true
          }
        });
      })
  }
  handleChange = (value,key) => {
    console.log(`selected ${key}:${value}`);
    const selectItem = {},nowValue = {};
    switch (key) {
      case 'sites':
        selectItem.site = value;
        nowValue.sites = [value];
        break;
      case 'products':
        selectItem.product = value;
        nowValue.products = [value];
        break;
      case 'colors':
        value === 'all' ? selectItem.color = this.state.selectOption.colors : selectItem.color = [value];
        value === 'all' ? nowValue.colors = this.state.selectOption.colors : nowValue.colors = [value];
        break;
      case 'builds':
        selectItem.build = value;
        nowValue.builds = [value];
        break;
      case 'special_builds':
        value === 'all' ? selectItem.special_build = this.state.selectOption.special_builds : selectItem.special_build = [value];
        value === 'all' ? nowValue.special_builds = this.state.selectOption.special_builds : nowValue.special_builds = [value];
        break;
      case 'wifis':
        value === 'all' ? selectItem.wifi = this.state.selectOption.wifis : selectItem.wifi = [value];
        value === 'all' ? nowValue.wifis = this.state.selectOption.wifis : nowValue.wifis = [value];
        break;
      default:
        break;
    }
    const select = Object.assign({},this.state.SelectItem,selectItem);
    const nowselct = Object.assign({},this.state.selectNowValue,nowValue);
    this.setState({SelectItem:select,selectNowValue:nowselct});
    console.log('更改条件---',select)
    this.props.dispatch({
      type:'global/saveSelectCondition',
      payload:{
        selectItem
      }
    })
  }
  onTimeOk = (value) => {
    // console.log('onOk: ', value);
    // const startT = new Date(value[0]).getTime();        //开始时间的毫秒
    // const endT = new Date(value[1]).getTime();          //截止时间的毫秒
    // const timeR = {};
    // timeR.startTime = startT;
    // timeR.endTime = endT;
    // timeR.span = '8';
    // this.props.dispatch({
    //   type:'global/saveTime',
    //   payload:{
    //     timeR
    //   }
    // })
    // this.setState({timeRange: timeR},this.fetch)
  }
  latestWeek = () => {
    const nowtime = new Date().getTime();
    const lastSenven = nowtime-1000*60*60*24*7
    console.log(nowtime)
    // this.setState({ open: false,nowtime:nowtime,lastSenven: lastSenven});
  }
  render() {
    return (
      <div className={styles.timeRangeCon}>
        <span style={{color:'black'}}>Time Range:</span>
        <RangePicker
          format="YYYY-MM-DD HH:mm:ss"
          onChange={this.timeChange}
          onOk={this.onTimeOk}
          allowClear={false}
          ranges={{
            Today: [moment().startOf('day'), moment().endOf('day')],
            'This Week': [moment().startOf('week'), moment().endOf('week')],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
          }}
          showTime={{
            hideDisabledOptions: true,
            // defaultValue: [moment('2019-5-14 00:00:00', 'YYYY-MM-DD HH:mm:ss'), moment('2019-5-15 23:59:59', 'YYYY-MM-DD HH:mm:ss')]
          }}
          defaultValue={[moment(new Date(this.props.global.dateTime.startTime),'YYYY-MM-DD HH:mm:ss'), moment(new Date(this.props.global.dateTime.endTime),'YYYY-MM-DD HH:mm:ss')]}
          value={[moment(new Date(this.props.global.dateTime.startTime),'YYYY-MM-DD HH:mm:ss'), moment(new Date(this.props.global.dateTime.endTime),'YYYY-MM-DD HH:mm:ss')]}
          style={{marginRight: '20px', fontSize: '12px'}} locale={locale}
          // renderExtraFooter={() => (            //后续需要添加最近一周，最近一月等按钮
          //   <Button size="small" type="primary" onClick={this.latestWeek}>
          //     latest week
          //   </Button>
          // )}
        />

          {
            Object.keys(this.state.selectOption).map((key, i) =>
              <Select key={key} value={this.state.selectNowValue[key][0] !== undefined ? this.state.selectNowValue[key][0] : key} className={styles.topSelect} onChange={(value)=>this.handleChange(value,key)}>
                <Option className={styles.topselectOption} value='disabled' disabled>{key}</Option>
                {
                  this.state.selectOption[key].map((v, k) =>
                    <Option className={styles.topselectOption} key={v} value={v}>{v}</Option>
                  )
                }
              </Select>
            )
          }

      </div>
    )
  }
}

export default TimeRange;

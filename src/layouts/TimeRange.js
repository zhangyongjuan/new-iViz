import React, {Component} from 'react';
import {DatePicker, Select} from 'antd';
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
    selectOption:{},
    SelectItem:{
      site: "",
      product: "",
      color: [],      //有全选和单选之分，全选时需要列出全部选择项
      build: "",
      special_build:"",
      wifi: []         //有全选和单选之分，全选时需要列出全部选择项
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
    this.setState({timeRange: timeR},this.fetch)
  }
  componentDidMount() {
    //首先获取顶部六个下拉条件，其中color和wifis是全选和多选两个选项
    this.fetch();
  }
  fetch=()=>{
    const con = {};
    con.data=JSON.stringify(this.state.timeRange);
    reqwest({
      url:`http://${global.constants.ip}:${global.constants.port}/condition/getTimeRange`,
      method:'get',
      type:'json',
      data:con
    })
      .then(data=>{
        // console.log('获取的顶部时间和下拉框===',data);
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
        })
      //  更新下拉框
        data.colors.unshift('all');
        data.wifis.unshift('all');
        const selectOption = Object.assign({},data);
        delete selectOption.timeStart;
        delete selectOption.timeEnd;
        this.setState({selectOption:selectOption});
      //  更新默认选项
        const selectItem = {};
          selectItem.site= data.sites[0];
          selectItem.product= data.products[0];
          selectItem.color= data.colors;
          selectItem.build= data.builds[0];
          selectItem.special_build=data.special_builds[0];
          selectItem.wifi= data.wifis;
        this.setState({SelectItem:selectItem});
        //把默认选项存入store中
        this.props.dispatch({
          type:'global/saveSelectCondition',
          payload:{
            selectItem
          }
        })
      })
  }
  handleChange = (value,key) => {
    console.log(`selected ${key}:${value}`);
    const selectItem = {};
    switch (key) {
      case 'sites':
        selectItem.site = value;
        break;
      case 'products':
        selectItem.product = value;
        break;
      case 'colors':
        value === 'all' ? selectItem.color = this.state.selectOption.colors : selectItem.color = [value];
        break;
      case 'builds':
        selectItem.build = value;
        break;
      case 'speacil_Builds':
        selectItem.special_build = value;
        break;
      case 'wifis':
        value === 'all' ? selectItem.wifi = this.state.selectOption.wifis : selectItem.wifi = [value];
        break;
      default:
        break;
    }
    this.props.dispatch({
      type:'global/saveSelectCondition',
      payload:{
        selectItem
      }
    })
  }
  onOk = (value) => {
    // console.log('onOk: ', value);
  }
  render() {
    return (
      <div className={styles.timeRangeCon}>
        <span style={{color:'black'}}>Time Range:</span>
        <RangePicker
          format="YYYY-MM-DD HH:mm:ss"
          onChange={this.timeChange}
          onOk={this.onOk}
          showTime={{
            hideDisabledOptions: true,
            defaultValue: [moment('2019-5-14 00:00:00', 'YYYY-MM-DD HH:mm:ss'), moment('2019-5-15 23:59:59', 'YYYY-MM-DD HH:mm:ss')]
          }}
          defaultValue={[moment(new Date(this.props.global.dateTime.startTime),'YYYY-MM-DD HH:mm:ss'), moment(new Date(this.props.global.dateTime.endTime),'YYYY-MM-DD HH:mm:ss')]}
          value={[moment(new Date(this.props.global.dateTime.startTime),'YYYY-MM-DD HH:mm:ss'), moment(new Date(this.props.global.dateTime.endTime),'YYYY-MM-DD HH:mm:ss')]}
          style={{marginRight: '20px', fontSize: '12px'}} locale={locale}
        />

          {
            Object.keys(this.state.selectOption).map((key, i) =>
              <Select key={key} defaultValue={this.state.selectOption[key].length !== 0 ? this.state.selectOption[key][0] : key} className={styles.topSelect} onChange={(value)=>this.handleChange(value,key)}>
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

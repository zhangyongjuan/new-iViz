import React, {Component} from 'react';
import {DatePicker, Select} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import styles from './index.css'
import locale from 'antd/lib/date-picker/locale/zh_CN';

const {RangePicker} = DatePicker;
const {Option} = Select;
// const vendorOption = ['RT','CTC','McEG'];
// const productCodeOption = ['J71B','J320'];
// const colorOption = ['NDA'];
// const buildOption = ['DVT'];
// const speacilBuildOption = ['DVT-DOE1'];
// const wifiOption = ['4G','WIFI'];
const selectOption = {
  'Vendor': ['RT', 'CTC', 'McEG'],
  'Product Code': ['J71B', 'J320'],
  'Color': ['NDA'],
  'Build': ['DVT'],
  'Speacil Build': ['DVT-DOE1'],
  '4G/WIFI': ['4G', 'WIFI'],
}

@connect(({global}) => ({
  global
}))
class TimeRange extends Component {
  state = {
    timeRange: {},
  }
  timeChange = (value, dateString) => {
    // console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    const startT = new Date(dateString[0]).getTime();        //开始时间的毫秒
    const endT = new Date(dateString[1]).getTime();          //截止时间的毫秒
    const timeR = {};
    timeR.startTime = startT;
    timeR.endTime = endT;
    timeR.span = '8';
    this.setState({timeRange: timeR})
    this.props.dispatch({
      type:'global/saveTime',
      payload:{
        timeR
      }
    })
  }

  handleChange = (value,key) => {
    console.log(`selected ${key}:${value}`);
    const item = {};
    item.vendor = value;
    this.props.dispatch({
      type:'global/saveSelectCondition',
      payload:{
        item
      }
    })
  }
  onOk = (value) => {
    // console.log('onOk: ', value);
  }
  render() {
    return (
      <div className={styles.timeRangeCon}>
        <span>Time Range:</span>
        <RangePicker
          format="YYYY-MM-DD HH:mm:ss"
          onChange={this.timeChange}
          onOk={this.onOk}
          showTime={{
            hideDisabledOptions: true,
            // defaultValue: [moment('2019-5-14 00:00:00', 'YYYY-MM-DD HH:mm:ss'), moment('2019-5-15 11:59:59', 'YYYY-MM-DD HH:mm:ss')],
            defaultValue: [moment('2019-5-14 00:00:00', 'YYYY-MM-DD HH:mm:ss'), moment('2019-5-15 23:59:59', 'YYYY-MM-DD HH:mm:ss')]
          }}
          defaultValue={[moment('2019-5-14 00:00:00', 'YYYY-MM-DD HH:mm:ss'), moment('2019-5-15 23:59:59', 'YYYY-MM-DD HH:mm:ss')]}
          style={{marginRight: '20px', fontSize: '12px'}} locale={locale}
        />
        {
          Object.keys(selectOption).map((key, i) =>
            <Select key={key} defaultValue={key} className={styles.topSelect} onChange={(value)=>this.handleChange(value,key)}>
              <Option className={styles.topselectOption} value='disabled' disabled>{key}</Option>
              {
                selectOption[key].map((v, k) =>
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

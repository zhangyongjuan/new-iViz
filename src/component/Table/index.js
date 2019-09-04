import React from 'react';
import {Popover, Table} from 'antd';
import ToolTips from "../Tooltips/tooltip";

const columns = [
  {
    title: 'SPC',
    dataIndex: 'name',
    key: 'name',
    align:'center'
  },
  {
    title:<Popover content={ToolTips('AimDashboard','table','lsl')} ><span>LSL</span></Popover>,
    dataIndex: 'lsl',
    key: 'lsl',
    align:'center'
  },
  {
    title: 'Norminal',
    dataIndex: 'norminal',
    key: 'norminal',
    align:'center'
  },
  {
    title:<Popover content={ToolTips('AimDashboard','table','usl')} ><span>USL</span></Popover>,
    dataIndex: 'usl',
    key: 'usl',
    align:'center'
  },
  {
    title:<Popover content={ToolTips('comparisonAnalysis','table','mean')} ><span>Mean</span></Popover>,
    dataIndex: 'actualMean',
    key: 'actualMean',
    align:'center',
    render:text=>text===0?0:text.toFixed(2)
  },
  {
    title:<Popover content={ToolTips('AimDashboard','dashboard','Failure Rate')} ><span>Failure Rate</span></Popover>,
    dataIndex: 'yield',
    key: 'yield',
    align:'center',
    render:(text)=>text===0?0:`${(Number(1-text)*100).toFixed(2)}%`
  },
  {
    title:<Popover content={ToolTips('formulaShows','showInfo','std')} ><span>Std</span></Popover>,
    dataIndex: 'std',
    key: 'std',
    align:'center',
    render:text=>text===0?0:text.toFixed(2)
  },
];

class BasicTable extends React.Component {
  render() {
    const {data,rowKey,loading}=this.props;
    return (
      <div style={{marginTop:30}}>
        <Table
          rowKey={r=>r[rowKey]}
          bordered
          // scroll={{ y: 400 }}
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default BasicTable;

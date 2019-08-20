import React from 'react';
import { Table } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    align:'center'
  },
  {
    title: 'LSL',
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
    title: 'USL',
    dataIndex: 'usl',
    key: 'usl',
    align:'center'
  },
  {
    title: 'Actual Mean',
    dataIndex: 'actualMean',
    key: 'actualMean',
    align:'center',
    render:text=>text===0?0:text.toFixed(2)
  },
  {
    title: 'Defect Yield',
    dataIndex: 'yield',
    key: 'yield',
    align:'center',
    render:(text)=>text===0?0:`${(Number(1-text)*100).toFixed(2)}%`
  },
  {
    title: 'Std',
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

import React from 'react';
import { Table } from 'antd';


const dataSource = [
  {
    key: '1',
    SPC: 'SPC_01',
    LSL: 32,
    Norminal: '1.23',
    USL: '1.344',
    ActualMean: '3.4',
    Yield: '2.5',
    cpk: '9.0',
  },
  {
    key: '1',
    SPC: 'SPC_01',
    LSL: 32,
    Norminal: '1.23',
    USL: '1.344',
    ActualMean: '3.4',
    Yield: '2.5',
    cpk: '9.0',
  },
  {
    key: '1',
    SPC: 'SPC_01',
    LSL: 32,
    Norminal: '1.23',
    USL: '1.344',
    ActualMean: '3.4',
    Yield: '2.5',
    cpk: '9.0',
  },
  {
    key: '1',
    SPC: 'SPC_01',
    LSL: 32,
    Norminal: '1.23',
    USL: '1.344',
    ActualMean: '3.4',
    Yield: '2.5',
    cpk: '9.0',
  },
];

const columns = [
  {
    title: 'SPC',
    dataIndex: 'SPC',
    key: 'SPC',
    align:'center'
  },
  {
    title: 'LSL',
    dataIndex: 'LSL',
    key: 'LSL',
    align:'center'
  },
  {
    title: 'Norminal',
    dataIndex: 'Norminal',
    key: 'Norminal',
    align:'center'
  },
  {
    title: 'USL',
    dataIndex: 'USL',
    key: 'USL',
    align:'center'
  },
  {
    title: 'Actual Mean',
    dataIndex: 'ActualMean',
    key: 'ActualMean',
    align:'center'
  },
  {
    title: 'Yield',
    dataIndex: 'Yield',
    key: 'Yield',
    align:'center'
  },
  {
    title: 'cpk',
    dataIndex: 'cpk',
    key: 'cpk',
    align:'center'
  },
];

class BasicTable extends React.Component {
  render() {
    return (
      <div>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default BasicTable;

import React from 'react';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts';
import DataSet from '@antv/data-set';

import _ from 'lodash';

const { Line } = Guide;

class BasicBox extends React.Component {
  render() {
    const { DataView } = DataSet;
    const {data, x, low, q1, q3, high, median,outliers } = this.props.params;
    const datas = _.slice(data,0,1);
    const dv = new DataView().source(datas);
    dv.transform({
      type: 'map',
      callback: obj => {
        obj.range = [obj[low], obj[q1], obj[median], obj[q3], obj[high]];
        return obj;
      },
    });
    // const cols = {
    //   range: {
    //     max: 35,
    //   },
    // };
    return (
      <div>
        <Chart
          height={500}
          data={dv}
          // scale={cols}
          padding={[20, 60, 95]}
          forceFit
        >
          <Axis name={x}/>
          <Axis name="range"/>
          <Tooltip
            showTitle={false}
            crosshairs={{
              type: 'rect',
              style: {
                fill: '#E4E8F1',
                fillOpacity: 0.43,
              },
            }}
            itemTpl="<li data-index={index} style=&quot;margin-bottom:4px;&quot;><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}<br/><span style=&quot;padding-left: 16px&quot;>high：{high}</span><br/><span style=&quot;padding-left: 16px&quot;>q3：{q3}</span><br/><span style=&quot;padding-left: 16px&quot;>median：{median}</span><br/><span style=&quot;padding-left: 16px&quot;>q1：{q1}</span><br/><span style=&quot;padding-left: 16px&quot;>low：{low}</span><br/></li>"
          />

          <Geom
            type="schema"
            position={`${x}*range`}
            shape="box"
            tooltip={[
              `${x}*${low}*${q1}*${median}*${q3}*${high}`,
              (x, low, q1, median, q3, high) => {
                return {
                  name: x,
                  low,
                  q1,
                  median,
                  q3,
                  high,
                };
              },
            ]}
            style={{
              stroke: 'rgba(0, 0, 0, 0.45)',
              fill: '#1890FF',
              fillOpacity: 0.3,
            }}
          />
          <View data={data}>
            <Geom
              type="point"
              position={`${x}*${outliers}`}
              shape="circle"
              size={3}
              active={false}
            />
          </View>
          {/*<Guide>*/}
          {/*  <Line*/}
          {/*    top={true} // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层*/}
          {/*    start={[-1,1]} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback*/}
          {/*    end={[3,1]} // 同 start*/}
          {/*    offsetX={0}*/}
          {/*    lineStyle={{*/}
          {/*      stroke: 'red', // 线的颜色*/}
          {/*      lineDash: [0, 2, 2], // 虚线的设置*/}
          {/*      lineWidth: 1, // 线的宽度*/}
          {/*    }}*/}

          {/*  />*/}
          {/*  <Line*/}
          {/*    top={true} // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层*/}
          {/*    start={[-0.5,2]} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback*/}
          {/*    end={[3,2]} // 同 start*/}
          {/*    offsetX={0}*/}
          {/*    lineStyle={{*/}
          {/*      stroke: 'red', // 线的颜色*/}
          {/*      lineDash: [0, 2, 2], // 虚线的设置*/}
          {/*      lineWidth: 1, // 线的宽度*/}
          {/*    }}*/}

          {/*  />*/}
          {/*</Guide>*/}
        </Chart>
      </div>
    );
  }
}

export default BasicBox;

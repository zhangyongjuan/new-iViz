import React from "react";
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
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";
import _ from 'lodash';

class GroupedColumn extends React.Component {
  render() {
    const data = [
      {
        label: "Monday",
        series1: 2800,
        series2: 2260
      },

      {
        label: "Tuesday",
        series3: 1800,
        series4: 1300
      },
      {
        label: "Wednesday",
        series5: 950,
        series6: 900
      },
      {
        label: "Thursday",
        series7: 500,
        series8: 390
      },
      {
        label: "Friday",
        series9: 170,
        series10: 100
      }
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields: ["series1", "series2","series3", "series4","series5", "series6","series7", "series8","series9", "series10"],
      // 展开字段集
      key: "type",
      // key字段
      value: "value" // value字段
    });

    // const old = [...dv.rows];
    // dv.rows = _.filter(old,(k)=>k.value!==undefined);
    // console.log(dv.rows);
    // dv.rows=[
    //   {label:'Monday',type:'series1',value:2800},
    //   {label:'Monday',type:'series3',value:2800},
    //   {label:'Monday',type:'series4',value:2800},
    //   {label:'Monday',type:'series6',value:2800},
    //   {label:'Friday',type:'series5',value:2800},
    //   {label:'Friday',type:'series7',value:2800},
    //   ];
    return (
      <div>
        <Chart height={400} data={dv} forceFit onPlotClick={(c)=>console.log(c)}>

          <Axis
            name="label"
            label={{
              offset: 12
            }}
          />
          <Axis name="value" />
          <Tooltip />
          <Geom
            type="interval"
            position="label*value"
            color={"type"}
            adjust={[
              {
                type: "dodge",
                marginRatio: 0
              }
            ]}
          />
          <Geom
            type="interval"
            position="label*value"
            color={"type"}
            adjust={[
              {
                type: "dodge",
                marginRatio: 0
              }
            ]}
          />
        </Chart>
      </div>
    );
  }
}

export default GroupedColumn;

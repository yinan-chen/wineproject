/*
  Credit to: http://bl.ocks.org/Kuerzibe/338052519b1d270b9cd003e0fbfb712e
*/


//////////////////////////////////////////////////////////////
//////////////////////// Set-Up //////////////////////////////
//////////////////////////////////////////////////////////////

var margin = { top: 8, right: 100, bottom: 8, left: 60 };

//////////////////////////////////////////////////////////////
////////////////////////// Data //////////////////////////////
//////////////////////////////////////////////////////////////

var data = [
  { name: 'Allocated budget',
    axes: [
      {axis: 'Sales', value: 0},
      {axis: 'Marketing', value: 2},
      {axis: 'Development', value: 5},
      {axis: 'Customer Support', value: 4},
      {axis: 'Information Technology', value: 3},
      {axis: 'Administration', value: 1}
    ],
   color: '#E2C185'
  },
  { name: 'Cabernet Sauvignon',
    axes: [
      {axis: 'Sales', value: 5},
      {axis: 'Marketing', value: 3},
      {axis: 'Development', value: 0},
      {axis: 'Customer Support', value: 2},
      {axis: 'Information Technology', value: 1},
      {axis: 'Administration', value: 4}
    ],
   color: '#841935'
  }
];

var radarChartOptions = {
  w: 240,
  h: 300,
  margin: margin,
  maxValue: 5,
  levels: 6,
  roundStrokes: false,
  color: d3.scaleOrdinal().range(['#E2C185', '#841935']),
  format: '.0f',
  legend: { title: 'Wine Varieties', translateX: 100, translateY: 0 },
};

// Draw the chart, get a reference the created svg element :
let svg_radar2 = RadarChart("#radarChart", data, radarChartOptions);
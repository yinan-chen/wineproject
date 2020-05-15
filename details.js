
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////Detail Sections HTML//////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getClickStr(data,map_list){
    if(map_list.length === 1){
        return getSingleVareityDetails(true,data.filter(d => d.Name === map_list[0])[0]);
    }else{
        return "<div id='multi' class='carousel slide' data-ride='carousel'>" +
                    "<ul class='carousel-indicators'>" +
                        "<li data-target='#multi' data-slide-to='0' class='active'></li>" +
                        "<li data-target='#multi' data-slide-to='1'></li>" +
                        "<li data-target='#multi' data-slide-to='2'></li>" +
                    "</ul>" +
                    "<div class='carousel-inner'>" +
                        "<div class='carousel-item active'>" +
                            "<img src='img/detail/placeholder1.png' width='80%'>" +
                        "</div>" +
                        "<div class='carousel-item'>" +
                            "<img src='img/detail/placeholder2.png' width='80%'>" +
                        "</div>" +
                        "<div class='carousel-item'>" +
                            "<img src='img/detail/placeholder3.png' width='80%'>" +
                        "</div>" +
                    "</div>" +
                "</div>";
    }
}

function getSingleVareityDetails(single,variety){
    let id = getVarietyId(variety.Name);
    let htmlStr = "<div class='row'>";

    //property section
    htmlStr += single? "<div class='col-5 offset-1 properties'>" : "<div class='col-6 properties'>";
    htmlStr += getPropertyHtmlStr(variety);
    htmlStr += "</div><div class='col-5' id='"+id+"_radarChart'></div></div>";
    //top rating section
    // htmlStr += single? "<div class='row'><div class='col-10 offset-1'>" : "<div class='row'><div class='col-12'>"

    return htmlStr;
}

//get properties section htmlStr
function getPropertyHtmlStr(variety){
    let name = variety.Name;
    let values = {
        "Body": variety.Body,
        "Acidity": variety.Acidity, 
        "Sweetness": variety.Sweetness,
        "Alcohol": alcohol_scales[variety.Alcohol-1]
    };
   
    //variety name
    let htmlStr = "<h3 class='secondary-title'>"+name+"</h3>";

    //set properties isotope table
    htmlStr += "<br><table>";
    let i;

    variety_properties.forEach(property => {
        htmlStr += "<tr><td>"+property+"</td><td class='padding-property-td'>";

        if(property === "Alcohol"){
            htmlStr += values[property];

        }else{
            for(i = 1; i <= values[property];i++){
                htmlStr += "<img src='img/detail/"+property.toLowerCase()+".png'>";
            }

            for(i = 1; i <= scale-values[property];i++){
                htmlStr += "<img src='img/detail/"+property.toLowerCase()+"_empty.png'>";
            }
        }
        htmlStr += "</td></tr>";
    });

    //close table
    htmlStr += "</table>";

    return htmlStr;
}

//get topRating section htmlStr
function getTopRatingHtmlStr(variety){
    let name = vareity.Name;
    let id = getVarietyId(name);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////Radar Chart//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setRadarChart(data,wineType,map_list){
  map_list.forEach(name => {
    let id = "#"+getVarietyId(name)+"_radarChart";
    let variety = data.filter(d => d.Name === name)[0];
    let radar_data;

    if(flavor_reference !== "" && flavor_reference !== name){
      //with reference
      let reference = data.filter(d => d.Name === flavor_reference)[0];
      radar_data = [radarDataFormatter(wineType,reference,true),radarDataFormatter(wineType,variety,false)];
      generateRadarChart(radar_data,id,true);
    }else{
      //single
      radar_data = [radarDataFormatter(wineType,variety,false)];
      generateRadarChart(radar_data,id,false);
    }
  });
}

/*
  Radar Chart credit to: http://bl.ocks.org/Kuerzibe/338052519b1d270b9cd003e0fbfb712e
*/

function radarDataFormatter(wineType,variety,reference){
  let flavor_list = flavors[wineType];
  let color = reference? '#E2C185':'#841935';

  return {name: variety.Name,
          axes: [
            {axis: flavor_list[0], value: variety[flavor_list[0]]},
            {axis: flavor_list[1], value: variety[flavor_list[1]]}, 
            {axis: flavor_list[2], value: variety[flavor_list[2]]},
            {axis: flavor_list[3], value: variety[flavor_list[3]]},
            {axis: flavor_list[4], value: variety[flavor_list[4]]},
            {axis: flavor_list[5], value: variety[flavor_list[5]]}
          ],
          color: color}; 
}


var radar_margin = { top: 8, right: 100, bottom: 20, left: 60 };

function generateRadarChart(radar_data, id, reference){
  let color_range = reference? ['#E2C185', '#841935']: ['#841935'];

  var radarChartOptions = {
    w: 240,
    h: 300,
    margin: radar_margin,
    maxValue: 5,
    levels: 6,
    roundStrokes: false,
    color: d3.scaleOrdinal().range(color_range),
    format: '.0f',
    legend: { title: 'Wine Variety', translateX: 100, translateY: 0 },
  };

  // Draw the chart, get a reference the created svg element :
  RadarChart(id, radar_data, radarChartOptions);
}



// var radar_data = [
//   { name: 'Allocated budget',
//     axes: [
//       {axis: 'Sales', value: 0},
//       {axis: 'Marketing', value: 2},
//       {axis: 'Development', value: 5},
//       {axis: 'Customer Support', value: 4},
//       {axis: 'Information Technology', value: 3},
//       {axis: 'Administration', value: 1}
//     ],
//    color: '#E2C185'
//   },
//   { name: 'Cabernet Sauvignon',
//     axes: [
//       {axis: 'Sales', value: 5},
//       {axis: 'Marketing', value: 3},
//       {axis: 'Development', value: 0},
//       {axis: 'Customer Support', value: 2},
//       {axis: 'Information Technology', value: 1},
//       {axis: 'Administration', value: 4}
//     ],
//    color: '#841935'
//   }
// ];
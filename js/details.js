
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////Detail Sections HTML//////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getClickStr(data,map_list,rating_data){
    if(map_list.length === 1){
        return getSingleVarietyDetails(true,data.filter(d => d.Name === map_list[0])[0],rating_data);
    }else{
        return getMultipleVarietiesDetails(data,map_list,rating_data);
    }
}

function getMultipleVarietiesDetails(data,map_list,rating_data){
    let htmlStr = "<div class='row'>" +
                        "<div class='col-3'>" +
                            "<div class='list-group varieties' role='tablist'>";
    let i;
    for(i = 0; i < map_list.length; i++){
        let name = map_list[i];
        let id = getVarietyId(name);
        htmlStr += i === 0? "<a class='list-group-item list-group-item-action multi active' id='list-"+id+"-list' href='#list-"+id+"' data-toggle='list'  role='tab'>"+name+"</a>":
                        "<a class='list-group-item list-group-item-action multi' id='list-"+id+"-list' href='#list-"+id+"' data-toggle='list'  role='tab'>"+name+"</a>";
    }
    htmlStr += "</div>" +
            "</div>" +
            "<div class='col-9'>" +
                "<div class='tab-content'>";
    for(i = 0; i < map_list.length; i++){
        let name = map_list[i];
        let id = getVarietyId(name);
        let variety = data.filter(d => d.Name === name)[0];

        //tab
        htmlStr += i === 0? "<div class='tab-pane fade show active' id='list-"+id+"' role='tabpanel' aria-labelledby='list-"+id+"-list'>":
                            "<div class='tab-pane fade' id='list-"+id+"' role='tabpanel' aria-labelledby='list-"+id+"-list'>";
        //tab content
        htmlStr += getSingleVarietyDetails(false,variety,rating_data);
        htmlStr += "</div>";
    }
    htmlStr += "</div></div></div>";

    return htmlStr;
}

function bindMultipleVarietiesClickEvent(data,wineType,map_list){
    $(".multi").click(function(){
        map_list.forEach(variety_name => {
           let id = getVarietyId(variety_name);
           $("#"+id+"_radarChart").html("");
        });
        setRadarChart(data,wineType,$(this).text());
    })
}

function getSingleVarietyDetails(single,variety,rating_data){
    let variety_name = variety.Name;
    let id = getVarietyId(variety_name);
    let htmlStr = "<div class='row'>";

    //property section
    htmlStr += single? "<div class='col-5 offset-1 properties'>" : "<div class='col-6 properties'>";
    htmlStr += getPropertyHtmlStr(variety);
    htmlStr += "</div><div class='col-5' id='"+id+"_radarChart'></div></div>";
    //top rating section
    htmlStr += single? "<div class='row'><div class='col-10 offset-1'>" : "<div class='row'><div class='col-12'>";
    htmlStr += getTopRatingHtmlStr(variety_name,id,rating_data);
    htmlStr += "</div></div>";

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
function getTopRatingHtmlStr(variety_name,id,rating_data){
    let tops = rating_data.filter(d => d.variety === variety_name);

    //top list headline
    let htmlStr = "<h4 class='tertiary-title'>The Top 5 You Should Try (Based on ratings):</h4>";

    //top5 content
    htmlStr += "<div class='topRating' id='"+id+"_tops' style='margin-top: 1rem;'>"; 

    //each top information
    let i;
    for(i = 1; i <= tops.length; i++){
      let top = tops[i-1];
      //button
      htmlStr += i === 1? "<button class='btn' data-toggle='collapse' data-target='#"+id+"_top"+i+"' aria-expanded='true' aria-controls='"+id+"_top"+i+"'>" : 
                        "<button class='btn collapsed' data-toggle='collapse' data-target='#"+id+"_top"+i+"' aria-expanded='true' aria-controls='"+id+"_top"+i+"'>"
      htmlStr += i+". "+top.title+"</button>";   
      //content
      htmlStr += i === 1? "<div id='"+id+"_top"+i+"' class='collapse show' data-parent='#"+id+"_tops'>" : "<div id='"+id+"_top"+i+"' class='collapse' data-parent='#"+id+"_tops'>";
      htmlStr += "<div class='row padding-accordion'>"+
                    "<div class='col-5'>"+
                        "<table>"+
                            "<tr><td>Rating:</td><td class='padding-rating-td'>"+top.points+"</td></tr>"+
                            "<tr><td>Price:</td><td class='padding-rating-td'>$"+top.price+"</td></tr>"+
                            "<tr><td>Origin:</td><td class='padding-rating-td'>"+top.province+", "+top.country+"</td></tr>"+
                            "<tr><td>Winery:</td><td class='padding-rating-td'>"+top.winery+"</td></tr>"+
                        "</table>"+
                    "</div>"+
                    "<div class='col-7'>"+
                        "<p>"+
                            "Description: <br>"+top.description+
                        "</p>"+
                    "</div>"+
                "</div>"+
            "</div>";
    };      
    htmlStr += "</div>";
    return htmlStr; 
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////Radar Chart//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setRadarChart(data,wineType,variety_name){
    let id = "#"+getVarietyId(variety_name)+"_radarChart";
    let variety = data.filter(d => d.Name === variety_name)[0];
    let radar_data;

    if(flavor_reference !== "" && flavor_reference !== variety_name){
        //with reference
        let reference = data.filter(d => d.Name === flavor_reference)[0];
        radar_data = [radarDataFormatter(wineType,reference,true),radarDataFormatter(wineType,variety,false)];
        generateRadarChart(radar_data,id,true);
    }else{
        //single
        radar_data = [radarDataFormatter(wineType,variety,false)];
        generateRadarChart(radar_data,id,false);
    }
}

// function setRadarChart(data,wineType,map_list){
//   map_list.forEach(variety_name => {
//     let id = "#"+getVarietyId(variety_name)+"_radarChart";
//     let variety = data.filter(d => d.Name === variety_name)[0];
//     let radar_data;
//
//     if(flavor_reference !== "" && flavor_reference !== variety_name){
//       //with reference
//       let reference = data.filter(d => d.Name === flavor_reference)[0];
//       radar_data = [radarDataFormatter(wineType,reference,true),radarDataFormatter(wineType,variety,false)];
//       generateRadarChart(radar_data,id,true);
//     }else{
//       //single
//       radar_data = [radarDataFormatter(wineType,variety,false)];
//       generateRadarChart(radar_data,id,false);
//     }
//   });
// }

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
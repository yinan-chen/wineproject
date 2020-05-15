//flavor viz - d3 scatterplot

var flavor_margin = {top:50,bottom:50,left:50,right:50};
var size = 350;
var imageSize = 40;

var flavor_x = d3.scaleLinear()
    .domain([0,5])
    .range([0,size]);

var flavor_y = d3.scaleLinear()
    .domain([0,5])
    .range([size,0]);

function getFlavorViz(data,y,x){
    var flavor_svg = d3.select("#flavor_viz")
        .append("svg")
        .attr("width",size + flavor_margin.left + flavor_margin.right)
        .attr("height",size + flavor_margin.top + flavor_margin.bottom)
        .append("g")
        .attr("transform","translate(" + flavor_margin.left + "," + flavor_margin.top + ")");

    //tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    let scatterMap = getFlavorScatterMap(data,y,x);

    //axis
    let y_axis = flavor_svg.append("g")
        .call(d3.axisLeft(flavor_y).ticks(5));
    y_axis.selectAll(".tick text")
        .attr("x","-24");
    flavor_svg.append("text")
        .attr("class","label")
        .attr("transform", "rotate(-90)")
        .attr("x",0 - (size / 2))
        .attr("y", 0 - flavor_margin.left)
        .attr("dy", "1em")
        .style("text-anchor","middle")
        .text(y);

    let x_axis = flavor_svg.append("g")
        .attr("transform","translate(0," + size + ")")
        .call(d3.axisBottom(flavor_x).ticks(5));
    x_axis.selectAll(".tick text")
        .attr("y","20")
        .attr("dy","1em");
    flavor_svg.append("text")
        .attr("class","label")
        .attr("transform","translate("+size/2+","+(size+flavor_margin.bottom-5)+")")
        .style("text-anchor","middle")
        .text(x);

    //grid line
    flavor_svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(flavor_y).ticks(5)
            .tickSize(-size)
            .tickFormat("")
        );
    flavor_svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + size + ")")
        .call(d3.axisBottom(flavor_x).ticks(5)
            .tickSize(-size)
            .tickFormat("")
        );

    //scatter
    flavor_svg.append("g")
        .selectAll("dots")
        .data(data)
        .enter()
        .append("image")
        .attr("id", d => getVarietyId(d.Name))
        .attr("y", d => flavor_y(d[y])-imageSize/2)
        .attr("x",d => flavor_x(d[x])-imageSize/2)
        .attr("xlink:href", "img/icon/grape.png")
        .attr("opacity","0.6")
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 1.0);
            div.html(getTooltipStr(scatterMap[[d[y],d[x]]]))
                .style("left", (d3.event.pageX + 8) + "px")
                .style("top", (d3.event.pageY - 32) + "px");
        })
        .on("mouseout", function() {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click",function(d){
            showRestSections();
            $("#details_title").html("<h1 class='primary-title-colored'>The variety you selected</h1>");
            $("#details_content").html(getClickStr(data,scatterMap[[d[y],d[x]]]));
            //generate radar charts
        });
}

//handle scatter points with multiple wine varieties
function getFlavorScatterMap(data,y,x){
    console.log("Get flavor scatter map");
    let map = {};
    let flavorY = data.map(d => d[y]);
    let flavorX = data.map(d => d[x]);
    let name = data.map(d => d.Name);

    let i;
    for(i = 0; i < flavorY.length; i++){
        if([flavorY[i],flavorX[i]] in map){
            map[[flavorY[i],flavorX[i]]].push(name[i]);
        }else {
            map[[flavorY[i],flavorX[i]]] = [name[i]];
        }
    }

    console.log(map);
    return map;
}

function getTooltipStr(map_list){
    let str = "";
    map_list.forEach(curr => str += " • "+curr+" <br>");
    return str;
}

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





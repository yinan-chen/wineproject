//flavor viz - d3 scatterplot

var margin = {top:50,bottom:50,left:50,right:50};
var size = 320;
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
        .attr("width",size + margin.left + margin.right)
        .attr("height",size + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

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
        .attr("y", 0 - margin.left)
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
        .attr("transform","translate("+size/2+","+(size+margin.bottom-5)+")")
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
                .style("opacity", .9);
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
            $("#recommend_title").html("<h1 class='primary-title-colored' >The variety you selected</h1>");
            $("#details").html(getClickStr(scatterMap[[d[y],d[x]]]));
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
    map_list.forEach(curr => str += curr+"<br>");
    return str;
}

function getClickStr(map_list){
    if(map_list.length === 1){
        return "<img src='img/detail/placeholder1.png' width='80%'>"
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
                "</div>"
    }
}





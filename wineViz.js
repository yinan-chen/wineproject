const path = "https://yinan-chen.github.io/wineproject/data/";
var margin = {top:50,bottom:50,left:50,right:50};
var size = 400;
var imageSize = 32;

var flavor_x = d3.scaleLinear()
    .domain([0,5])
    .range([0,size]);

var flavor_y = d3.scaleLinear()
    .domain([0,5])
    .range([size,0]);

function getFlavorViz(wineType,y,x){
    var flavor_svg = d3.select("#flavor_viz")
        .append("svg")
        .attr("width",size + margin.left + margin.right)
        .attr("height",size + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    d3.csv(path+wineType+".csv").then(function(data){
        console.log(data[0]);

        //axis
        let x_axis = flavor_svg.append("g")
            .attr("transform","translate(0," + size + ")")
            .attr("y","15")
            .attr("dy","1em")
            .call(d3.axisBottom(flavor_x).ticks(5));
        x_axis.selectAll(".tick text")
            .attr("y","15")
            .attr("dy","1em");
        flavor_svg.append("text")
            .attr("transform","translate("+size/2+","+(size+margin.bottom-5)+")")
            .style("text-anchor","middle")
            .text(x);

        flavor_svg.append("g")
            .call(d3.axisLeft(flavor_y).ticks(5));
        flavor_svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x",0 - (size / 2))
            .attr("y", 0 - margin.left)
            .attr("dy", "1em")
            .style("text-anchor","middle")
            .text(y);


        //grid line
        flavor_svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + size + ")")
            .call(d3.axisBottom(flavor_x).ticks(5)
                .tickSize(-size)
                .tickFormat("")
            );

        flavor_svg.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(flavor_y).ticks(5)
                .tickSize(-size)
                .tickFormat("")
            );


        //scatter
        flavor_svg.append("g")
            .selectAll("dots")
            .data(data)
            .enter()
            .append("image")
            .attr("x",d => flavor_x(d[x])-imageSize/2)
            .attr("y", d => flavor_y(d[y])-imageSize/2)
            .attr("xlink:href", "img/grape.png")
            .attr("opacity","0.6");
    });
}
// d3.csv("./data/red.csv").then(function(data){
//     console.log(data[0])
// });



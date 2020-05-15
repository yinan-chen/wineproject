//navbar
$(window).scroll(function() {
    if ($(document).scrollTop() > 30) {
        $('.navbar').addClass('shrink');
    } else {
        $('.navbar').removeClass('shrink');
    }
});

//control section display
function showIntro(){
    $("#researchNav").show();
    $("#research").show();
}

function showTasteProfile(){
    $("#tasteNav").show();
    $("#taste").show();
    $("#helper").show();
}

function showRestSections(){
    $("#detailsNav").show();
    $("#tipsNav").show();
    $("#details").show();
    $("#tips").show();
    $(".footer").show();
}

function hideRestSections(){
    $("#detailsNav").hide();
    $("#tipsNav").hide();
    $("#details").hide();
    $("#tips").hide();
    $(".footer").hide();
}

//Taste Profile interaction
var wine = "";
var flavor_select = ["",""];
var flavor_count = 0;
var flavor_reference = "";

d3.csv(data_path+"rating_data.csv").then(function(rating_data){
    console.log("rating dataset loaded successfully!");
    $(".wine").click(function(e){
    let curr = e.target;

    if(wine !== curr.id){
        //deselect selected one
        if(wine !== ""){
            $("#"+wine).attr("src",getWineImgPath(wine,false));

            //reset settings
            flavor_select = [","];
            flavor_count = 0;
            flavor_reference = "";
            cleanFlavorViz();
            hideRestSections();
        }
        //update with selected wine type
        wine = curr.id;
        curr.src = getWineImgPath(wine,true);

        console.log(wine);

        //read data
        d3.csv(data_path+wine+".csv").then(function(data){
            console.log(wine+" dataset loaded successfully!");
            //display flavor options based on selected wine type
            $("#flavor_step2").show();
            $("#flavor_label_step2").html("<p class='step-icon-align'>Choose you <b>TWO</b> favorite flavors: </p>");
            set_flavor_options(curr.id,data,rating_data);
        });
    }
});          
});

function set_flavor_options(type,data,rating_data){
    let options = flavors[type];
    let htmlStr = "";

    options.forEach(function(flavor){
        let id = flavor;
        let name = flavor;
        if(flavor === "Floral"){
            id += type;
        }else if(flavor.includes("Fruit") || flavor.includes("Spice")){
            let subs = flavor.split(" ");
            id = subs[0]+subs[1];
        }
        htmlStr += "<div class='col-2' align='center'>" +
                        "<img class='flavor' id='"+id +"' alt='"+name +"' src='"+img_path+"flavor/"+id+".png"+"' width='50%'>" +
                        "<br>" +
                        "<p class='label'>"+name+"</p>" +
                        "</div>";
    });
    $("#flavor_choices").html(htmlStr);
    bindFlavorHoverEvent(type);
    bindFlavorClickEvent(data,rating_data);
}

function bindFlavorHoverEvent(type){
    let dict = definitions[type];
    let flavors = Object.keys(dict);

    flavors.forEach(flavor => {
        let id = "#"+flavor;
        tippy(id, {
            content: dict[flavor],
            allowHTML: true,
            theme: 'wine',
            placement: 'top-start',
        });
    });
}

function bindFlavorClickEvent(data,rating_data){
    $(".flavor").click(function(e){
        let curr = e.target;
        let error =  $("#errorAlert");

        if(curr.src === getFlavorImgPath(curr.id,false)){
            if(flavor_count < 2){
                flavor_count === 0? flavor_select[0] = curr.id:flavor_select[1] = curr.id;
                curr.src = getFlavorImgPath(curr.id,true);
                flavor_count++;
            }else{
                //choose more than two flavors => error handle
                error.html(getErrorAlertHtmlStr());
            }
        }else {
            //clean
            error.html("");
            cleanFlavorViz();
            hideRestSections();
            //show helper
            $("#helper").show();
            //deselect the selected one
            curr.src = getFlavorImgPath(curr.id,false);
            if(flavor_select[0] === curr.id)
                flavor_select[0] = flavor_select[1];
            flavor_select[1] = "";
            flavor_count--;
        }

        console.log(flavor_select);

        //call to generate step3 part
        if(flavor_count === 2 &&  error.html() === ""){
            cleanFlavorViz();
            //display step3 label
            $("#flavor_step3").show();
            //set variety dropdown
            $("#flavor_label_step3").html(getFlavorStep3HtmlStr(data.map(d => d.Name)));
            bindDropdownClickEvent();
            //viz: use alphabetical order to set y/x with flavor names
            let flavors = [$("#"+flavor_select[0]).attr("alt"),$("#"+flavor_select[1]).attr("alt")];
            flavors.sort();
            getFlavorViz(data,wine,flavors[0],flavors[1],rating_data);
            $("#helper").hide();
        }

    });
}

function bindDropdownClickEvent(){
    $(".dropdown-item").click(function(){
        let variety = $(this).text();
        //update dropdown text
        $("#varietyBtn").text(variety+" ");
        console.log(variety);

        //deselect prev reference 
        if(flavor_reference !== ""){
            let pre = $("#"+getVarietyId(flavor_reference));
            pre.attr("href","img/icon/grape.png");
            pre.attr("opacity","0.6");
        }
        
        hideRestSections();
        
        if(variety == "Choose one familiar wine variety"){
            flavor_reference = "";
        }else{
            let variety_id = getVarietyId(variety);
            let reference = $("#"+variety_id);
            reference.attr("href","img/icon/grape_reference.png");
            reference.attr("opacity","2.0");
            flavor_reference = variety;
        }
    });
}

function getWineImgPath(name,selected){
    if(selected)
        return img_path+"wine/"+name+"_select.png";
    else
        return img_path+"wine/"+name+".png";
}

function getFlavorImgPath(name,selected){
    if(selected)
        return img_path+"flavor/"+name+"_select.png";
    else
        return img_path+"flavor/"+name+".png";
}

function getErrorAlertHtmlStr(){
    return "<div class='alert alert-danger alert-dismissible fade show' role='alert'>" +
                "You could only select <strong>TWO</strong> flavors! Please deselect unwanted ones first." +
                "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
                    "<span aria-hidden='true'>&times;</span>" +
                "</button>" +
            "</div>"
}

function getFlavorStep3HtmlStr(varieties){
    //label
    htmlStr = "<p class='step-icon-align'><b>Hover & Click</b> on the flavor combination <img src='img/icon/grape.png'> " +
        "that you like to explore the associated wine varieties</p>";
    //dropdown title
    htmlStr += "<p>(Optional) Set your familiar wine variety as the reference <img src='img/icon/grape_reference.png'> to better understand the scale:</p>";
    //dropdown
    htmlStr += getVarietyDropDownHtmlStr(varieties);
    return htmlStr;
}

function getVarietyDropDownHtmlStr(varieties){
    htmlStr = "<div class='dropdown'>" +
                "<button class='btn dropdown-toggle' type='button' id='varietyBtn' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                    "Choose one familiar wine variety " +
                "</button>" +
              "<div class='dropdown-menu' aria-labelledby='varietyBtn'>";

    //add an option to deselect reference
     htmlStr += "<button class='dropdown-item' type='button'>"+"Choose one familiar wine variety"+"</button>"

    varieties.forEach(variety => {
       htmlStr += "<button class='dropdown-item' type='button'>"+ variety +"</button>";
    });

    return htmlStr += "</div></div>";
}

function cleanFlavorViz(){
    $("#flavor_step3").hide();
    $("#flavor_label_step3").html("");
    $("#flavor_viz").html("");
}

function getVarietyId(name){
    if(name.includes(" ")){
        let parts = name.split(" ");
        if(parts[0] === "Nero"){
            return parts[0];
        }
        return parts[0]+parts[1]
    }else{
        return name;
    }
}
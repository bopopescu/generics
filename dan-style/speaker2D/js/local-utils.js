
function textWrap(x,y, r, content, maxWidth, size){

    var t = r.text(x, y).attr('text-anchor', 'start');
    //var maxWidth = 100;
    var words = content.split(" ");

    var tempText = "";
    for (var i=0; i<words.length; i++) {
        t.attr("text", tempText + " " + words[i]);
        if (t.getBBox().width > maxWidth) {
            tempText += "\n" + words[i];
        } else {
            tempText += " " + words[i];
        }
    }

    t.attr({"text": tempText.substring(1), "font-size": size });
}



_.sum = function(array){
    return(_.reduce(array, function(x,arr){return(x+arr);}));
};



function position_debug() {
  $(document).mousedown(function(e){
      console.log(e.pageX +', '+ e.pageY);
   });
}


function caps(a) {return a.substring(0,1).toUpperCase() + a.substring(1,a.length);}

function clone(o) {return JSON.parse(JSON.stringify(o));}

function is_same(response, creature) {
  var result = response.match(new RegExp(creature + "|" + plural(creature), "i"));
  if (result) {
    return true;
  } else {
    return false;
  }
}

function slideCreator(key_in_sliderPost) {
  return function(event, ui) {
    exp.sliderPost[key_in_sliderPost] = ui.value/100;
    console.log(ui.value/100);
  }
}

function changeCreator(label) {
  return function(value) {
    $('#' + label).css({"background":"#99D6EB"});
    $("#" + label + ' .ui-slider-range').css({"background":"#99D6EB"});
    $('#' + label + ' .ui-slider-handle').show();
    $('#' + label + ' .ui-slider-handle').css({
      "background":"#667D94",
      "border-color": "#001F29" });
    /*$("#slider" + i).mousedown(function(){
          $("#slider" + i).css({"background":"#99D6EB"});
          $("#slider" + i + ' .ui-slider-handle').show();
          $("#slider" + i + ' .ui-slider-handle').css({
            "background":"#667D94",
            "border-color": "#001F29"
          });
        });*/
    /*if (responses[category_type][label] == null) {
      n_responses++;
      responses[category_type][label] = [];
    }
    var slider_val = $("#" + label).slider("value");
    responses[category_type][label].push(slider_val);*/
  } 
}
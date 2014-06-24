
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
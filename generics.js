

function caps(a) {return a.substring(0,1).toUpperCase() + a.substring(1,a.length);}
function uniform(a, b) { return ( (Math.random()*(b-a))+a ); }
function showSlide(id) { $(".slide").hide(); $("#"+id).show(); }
function shuffle(v) { newarray = v.slice(0);for(var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);return newarray;} // non-destructive.

function plural(word) {
  if (/dax|poch|monx|hinx/.test(word)) {//["dax", "poch", "monx", "hinx"].include(word)) { //word.match("dax|poch|monx|hinx")) {
    return(word + "es");
  } else if (word == "fish") {
    return word;
  } else {
    return(word + "s");
  }
}
function utterance(utteranceType, wug, fur) {
  switch (utteranceType) {
    case "generic":
      return caps(plural(wug)) + " have " + fur;
    case "specific":
      return caps(wug) + " number 272 has " + fur;
    default:
      return("");
  }
}
var constructor = {"tree":Stimuli.Tree,
                   "flower":Stimuli.Flower,
                   "monster":Stimuli.Monster,
                   "bug":Stimuli.Bug,
                   "bird":Stimuli.Bird,
                   "microbe":Stimuli.Microbe,
                   "fish":Stimuli.Fish}
var properties = {"tree":["berries", "leaves"],
                  "flower":["spots", "thorns"],
                  "monster":["horns", "teeth"],
                  "bug":["wings", "antennae"],
                  "bird":["crests", "tails"],
                  "microbe":["spikes", "bumps"],
                  "fish":["fangs", "whiskers"]}
var distBins = {
  // These distributions are the number of tokens per type that have the target feature.
  // Each distribution should have the same number of elements as the number of trainings_per_category above.
  // The max value within each distribution is the product of training_rows and training_columns above.
  beta: shuffle([0, .05, .95, 1]),
  binary: shuffle([0, 0, 1, 1]),
  uniform: shuffle([0, .33333, .66667, 1]),
  uniform_low: shuffle([0, .16667, .33333, .5])
};

//**********things that are randomized:
var nonceWords = shuffle(["wug", "dax", "fep",
                          "wost", "wock", "thog", "snim", "ript",
                          "quog", "polt", "poch", "murp", "mulb",
                          "mork", "mopt", "monx", "mone", "moge",
                          "lide", "hoil", "hoff", "hisp", "hinx",
                          "hife", "hett", "fraw", "fing", "fick",
                          "blim"]);
var domains = shuffle(["tree", "flower", "monster", "bird", "microbe", "bug", "fish"])
var utteranceTypes = shuffle(["generic", "none", "specific"]);
var distributions = shuffle(["beta", "binary", "uniform", "uniform_low"]);
var propertyIndices = shuffle([0, 1]);
//var nonTargetProps = shuffle([true, false]);

//random values that are constant throughout experiment:
var domain = domains[0];
var propertyIndex = propertyIndices[0];
var property = properties[domain][propertyIndex];
var utteranceType = utteranceTypes[0];
var distribution = distributions[0];
var nonTargetProp = false;//nonTargetProps[0];
//************************************
console.log(domain);

var nFamiliarizations = 4;
var training_rows = 3;
var training_columns = 5;
var nExamples = training_rows*training_columns; //per familirarization
var nDomains = 1//domains.length;
var nQs = nDomains*(nFamiliarizations+1);
//var nSet = nFamiliarizations + 1; //a set consists of the intro, plus all familiarization trials for a domain, plus the target

$(document).ready(function() {
  showSlide("consent");
  $("#mustaccept").hide();
});

var experiment = {
  data: {
    domain:domain,
    property:property,
    utteranceType:utteranceType,
    nFamiliarizations:nFamiliarizations,
    nExamples:nExamples,
    nDomains:nDomains,
    nonTargetProp:nonTargetProp,
    distribution:distribution
  },
  
  intro: function() {
    $(".domain").html(domain);
    $(".domain-plural").html(plural(domain));
    $(".domain-plural-caps").html(caps(plural(domain)));
    $(".property").html(property);
    if (turk.previewMode) {
      $("#intro #mustaccept").show();
    } else {
      showSlide("intro");
      $(".continue").click(function() { 
        experiment.trial(0);
      })
    }
  },

  familiarization: function(qNumber) {
    var wug = nonceWords[qNumber];
    showSlide("familiarization");
    
    $(".Wugs").html(caps(plural(wug)));
    $(".Wug").html(caps(wug));
    $(".wugs").html(plural(wug));
    $(".wug").html(wug);
    $(".domain").html(domain);
    $(".domain-plural").html(plural(domain));
    $(".domain-plural-caps").html(caps(plural(domain)));
    $(".property").html(property);

    var Domain = constructor[domain];
    var thing = new Domain();

    var training_html = "<center>";
    for (var row=0;row<training_rows;row++)
    {       
      for (var col=0;col<training_columns;col++)
      {
        var index = row*training_columns + col;
        training_html += '<svg id="svg' + index + '"></svg>'
      }
      training_html += "<br/>";
    }
    training_html += "</center>";
                
    $("#examples").html(training_html);

    var distBin = distBins[distribution][qNumber];
    console.log(distBin);
    var nPositiveExamples = Math.round(distBin*nExamples);

    var trialData = {
      nrow: training_rows,
      ncol: training_columns,
      drawnObjects: [],
      nPositiveExamples:nPositiveExamples,
      qType:"familiarization"
    }

    var hasProp = [];
    for (var i=0; i<nPositiveExamples; i++) {
      hasProp.push(true);
    }
    for (var i=nPositiveExamples; i<nExamples; i++) {
      hasProp.push(false);
    }
    var hasProp = shuffle(hasProp);
    console.log(nPositiveExamples);
    console.log(hasProp);

    for (var row=0; row<training_rows; row++)
    {       
      for (var col=0; col<training_columns; col++)
      {
        var index = row*training_columns + col;
        if (propertyIndex == 0) {
          prop0 = hasProp[index]; //sample this!!!!
          prop1 = nonTargetProp;
        } else {
          prop0 = nonTargetProp;
          prop1 = hasProp[index]; //sample this!!!
        }
        drawnObject = thing.draw("svg" + index, prop0, prop1, 0.5);
        trialData.drawnObjects[index] = drawnObject;
      }
    }

    trialData.categoryMeans = JSON.stringify(thing);

    $(".continue").click(function() {
      $(".continue").unbind("click");
      experiment.data["trial" + qNumber] = trialData;
      if (qNumber + 1 < nQs) {
        experiment.trial(qNumber+1);
      } else {
        experiment.questionaire();
      }
    })
  },

  target: function(qNumber) {
    var wug = nonceWords[qNumber];
    showSlide("target");
    $(".err").hide();
    $(".Wugs").html(caps(plural(wug)));
    $(".Wug").html(caps(wug));
    $(".wugs").html(plural(wug));
    $(".wug").html(wug);
    $(".domain").html(domain);
    $(".domain-plural").html(plural(domain));
    $(".domain-plural-caps").html(caps(plural(domain)));
    $(".property").html(property);
    var statement = utterance(utteranceType, wug, property);
    if (statement) {
      $("#utterance").show();
      $("#statement").html('"' + statement + '."');
    } else {
      $("#utterance").hide();
    }

    var nResponses = 0;

    var trialData = {
      responses:[],
      qType:"target"
    };

    function changeCreator(i) {
      return function(value) {
        $('#slider' + i).css({"background":"#99D6EB"});
        $('#slider' + i + ' .ui-slider-handle').css({
          "background":"#667D94",
          "border-color": "#001F29" });
        if (trialData.responses[i] == null) {
          nResponses++;
        }
        var sliderVal = $("#slider"+i).slider("value");
        trialData.responses[i] = sliderVal;
        $("#slider" + i + "val").html(sliderVal);
      } 
    }
    function slideCreator(i) {
      return function() {
        $('#slider' + i + ' .ui-slider-handle').css({
           "background":"#E0F5FF",
           "border-color": "#001F29"
        });
      }
    }

    var nBins = 10;
    var binWidth = 10;
    var firstColWidth = 150;
    var otherColWidth = 100;

    var lowers = [];
    var uppers = [];
    var sliders = "";
    var ranges = "";

    for (var i=0; i<nBins; i++) {
      sliders += '<td rowspan="5" width="' + otherColWidth + '" align="center"><div class="slider" id="slider' + i + '"></div></td>';
        var low = i*binWidth;
        var high = (i+1)*binWidth;
        lowers.push(low);
        uppers.push(high);
        ranges += '<td align="center" width="' + otherColWidth + '" margin="5px">' + low + '-' + high + ' ' + plural(wug) + ' with ' + property + '</td>';
    }
    $("#sliderbins").html('<td height="80" width="' + firstColWidth + '">Extremely Likely</td>' + sliders);
    $("#ranges").html('<td width="' + firstColWidth + '"></td>' + ranges);

    trialData.lowers = lowers;
    trialData.uppers = uppers;

    for (var i=0; i<nBins; i++) {
      $("#slider" + i).css({"height": 300, "width":12});
      $("#slider" + i + " .ui-slider-handle").attr({"background": "#FAFAFA"});
      $('#slider' + i).slider({
        animate: true,
        orientation: "vertical",
        max: 1 , min: 0, step: 0.01, value: 0.5,
        slide: slideCreator(i),
        change: changeCreator(i)
      });
    }

    $(".continue").click(function() {
      if (nResponses < nBins) {
        $(".err").show();
      } else {
        $(".continue").unbind("click");
        $(".err").hide();
        experiment.data["trial" + qNumber] = trialData;
        if (qNumber + 1 < nQs) {
          experiment.trial(qNumber+1);
        } else {
          experiment.questionaire();
        }
      }
    })
  },

  trial: function(qNumber) {
    $('.bar').css('width', ( (qNumber / nQs)*100 + "%"));
    if (qNumber % (nFamiliarizations+1) == nFamiliarizations) {
      experiment.target(qNumber);
    } else {
      experiment.familiarization(qNumber);
    }
  },
  
  questionaire: function() {
    //disable return key
    $(document).keypress( function(event){
     if (event.which == '13') {
        event.preventDefault();
      }
    });
    //progress bar complete
    $('.bar').css('width', ( "100%"));
    showSlide("questionaire");
    $("#formsubmit").click(function() {
      rawResponse = $("#questionaireform").serialize();
      pieces = rawResponse.split("&");
      var age = pieces[0].split("=")[1];
      var lang = pieces[1].split("=")[1];
      var comments = pieces[2].split("=")[1];
      if (lang.length > 0) {
        experiment.data["language"] = lang;
        experiment.data["comments"] = comments;
        experiment.data["age"] = age;
        showSlide("finished");
        setTimeout(function() { turk.submit(experiment.data) }, 1000);
      }
    });
  }
}
  

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
      return caps(plural(wug)) + " have " + fur + ".";
    case "question-generic":
      return "Do " + plural(wug) + " have " + fur + "?";
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
                  "fish":["fangs", "whiskers"]};
var distributions = {
  "2":[2],
  "10":[10],
  "18":[18],
  "foo":shuffle([1,2,3]),
  "none":[],
  "low":shuffle([0,0,2,4]),
  "high":shuffle([20,20,18,16])
};
function singular(property) {
  if (property == "tails") {
    return "a tail";
  } else if (property == "crests") {
    return "a crest";
  } else {
    return property;
  }
}

//**********things that are randomized:
var nonceWords = shuffle(["wug", "dax", "fep", "tig", "speff",
                          "zid", "gub", "dob", "mib", "baw",
                          "wost", "wock", "thog", "snim", "ript",
                          "quog", "polt", "poch", "murp", "mulb",
                          "mork", "mopt", "monx", "mone", "moge",
                          "lide", "hoil", "hoff", "hisp", "hinx",
                          "hife", "hett", "fraw", "fing", "fick",
                          "blim", "zop", "blick"]);
var domains = shuffle(["tree", "flower", "monster", "bird", "microbe", "bug", "fish"]);
var propertyIndices = shuffle([0, 0, 0, 0, 1, 1, 1, 1]);
var conditions = shuffle([
  ["generic", "low"],
  ["none", "low"],
  ["generic", "high"],
  ["none", "high"]
]);
//************************************

var nFamiliarizations = distributions[conditions[0][1]].length;//4;
var training_rows = 2;
var training_columns = 10;
var scale = 0.4;
var nExamples = training_rows*training_columns; //per familirarization
var nDomains = conditions.length;//domains.length;
var nSet = nFamiliarizations + 2; //a set consists of the intro, plus all familiarization trials for a domain, plus the target
var nQs = nDomains*(nSet);

var qNumbers = [];
for (var i=0; i<nQs; i++) {
  qNumbers.push(i);
}

function domain(qNumber) {
  return domains[Math.floor((qNumber/nSet)) % domains.length];
}

function propertyIndex(qNumber) {
  return propertyIndices[Math.floor((qNumber/nSet)) % propertyIndices.length];
}

function property(qNumber) {
  var propList = properties[domain(Math.floor(qNumber))];
  return propList[propertyIndex(qNumber)];
}

function condition(qNumber) {
  return conditions[Math.floor(qNumber/nSet) % conditions.length];
}

$(document).ready(function() {
  showSlide("consent");
  $("#mustaccept").hide();
  if (nFamiliarizations == 1) {
    $(".fam1").show();
    $(".fam2").hide();
  } else {
    $(".fam1").hide();
    $(".fam2").show();
  }
  if (nDomains == 1) {
    $(".dom1").show();
    $(".dom2").hide();
  } else {
    $(".dom1").hide();
    $(".dom2").show();
  }
});

var experiment = {
  data: {
    domains:qNumbers.map(domain),
    properties:qNumbers.map(property),
    conditions:qNumbers.map(condition),
    nFamiliarizations:nFamiliarizations,
    nExamples:nExamples,
    nDomains:nDomains,
  },
  
  intro: function(qNumber) {
    if (qNumber == 0) {
      $("#firstIntro").show();
      $("#laterIntro").hide();
    } else {
      $("#firstIntro").hide();
      $("#laterIntro").show();
    }
    $(".domain").html(domain(qNumber));
    $(".domain-plural").html(plural(domain(qNumber)));
    $(".domain-plural-caps").html(caps(plural(domain(qNumber))));
    $(".property").html(property(qNumber));
    if (turk.previewMode) {
      $("#intro #mustaccept").show();
    } else {
      showSlide("intro");
      $(".continue").click(function() { 
        experiment.trial(qNumber + 1);
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
    $(".domain").html(domain(qNumber));
    $(".domain-plural").html(plural(domain(qNumber)));
    $(".domain-plural-caps").html(caps(plural(domain(qNumber))));
    $(".property").html(property(qNumber));

    var Domain = constructor[domain(qNumber)];
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

    var distribution = condition(qNumber)[1];
    var nPositiveExamplesList = distributions[distribution];
    var nPositiveExamples = nPositiveExamplesList[ (qNumber % nSet) - 1];

    var trialData = {
      nrow: training_rows,
      ncol: training_columns,
      drawnObjects: [],
      condition: condition(qNumber),
      domain: domain(qNumber),
      property: property(qNumber),
      distribution:distribution,
      nPositiveExamples:nPositiveExamples,
      nonceWord: wug,
      utteranceType: condition(qNumber)[0],
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

    for (var row=0; row<training_rows; row++)
    {       
      for (var col=0; col<training_columns; col++)
      {
        var index = row*training_columns + col;
        if (propertyIndex(qNumber) == 0) {
          prop0 = hasProp[index];
          prop1 = false;
        } else {
          prop0 = false;
          prop1 = hasProp[index];
        }
        drawnObject = thing.draw("svg" + index, prop0, prop1, scale);
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
    $(".domain").html(domain(qNumber));
    $(".domain-plural").html(plural(domain(qNumber)));
    $(".domain-plural-caps").html(caps(plural(domain(qNumber))));
    $(".property").html(property(qNumber));
    $(".property-singular").html(singular(property(qNumber)));

    var cond = condition(qNumber);
    var utteranceType = cond[0];

    var distribution = cond[1];

    var trialData = {
      responses:[],
      domain: domain(qNumber),
      property: property(qNumber),
      utteranceType: utteranceType,
      condition: cond,
      distribution: distribution,
      nonceWord: wug,
      drawnObjects: [],
      responses: [],
      qType:"target"
    };

/*    var categoryMeans = "";

    var lastDist = cond[2];
    if (lastDist == "none") {
      $(".have-seen").hide();
      $(".have-not-seen").show();
      var nPositiveExamples = 0;
      var haveSeen = false;
    } else {
      $(".have-seen").show();
      $(".have-not-seen").hide();
      var nPositiveExamplesList = distributions[lastDist];
      var nPositiveExamples = nPositiveExamplesList[0];
      var haveSeen = true;

      //Draw examples
      var Domain = constructor[domain(qNumber)];
      var thing = new Domain();

      var target_html = "<center>";
      for (var row=0;row<training_rows;row++)
      {       
        for (var col=0;col<training_columns;col++)
        {
          var index = row*training_columns + col;
          target_html += '<svg id="targetSvg' + index + '"></svg>'
        }
        target_html += "<br/>";
      }
      target_html += "</center>";
                  
      $("#targetExamples").html(target_html)

      var hasProp = [];
      for (var i=0; i<nPositiveExamples; i++) {
        hasProp.push(true);
      }
      for (var i=nPositiveExamples; i<nExamples; i++) {
        hasProp.push(false);
      }
      var hasProp = shuffle(hasProp);

      for (var row=0; row<training_rows; row++)
      {       
        for (var col=0; col<training_columns; col++)
        {
          var index = row*training_columns + col;
          if (propertyIndex(qNumber) == 0) {
            prop0 = hasProp[index];
            prop1 = false;
          } else {
            prop0 = false;
            prop1 = hasProp[index];
          }
          drawnObject = thing.draw("targetSvg" + index, prop0, prop1, scale);
          trialData.drawnObjects[index] = drawnObject;
        }
      }

      categoryMeans = JSON.stringify(thing);
    }*/

    var statement = utterance(utteranceType, wug, property(qNumber));
    if (statement) {
      $("#utterance").show();
      $("#statement").html('"' + statement + '"');
    } else {
      $("#utterance").hide();
    }

    var nResponses = 0;

/*    trialData.nPositiveExamples = nPositiveExamples;
    trialData.categoryMeans = categoryMeans;
    trialData.haveSeen = haveSeen;*/

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

    $("#sliders").html('<div class="slider" id="slider0"></div>');
    $("#slider0").css({"height": 12, "width":800});
    $("#slider0 .ui-slider-handle").attr({"background": "#FAFAFA"});
    $('#slider0').slider({
      animate: true,
      orientation: "horizontal",
      max: 1 , min: 0, step: 0.01, value: 0.5,
      slide: slideCreator(0),
      change: changeCreator(0)
    });

    $(".continue").click(function() {
      if (nResponses < 1) {
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
    if (qNumber % nSet == 0) {
      experiment.intro(qNumber);
    } else if (qNumber % nSet == (nSet-1)) {
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
  

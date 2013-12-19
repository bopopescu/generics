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
function getUtterance(utteranceType, wug, fur) {
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
var he = {
  girl: "she",
  boy: "he"
};
var his = {
  girl: "her",
  boy: "his"
};
var him = {
  girl: "her",
  boy: "him"
};
function possessive(name) {
  return name + "'s";
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
var names = {
  girl: shuffle(["Anna", "Beth", "Carey", "Danielle", "Erica", "Sally"]),
  boy: shuffle(["Andrew", "Ben", "Colin", "Daniel", "Eric", "Sam"])
}
var sciGender = shuffle(["boy", "girl"])[0];
var sciName = names[sciGender].pop();
//if we're not varying the person in between sections:
var gender = shuffle(["boy", "girl"])[0];
var name = names[gender].pop();
//************************************

var nFamiliarizations = distributions[conditions[0][1]].length;//4;
var training_rows = 4;
var training_columns = 5;
var scale = 0.4;
var nExamples = training_rows*training_columns; //per familirarization
var nDomains = conditions.length;//domains.length;
var nSet = nFamiliarizations + 2; //a set consists of the intro, plus all familiarization trials for a domain, plus the target
var nQs = nDomains*(nSet);

$(document).ready(function() {
  showSlide("consent");
  $("#mustaccept").hide();
  if (nDomains == 1) {
    $(".dom1").show();
    $(".dom2").hide();
  } else {
    $(".dom1").hide();
    $(".dom2").show();
  }

  $(".sci-name").html(sciName);
  $(".sci-he-caps").html(caps(he[sciGender]));
});

var experiment = {
  data: {
    sectionProperties:[],
    version:"12-18",
    targets:[]
  },
  
  intro: function(qNumber, state, sectionProperties) {
    var domain = sectionProperties.domain;
    var property = sectionProperties.property;
    if (qNumber == 0) {
      $("#firstIntro").show();
      $("#laterIntro").hide();
    } else {
      $("#firstIntro").hide();
      $("#laterIntro").show();
    }
    $(".domain").html(domain);
    $(".domain-plural").html(plural(domain));
    $(".domain-plural-caps").html(caps(plural(domain)));
    $(".property").html(property);
    if (turk.previewMode) {
      $("#intro #mustaccept").show();
    } else {
      showSlide("intro");
      $(".continue").click(function() { 
        //after intro is always first familiarization:
        state.type = "familiarization";
        state.familiarizationNumber = 0; //keep track of how many familiarizations have been seen so far
        experiment.trial(qNumber + 1, state, sectionProperties);
      })
    }
  },

  familiarization: function(qNumber, state, sectionProperties) {

    var distribution = sectionProperties.distribution;
    var utterance = sectionProperties.utterance;
    var property = sectionProperties.property;
    var wug = sectionProperties.words[state.familiarizationNumber];
    var thing = sectionProperties.things[state.familiarizationNumber];
    var hasProp = sectionProperties.hasProp[state.familiarizationNumber];
    var domain = sectionProperties.domain;
    var propertyIndex = sectionProperties.propertyIndex;

    showSlide("trial");
    $(".err").hide();
    $("#familiarization").show();
    $("#target").hide();
    
    $(".Wugs").html(caps(plural(wug)));
    $(".Wug").html(caps(wug));
    $(".wugs").html(plural(wug));
    $(".wug").html(wug);

    var training_html = "<center>";
    var notebook_html = "<center>";
    for (var row=0;row<training_rows;row++)
    {       
      for (var col=0;col<training_columns;col++)
      {
        var index = row*training_columns + col;
        training_html += '<svg id="svg' + index + '"></svg>'
        notebook_html += '<svg id="svg' + state.familiarizationNumber + '-' + index + '"></svg>'
      }
      training_html += "<br/>";
      if (row % 2 == 1) {
        notebook_html += "<br/>";
      }
    }
    training_html += "</center>";
    notebook_html += "</center>";
                
    $("#examples").html(training_html);
    $("#examples" + state.familiarizationNumber).html(notebook_html);

    sectionProperties.drawnObjects = [];

    var drawnObjects = []; //NOT RECORDED!!!!!!!!

    for (var row=0; row<training_rows; row++) {       
      for (var col=0; col<training_columns; col++) {
        var index = row*training_columns + col;
        if (propertyIndex == 0) {
          prop0 = hasProp[index];
          prop1 = false;
        } else {
          prop0 = false;
          prop1 = hasProp[index];
        }
        drawnObject = thing.draw("svg" + index, prop0, prop1, scale);
        thing.draw("svg" + state.familiarizationNumber + '-' + index, prop0, prop1, 0.12);
        drawnObjects[index] = drawnObject;
      }
    }

    sectionProperties.drawnObjects[state.familiarizationNumber] = drawnObjects;

    $(".continue").click(function() {
      $(".continue").unbind("click");
      if (qNumber + 1 < nQs) {
        //repeat familiarization phase until nFamiliarizations familiarizations have been shown. then go to "target"
        if (state.familiarizationNumber < nFamiliarizations-1) {
          state.familiarizationNumber = 1 + state.familiarizationNumber;
        } else {
          state.type = "target";
        }
        experiment.trial(qNumber+1, state, sectionProperties);
      } else {
        experiment.questionaire();
      }
    })
  },

  target: function(qNumber, state, sectionProperties) {
    var distribution = sectionProperties.distribution;
    var utterance = sectionProperties.utterance;
    var property = sectionProperties.property;
    var wug = sectionProperties.words[nFamiliarizations];
    var domain = sectionProperties.domain;

    showSlide("trial");
    $("#target").show();
    $("#familiarization").hide();
    $(".err").hide();
    $(".Wugs").html(caps(plural(wug)));
    $(".Wug").html(caps(wug));
    $(".wugs").html(plural(wug));
    $(".wug").html(wug);


    var trialData = {
      response:null,
      distribution: distribution,
      utterance: utterance
    };

    var statement = getUtterance(utterance, wug, property);
    if (statement) {
      $("#utterance").show();
      $("#statement").html('"' + statement + '"');
    } else {
      $("#utterance").hide();
    }

    var nResponses = 0;

    $("#sliders").html('<div class="slider" id="slider"></div>');
    $("#slider").css({"height": 12, "width":600});
    $("#slider .ui-slider-handle").attr({"background": "#FAFAFA"});
    $('#slider').slider({
      animate: true,
      orientation: "horizontal",
      max: 1 , min: 0, step: 0.01, value: 0.5,
      slide: function() {
        $('#slider .ui-slider-handle').css({
           "background":"#E0F5FF",
           "border-color": "#001F29"
        });
      },
      change: function(value) {
        $('#slider').css({"background":"#99D6EB"});
        $('#slider .ui-slider-handle').css({
          "background":"#667D94",
          "border-color": "#001F29" });
        if (trialData.response == null) {
          nResponses++;
        }
        var sliderVal = $("#slider").slider("value");
        trialData.response = sliderVal;
        //$("#sliderval").html(sliderVal);
      },
    });

    $(".continue").click(function() {
      if (nResponses < 1) {
        $(".err").show();
      } else {
        $(".continue").unbind("click");
        $(".err").hide();
        experiment.data.targets.push(trialData);
        //now that all the object have been drawn:
        experiment.data.sectionProperties.push(sectionProperties);
        if (qNumber + 1 < nQs) {
          //start over after each target question
          experiment.trial(qNumber+1, {type:"new"});
        } else {
          experiment.questionaire();
        }
      }
    })
  },

  trial: function(qNumber, state, sectionProperties) {
    $('.bar').css('width', ( (qNumber / nQs)*100 + "%"));

    //write new section properties to data each section:
    if (state.type == "new") {
      var sectionProperties = {
        domain: domains.pop(), //e.g. "tree"
        cond: conditions.pop(),
        drawnObjects: [],
        //gender: shuffle(["boy", "girl"])[0]
        gender: gender
      }
      //sectionProperties.name = names[sectionProperties.gender].pop();
      sectionProperties.name = name;
      //words for familiarizations and target:
      sectionProperties.words = []; //e.g. ["wugs", "tigs", "daxes", "feps", "gorps"]
      for (var i=1; i<=nFamiliarizations+1; i++) {
        sectionProperties.words.push(nonceWords.pop());
      }
      //category means for familiarization and target:
      sectionProperties.things = [];
      for (var i=1; i<=nFamiliarizations+1; i++) {
        var Domain = constructor[sectionProperties.domain];
        var thing = new Domain();
        sectionProperties.things.push(thing);
      }
      sectionProperties.utterance = sectionProperties.cond[0]; //generic or none (or neg?)
      sectionProperties.distribution = sectionProperties.cond[1]; //low or high
      if (sectionProperties.domain == "monster") { //teeth don't show up in notebook
        sectionProperties.propertyIndex = 0;
      } else if (sectionProperties.domain == "fish") { //fangs don't show up in notebook
        sectionProperties.propertyIndex = 1;
      } else {
        sectionProperties.propertyIndex = shuffle([0,1])[0];
      }
      sectionProperties.property = properties[sectionProperties.domain][sectionProperties.propertyIndex];

      //distribution of property among the 20 (or however many) objects - ONLY for familiarization
      sectionProperties.hasProp = [];
      for (var i=0; i<nFamiliarizations; i++) {
        var nPositiveExamples = distributions[sectionProperties.distribution][i];
        var hasProp = [];
        for (var k=0; k<nPositiveExamples; k++) {
          hasProp.push(true);
        }
        for (var k=nPositiveExamples; k<nExamples; k++) {
          hasProp.push(false);
        }
        var hasProp = shuffle(hasProp);
        sectionProperties.hasProp.push(hasProp);
      }
      console.log(sectionProperties.hasProp);
      state.type = "intro";

      for (var i=0; i<sectionProperties.words.length; i++) {
        var word = sectionProperties.words[i];
        $(".wug"+i).html(plural(word));
        $("#examples" + i).html("?");
      }

      $(".domain").html(sectionProperties.domain);
      $(".domain-plural").html(plural(sectionProperties.domain));
      $(".domain-plural-caps").html(caps(plural(sectionProperties.domain)));
      $(".property").html(sectionProperties.property);
      $(".property-singular").html(singular(sectionProperties.property));
      $(".name").html(sectionProperties.name);
      $(".he-caps").html(caps(he[sectionProperties.gender]));
      $(".he").html(he[sectionProperties.gender]);
      $(".his").html(his[sectionProperties.gender]);
      $(".him").html(him[sectionProperties.gender]);
      $(".pos").html(possessive(sectionProperties.name));
    }

    if (state.type == "intro") {
      experiment.intro(qNumber, state, sectionProperties);
    } else if (state.type == "target") {
      experiment.target(qNumber, state, sectionProperties);
    } else {
      experiment.familiarization(qNumber, state, sectionProperties);
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
  

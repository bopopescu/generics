// collect all pairs of npos and nneg (number of pos and neg examples)
// should be 10 pairs when max examples is 3,
// double so we can try each pair with and without generics

var simpleSlider;

var maxExamples = 3;
var nPosNeg = [];
for (i=0; i<=maxExamples; i++) {
  for (j=0; j<=maxExamples-i; j++) {
    nPosNeg.push([i, j, true]); // with generic
    // alternatively don't have this if statement, and use that case
    // for the question to check turkers are paying attention
    if (i+j > 0) {
      nPosNeg.push([i, j, false]); // without generic
    }
  }
}
nPosNeg = shuffle(nPosNeg);

// create banks of nonce words and properties
// should be twice as many nonce words (2 per trial) as properties (1 per trial)
var entities = shuffle(["wugs", "feps", "blickets", "daxes", "speffs", 
                        "zibs", "feps", "blickets", "daxes", "speffs",
                        "wugs", "feps", "blickets", "daxes", "speffs", 
                        "zibs", "feps", "blickets", "daxes", "speffs", 
                        "zibs", "feps", "blickets", "daxes", "speffs", 
                        "zibs", "feps", "blickets", "daxes", "speffs", 
                        "zibs", "feps", "blickets", "daxes", "speffs", 
                        "zibs", "feps", "blickets", "daxes", "speffs"]);
var properties = shuffle(["have horns", "have little appendages that stick off of them",
                          "have little appendages that stick off of them",
                          "are green", "are green", "are green",
                          "have swirly branches", "have swirly branches", 
                          "have swirly branches",
                          "have horns", "have horns", "have horns",
                          "have horns", "have horns", "have horns",
                          "have horns", "have horns", "have horns",
                          "have horns", "have horns"]);
var examplesFirst = shuffle([true, true, true, true, true,
                             false, false, false, false, false]);
var categories = {"have horns":"monster",
                  "have little appendages that stick off of them":"microbe",
                  "are green":"crystal",
                  "have swirly branches":"tree"};

// singular form of nonce words
var singular = {"wugs":"wug", "feps":"fep", "blickets":"blicket", 
                "daxes":"dax", "speffs":"speff", "zibs":"zib"};

// as as many questions as there are pos/neg example pairs
qtotal = nPosNeg.length;
$(".numberofquestions").html(qtotal);

// begin experiment
function instructions() {showSlide("instructions");}

var trial = {
  qResponse: .5,

  qnum: 0, // question number (increments from 0 to qtotoal)

  // compuations of variables for this trial, including what strings and
  // images to display on info and question slides
  // run right before info slide is displayed. results affect question slide
  // as well.
  computations: function() {

    // variables for this trial
    npos = nPosNeg[trial.qnum][0];
    nneg = nPosNeg[trial.qnum][1];
    ntot = npos + nneg;
    showGen = nPosNeg[trial.qnum][2];
    entity1 = entities.shift();
    entity2 = entities.shift();
    property = properties.shift();
    category = categories[property];

    // clear examples from previous trial
    var imagesSpan = document.getElementById("images");
    imagesSpan.innerHTML = '';

    // Examples
    if (ntot > 0) {
      // introduce images
      if (ntot == 1) {
        existPhrase = "this is";
        entityWord = singular[entity1];
      } else {
        existPhrase = "these are";
        entityWord = entity1;
      }
      ex = "You go out into the wild to observe some " + entity1 + ", and " + 
           existPhrase + " the " + entityWord + " that you see:";

      // collect at most 3 image files into "examples" list based on how many 
      // positive and negative examples there should be in this trial
      function posImg(numStr) {
        imgString = "./generics_files/images/" + category + "-pos" + numStr + ".png";
        return imgString;
      }
      function negImg(numStr) {
        imgString = "./generics_files/images/" + category + "-neg" + numStr + ".png";
        return imgString;
      }
      
      var numbers = ["1", "2", "3"];
      positives = shuffle(numbers.map(posImg));
      negatives = shuffle(numbers.map(negImg));
      examples = shuffle(positives.slice(0,npos).concat(negatives.slice(0,nneg)));

      // add images to the info slide for this trial
      for (i=0; i<examples.length; i++) {
        var img = document.createElement("img");
        img.src = examples[i]
        imagesSpan.appendChild(img);
      }
    } else {ex = "";}

    // Generic
    if (showGen) {
      exFirst = examplesFirst.shift();
      generic = "You have heard Scientist Sally, who is an expert on the " +
                category + "s of this planet, mention " + entity1 + " before." +
                " When you first came to the planet, she told you, \"" + 
                capitalize(entity1) + " " + property + "\".";
      if (exFirst) {
        var gen1 = "";
        var gen2 = generic;
      } else {
        var gen1 = generic;
        var gen2 = "";
      }
    } else {
        var gen1 = "";
        var gen2 = "";
    }

    // more strings
    var otherEntity = capitalize(entity2) + " are another kind of " + 
                      category + " that are found on this planet.";

    var q = "Imagine you came accross 100 " + entity2 + 
            ". How many of those " + entity2 + " do you think " + property +"?";

    var intr = capitalize(entity1) + " are a kind of " + category + 
               " that are found on this planet."

    // send strings to html
    $(".pr").show();
    $("#ex").html(ex);
    $("#gen1").html(gen1);
    $("#gen2").html(gen2);
    $("#q").html(q);
    $("#otherEntity").html(otherEntity);
    $("#intr").html(intr);
  },

  info: function() {
    trial.computations();
    // display slide, now with appropriate information for this trial
    showSlide("trialInfo");
  },

  question: function() {
    $("#leftanchor").html("0") 
    $("#rightanchor").html("100")

    var sliderCase = document.getElementById("sliderCase");
    sliderCase.innerHTML = '<div id="simple-slider" class="dragdealer"><div class="red-bar handle"></div></div>';
    showSlide("trialQ");
    simpleSlider = new Dragdealer('simple-slider', {
      speed:20,
      callback: function(value) {experiment.qResponse = value;}
    });
    simpleSlider.setValue(.5);
  },

  submit: function() {
    //proportion = $("#propform").serialize();
    //document.getElementById("propform").reset();
    trial.qnum++;
    if (trial.qnum < qtotal) {trial.info();} else {language();}
  }
}

function language() {
  showSlide("language");
  $("#lgerror").hide();
  $("#lgsubmit").click(function(){
    lang = $("#lgform").serialize();
    if (lang.length > 5) {
      lang = lang.slice(3,lang.length);
      //experiment.data["language"] = lang;
      showSlide("finished");
      //setTimeout(function() {turk.submit(experiment.data)}, 1000);
    }
  });
}

function showSlide(id) {$(".slide").hide();$("#"+id).show();}
function shuffle(v) { newarray = v.slice(0);for(var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);return newarray;} // non-destructive.
function capitalize(string) {var firstLetter = string.substring(0,1); firstLetter = firstLetter.toUpperCase(); var rest = string.substring(1,string.length); return firstLetter.concat(rest);}

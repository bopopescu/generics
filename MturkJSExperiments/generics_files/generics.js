// collect all pairs of npos and nneg (number of pos and neg examples)
// should be 10 pairs when max examples is 3,
// double so we can try each pair with and without generics
var maxExamples = 3;
var nPosNeg = [];
for (i=0; i<=maxExamples; i++) {
  for (j=0; j<=maxExamples-i; j++) {
    nPosNeg.push([i, j, true]); // with generic
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
var properties = shuffle(["have horns", "have horns", "have horns",
                          "have horns", "have horns", "have horns",
                          "have horns", "have horns", "have horns",
                          "have horns", "have horns", "have horns",
                          "have horns", "have horns", "have horns",
                          "have horns", "have horns", "have horns",
                          "have horns", "have horns"]);
var examplesFirst = shuffle([true, true, true, true, true,
                             false, false, false, false, false]);

// singular form of nonce words
var singular = {"wugs":"wug", "feps":"fep", "blickets":"blicket", 
                "daxes":"dax", "speffs":"speff", "zibs":"zib"};

// as as many questions as there are pos/neg example pairs
qtotal = nPosNeg.length;
$(".numberofquestions").html(qtotal);

// begin experiment
function instructions() {showSlide("instructions");}

var trial = {
  qnum: 0, // question number (increments from 0 to qtotoal)

  info: function() {

    // variables for this trial
    npos = nPosNeg[trial.qnum][0];
    nneg = nPosNeg[trial.qnum][1];
    ntot = npos + nneg;
    showGen = nPosNeg[trial.qnum][2];
    entity1 = entities.shift();
    entity2 = entities.shift();
    property = properties.shift();

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
      positives = shuffle(["horns1", "horns2", "horns3"]);
      negatives = shuffle(["nohorns1", "nohorns2", "nohorns3"]);
      examples = shuffle(positives.slice(0,npos).concat(negatives.slice(0,nneg)));

      // add images to the info slide for this trial
      for (i=0; i<examples.length; i++) {
        var img = document.createElement("img");
        img.src = "generics_files/" + examples[i] + ".png";
        imagesSpan.appendChild(img);
      }
    } else {ex = "";}

    // Generic
    if (showGen) {
      exFirst = examplesFirst.shift();
      generic = "You have heard Scientist Sally mention " + entity1 +
                    " before. When you first came to the planet," +
                    " she told you, \"" + capitalize(entity1) + 
                    " have horns\".";
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

    $(".pr").show();
    $("#ex").html(ex);
    $("#gen1").html(gen1);
    $("#gen2").html(gen2);

    // display slide, now with appropriate information for this trial
    showSlide("trialInfo");
  },

  question: function() {
    showSlide("trialQ");
  },

  submit: function() {
    proportion = $("#propform").serialize();
    document.getElementById("propform").reset();
    trial.qnum++;
    if (trial.qnum < qtotal) {trial.info();} else {language();}
  },
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

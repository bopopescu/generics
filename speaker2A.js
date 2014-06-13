function caps(a) {return a.substring(0,1).toUpperCase() + a.substring(1,a.length);}
function uniform(a, b) { return ( (Math.random()*(b-a))+a ); }
function showSlide(id) { $(".slide").hide(); $("#"+id).show(); }
function shuffle(v) { newarray = v.slice(0);for(var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);return newarray;} // non-destructive.
function sample(v) {return(shuffle(v)[0]);}
function rm(v, item) {if (v.indexOf(item) > -1) { v.splice(v.indexOf(item), 1); }}
function rm_sample(v) {var item = sample(v); rm(v, item); return item;}
function sample(v, n) {
  if (n == null) {
    return(shuffle(v)[0]);
  } else {
    return(shuffle(v).slice(0,n));
  }
}
var startTime;

var num_with_property_clicked_on = 0;
var num_needed_clicked_on;

var enough_responses;
var n_responses = 0;
responses = {};
function changeCreator(i) {
  return function(value) {
    $('#slider' + i).css({"background":"#99D6EB"});
    $('#slider' + i + ' .ui-slider-handle').show();
    $('#slider' + i + ' .ui-slider-handle').css({
      "background":"#667D94",
      "border-color": "#001F29" });
    if (responses["response" + i] == null) {
      n_responses++;
      responses["response" + i] = [];
    }
    var slider_val = $("#slider"+i).slider("value");
    responses["response" + i] = slider_val;
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
function clickCreator(i, has_property) {
  return function() {
    $( "#creature" + i ).unbind("click");
    if (has_property) {
      $( "#creature" + i ).css("padding", "0px");
      $( "#creature" + i ).css("border", "1px solid black");
      num_with_property_clicked_on ++;
      if (num_needed_clicked_on > 0 & num_with_property_clicked_on == num_needed_clicked_on) {
        $(".creature_image").unbind("click");
        $("#click_on_all_targets").hide();
        $("#what_kind_question").show();
      }
    }
  }
}

var nonceWords = shuffle([
  "wug", "dax", "fep", "tig", "speff", "zib", "gub", "wost", "wock", "thog",
  "snim", "ript", "quog", "polt", "poch", "murp", "mulb", "mork", "mopt", "monx",
  "mone", "moge", "lide", "hoil", "hoff", "hisp", "hinx", "hife", "hett", "fraw",
  "fing", "fick", "blim", "zop", "blick"
]);

function plural(word) {
  if (/dax|poch|monx|hinx/.test(word)) {
    return(word + "es");
  } else if (/fish|thorns|fangs|whiskers|antennae|wings|spots/.test(word)) {
    return word;
  } else {
    return(word + "s");
  }
}

function is_same(response, creature) {
  var result = response.match(new RegExp(creature + "|" + plural(creature), "i"));
  if (result) {
    return true;
  } else {
    return false;
  }
}

var target_features = {
  flower: ["thorns", "spots"],
  fish: ["fangs", "whiskers"],
  bug: ["antennae", "wings"],
  bird: ["tail", "crest"]
}

var distributions = {
  "none": [false, false, false, false, false, false, false, false, false, false],
  "half": [true, true, true, true, true, false, false, false, false, false],
  "all": [true, true, true, true, true, true, true, true, true, true],
}

/*shuffle(
    [ [ shuffle([false, false, false, false, false, false, false, false, false, false]),
        shuffle([true, true, true, true, true, false, false, false, false, false]),
        shuffle([true, true, true, true, true, true, true, true, true, true]) ],
      [ shuffle([false, false, false, false, false, false, false, false, false, false]),
        shuffle([true, true, true, true, true, false, false, false, false, false]),
        shuffle([false, false, false, false, false, false, false, false, false, false]) ],
      [ shuffle([true, true, true, true, true, true, true, true, true, true]),
        shuffle([true, true, true, true, true, false, false, false, false, false]),
        shuffle([true, true, true, true, true, true, true, true, true, true]) ],
    ]
  )*/

var randomization = {
  "creature": sample(["fish", "bird", "flower", "bug"]),
  "categories": sample(nonceWords, 3),
  "target_feature_index": sample([0, 1]),
  "order": shuffle(["target", "distractor0", "distractor1"]),
  "context": sample("higher", "same", "lower"),
  "shuffling": {
    "target": shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
    "distractor0": shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
    "distractor1": shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  }
}

randomization.amount_positive_examples = {target: "half"};
randomization.amount_positive_examples.distractor0 = randomization.context == "higher" ? "all" : randomization.context == "same" ? "half" : "none";
randomization.amount_positive_examples.distractor1 = randomization.context == "higher" ? "all" : randomization.context == "same" ? "half" : "none";

randomization.target_category = randomization.categories[randomization.order.indexOf("target")];

var qNumber = 1;
var number_of_categories = 3;
var number_of_examples = 10;
var nQs = number_of_categories + 1;

$(document).ready(function() {
  showSlide("consent");
  $("#mustaccept").hide();
  startTime = Date.now();
});

var experiment = {
  data: {
    "creature": randomization.creature,
    "repsonses": [],
  },

  begin: function() {
    if (turk.previewMode) {
      $("#instructions #mustaccept").show();
    } else {
      experiment.instructions();
    }
  },
  
  instructions: function() {
    $(".creature").html(randomization.creature);
    $(".creatures").html(plural(randomization.creature));
    $(".number_of_categories").html(number_of_categories);
    showSlide("instructions");
    $(".continue").click(function() {
      $(".continue").unbind("click");
      experiment.trial(0);
    })
  },

  trial: function(qNumber) {
    $(".err").hide();
    if (qNumber < number_of_categories) {
      response_check = experiment.examples(qNumber);
    } else {
      response_check = experiment.sentences(qNumber - number_of_categories);
    }
    $(".continue").click(function() {
      if (response_check()) {
        $(".continue").unbind("click");
        $(".to_clear").val("");
        if (qNumber + 1 < nQs){
          experiment.trial(qNumber + 1);
        } else{
          experiment.questionnaire();
        }
      }
    })
  },

  examples: function(qNumber) {
    num_with_property_clicked_on = 0;
    $("#click_on_all_targets").show();
    $("#what_kind_question").hide();

    var category_index = qNumber;
    var category_type = randomization.order[category_index];
    var amount_positive_examples = randomization.amount_positive_examples[category_type];
    num_needed_clicked_on = amount_positive_examples == "all" ? number_of_examples : amount_positive_examples == "half" ? number_of_examples / 2 : 0;

    var target_distribution = []
    for (var i=0; i<distributions[amount_positive_examples].length; i++) {
      target_distribution[i] = distributions[amount_positive_examples][randomization.shuffling[category_type][i]]
    }

  	$('.bar').css('width', ( (qNumber / nQs)*100 + "%"));
    showSlide("examples");
    var creature_images = "";
    for (var i=0; i<number_of_examples; i++) {
      creature_images += "<svg class='creature_image' id='creature" + i + "'></svg>";
    }
    $("#creature_images").html(creature_images);
    var scale = 0.4;
    var genus = new Ecosystem.Genus(randomization.creature, {
      /*"col1":{"mean":"#ff0000"},
      "col2":{"mean":"#00ff00"},
      "col3":{"mean":"#0000ff"},
      "tar1":0.1, //almost never has a tail
      "tar2":0.9, //almost always has a crest
      "prop1":{"mean":0, "var":0.05}, //low height variance
      "prop1":{"mean":0, "var":0.5}, //high fatness variance*/
      "var":0.3 //overall variance (overwritten by any specified variances)
    })
    for (var i=0; i<number_of_examples; i++) {
      has_property = target_distribution[i];
      console.log(has_property);
      if (randomization.target_feature_index == 0) {
        genus.draw("creature" + i, {tar1:has_property}, scale);
      } else {
        genus.draw("creature" + i, {tar2:has_property}, scale);
      }
      $("#creature" + i).click(clickCreator(i, has_property));
    }
/*    Ecosystem.draw(
        "bird", {"col1":"#ff0000",
                 "col2":"#00ff00",
                 "col3":"#0000ff",
                 "tar1":false,
                 "tar2":true,
                 "prop1":0,
                 "prop2":0},
        "svgID", scale)*/
    /*var options = "<option></option>"
    for (var i=0; i<=number_of_examples; i++) {
      options += "<option>" + i + "</option>";
    }
    $("#how_many").html(options);*/
    $(".creature").html(randomization.creature);
    $(".creatures").html(plural(randomization.creature));
    $(".category").html(randomization.categories[category_index]);
    $(".capital_category").html(caps(randomization.categories[category_index]));
    $(".categories").html(plural(randomization.categories[category_index]));
    $(".capital_categories").html(caps(plural(randomization.categories[category_index])));
    $(".target_features").html(plural(target_features[randomization.creature][randomization.target_feature_index]));
    $(".temporal_adverb").html(qNumber == 0 ? "first" : "next");

    if (amount_positive_examples == "none") {
      $("#there_are_none").click(function() {
        $(".creature_image").unbind("click");
        $("#there_are_none").unbind("click");
        $("#click_on_all_targets").hide();
        $("#what_kind_question").show();
      })
    }

    return function() {
      var what_kind_response = $("#what_kind").val();
      /*var how_many_response = $("#how_many").val();
      if (how_many_response == "") {
        $("#how_many_err").show();
      } else {
        $("#how_many_err").hide();
      }*/
      if (!is_same(what_kind_response, randomization.categories[category_index])) {
        $("#what_kind_err").show();
      } else {
        $("#what_kind_err").hide();
      }
      //return (how_many_response != "") & is_same(what_kind_response, randomization.categories[category_index]);
      return is_same(what_kind_response, randomization.categories[category_index]);
    };
  },

  sentences: function() {
    var target_property_plural = plural(target_features[randomization.creature][randomization.target_feature_index]);
    $(".creature").html(randomization.creature);
    $(".creatures").html(plural(randomization.creature));
    $(".target_category").html(randomization.target_category);
    $(".capital_target_category").html(caps(randomization.target_category));
    $(".target_categories").html(plural(randomization.target_category));
    $(".capital_target_categories").html(caps(plural(randomization.target_category)));
    $(".target_features").html(target_property_plural);
    $(".temporal_adverb").html(qNumber == 0 ? "first" : "next");

    showSlide("sentences");
    var slider_table = '<tr><td></td><td><div class="left_slider_meaning">very unlikely</div><div class="right_slider_meaning">very likely</div></td></tr>';
    var sentences = [
      '"' + caps(plural(randomization.target_category)) + ' have ' + target_property_plural + '."',
      '"' + caps(plural(randomization.target_category)) + ' usually have ' + target_property_plural + '."',
      '"' + caps(plural(randomization.target_category)) + ' always have ' + target_property_plural + '."',
      '"' + caps(plural(randomization.target_category)) + ' sometimes have ' + target_property_plural + '."',
      '"' + caps(plural(randomization.target_category)) + ' do not have ' + target_property_plural + '."'
    ];
    for (var i=0; i<sentences.length; i++) {
      slider_table += '<tr><td id="completion' + i + '"></td><td class="slider_container"><div id="slider' + i + '" class="slider"></div></td></tr>';
    }
    $("#slider_table").html(slider_table);
    for (var i=0; i<sentences.length; i++) {
      $("#completion" + i).html(sentences[i]);
      responses["completion" + i] = sentences[i];
      $('#slider' + i).slider({
        animate: false,
        orientation: "horizontal",
        max: 1 , min: 0, step: 0.01, value: 0.5,
        slide: slideCreator(i),
        change: changeCreator(i)
      });
    }
    $(".ui-slider-handle").hide();
    return function() {
      return n_responses == sentences.length;
    }
  },

  questionnaire: function() {
  	showSlide("questionnaire");
  }
}
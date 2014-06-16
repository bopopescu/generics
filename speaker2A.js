function caps(a) {return a.substring(0,1).toUpperCase() + a.substring(1,a.length);}
function uniform(a, b) { return ( (Math.random()*(b-a))+a ); }
function showSlide(id) { $(".slide").hide(); $("#"+id).show(); }
function shuffle(v) { newarray = v.slice(0);for(var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);return newarray;} // non-destructive.
function sample(v) {return(shuffle(v)[0]);}
function rm(v, item) {if (v.indexOf(item) > -1) { v.splice(v.indexOf(item), 1); }}
function rm_sample(v) {var item = sample(v); rm(v, item); return item;}
function last(lst) {return lst[lst.length - 1];}
function sample(v, n) {
  if (n == null) {
    return(shuffle(v)[0]);
  } else {
    return(shuffle(v).slice(0,n));
  }
}
var start_time;
var scale = 0.4;

var num_with_property_clicked_on = 0;
var num_needed_clicked_on;

var enough_responses;
var n_responses = 0;
responses = {
  "target":{"correct_image_clicks":[], "incorrect_image_clicks":[]},
  "context_category0":{"correct_image_clicks":[], "incorrect_image_clicks":[]},
  "context_category1":{"correct_image_clicks":[], "incorrect_image_clicks":[]},
};
function changeCreator(label, category_type, response_type) {
  return function(value) {
    $('#' + label).css({"background":"#99D6EB"});
    $('#' + label + ' .ui-slider-handle').show();
    $('#' + label + ' .ui-slider-handle').css({
      "background":"#667D94",
      "border-color": "#001F29" });
    if (responses[category_type][label] == null) {
      n_responses++;
      responses[category_type][label] = [];
    }
    var slider_val = $("#" + label).slider("value");
    responses[category_type][label].push(slider_val);
  } 
}
function slideCreator(label) {
  return function() {
    $('#' + label + ' .ui-slider-handle').css({
       "background":"#E0F5FF",
       "border-color": "#001F29"
    });
  }
}
function clickCreator(i, has_property, category_type) {
  return function() {
    $( "#creature" + i ).unbind("click");
    if (has_property) {
      responses[category_type].correct_image_clicks.push(Date.now());
      $( "#creature" + i ).css("padding", "0px");
      $( "#creature" + i ).css("border", "1px solid black");
      num_with_property_clicked_on ++;
      if (num_needed_clicked_on > 0 & num_with_property_clicked_on == num_needed_clicked_on) {
        $(".creature_image").unbind("click");
        $("#click_on_all_targets").hide();
        $("#what_kind_question").show();
      }
    } else {
      responses[category_type].incorrect_image_clicks.push(Date.now());
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

function order_code(ordering) {
  return ordering[0][0] + ordering[1][0] + ordering[2][0];
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
  "most": [true, true, true, true, true, true, true, true, true, false],
  "few": [true, false, false, false, false, false, false, false, false, false]
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

function make_sentence(sentence_type, creatures, property) {
  if (sentence_type == "generic") {
    return '"' + creatures + " have " + property + '."';
  } else if (sentence_type == "always") {
    return '"' + creatures + " always have " + property + '."';
  } else if (sentence_type == "usually") {
    return '"' + creatures + " usually have " + property + '."';
  } else if (sentence_type == "sometimes") {
    return '"' + creatures + " sometimes have " + property + '."';
  } else if (sentence_type == "negation") {
    return '"' + creatures + " do not have " + property + '."';
  } else {
    alert("ERROR1: what kind of sentence is " + sentence_type + "?");
  }
}

var randomization = {
  "creature": sample(["fish", "bird", "flower", "bug"]),
  "nonce_words": sample(nonceWords, 3),
  "target_feature_index": sample([0, 1]),
  "order": shuffle(["target", "context_category0", "context_category1"]),
  "sentences_order": shuffle(["target", "context_category0", "context_category1"]),
  "posterior_order": shuffle(["target", "context_category0", "context_category1"]),
  "sentences": {
    "target": shuffle(["generic", "always", "usually", "sometimes", "negation"]),
    "context_category0": shuffle(["generic", "always", "usually", "sometimes", "negation"]),
    "context_category1": shuffle(["generic", "always", "usually", "sometimes", "negation"])
  },
  "displayed_sentences": {
    "target":[],
    "context_category0":[],
    "context_category1":[]
  },
  "context": sample(["higher", "same", "lower"]),
  "shuffling": {
    "target": shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
    "context_category0": shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
    "context_category1": shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  },
  "properties": {
    "target": [],
    "context_category0": [],
    "context_category1": []
  }
}

//"categories": shuffle(["wug", "tig", "dax"]),//sample(nonceWords, 3),

randomization.amount_positive_examples = {target: "half"};
//randomization.amount_positive_examples.context_category0 = randomization.context == "higher" ? "all" : randomization.context == "same" ? "half" : "none";
//randomization.amount_positive_examples.context_category1 = randomization.context == "higher" ? "all" : randomization.context == "same" ? "half" : "none";
randomization.amount_positive_examples.context_category0 = randomization.context == "higher" ? "most" : randomization.context == "same" ? "half" : "few";
randomization.amount_positive_examples.context_category1 = randomization.context == "higher" ? "most" : randomization.context == "same" ? "half" : "few";

randomization.categories = {
  "target":randomization.nonce_words[0],
  "context_category0":randomization.nonce_words[1],
  "context_category1":randomization.nonce_words[2]
}

randomization.genus = {
  "target": new Ecosystem.Genus(randomization.creature, {"var":0.3}),
  "context_category0": new Ecosystem.Genus(randomization.creature, {"var":0.3}),
  "context_category1": new Ecosystem.Genus(randomization.creature, {"var":0.3})
}

var qNumber = 1;
var number_of_categories = 3;
var number_of_examples = 10;
var nQs = number_of_categories * 3;

$(document).ready(function() {
  showSlide("consent");
  $("#mustaccept").hide();
  start_time = Date.now();
});

var experiment = {
  data: {},

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
    $('.bar').css('width', ( (qNumber / nQs)*100 + "%"));
    n_responses = 0;
    $(".err").hide();
    if (qNumber < number_of_categories) {
      response_check = experiment.examples(qNumber);
    } else if (qNumber < number_of_categories * 2) {
      response_check = experiment.sentences(qNumber - number_of_categories);
    } else {
      response_check = experiment.posterior(qNumber - (2 * number_of_categories));
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
    var category = randomization.categories[category_type];
    var amount_positive_examples = randomization.amount_positive_examples[category_type];
    if (amount_positive_examples == "all") {
      num_needed_clicked_on = number_of_examples;
    } else if (amount_positive_examples == "most") {
      num_needed_clicked_on = number_of_examples - 1;
    } else if (amount_positive_examples == "half") {
      num_needed_clicked_on = number_of_examples / 2;
    } else if (amount_positive_examples == "few") {
      num_needed_clicked_on = 1;
    } else {
      num_needed_clicked_on = 0;
    }

    var target_distribution = []
    for (var i=0; i<distributions[amount_positive_examples].length; i++) {
      target_distribution[i] = distributions[amount_positive_examples][randomization.shuffling[category_type][i]]
    }

    showSlide("examples");
    var creature_images = "";
    for (var i=0; i<number_of_examples; i++) {
      creature_images += "<svg class='creature_image' id='creature" + i + "'></svg>";
    }
    $("#creature_images").html(creature_images);
    var genus = randomization.genus[category_type];
    for (var i=0; i<number_of_examples; i++) {
      var has_property = target_distribution[i];
      var properties;
      if (randomization.target_feature_index == 0) {
        properties = genus.draw("creature" + i, {tar1:has_property, tar2:false}, scale);
      } else {
        properties = genus.draw("creature" + i, {tar2:has_property, tar1:false}, scale);
      }
      randomization.properties[category_type][i] = properties;
      $("#creature" + i).click(clickCreator(i, has_property, category_type));
    }

    $(".creature").html(randomization.creature);
    $(".creatures").html(plural(randomization.creature));
    $(".category").html(randomization.categories[category_type]);
    $(".capital_category").html(caps(randomization.categories[category_type]));
    $(".categories").html(plural(randomization.categories[category_type]));
    $(".capital_categories").html(caps(plural(randomization.categories[category_type])));
    $(".target_features").html(plural(target_features[randomization.creature][randomization.target_feature_index]));
    $(".temporal_adverb").html(qNumber == 0 ? "first" : "next");

    if (amount_positive_examples == "none") {
      $("#there_are_none").click(function() {
        $(".creature_image").unbind("click");
        $("#there_are_none").unbind("click");
        $("#click_on_all_targets").hide();
        $("#what_kind_question").show();
      })
    } else {
      $("#there_are_none").click(function() {
        $("#not_all").show();
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
      if (!is_same(what_kind_response, randomization.categories[category_type])) {
        $("#what_kind_err").show();
      } else {
        $("#what_kind_err").hide();
        responses[category_type]["category_name"] = what_kind_response;
      }
      //return (how_many_response != "") & is_same(what_kind_response, randomization.categories[category_index]);
      return is_same(what_kind_response, randomization.categories[category_type]);
    };
  },

  sentences: function(sentences_index) {
    var category_type = randomization.sentences_order[sentences_index];
    var amount_positive_examples = randomization.amount_positive_examples[category_type];
    var category = randomization.categories[category_type];

    var small_creature_images = "";
    for (var i=0; i<number_of_examples; i++) {
      small_creature_images += "<svg class='creature_image' id='small_creature" + i + "'></svg>";
    }
    $("#smaller_creature_images").html(small_creature_images);
    for (var i=0; i<number_of_examples; i++) {
      Ecosystem.draw(randomization.creature,
        randomization.properties[category_type][i],
        "small_creature" + i,
        scale/2);
    }

    $("#i_remember_now").hide();
    $("#reminder").show();
    $("#smaller_creature_images").hide();
    $("#reminder").click(function() {
      $("#reminder").hide();
      $("#smaller_creature_images").show();
      $("#i_remember_now").show();
    })
    $("#i_remember_now").click(function() {
      $("#i_remember_now").hide();
      $("#smaller_creature_images").hide();
      $("#reminder").show();
    })

    var target_property_plural = plural(target_features[randomization.creature][randomization.target_feature_index]);

    $(".creature").html(randomization.creature);
    $(".creatures").html(plural(randomization.creature));
    $(".category").html(category);
    $(".capital_category").html(caps(category));
    $(".categories").html(plural(category));
    $(".capital_categories").html(caps(plural(category)));
    $(".target_features").html(plural(target_features[randomization.creature][randomization.target_feature_index]));

    showSlide("sentences");
    var slider_table = '<tr><td></td><td><div class="left_slider_meaning">very unlikely</div><div class="right_slider_meaning">very likely</div></td></tr>';
    /*var sentences = [
      '"' + caps(plural(category)) + ' have ' + target_property_plural + '."',
      '"' + caps(plural(category)) + ' usually have ' + target_property_plural + '."',
      '"' + caps(plural(category)) + ' always have ' + target_property_plural + '."',
      '"' + caps(plural(category)) + ' sometimes have ' + target_property_plural + '."',
      '"' + caps(plural(category)) + ' do not have ' + target_property_plural + '."'
    ];*/
    var sentences = [];
    for (var i=0; i<randomization.sentences[category_type].length; i++) {
      var sentence_type = randomization.sentences[category_type][i];
      sentences.push(make_sentence(sentence_type, caps(plural(category)), target_property_plural));
    }
    randomization.displayed_sentences[category_type] = sentences;
    for (var i=0; i<sentences.length; i++) {
      slider_table += '<tr><td id="completion' + i + '"></td><td class="slider_container"><div id="slider' + i + '" class="slider"></div></td></tr>';
    }
    $("#slider_table").html(slider_table);
    for (var i=0; i<sentences.length; i++) {
      $("#completion" + i).html(sentences[i]);
      responses[category_type]["completion" + i] = sentences[i];
      responses[category_type]["completion_type" + i] = randomization.sentences[category_type][i];
      $('#slider' + i).slider({
        animate: false,
        orientation: "horizontal",
        max: 1 , min: 0, step: 0.01, value: 0.5,
        slide: slideCreator("slider" + i),
        change: changeCreator("slider" + i, category_type)
      });
    }
    $(".ui-slider-handle").hide();
    return function() {
	if (n_responses != sentences.length) {
		$(".err").show();
	}
      return n_responses == sentences.length;
    }
  },

  posterior: function(posterior_index) {
    $("#prediction_slider_container").html('<div id="prediction" class="slider"></div>');
    var category_type = randomization.posterior_order[posterior_index];
    var amount_positive_examples = randomization.amount_positive_examples[category_type];
    var category = randomization.categories[category_type];

    var target_property_plural = plural(target_features[randomization.creature][randomization.target_feature_index]);

    $(".creature").html(randomization.creature);
    $(".creatures").html(plural(randomization.creature));
    $(".category").html(category);
    $(".capital_category").html(caps(category));
    $(".categories").html(plural(category));
    $(".capital_categories").html(caps(plural(category)));
    $(".target_features").html(plural(target_features[randomization.creature][randomization.target_feature_index]));

    showSlide("posterior");

    $('#prediction').slider({
      animate: false,
      orientation: "horizontal",
      max: 1 , min: 0, step: 0.01, value: 0.5,
      slide: slideCreator("prediction"),
      change: changeCreator("prediction", category_type)
    });
    $(".ui-slider-handle").hide();
    return function() {
      return n_responses == 1;
    }
  },

  questionnaire: function() {
    $('.bar').css('width', ( "100%"));
    $(document).keypress( function(event){
     if (event.which == '13') {
        event.preventDefault();
      }
    });
    showSlide("questionnaire");
    $(".continue").click(function() {
      var language = $("#participant_native_language").val();
      var comments = $("#participant_comments").val();
      var age = $("#participant_age").val();
      if (language != "") {
        $(".continue").unbind("click");
        showSlide("finished");
        //subject level
        experiment.data["language"] = language;
        experiment.data["comments"] = comments;
        experiment.data["age"] = age;
        experiment.data["creature"] = randomization.creature;
        experiment.data["target_property"] = target_features[randomization.creature][randomization.target_feature_index];
        experiment.data["presentation_order"] = order_code(randomization.order);
        experiment.data["speaker_order"] = order_code(randomization.sentences_order);
        experiment.data["posterior_order"] = order_code(randomization.posterior_order);
        experiment.data["context"] = randomization.context;
        experiment.data["randomization"] = randomization;
        experiment.data["all_responses"] = responses;
        experiment.data["start_time"] = start_time;
        experiment.data["end_time"] = Date.now();
        //trial level
        var trials = [];
        for (var c=0; c<randomization.order.length; c++) {
          var category_type = randomization.order[c];
          for (var i=0; i<randomization.sentences[category_type].length; i++) {
            var trial = {}
            var sentence_type = randomization.sentences[category_type][i];
            if (responses[category_type]["completion_type" + i] != sentence_type) {
              alert(responses[category_type]["completion_type" + i] + " doesn't equal " +
                sentence_type + " for category type " + category_type + " (item " + i + ")!");
            }
            trial.response = last(responses[category_type]["slider" + i]);
            trial.sentence_type = responses[category_type]["completion_type" + i];
            trial.category_type = category_type;
            trial.amount_positive_examples = randomization.amount_positive_examples[category_type];
            trials.push(trial);
          }
          trials.push({
            "response": last(responses[category_type].prediction),
            "sentence_type": "NA",
            "category_type": category_type,
            "amount_positive_examples": randomization.amount_positive_examples[category_type]
          })
          trials.push({
            "response": responses[category_type].category_name,
            "sentence_type": "NA",
            "category_type": category_type,
            "amount_positive_examples": randomization.amount_positive_examples[category_type]
          })
        }
        experiment.data["trials"] = trials;
        //experiment.data.responses.append({})
        setTimeout(function() { turk.submit(experiment.data) }, 1000);
      }
    })
  }
}

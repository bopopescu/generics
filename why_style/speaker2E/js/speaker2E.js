function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      console.log('this version last updated at 11:23 AM on Tuesday, July 8, 2014');
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.familiarization = slide({
    name : "familiarization",
    present : _.shuffle(exp.present_categories),
    start : function() {
    },
    present_handle : function(stim) {
      $(".err").hide();
      $("#what_kind").hide();
      var genus = exp.data.categories.genus;
      $(".BIRD").html(genus);
      var type = stim.type;
      var name = stim.name;
      this.correct_category_name = name;
      var feature_proportions = exp.data.categories[type].feature_proportions;
      var feature_order = stim.feature_order;
      var num_examples = 10;
      var has_property = local_utils.get_has_property(feature_proportions, num_examples);

      $("#examples").html("");
      for (var i=0; i<num_examples; i++) {
        $("#examples").append("<svg id='svg" + i + "'/>");
        var props = has_property[i];
        var all_props = exp.data.categories[type].creator.draw("svg" + i, props, 0.5);
        exp.data.categories[type].examples.push(all_props);
      }
      var category_name = function() {
        _s.trial_data = {
          "category_name": name,
          "response": null
        }
        $("#question").html("What kind of " + genus + " are these?");
        $("#what_kind").show();
        $("#question").show();
        $("#feedback").hide();
        $(".err").hide();
        for (var i=0; i<num_examples; i++) {
          $("#svg" + i).unbind("click");
          $("#svg" + i).css("border", "solid 1px white")
        }
      }
      var property_clicks = function() {
        $(".err").hide();
        $("#question").show();
        $("#feedback").hide();
        $("#i_dont_see_any").unbind("click");
        $("#question").html("Please click on all the <span class='WUGS'>{{}}</span> with <span class='TAILS'>{{}}.");
        if (feature_order.length > 0) {
          $("#i_dont_see_any").show();
          for (var i=0; i<num_examples; i++) {
            $("#svg" + i).unbind("click");
            $("#svg" + i).css("border", "solid 1px white")
          }
          _s.current_feature_index = feature_order.shift();
          var feature = Ecosystem.features[genus][_s.current_feature_index];
          _s.trial_data = {
            "category_name": name,
            "feature": feature,
            "feature_type": exp.data.categories.features[feature],
            "category_type": type,
            "feature_index":_s.current_feature_index,
            "incorrect_clicks": 0,
            "correct_clicks": 0
          };
          $(".WUGS").html(local_utils.plural(name));
          $(".cap_WUGS").html(local_utils.caps(local_utils.plural(name)));
          $(".TAILS").html(local_utils.plural(feature));
          var current_num = Math.round(feature_proportions[_s.current_feature_index] * num_examples);
          $("#i_dont_see_any").click(function() {
            if (current_num > 0) {
              $("#not_all").show();
            } else {
              continue_category_familiarization();
            }
          });
          for (var i=0; i<num_examples; i++) {
            $("#svg" + i).click(local_utils.click_creator(has_property[i], i, function() {
              if (current_num == _s.trial_data.correct_clicks) {
                continue_category_familiarization();
              }
            }));
          }
        } else {
          category_name();
        }
      };
      function continue_category_familiarization() {
        $("#feedback").show();
        $("#question").hide();
        $("#i_dont_see_any").hide();
        exp.data.trials.push(utils.clone(_s.trial_data));
        setTimeout(function() {property_clicks();}, 1000)
      }
      property_clicks();
    },
    button : function() {
      var response = $("#category_name_response").val();
      if (local_utils.is_same(response, _s.correct_category_name) && response.length > 0) {
        _s.trial_data.response = response;
        $("#category_name_response").val("");
        exp.data.trials.push(utils.clone(_s.trial_data));
        _stream.apply(this); //use exp.go() if and only if there is no "present" data.
      } else {
        $("#not_the_name").show();
      }
    },
    end : function() {/*what to do at the end of a block*/}
  });

  slides.generic = slide({
    name : "generic",
    present : _.shuffle(exp.present_generics),
    present_handle : function(stim) {
      exp.sliderPost = null;
      $(".err").hide();
      $(".BIRD").html(stim.genus);
      $(".BIRDS").html(local_utils.plural(stim.genus));
      $(".cap_WUGS").html(utils.caps(local_utils.plural(stim.name)));
      $(".TAILS").html(local_utils.plural(stim.feature));
      _s.trial_data = utils.clone(stim);
      this.init_sliders();
      //var properties = exp.data.categories[stim.type].examples;
    },
    button : function() {
      if (exp.sliderPost != null) {
        _s.log_responses();
        _stream.apply(this); //use exp.go() if and only if there is no "present" data.
      } else {
        $(".err").show();
      }
    },
    init_sliders : function() {
      utils.make_slider("#generic_slider", function(event, ui) {
        exp.sliderPost = ui.value;
      });
    },
    log_responses : function() {
      _s.trial_data["trial_type"] = "generic";
      _s.trial_data["sentence_type"] = "generic";
      _s.trial_data["response"] = exp.sliderPost;
      exp.data.trials.push(utils.clone(_s.trial_data));
    }
  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.data.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data.time = (Date.now() - exp.startT)/1000;
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {
  exp.sliderPost = null;
  exp.data = {};
  exp.data.trials = [];
  exp.data.catch_trials = [];
  exp.data.condition = {}; //can randomize between subject conditions here
  exp.data.system = {
    Browser : BrowserDetect.browser,
    OS : BrowserDetect.OS,
    screenH: screen.height,
    screenUH: exp.height,
    screenW: screen.width,
    screenUW: exp.width
  };
  exp.data.nonce_words = local_utils.nonce.slice(0, 3);
  var target_category = exp.data.nonce_words[0];
  var distractor1 = exp.data.nonce_words[1];
  var distractor2 = exp.data.nonce_words[2];
  var names = {
    "target_category":exp.data.nonce_words[0],
    "distractor1":exp.data.nonce_words[1],
    "distractor2":exp.data.nonce_words[2],
  }
  var types = ["target_category", "distractor1", "distractor2"];
  var features = _.shuffle(["tar1", "tar2", "tar3"]);
  var genus = _.shuffle(["bug", "fish", "flower"])[0];
  exp.data.categories = {
    "genus" : genus,
    "target_category" : {
      "feature_proportions" : {},
      "examples":[],
      "creator": new Ecosystem.Genus(genus, {var:0.3})
    },
    "distractor1" : {
      "feature_proportions" : {},
      "examples":[],
      "creator": new Ecosystem.Genus(genus, {var:0.3})
    },
    "distractor2" : {
      "feature_proportions" : {},
      "examples":[],
      "creator": new Ecosystem.Genus(genus, {var:0.3})
    }
  }
  exp.data.categories.target_category.feature_proportions[features[0]] = 0.5;
  exp.data.categories.target_category.feature_proportions[features[1]] = 0.5;
  exp.data.categories.target_category.feature_proportions[features[2]] = 0.5;
  exp.data.categories.distractor1.feature_proportions[features[0]] = 0.5;
  exp.data.categories.distractor1.feature_proportions[features[1]] = 0.9;
  exp.data.categories.distractor1.feature_proportions[features[2]] = 0.1;
  exp.data.categories.distractor2.feature_proportions[features[0]] = 0.5;
  exp.data.categories.distractor2.feature_proportions[features[1]] = 0.9;
  exp.data.categories.distractor2.feature_proportions[features[2]] = 0.1;
  exp.data.categories.features = {}
  exp.data.categories.features[features[0]] = 0.5;
  exp.data.categories.features[features[1]] = 0.9;
  exp.data.categories.features[features[2]] = 0.1;
  exp.present_categories = [{}, {}, {}];
  for (var i=0; i<3; i++) {
    exp.present_categories[i].name = exp.data.nonce_words[i];
    exp.present_categories[i].type = types[i];
  }
  exp.present_categories = _.shuffle(exp.present_categories);
  for (var i=0; i<3; i++) {
    exp.present_categories[i].feature_order = _.shuffle(["tar1", "tar2", "tar3"]);
  }
  exp.present_generics = [];
  for (var i=0; i<3; i++) {
    var type = types[i];
    var category = exp.data.categories[type];
    for (var j=0; j<3; j++) {
      var target_feature = features[j];
      exp.present_generics.push({
        type: type,
        genus: genus,
        //exp.data.categories[type],
        name: names[type],
        feature_index: target_feature,
        feature: Ecosystem.features[genus][target_feature],
        feature_distractor: exp.data.categories.features[target_feature],
        feature_proprotion: exp.data.categories[type].feature_proportions[target_feature],
      })
    }
  }
  //blocks of the experiment:
  exp.structure=["i0", "instructions",
    "familiarization",
    "generic",
    "subj_info", "thanks"];//, "one_slider", "multi_slider", 'subj_info', 'thanks'];
  
  //make corresponding slides:
  exp.slides = make_slides(exp);

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}
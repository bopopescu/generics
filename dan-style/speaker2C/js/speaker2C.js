function make_slides(f) {

  var   slides = {};

  //!i0 (first slide)

  slides.i0 = slide(
    {
      name : "i0",
      start : function() {
        $('.bar').css('width', ( (exp.phase / exp.nQs)*100 + "%"));
      }
    }
  );

  slides.instructions = slide(
    {
      name : "instructions",
      button : function(){
        exp.go();
      }
    }
  );

  slides.examples = slide(
    {
      name : "examples",
      present_stack : exp.clone_categories(),
      start: function() {
        this.present = this.present_stack.shift();
      },
      present_handle : function(stim) {
        var trial_stim = clone(stim);
        _s.trial_data = {
          "species":trial_stim.species,
          "genus":trial_stim.genus,
          //"examples": trial_stim.examples,
          "target_proportion": trial_stim.target_proportion,
          "distractor_proportion": trial_stim.distractor_proportion,
          "feature": trial_stim.feature
        };
        _s.trial_data["trial_type"] = "familiarization";
        _s.trial_data["trial_number"] = exp.phase;
        //_s.trial_data["feature_start"] = Date.now();
        //_s.trial_data["label_start"] = -1;
        _s.trial_data["incorrect_clicks"] = 0;
        //_s.trial_data["correct_clicks"] = [];
        _s.trial_data["incorrect_labels"] = [];
        _s.trial_data["response"] = "";
        //_s.trial_data["rt"] = -1;

        all_slides_do_this(stim);
        $("#click_on_all_targets").show();
        $("#what_kind_question").hide();

        this.num_positive_examples = stim.num_positive_examples;
        this.num_needed_clicked_on = this.num_positive_examples;
        this.category_name = stim.genus;

        $("#set_of_examples").html("");

        var example_properties = stim.examples;
        for (var i=0; i<example_properties.length; i++) {
          $("#set_of_examples").append("<svg class='creature_image' id='svg" + i + "'/>");
          var p = example_properties[i];
          Ecosystem.draw(p.category, p, "svg" + i, 0.4);
          $("#svg" + i).click(this.clickCreator(i, stim));
        }
      },
      update_progress : function() {
        exp.phase++;
      },
      button : function() {
        if (this.num_positive_examples == 0) {
          //_s.trial_data.correct_clicks.push("none");
          /*{
            "creature_index": "none",
            "time": Date.now() - _s.trial_data.feature_start
          });*/
          $(".creature_image").unbind("click");
          $("#click_on_all_targets").hide();
          $("#what_kind_question").show();
         // _s.trial_data.label_start = Date.now();
          //$("#set_of_examples").html("");
        } else {
          _s.trial_data.incorrect_clicks ++;//.push("none");/*{
            /*"creature_index": "none",
            "time": Date.now() - _s.trial_data.feature_start
          });*/
          $("#not_all").show();
        }
      },
      continue : function() {
        var what_kind_response = $("#what_kind").val();
        if (!is_same(what_kind_response, _s.category_name)) {
          _s.trial_data.incorrect_labels.push(what_kind_response);/*{"label": what_kind_response, "time": Date.now() - _s.trial_data.label_start});*/
          $("#what_kind_err").show();
        } else {
          _s.trial_data.response = what_kind_response;
          //_s.trial_data.rt = Date.now() - _s.trial_data.label_start;
          $("#what_kind_err").hide();
          $("#set_of_examples").html("");
          $("#what_kind").val("");
          exp.data_trials.push(clone(_s.trial_data));
          _stream.apply(_s);
        }
      },
      clickCreator: function(i, stim) {
        return function() {
          $( "#svg" + i ).unbind("click");
          if (stim.has_property[i]) {
            /*_s.trial_data.correct_clicks += 1;/*{
              "creature_index": i,
              "time": Date.now() - _s.trial_data.feature_start
            });*/
            $("#not_all").hide();
            _s.num_needed_clicked_on = _s.num_needed_clicked_on - 1;
            $( "#svg" + i ).css("padding", "0px");
            $( "#svg" + i ).css("border", "1px solid black");
            if (_s.num_needed_clicked_on == 0) {
              $(".creature_image").unbind("click");
              $("#click_on_all_targets").hide();
              $("#what_kind_question").show();
              //_s.trial_data.label_start = Date.now();
            }
          } else {
            _s.trial_data.incorrect_clicks ++;/*{
              "creature_index": i,
              "time": Date.now() - _s.trial_data.feature_start
            });*/
            //responses[category_type].incorrect_image_clicks.push(Date.now());
          }
        }
      }
    }
  );

  slides.prediction = slide(
    {
      name : "prediction",
      present_stack : exp.clone_categories(),
      start: function() {
        this.present = this.present_stack.shift();
      },
      present_handle : function(stim) {
        var trial_stim = clone(stim);
        _s.trial_data = {
          "species":trial_stim.species,
          "genus":trial_stim.genus,
          //"examples": trial_stim.examples,
          "target_proportion": trial_stim.target_proportion,
          "distractor_proportion": trial_stim.distractor_proportion,
          "feature": trial_stim.feature
        };
        _s.trial_data["trial_type"] = "prediction";
        _s.trial_data["trial_number"] = exp.phase;
        //_s.trial_data["trial_start"] = Date.now();
        //_s.trial_data["slider_history"] = [];
        _s.trial_data["response"] = "";
        //_s.trial_data["rt"] = -1;

        all_slides_do_this(stim);
        this.init_sliders();
      },
      update_progress : function() {
        exp.phase++;
      },
      button : function() {
        if (exp.sliderPost != null) {
          _s.trial_data.response = exp.sliderPost;//_s.trial_data.slider_history[_s.trial_data.slider_history.length - 1].response;
          //_s.trial_data.rt = _s.trial_data.slider_history[_s.trial_data.slider_history.length - 1].time;
          exp.data_trials.push(clone(_s.trial_data));
          _stream.apply(this);
        } else {
          $(".err").show();
        }
      },
      init_sliders : function() {
        exp.sliderPost=null;
        /*$(".hi_sim_slide").css('width' , 3*(exp.width/4)).centerhin();
        $("k.slider-lbl1 ").css('right' , (exp.width/4) *3.2 +20);
        $(".slider-lbl2 ").css('left' , (exp.width/4) *3.2 +20);
        $(".slider-lbl3 ").css('left' , (exp.width/2));*/
        $("#prediction_slider_container").slider({
          range : "min",
          value : 50,
          min : 0,
          max : 100,
          slide : function(event, ui) {
            //_s.trial_data.slider_history.push({"response":ui.value/100, "time":Date.now() - _s.trial_data.trial_start});
            exp.sliderPost = ui.value/100;
          }
        });

        $("#prediction_slider_container").mousedown(function(){
          $('#prediction_slider_container').css({"background":"#99D6EB"});
          $('#prediction_slider_container .ui-slider-range').css({"background":"#99D6EB"});
          $('#prediction_slider_container .ui-slider-handle').show();
          $('#prediction_slider_container .ui-slider-handle').css({
            "background":"#667D94",
            "border-color": "#001F29"
          });
        });
        $("#prediction_slider_container").slider("option","value",0);//reset slider
        $(".ui-slider-handle").css('display', 'none');
        $('#prediction_slider_container').css({"background":"#ffffff"});
        $('#prediction_slider_container .ui-slider-range').css({"background":"#ffffff"});
      }
    }
  );

  slides.generic = slide(
    {
      name : "generic",
      present_stack : exp.clone_categories(),
      start: function() {
        $(".when").html("Imagine that after the hike, Scientist Sally is describing the properties of the <span class='BIRDS'>{{}}</span> you saw on your hike.");
        this.present = this.present_stack.shift();
      },
      present_handle : function(stim) {
        var trial_stim = clone(stim);
        _s.trial_data = {
          "species":trial_stim.species,
          "genus":trial_stim.genus,
          //"examples": trial_stim.examples,
          "target_proportion": trial_stim.target_proportion,
          "distractor_proportion": trial_stim.distractor_proportion,
          "feature": trial_stim.feature
        };
        _s.trial_data["trial_type"] = "generic";
        _s.trial_data["trial_number"] = exp.phase;
        //_s.trial_data["trial_start"] = Date.now();
        //_s.trial_data["slider_history"] = [];
        _s.trial_data["response"] = "";
        //_s.trial_data["rt"] = -1;

        all_slides_do_this(stim);
        this.init_sliders();
      },
      update_progress : function() {
        exp.phase++;
      },
      button : function() {
        if (exp.sliderPost != null) {
          _s.trial_data.response = exp.sliderPost;
          //_s.trial_data.response = _s.trial_data.slider_history[_s.trial_data.slider_history.length - 1].response;
          //_s.trial_data.rt = _s.trial_data.slider_history[_s.trial_data.slider_history.length - 1].time;
          exp.data_trials.push(clone(_s.trial_data));
          $(".when").html("");
          _stream.apply(this);
        } else {
          $(".err").show();
        }
      },
      init_sliders : function() {
        exp.sliderPost=null;
        /*$(".hi_sim_slide").css('width' , 3*(exp.width/4)).centerhin();
        $("k.slider-lbl1 ").css('right' , (exp.width/4) *3.2 +20);
        $(".slider-lbl2 ").css('left' , (exp.width/4) *3.2 +20);
        $(".slider-lbl3 ").css('left' , (exp.width/2));*/
        $("#generic_slider_container").slider({
          range : "min",
          value : 50,
          min : 0,
          max : 100,
          slide : function(event, ui) {
            //_s.trial_data.response = ui.value/100;
            exp.sliderPost = ui.value/100;
          }
        });

        $("#generic_slider_container").mousedown(function(){
          $('#generic_slider_container').css({"background":"#99D6EB"});
          $('#generic_slider_container .ui-slider-range').css({"background":"#99D6EB"});
          $('#generic_slider_container .ui-slider-handle').show();
          $('#generic_slider_container .ui-slider-handle').css({
            "background":"#667D94",
            "border-color": "#001F29"
          });
        });
        $("#generic_slider_container").slider("option","value",0);//reset slider
        $(".ui-slider-handle").css('display', 'none');
        $('#generic_slider_container').css({"background":"#ffffff"});
        $('#generic_slider_container .ui-slider-range').css({"background":"#ffffff"});
      }
    }
  );

  slides.sentences = slide({
    name: "sentences",
    present_stack: exp.clone_categories(),
    start: function() {
      $(".when").html("Imagine that after the hike, Scientist Sally is describing the properties of the <span class='BIRDS'>{{}}</span> you saw on your hike. She says,");
      this.present = this.present_stack.shift();
    },
    present_handle: function(stim) {
      var trial_stim = clone(stim);
      _s.trial_data = {
        "species":trial_stim.species,
        "genus":trial_stim.genus,
        //"examples": trial_stim.examples,
        "target_proportion": trial_stim.target_proportion,
        "distractor_proportion": trial_stim.distractor_proportion,
        "feature": trial_stim.feature
      };
      _s.trial_data["trial_type"] = "sentences";
      _s.trial_data["trial_number"] = exp.phase;
      //_s.trial_data["trial_start"] = Date.now();
      //_s.trial_data["slider_history"] = [];
      _s.trial_data["response"] = "";
      //_s.trial_data["rt"] = -1;

      var sentence_types = _.shuffle(["generic", "usually", "always", "sometimes", "negation"]);
      _s.sentence_types = sentence_types;

      var sentences = {
        "generic": '"<span class="cap_WUGS">{{}}</span> have <span class="TAILS">{{}}</span>."',
        "usually": '"<span class="cap_WUGS">{{}}</span> usually have <span class="TAILS">{{}}</span>."',
        "always": '"<span class="cap_WUGS">{{}}</span> always have <span class="TAILS">{{}}</span>."',
        "sometimes": '"<span class="cap_WUGS">{{}}</span> sometimes have <span class="TAILS">{{}}</span>."',
        "negation": '"<span class="cap_WUGS">{{}}</span> do not have <span class="TAILS">{{}}</span>."',
      };

      var slider_table = '<tr><td></td><td><div class="slider_meaning_container"><div class="left_slider_meaning">very unlikely</div><div class="right_slider_meaning">very likely</div></div></td></tr>';

      exp.sliderPost={};
      for (var i=0; i<sentence_types.length; i++) {
        var sentence_type = sentence_types[i];
        var sentence = sentences[sentence_type];
        slider_table += '<tr><td><div class="completion"><div class="completion-text" id="completion' + i + '"></div></div></td><td class="slider_container"><div id="slider' + i + '" class="slider"></div></td></tr>';
        exp.sliderPost[sentence_type] = null;
      }
      $("#slider_table").html(slider_table);

      for (var i=0; i<sentence_types.length; i++) {
        var sentence_type = sentence_types[i];
        var sentence = sentences[sentence_type];
        $("#completion" + i).html(sentence, i);

        $("#slider" + i).slider({
          range : "min",
          value : 50,
          min : 0,
          max : 100,
          slide : slideCreator(sentence_type)
        });

        $("#slider" + i).mousedown(changeCreator("slider" + i));
        $("#slider" + i).slider("option","value",0);//reset slider
        $(".ui-slider-handle").css('display', 'none');
        $("#slider" + i).css({"background":"#ffffff"});
        $("#slider" + i + ' .ui-slider-range').css({"background":"#ffffff"});
      }

      all_slides_do_this(stim);
    },
    update_progress : function() {
      exp.phase++;
    },
    button: function() {
      var n_responses = 0;
      for (var i=0; i<_s.sentence_types.length; i++) {
        var sentence_type = _s.sentence_types[i];
        if (exp.sliderPost[sentence_type] != null) {
          n_responses++
        }
      }
      if (n_responses == _s.sentence_types.length) {
        for (var i=0; i<_s.sentence_types.length; i++) {
          var sentence_type = _s.sentence_types[i];
          var trial_data = clone(_s.trial_data);
          console.log(exp.sliderPost["sentence_type"]);
          trial_data["sentence_type"] = sentence_type;
          trial_data["response"] = exp.sliderPost[sentence_type];
          exp.data_trials.push(trial_data);
        }
        $(".when").html("Next she says,");
        _stream.apply(_s);
      } else {
        $(".err").show();
      }
    }
  });
  
  slides.subj_info =  slide(
    {
      name : "subj_info",
      start : function () {
        $('#subj_info_form').submit(this.button);
        $('.bar').css('width', ( (exp.phase / exp.nQs)*100 + "%"));
      },
      button : function(e){
        if (e.preventDefault) e.preventDefault();
        exp.subj_data =
          {
            language: $('select[name="language"]').val(),
            enjoyment: $('select[name="enjoyment"]').val(),
            assess: $('input[name="assess"]:checked').val(),
            age : $('input:text[name="age"]').val(),
            sex : $('input[name="sex"]:checked').val(),
            education : $('select[name="education"]').val(),
            //comments : $('select[name="comments"]').val()
            //workerId : turk.workerId
          };

        exp.go();
        return false;
      }

    }
  );

  //!thanks

  slides.thanks = slide(
    {
      name : "thanks",
      start : function(){

        exp.data= {
          trials : exp.data_trials,
          system : exp.system,
          //condition : exp.condition
          subject_information : exp.subj_data
        };
        exp.data.experiment_start = exp.experiment_start;
        exp.data.experiment_end = Date.now();
        exp.data.experiment_duration = exp.data.experiment_end - exp.experiment_start;
        //setTimeout(function() {turk.submit({"hi": 1})}, 1000);
        setTimeout(function() {turk.submit({
          "trials": JSON.stringify(exp.data_trials),
          "subject_information": JSON.stringify(exp.subj_data),
          "system" : JSON.stringify(exp.system)
          //"subject_information": exp.subj_data,
          //"system": exp.system
        })}, 1000);
        //setTimeout(function() {turk.submit(JSON.stringify(exp.data));}, 1000);
      }
    });
  return slides;
};

/// init ///
function init() {

  exp.experiment_start = Date.now();

  jquery_extensions();
  $('.slide').hide();
  $('body').css('visibility','visible');
  exp_sizing();

  //exp.nQs = 25;
  exp.num_examples = 10;

  exp.data_trials=[];
  //exp.sandbox=0;

  exp.categories = make_categories(exp);
  exp.clone_categories = function() {
    var ret_categories = [];
    for (var i=0; i<exp.categories.length; i++) {
      var category_pair = exp.categories[i].slice(0);
      var new_category_pair = [];
      for (var j=0; j<category_pair.length; j++) {
        var genus_object = clone(category_pair[j]);
        new_category_pair[j] = clone(category_pair[j]);
      }
      ret_categories[i] = _.shuffle(new_category_pair); //randomize order of subcategories for different kinds of trials
    }
    return ret_categories;
  }
  exp.slides = make_slides(exp);
  /*var this_is_really_annoying = exp.slides.prediction.some_thingamajig_wtf_is_going_on.shift(); //why is there an extra function thing at the *beginning* of this array??!!
  var this_is_also_really_annoying = exp.slides.generic.some_thingamajig_wtf_is_going_on.shift();*/

  exp.structure=['i0', 'instructions'];
  for (var i=0; i<exp.species.length; i++) {
    exp.structure.push("examples");
    //exp.structure.push("prediction");
    //exp.structure.push("generic");
    exp.structure.push("sentences");
  }
  exp.structure.push("subj_info");
  exp.structure.push("thanks");

  exp.nQs = exp.species.length * 4;

  $("#click_on_all_targets").show();
  //exp.prog = 0;
  //for (var i=0; i<exp.structure.length; i++) {
  //    var block_type = exp.structure[i];
  //    if (block_type != "i0" && block_type != "subj_info" && block_type != "thanks") {
  //        block_type
  //    }
   // }
  //exp.prog = 50;
  
  //set_condition();

  //allow to click through experiment
  exp.debug=0;

  $("#start-button").click(function() {
    if (exp.debug || !turk.previewMode) {
      exp.go();
    } else {
      alert("You must accept the HIT in order to continue.");
    }
  });
  /*if (exp.debug){
    console.log('debug');
    $('#start-button').click(function(){exp.go();});
  }
  else if (!turk.previewMode) {
    $('#start-button').click(function(){
      exp.go();
      //experiment_proceed();
    });
  } else {
    alert("you must accept the HIT in order to continue");
  }*/

  exp.system =
    [{
      //workerId : turk.workerId,
      //cond : exp.condition,
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    }];

  exp.go();

};

function plural(word) {
  if (/dax|poch|monx|hinx/.test(word)) {
    return(word + "es");
  } else if (/fish|thorns|fangs|whiskers|antennae|wings|spots/.test(word)) {
    return word;
  } else {
    return(word + "s");
  }
}

function make_categories(exp) {
  var nonce_words = _.shuffle([
    "wug", "dax", "fep", "tig", "speff", "zib", "gub", "wost", "wock", "thog",
    "snim", "ript", "quog", "polt", "poch", "murp", "mulb", "mork", "mopt", "monx",
    "mone", "moge", "lide", "hoil", "hoff", "hisp", "hinx", "hife", "hett", "fraw",
    "fing", "fick", "blim", "zop", "blick"
  ]);

  var target_features = {
    flower: ["thorns", "spots"],
    fish: ["fangs", "whiskers"],
    bug: ["antennae", "wings"],
    bird: ["tail", "crest"]
  }

  var species = _.shuffle(["bird", "fish", "flower"//, "bug"
                          ]);
  exp.species = species;

  var feature_proportions = _.shuffle([
    //[.1, .1],
    [.1, .5],
    //[.1, .9],
    [.5, .5],
    [.5, .9],
    //[.9, .9],
  ].map(function(e) {return _.shuffle(e);})).slice(0, species.length);

  var target_feature_index = [];

  var genus = [];
  for (var species_index=0; species_index<species.length; species_index++) {
    target_feature_index[species_index] = _.shuffle([0, 1])[0];
    genus[species_index] = [
      {
        "species": species[species_index],
        "creature_generator": new Ecosystem.Genus(species[species_index], {var: 0.3}),
        "genus": nonce_words.shift(),
        "has_property":[],
        "examples": [],
        "target_proportion": feature_proportions[species_index][0],
        "distractor_proportion": feature_proportions[species_index][1],
        "feature": target_features[species[species_index]][target_feature_index[species_index]]
      },
      {
        "species": species[species_index],
        "creature_generator": new Ecosystem.Genus(species[species_index], {var: 0.3}),
        "genus": nonce_words.shift(),
        "has_property": [],
        "examples": [],
        "target_proportion": feature_proportions[species_index][1],
        "distractor_proportion": feature_proportions[species_index][0],
        "feature": target_features[species[species_index]][target_feature_index[species_index]]
      }
    ];
    for (var g=0; g<2; g++) {
      var unshuffled_has_property = [];
      var num_positive_examples = Math.round(genus[species_index][g].target_proportion * exp.num_examples);
      genus[species_index][g].num_positive_examples = num_positive_examples;
      for (var e=0; e<exp.num_examples; e++) {
        if (e < num_positive_examples) {
          unshuffled_has_property.push(true);
        } else {
          unshuffled_has_property.push(false);
        }
      }
      genus[species_index][g].has_property = _.shuffle(unshuffled_has_property);
      //exp.genus[species][g].has_property = _.shuffle();
      for (var e=0; e<exp.num_examples; e++) {
        if (target_feature_index[species_index] == 0) {
          var properties = {"tar1": genus[species_index][g].has_property[e], "tar2": false};
        } else {
          var properties = {"tar1": false, "tar2": genus[species_index][g].has_property[e]};
        }
        genus[species_index][g].examples.push(genus[species_index][g].creature_generator.draw(null, properties));
      }
    }
  }
  return genus;
}

function all_slides_do_this(stim) {
  $('.bar').css('width', ( (exp.phase / exp.nQs)*100 + "%"));
  words(stim);
  $('.err').hide();
}

function words(stim) {
  var bird = stim.species;
  var wug = stim.genus;
  var wugs = plural(wug);
  var cap_wugs = caps(wugs);
  var tails = plural(stim.feature);
  $(".BIRD").html(bird);
  $(".BIRDS").html(plural(bird));
  $(".WUG").html(wug);
  $(".WUGS").html(wugs);
  $(".cap_WUGS").html(cap_wugs);
  $(".TAILS").html(tails);
}

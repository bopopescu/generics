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
        all_slides_do_this(stim);
      },
      update_progress : function() {
        exp.phase++;
      },
      button : function() {
        _stream.apply(this);
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
        all_slides_do_this(stim);
      },
      update_progress : function() {
        exp.phase++;
      },
      button : function() {
        _stream.apply(this);
      }
    }
  );

  slides.generic = slide(
    {
      name : "generic",
      present_stack : exp.clone_categories(),
      start: function() {
        this.present = this.present_stack.shift();
      },
      present_handle : function(stim) {
        all_slides_do_this(stim);
      },
      update_progress : function() {
        exp.phase++;
      },
      button : function() {
        _stream.apply(this);
      }
    }
  );
  
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
          [{
            language: $('select[name="language"]').val(),
            enjoyment: $('select[name="enjoyment"]').val(),
            assess: $('input[name="assess"]:checked').val(),
            age : $('input:text[name="age"]').val(),
            sex : $('input[name="sex"]:checked').val(),
            education : $('select[name="education"]').val(),
            workerId : turk.workerId
          }];

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
          condition : exp.condition
        };
        setTimeout(function() {turk.submit(exp.data);}, 1000);
      }
    });
  return slides;
};

/// init ///
function init() {

  jquery_extensions();
  $('.slide').hide();
  $('body').css('visibility','visible');
  exp_sizing();

  exp.nQs = 25;
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

  exp.structure=['i0', 'instructions',
           'examples', 'prediction', 'generic',
           'examples', 'prediction', 'generic',
           'thanks'];
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
  exp.debug=1;
  if (exp.debug){
    console.log('debug');
    $('#start-button').click(function(){exp.go();});
  }
  else{
    $('#start-button').click(function(){experiment_proceed();});
  }

  exp.system =
    [{
      workerId : turk.workerId,
      cond : exp.condition,
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

  var species = _.shuffle(["bird", "fish", "flower", "bug"]);

  var feature_proportions = _.shuffle([
    [.1, .1],
    [.1, .5],
    [.1, .9],
    [.5, .5],
    [.5, .9],
    [.9, .9],
  ].map(function(e) {return _.shuffle(e);})).slice(0, species.length);

  var target_feature_index = [];

  var genus = [];
  for (var species_index=0; species_index<species.length; species_index++) {
    target_feature_index[species_index] = _.shuffle([0, 1])[0];
    genus[species_index] = [
      {
        "species": species[species_index],
        "creature_generator": new Ecosystem.Genus(species[species_index]),
        "genus": nonce_words.shift(),
        "has_property":[],
        "examples": [],
        "target_proportion": feature_proportions[species_index][0],
        "distractor_proportion": feature_proportions[species_index][1],
        "feature": target_features[species[species_index]][target_feature_index[species_index]]
      },
      {
        "species": species[species_index],
        "creature_generator": new Ecosystem.Genus(species[species_index]),
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
  var bird = stim.species;
  var wug = stim.genus;
  var wugs = plural(wug);
  var cap_wugs = caps(wugs);
  var tails = plural(stim.feature);
  $(".BIRD").html(bird);
  $(".WUG").html(wug);
  $(".WUGS").html(wugs);
  $(".cap_WUGS").html(cap_wugs);
  $(".TAILS").html(tails);
  $('.err').hide();
}
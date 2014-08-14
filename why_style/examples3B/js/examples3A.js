function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.generic = slide({
    name : "generic",
    present : _.shuffle([
      /*{"question":"natural", "sentence": "People have black hair."},
      {"question":"natural", "sentence": "People are over three years old."},
      {"question":"natural", "sentence": "Books are paperbacks."},
      {"question":"natural", "sentence": "Shoes are size 7 and above."},
      {"question":"natural", "sentence": "Lions have manes"},
      {"question":"natural", "sentence": "People care about the environment"},
      {"question":"natural", "sentence": "Mosquitos carry West Nile Virus"},
      {"question":"natural", "sentence": "Animals weigh less than 2 tons."},
      {"question":"natural", "sentence": "Birds fly"},*/
      {"question":"true", "sentence": "Do people have black hair"},
      {"question":"true", "sentence": "Are people over three years old"},
      {"question":"true", "sentence": "Are books are paperbacks"},
      {"question":"true", "sentence": "Are shoes are size 7 and above"},
      {"question":"true", "sentence": "Do lions have manes"},
      {"question":"true", "sentence": "Do people care about the environment"},
      {"question":"true", "sentence": "Do mosquitos carry West Nile Virus"},
      {"question":"true", "sentence": "Do animals weigh less than 2 tons"},
      {"question":"true", "sentence": "Do birds fly"}
    ]),
    present_handle : function(stim) {
      this.start_time = Date.now();
      exp.sliderPost = null;
      $(".err").hide();
      $("#sentence").html('' + stim.sentence + '?');
      $(".question").html(stim.question);
      _s.trial_data = {"sentence": stim.sentence, "question": stim.question};
      this.init_sliders();
    },
    button : function() {
      if (exp.sliderPost != null) {
        this.end_time = Date.now();
        _s.log_responses(this.end_time - this.start_time);
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
    log_responses : function(rt) {
      _s.trial_data["response"] = exp.sliderPost;
      _s.trial_data["rt"] = rt;
      exp.data.trials.push(utils.clone(_s.trial_data));
    }
  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.data.subj_data = {
        language : $("#language").val(),
        comments : $("#comments").val(),
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data.time_in_minutes = (Date.now() - exp.startT)/60000;
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {
  exp.sliderPost = null;
  exp.data = {
    "trials": [],
    "catch_trials": [],
    "condition": {},
    "system": {
      "Browser" : BrowserDetect.browser,
      "OS" : BrowserDetect.OS,
      "screenH": screen.height,
      "screenUH": exp.height,
      "screenW": screen.width,
      "screenUW": exp.width 
    }
  };
  //blocks of the experiment:
  exp.structure=["i0",
    "generic",
    "subj_info", "thanks"];//, "one_slider", "multi_slider", 'subj_info', 'thanks'];
  
  //make corresponding slides:
  exp.slides = make_slides(exp);
  exp.nQs = utils.get_exp_length();

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
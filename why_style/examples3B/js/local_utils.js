var local_utils = {
  plural: function(word) {
    if (/dax|poch|monx|hinx/.test(word)) {
      return(word + "es");
    } else if (/fish|thorns|fangs|whiskers|antennae|wings|spots|stripes|tendrils/.test(word)) {
      return word;
    } else {
      return(word + "s");
    }
  },
  click_creator : function(has_property, i, callback_function) {
    return function() {
      $("#svg" + i).unbind("click");
      if (has_property[_s.current_feature_index]) {
        $("#svg" + i).css("border", "1px black solid");
        _s.trial_data.correct_clicks++;
      } else {
        _s.trial_data.incorrect_clicks++;
      }
      callback_function();
    };
  },
  is_same : function(response, creature) {
    var result = response.match(new RegExp(creature, "i"));
    if (result) {
      return true;
    } else {
      return false;
    }
  },
  get_has_property : function(feature_proportions, num_examples) {
    var target_property_on_or_off = [];
    for (var i=0; i<num_examples; i++) {
      target_property_on_or_off.push({});
    }
    for (var i=0; i<3; i++) {
      var target_index = ["tar1", "tar2", "tar3"][i];
      var num_positive_examples = Math.round(feature_proportions[target_index] * num_examples);
      for (var j=0; j<num_examples; j++) {
        target_property_on_or_off[j][target_index] = j<num_positive_examples;
      }
      target_property_on_or_off = _.shuffle(target_property_on_or_off);
    }
    return target_property_on_or_off;
  },
  nonce : _.shuffle([
    "wug", "dax", "fep", "tig", "speff", "zib", "gub", "wost", "wock", "thog",
    "snim", "ript", "quog", "polt", "poch", "murp", "mulb", "mork", "mopt", "monx",
    "mone", "moge", "lide", "hoil", "hoff", "hisp", "hinx", "hife", "hett", "fraw",
    "fing", "fick", "blim", "zop", "blick"
  ]),
  caps : function(a) {
    return a.substring(0,1).toUpperCase() + a.substring(1,a.length);
  }
}
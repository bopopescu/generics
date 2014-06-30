/// Stream ///

var slide = function (_slide, _private) {
  var s = _slide || {}, p = _private || {};
  //add method to all stimuli bearing slides
  s.phaseid=0;
  s.init = function() {
    utils.showSlide(this.name);
    /*$('#progress').css('visibility', 'hidden');*/
    this.phaseid++;
    if (this.start) {this.start();};
    /*if (s.present !== undefined)  {
        if (s.slen == undefined) s.slen = s.present.length;
    };*/
    //exp.phase++;

    /*if(this.prog) {
        $('#progress').css('visibility', 'visible');
        if (this.progress){
            this.progress();
        }
        else if (exp.progress){
            exp.progress();
        }
        else{
            exp.phase++;
            //$('#phase').text("Question    " + exp.phase + " of " + exp.prog);
            $('#phase').text( exp.phase + " of " + exp.prog);
            $('#progress').css('visibility', 'visible');
        }
    }*/
    if(this.handle) this.handle();
    _stream.apply(this);
  };

  //what to do when done presenting all the slides
  s.callback = s.callback !== undefined ? s.callback : function() {exp.go();};
  return(s);
};

var _stream = function() {
  if (this.present == undefined) { //not a presented slide (i.e. there are not multiple trials using the same slide)
    //this.pass_data();
  } else {
    var presented_stims = this.present || [];

    //done with slide
    if (presented_stims.length === 0) {
        if (this.end) {this.end();};
        this.callback();
    } else {
      if (this.present_handle) {
        var stim = presented_stims.shift();
        //var trial_num = this.slen - presented_stims.length;
        this.present_handle(stim);
        exp.phase++;

        /*//Catch Trial
        if (this.catch_trial_handle && stim.length == 3) {
          //s = Math.round(Math.random());
          //this.pass_data({trial:tri, stim:s, catch: 1});
          this.catch_trial_handle(presented_stims[Math.floor(Math.random()*presented_stims.length)]);
        }

        //Normal Trial
        else{
          //this.pass_data({"trial":trial_num, "stim":stim});
          this.present_handle(stim);/*, function() {
            this.takeInput = 1;
          });
        }*/
      }
      /*if (this.update_progress) {
        this.update_progress();
      }*/
    }
        /*
        //stims left
        else {
            if (this.present_handle)  {
                var s = presented_stims.shift();
                var tri = this.slen-presented_stims.length;

                if (this.prog) {
                    if (this.update_progress){
                        this.update_progress(tri); //update progress
                    }
                    else {
                        update_progress(tri);
                    }
                } else {
                    if (this.update_progress) {
                        this.update_progress(tri); //update progress
                    }
                }

            }
            // Not a presented stim
            else {
                presented_stims.shift();
                this.takeInput = 1;
                this.pass_data();
            }

        }

    }
    //add trial time
    if (exp.data[exp.data.length-3] != undefined && exp.data[exp.data.length-3].t_start) exp.data[exp.data.length-2].trial_time =  getTimeOffset(exp.data[exp.data.length-3].t_start);
    //if (exp.data.length >= 2) exp.data[exp.data.length-2].trial_time =  getTimeOffset(exp.data[exp.data.length-3].t_start);*/
  }
};
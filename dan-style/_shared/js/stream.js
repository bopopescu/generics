
/// Stream ///

var slide = function (_slide, _private) {
    var s = _slide || {}, p = _private || {};
    //add method to all stimuli bearing slides
    s.phaseid=0;
    s.data = [];
    s.init = function() {
        showSlide(this.name);
        $('#progress').css('visibility', 'hidden');
        this.phaseid++;
        if (this.start) this.start();
        if (s.present != undefined)  {
            s.takeInput = 1;
            s.resp = [];
            if (s.slen == undefined) s.slen = s.present.length;
        }

        if(this.prog) {
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
        }
        if(this.handle) this.handle();

        _stream.apply(this);
    };
    s.pass_data = function(handle){
        return function(_extensions) {
            if(this.data_handle) var x= this.data_handle();
            else x = {}
            //            var x = this.data_handle() || {},
            var e = _extensions || {},
                time = getTime(),
                data = {cond: exp.condition, phaseid: this.phaseid, phase: this.name, t:time, t_start:new Date(), catch: 0};
            _.extend(data, x, e);
            exp.data[exp.data.length]= data;
            this.data[this.data.length]=data;
        };
    }(s.data_handle);

    s.callback = s.callback !== undefined ? s.callback : function() {exp.go();};
    return(s);
};

var _stream = function() {
    if (this.present == undefined) { //not a presented slide
        this.pass_data();
    }

    else { //a presented stim
        var presented_stims = this.present || {};

        //done with slide
        if (presented_stims.length === 0) {
            if (this.end) this.end();
            this.callback();
        }
        //stims left
        else {
            if (this.present_handle)  {
                var s = presented_stims.shift();
                var tri = this.slen-presented_stims.length;

                //Catch Trial
                if (this.catch_trial_handle && s.length == 3) {
                    s = Math.round(Math.random());
                    this.pass_data({trial:tri, stim:s, catch: 1});
                    this.catch_trial_handle(presented_stims[Math.floor(Math.random()*presented_stims.length)]);
                }
                //Normal Trial
                else{
                    this.pass_data({trial:tri, stim:s});
                    this.present_handle(s, function() {
                        this.takeInput = 1;
                    });
                }

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
    //if (exp.data.length >= 2) exp.data[exp.data.length-2].trial_time =  getTimeOffset(exp.data[exp.data.length-3].t_start);
};

_stream_2 = function() {
    //_.s=this;
    var time;
    //utils
    function pass_data(_x, ret) {
        var x = x || {};
        var data = {cond: exp.condition , phase: this.name, trial : tri , stim : s, t:time, t_start:new Date()};
        _.extend(data,x);
        if(ret === undefined)  exp.data[exp.data.length]= data;
        return(data);
    }

    if (this.present == undefined) { //not a presented slide
        time = getTime();
        if(this.data_handle) {
            this.data_handle({cond: exp.condition , phase: this.name, trial : tri, stim : s, catch : 0});
        }
        else {
            //  exp.data[exp.data.length]= {cond: exp.condition , phase: this.name, trial : tri , stim : s, t:time, t_start:new Date()};
            this.pass_data();
        }
    }
    else { //a presented stim
        var presented_stims = this.present || {};

        //done with slide
        if (presented_stims.length === 0) {
            if (this.end) this.end();
            this.callback();
        }
        //stims left
        else {
            if (this.prog) {
                if (this.update_progress){
                    this.update_progress(); //update progress
                }
                else {
                    update_progress();
                }
            }
            if (this.present_handle)  {
                var s = presented_stims.shift();
                var tri = this.slen-presented_stims.length;
                this.stim[0]=s;

                //Catch Trial
                if (this.catch_trial_handle && s.length == 3) {
                    s = Math.round(Math.random());
                    time = getTime();
                    if(this.data_handle) {
                        this.data_handle({cond: exp.condition , phase: this.name, trial : tri , stim : s, t:time, t_start:new Date(), catch:1});
                        //                        this.data_handle(pass_data({catch:1},1));
                        //                        this.data_handle(pass_data({catch:1},1));
                    }
                    this.catch_trial_handle(presented_stims[Math.floor(Math.random()*presented_stims.length)]);
                }
                //Normal Trial
                else{
                    time  = getTime();
                    if(this.data_handle) {
                        this.data_handle({catch : 0},1);
                    }
                    else {
                        //pass_data();
                        exp.data[exp.data.length]= {cond: exp.condition , phase: this.name, trial : tri , stim : s, t:time, t_start:new Date()};
                    }
                    this.present_handle(s, function() {
                        this.takeInput = 1;
                    });

                }
            }
            // Not a presented stim
            else {
                presented_stims.shift();
                this.takeInput = 1;
                time  = getTime();
                exp.data[exp.data.length]= {cond: exp.condition , phase: this.name, trial : tri , stim : s, t:time, t_start:new Date(), catch:0};
            }

        }

    }
    //add trial time
    if (exp.data.length >= 2) exp.data[exp.data.length-1].trial_time =  getTimeOffset(exp.data[exp.data.length-2].t_start);
};



function simfunc(presented_stims){
    if (this.present_handle)  {
        //catch trial
        var s = presented_stims.shift();
        var tri = this.slen-presented_stims.length;
        this.stim[0]=s;
        if (this.catch_trial_handle && s.length == 3) {//Math.random() < .08) { //.08
            s = Math.round(Math.random());
            var time = getTime();
            if(this.data_handle) {
                this.data_handle({cond: exp.condition , phase: this.name, trial : tri, stim : s, t:time, catch : 1});
            }
            //TODO sim catch trial
        }
        //Normal Trial
        else{
            var time  = getTime();
            if(this.data_handle) {
                this.data_handle({cond: exp.condition , phase: this.name, trial : tri, stim : s, catch : 0});
            }
            else {
                exp.data[exp.data.length]= {cond: exp.condition , phase: this.name, trial : tri , stim : s, t:time};
            }
            this.sim()
        }
    }
    // Not a presented stim
    else {
        presented_stims.shift();
        this.takeInput = 1;
        //          if (exp.dataSaved.indexOf(this.name) !== -1) {
        //    this.stim.push(s);  //can be removed
        //write Data
        var time  = getTime();
        exp.data[exp.data.length]= {cond: exp.condition , phase: this.name, trial : this.stim.length, t:time};
    }


}

var _handle_mfunc = function(h_arr, keep_previous_handle) {
    if(!keep_previous_handle) $(document).unbind('keypress');
    var context = exp.get_current_slide();
    $(document).keypress(function(e) {
        for (var k=0; k<h_arr.length; k++) {
            if (e.which === h_arr[k].key.charCodeAt()) {
                console.log(h_arr[k].key);
                context.resp.push(h_arr[k].key);
                if (h_arr[k].func) {
                    h_arr[k].func.apply(context);
                }
                if (!h_arr[k]["Mult"]) {
                    _stream.apply(context);
                    break;
                }
            }
        }
    });
};

var _handle = function(h_arr,   func, context) {

    // var context= this;
    // try{
    //      var context = exp.get_current_slide();
    // } catch (x) {
    //  console.log(x)
    // }
    // console.log('in _handle');
    $(document).keypress(function(e) {
        for (var k=0; k<h_arr.length; k++) {
            if (e.which === h_arr[k].charCodeAt()) {
                $(document).unbind('keypress');
                //console.log(h_arr[k]);
                //context.resp.push(h_arr[k]);
                addData('resp', h_arr[k]);
                addData('t2', getTime());
                func();
            }
        }
    });
};

var n_handle = function(h_arr,  func, tout) {
    $(document).keypress(function(e) {
        for (var k=0; k<h_arr.length; k++) {
            if (e.which === h_arr[k].charCodeAt()) {
                $(document).unbind('keypress');
                $('#sd_ready').hide();
                setTimeout(func, tout);
            }
        }
    });
};

var mirror_handle = function(context, spec,  keep_previous_handle) {
    var  range = spec.range, func = spec.func;
    if(!keep_previous_handle) $(document).unbind('keypress');
    $(document).keypress(function(e) {

        if ( (e.which >= range[0]) && (e.which <= range[1]) && context.takeInput) {
            context.takeInput = 0;
            context.resp.push(String.fromCharCode(e.which));
            exp.data[exp.data.length-1].resp = 1 * String.fromCharCode(e.which);
            func(String.fromCharCode(e.which)*1, function (x) {return function () {_stream.apply(x);};}(context) );
            //  _stream.apply(context);
        }
    });
};

var train_handle = function(context, spec,  keep_previous_handle) {
    var  range = spec.range, func = spec.func;
    if(!keep_previous_handle) $(document).unbind('keypress');
    $(document).keypress(function(e) {

        if ( (e.which >= range[0]) && (e.which <= range[1]) && context.takeInput) {
            var resp_number = String.fromCharCode(e.which);
            context.takeInput = 0;
            $("#respA").show();
            $("#youP").text(resp_number);
            if (resp_number == exp.data[exp.data.length-1].stim) {
                $("#correctP").text(exp.data[exp.data.length-1].stim);
                $("#youP").css("color", "green !important");
            }
            else {
                $("#youP").css("color", "red !important");
            }

            context.resp.push(resp_number); //tbk
            exp.data[exp.data.length-1].resp = 1* resp_number;
            // setTimeout(function() {func(context.stim.peekback() *1, function (x) {return function () {_stream.apply(x);};}(context) ); $("#respA").hide();},1000);
            setTimeout(function (x) {return function () {
                _stream.apply(x);
                $("#respA").hide();
            };}(context) ,1800);
        }
    });
};

var test_handle = function(context, spec,  keep_previous_handle) {
    var  range = spec.range;
    if(!keep_previous_handle) $(document).unbind('keypress');
    $(document).keypress(function(e) {

        if ( (e.which >= range[0]) && (e.which <= range[1]) && context.takeInput) {
            var resp_number = String.fromCharCode(e.which);
            context.takeInput = 0;
            $("#respB").show();
            $("#youPt").text(resp_number);
            context.resp.push(resp_number); //tbk
            exp.data[exp.data.length-1].resp = 1 * resp_number;
            setTimeout(function(){_stream.apply(context); $("#respB").hide();}, 800);
        }
    });
};

/*var slide_old  = function (_specs) {
    var specs = _specs || {}, that = this;
    if (_specs.length!=1)  {
        var f = {};
        f.takeInput = 1;
        $.each(specs, function(key,val){
            f[key] = val;});
        f.resp = [];
        f.stim = [];
        f.takeInput = 1;
        if (f.present != undefined && f.slen == undefined) f.slen = f.present.length;
    }
    f.init = function(x) {
        return function() {
            showSlide(x.name);
            $('#progress').css('visibility', 'hidden');
            if (x.start && x.set == undefined) x.start();
            if(x.prog) {
                exp.phase++;
                $('#phase').text("Question    " + exp.phase + " of " + exp.prog);
                console.log("bai");
                $('#progress').css('visibility', 'visible');
            }
            if(this.handle) this.handle();
            _stream.apply(this);
        };
    }(specs);
    f.callback = specs.callback !== undefined ? specs.callback : function() {exp.go();};
    return f;
}
var _stream_old = function() {
    var that=this;
    if (this.present !== undefined) {
        var presented_stims = this.present || {};

        //done with slide
        if (presented_stims.length === 0) {
            if (this.end) this.end();
            this.callback();
        }
        //stims left
        else {
            if(exp.sim) {
                if (this.present_handle)  {
                    var s = presented_stims.shift();
                    var tri = this.slen-presented_stims.length;
                    this.stim[0]=s;


                    //catch trial
                    if (this.catch_trial_handle && s.length == 3) {
                        s = Math.round(Math.random());
                        if(this.data_handle) {
                            this.data_handle({cond: exp.condition , phase: this.name, trial : tri, stim : s, t:time, t_start:new Date(), catch : 1});
                        }
                        //TODO sim catch trial
                    }

                    //normal trial
                    else{
                        if(this.data_handle) {
                            this.data_handle({cond: exp.condition , phase: this.name, trial : tri, stim : s, catch : 0});
                        }
                        else {
                            exp.data[exp.data.length]= {cond: exp.condition , phase: this.name, trial : tri , stim : s, t:time, t_start:new Date()};
                        }
                        this.sim();
                    }
                }
                // Not a presented stim
                else {
                    presented_stims.shift();
                    this.takeInput = 1;
                    //          if (exp.dataSaved.indexOf(this.name) !== -1) {
                    //    this.stim.push(s);  //can be removed
                    //write Data

                    exp.data[exp.data.length]= {cond: exp.condition , phase: this.name, trial : this.stim.length, t:time, t_start:new Date()};
                }

            }
            else if (this.present_handle)  {
                var s = presented_stims.shift();
                var tri = this.slen-presented_stims.length;
                this.stim[0]=s;
                //catch trial
                if (this.catch_trial_handle && s.length == 3) {
                    s = Math.round(Math.random());
                    var time = getTime();
                    if(this.data_handle) {
                        this.data_handle({cond: exp.condition , phase: this.name, trial : tri, stim : s, t:time, t_start:new Date(), catch : 1});
                    }
                    this.catch_trial_handle(presented_stims[Math.floor(Math.random()*presented_stims.length)]);
                }
                //Normal Trial
                else{
                    var time  = getTime();
                    if(this.data_handle) {
                        this.data_handle({cond: exp.condition , phase: this.name, trial : tri, stim : s, catch : 0});
                    }
                    else {
                        exp.data[exp.data.length]= {cond: exp.condition , phase: this.name, trial : tri , stim : s, t:time, t_start:new Date()};
                    }
                    this.present_handle(s, function() {
                        this.takeInput = 1;
                    });

                }
            }
            // Not a presented stim
            else {
                presented_stims.shift();
                this.takeInput = 1;
                var time  = getTime();
                exp.data[exp.data.length]= {cond: exp.condition , phase: this.name, trial : this.stim.length, t:time, t_start:new Date()};
            }

        }

    }
    else {
        var time = getTime();
        if(this.data_handle) {
            this.data_handle({cond: exp.condition , phase: this.name, trial : tri, stim : s, catch : 0});
        }
        else {
            exp.data[exp.data.length]= {cond: exp.condition , phase: this.name, trial : tri , stim : s, t:time, t_start:new Date()};
        }
    }

    if (exp.data[exp.data.length-2].t_start) exp.data[exp.data.length-1].trial_time =  getTimeOffset(exp.data[exp.data.length-2].t_start);

};*/


//update_progress
function update_progress(){
    exp
}

/// Javascript Extensions ///
Function.prototype.method = function (name, func) {
    if(!this.prototype[name]) {
        this.prototype[name]= func;
        //      return this; //Necessary?
    }
};

Function.method('curry', function () {
    if (arguments.length<1) {
        return this; //nothing to curry with - return function
    }

    var slice = Array.prototype.slice,
        args = slice.apply(arguments),
        that = this;
    return function () {
        return that.apply(null, args.concat(arguments));
    };
});

_.sum = function(array){
    return(_.reduce(array, function(x,arr){return(x+arr);}));
};

Function.prototype.compose  = function(argFunction) {
    var invokingFunction = this;
    return function() {
        return  invokingFunction.call(this,argFunction.apply(this,arguments));
    };
};

/// JQuery Extensions ///

function jquery_extensions() {

    (function ($) {
        $.fn.preload = function() {
            this.each(function(){
                $('<img/>')[0].src = this;
            });
        };
    })(jQuery);


    (function ($) {
        ///Center function
        $.fn.center = function () {
            this.css("position","absolute");
            this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
            this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
            return this;
        };
    })(jQuery);

    (function ($) {
        ///Center function
        $.fn.hcenter = function () {
            this.css("position","absolute");
            this.css("left", ((exp.slide_width - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
            return this;
        };
    })(jQuery);

    (function ($) {
        ///Center function
        $.fn.centerhin = function () {
            var ah = $(this).width();
            var ph = $(this).parent().width();
            var mh = Math.ceil((ph-ah) / 2);
            $(this).css('margin-left', mh);
            return this;
        };
    })(jQuery);

    (function ($) {
        ///Center function
        $.fn.centerh = function () {
            var ah = $(this).outerWidth(true);
            var ph = $(this).parent().outerWidth(true);
            var mh = Math.ceil((ph-ah) / 2);
            $(this).css('left', mh);
            return this;
        };
    })(jQuery);

    (function ($) {
        // VERTICALLY ALIGN FUNCTION
        $.fn.vAlign = function() {
            return this.each(function(i){
                var ah = $(this).height();
                var ph = $(this).parent().height();
                var mh = Math.ceil((ph-ah) / 2);
                $(this).css('margin-top', mh);
            });
        };
    })(jQuery);
}

/// Utils ///

// Create Table ...I don't think this works
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function objLength(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function mean(a) {
    return a.length ? _.reduce(a, function(memo,num){return memo +num;}, 0) / a.length : 0;
}

//Javascript IO
function JIO() {
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

    function errorHandler(e) {
        var msg = '';

        switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
        };

        console.log('Error: ' + msg);
    }


    function onInitFs(fs) {

        fs.root.getFile('FindMeXXXX.txt', {create: true}, function(fileEntry) {

            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function(fileWriter) {

                fileWriter.onwriteend = function(e) {
                    console.log('Write completed.');
                };

                fileWriter.onerror = function(e) {
                    console.log('Write failed: ' + e.toString());
                };

                // Create a new Blob and write it to log.txt.
                var bb = new window.WebKitBlobBuilder(); //new BlobBuilder(); // Note: window.WebKitBlobBuilder in Chrome 12.
                bb.append('Lorem Ipsum');
                fileWriter.write(bb.getBlob('text/plain'));

            }, errorHandler);

        }, errorHandler);

    }

    window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
        window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
    }, function(e) {
        console.log('Error', e);
    });

}

/**
 * Escapes string for XML interpolation
 * @param value string or number value to escape
 * @returns string escaped
 */
function escapeXML(s) {
    if ( typeof s === 'number' ) return s.toString();

    var replace = { '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', '\'': 'apos' };

    for ( var entity in replace ) {
        s = s.replace(new RegExp(entity, 'g'), '&' + replace[entity] + ';');
    }

    return s;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    h /= 360;
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return "rgb(" + Math.round(r * 255) + ',' +  Math.round(g * 255) + "," + Math.round(b * 255) + ")";
}

function median(ary) {
    if (ary.length == 0)
        return null;
    ary.sort(function (a,b){return a - b;});
    var mid = Math.floor(ary.length / 2);
    if ((ary.length % 2) == 1)  // length is odd
        return ary[mid];
    else
        return (ary[mid - 1] + ary[mid]) / 2;
}

function randomNormal() {
    return Math.cos(2 * Math.PI * Math.random()) * Math.sqrt(-2 * Math.log(Math.random()));
}

/// Exp utils ///
function change_params(){
    exp.params={};
    //    exp.params.size=15;
    //    exp.params.angle=30;
    //    exp.params.size = (typeof php.size === "undefined") ? php.size : 10;

    //    exp.params.angle = (typeof php.angle === "undefined") ? php.angle : 20;
    //    exp.params.small= 50 - exp.params.size;
    //   exp.params.large= 50 + exp.params.size;
    //    exp.params.ratio=1.2;

    exp.params.sfreq = (typeof php.size === "undefined" || php.size == 0  ) ? 16 : php.size;
    exp.params.angle = (typeof php.angle === "undefined" || php.angle == 0  ) ? 30 : php.angle;
    exp.params.size_step = 20;
    exp.params.angle_step = 10;

    //    exp.data
}

function tallyResults() {
    var name= exp.data[exp.data.length-1].stim1 + exp.data[exp.data.length-1].stim2;
    if(exp.cats.numspikes.test(name)) exp.results["sfreq"].push(exp.data[exp.data.length-1].resp);
    else if(exp.cats.spikey.test(name)) exp.results["angle"].push(exp.data[exp.data.length-1].resp);
    else if(exp.cats.same.test(name)) exp.results["same"].push(exp.data[exp.data.length-1].resp);
    else exp.results["diag"].push(exp.data[exp.data.length-1].resp);
}

function updateParams() {
    exp.data[exp.data.length]={};
    exp.data[exp.data.length-1].this_sfreq = exp.params.sfreq;
    exp.data[exp.data.length-1].this_angle = exp.params.angle;
    exp.data[exp.data.length-1].sfreq = median(exp.results.sfreq);
    exp.data[exp.data.length-1].angle = median(exp.results.angle);
    exp.data[exp.data.length-1].diag = median(exp.results.diag);
    for (i in exp.results){
        exp.results[i]=mean(exp.results[i]);
    }
    if (exp.results.diag >= exp.results.angle && exp.results.diag >= exp.results.sfreq){
        exp.data[exp.data.length-1].next_sfreq = exp.params.sfreq;
        exp.data[exp.data.length-1].next_angle = exp.params.angle;
        exp.data[exp.data.length-1].awake = 0;
    }
    else if (exp.results.sfreq >= exp.results.angle){
        exp.data[exp.data.length-1].next_sfreq = exp.params.sfreq-exp.params.size_step;
        exp.data[exp.data.length-1].next_angle = exp.params.angle;//-exp.params.angle_step;
        exp.data[exp.data.length-1].awake = 1;
    }
    else {
        exp.data[exp.data.length-1].next_sfreq = exp.params.sfreq+exp.params.size_step;
        exp.data[exp.data.length-1].next_angle = exp.params.angle;//+exp.params.angle_step;
        exp.data[exp.data.length-1].awake = 1;
    }
    //    if(exp.data[exp.data.length-1].next_num == 0 || typeof exp.data[exp.data.length-1].next_num  === "undefined")  exp.data[exp.data.length-1].next_num = exp.params.sfreq;
}

function oldupdateParams() {
    exp.data[exp.data.length]={};
    exp.data[exp.data.length-1].this_sfreq = exp.params.sfreq;
    exp.data[exp.data.length-1].this_angle = exp.params.angle;
    exp.data[exp.data.length-1].sfreq = median(exp.results.sfreq);
    exp.data[exp.data.length-1].angle = median(exp.results.angle);
    exp.data[exp.data.length-1].diag = median(exp.results.diag);
    for (i in exp.results){
        exp.results[i]=mean(exp.results[i]);
    }
    if (exp.results.diag >= exp.results.angle || exp.results.diag >= exp.results.sfreq){
        exp.data[exp.data.length-1].next_sfreq = exp.params.sfreq;
        exp.data[exp.data.length-1].next_angle = exp.params.angle;
        exp.data[exp.data.length-1].awake = 0;
    }
    else if (exp.results.sfreq >= exp.results.angle){
        exp.data[exp.data.length-1].next_sfreq = exp.params.sfreq+exp.params.size_step;
        exp.data[exp.data.length-1].next_angle = exp.params.angle-exp.params.angle_step;
        exp.data[exp.data.length-1].awake = 1;
    }
    else {
        exp.data[exp.data.length-1].next_sfreq = exp.params.sfreq-exp.params.size_step;
        exp.data[exp.data.length-1].next_angle = exp.params.angle+exp.params.angle_step;
        exp.data[exp.data.length-1].awake = 1;
    }
    //    if(exp.data[exp.data.length-1].next_num == 0 || typeof exp.data[exp.data.length-1].next_num  === "undefined")  exp.data[exp.data.length-1].next_num = exp.params.sfreq;
}

function showSlide(slidename) {
    $(".slide").hide();
    $(".fullslide").hide();
    $("#" + slidename).show();
}

function addHit() {
    $.ajax({
        type: "POST",
        url:  "../shared/php/addHit.py",
        data: {ID: turk.hitId, sandbox: exp.sandbox},
        success: function(message) {console.log("addedHit: " + message);},
        error: function(xhr, textStatus, errorThrown) { alert(textStatus); }
    });
}

function grantBonus(bonus) {
    $.ajax({
        type: "POST",
        url:  "../shared/php/grantBonus.py",
        data: {HID: turk.hitId,
               sandbox: exp.sandbox,
               WID: turk.workerId,
               AID: turk.assignmentId,
               BONUS: bonus
              },
        success: function(message) {console.log("granted Bonus: " + message);},
        error: function(xhr, textStatus, errorThrown) { alert(textStatus); }
    });
}

function getTimeOffset(t1) {
    var t2 = new Date();
    return((t2.getTime()-t1.getTime())/1000);
}

function getTime() {
    var time = new Date();
    var offset = (420 - time.getTimezoneOffset())/60;
    time.addHours(offset);
    var year = time.getFullYear();
    var month = time.getMonth()+1;
    var date1 = time.getDate();
    var hour = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    var milliseconds = time.getMilliseconds();
    return  year + "-" + month+"-"+date1+" "+hour+":"+minutes+":"+seconds + "." + milliseconds;
}

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

$.getTime = function(zone, success) {
    var url = 'http://json-time.appspot.com/time.json?tz='
            + zone + '&callback=?';
    $.getJSON(url, function(o){
        success && success(new Date(o.datetime), o);
    });
};

function dNum(num, x, y ) {
    R.text(x,  y, num).attr("font-size", 50);
}

function drawNum(num, time, func, prog, space, position, size) {
    //func = typeof(func) != 'undefined' ? func + "()" : "";
    space = typeof(space) != 'undefined' ? space : "rArea";
    position = typeof(position) != 'undefined' ? position : center(space);
    size = typeof(size) != 'undefined' ? size : 30;

    R.text(position.width,  position.height, num + "").attr("font-size", 50);
    if (time) {
        setTimeout(function ()
                   {
                       R.clear();
                       if (exp.get_current_slide().prog) {
                           update_prog();
                       }
                       if (func !== undefined) {
                           setTimeout(function(){
                               func.apply(exp.get_current_slide());}
                                      ,time/5);
                       }
                   } , time);
    }
}

function drawDot(color, time, func, prog, space, position, size) {
    space = typeof(space) != 'undefined' ? space : "rArea";
    position = typeof(position) != 'undefined' ? position : center(space);
    size = typeof(size) != 'undefined' ? size : 30;

    R.circle(position.width,  position.height, size).attr("fill", calcColor(color));
    if (time) {
        setTimeout(function() {
            R.clear();
            if (exp.get_current_slide().prog) {
                update_prog();
            }
            if (toType(func) == 'function' ) {
                setTimeout(function() {
                    func.apply(exp.get_current_slide());}, time/5);
            }
        }, time);
    }
}

function update_prog() {
    var that = exp.get_current_slide();
    // console.log(100 * that.stim.length/(that.stim.length+that.present.length));
    //  $("#pb1").progressBar(Math.round(100 * that.stim.length/(that.stim.length+that.present.length)));
    var done= that.slen-that.present.length;
    $("#pb1").progressbar({value : Math.round(100 * done/that.slen)});
    //    $("#pb1").progressbar({value : Math.round(100 * that.stim.length/(that.stim.length+that.present.length))});
}

function calcColor(c) {

    var color = exp.color.r2 - (c * exp.color.stepsize);
    return 'rgb('+ color + ',' + color + ',' +color + ')';

}

function generateCombinations(array, r, callback) {
    function equal(a, b) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] != b[i]) return false;
        }
        return true;
    }
    function values(i, a) {
        var ret = [];
        for (var j = 0; j < i.length; j++) ret.push(a[i[j]]);
        return ret;
    }
    var n = array.length;
    var indices = [];
    for (var ii = 0; ii < r; ii++) indices.push(ii);
    var fin = [];
    for (var ip = n - r; ip < n; ip++) fin.push(ip);
    while (!equal(indices, fin)) {
        callback(values(indices, array));
        var i = r - 1;
        while (indices[i] == n - r + i) i -= 1;
        indices[i] += 1;
        for (var j = i + 1; j < r; j++) indices[j] = indices[i] + j - i;
    }
    callback(values(indices, array));
}

function drawLine(length, time, space, position) {
    space = typeof(space) != 'undefined' ? space : "playingArea";
    position = typeof(position) != 'undefined' ? posiiton : center(space) ;

    var l = R.path("m" + position.width + " " + position.height + "v" + (-1* (base+(length*mult)))).attr({"stroke-width": 4});
    setTimeout('R.clear();', time);
}

function rgb(x,y,z) {
    return "rgb(" + x + ',' + y + ',' + z + ')';
}




/// Turk Utils
function sendJustData(name, data) {
    var datafin =  {};
    if (name == undefined) name = exp.name;
    if (data == undefined) data = exp.data;

    datafin[name] = JSON.stringify(data);

    $.ajax({
        type: "POST",
        url:  "../shared/php/handle_data.php",
        data: datafin,
        success: function() { console.log("All good");},
        error: function(xhr, textStatus, errorThrown) { alert(textStatus); }
    });
}

function sendTurk (data) {
    if (data == undefined)  {
        data= {bonus:exp.data[0].bonus, wid: turk.workerId};
        data = [JSON.stringify(data)];
    }

    if (exp.done) {
        turk.submit(data);
    }
    else {
        alert("Please wait a moment while we process your submission, and then"
              + " click the button again." );
    }
}

function makeWindow2(x) {
    var params  = 'height=$(window).height()';
    params += ', width='+$(window).width();
    params += ', top=0, left=0';
    params +='scrollbars=auto';
    window.open("http://www.stanford.edu/group/cocolab/cgi-bin/dj/WWW/"+ x + "/Experiment.php", 'Experiment', params);
}

function makeWindow(x) {
    if(turk.workerId){
        window.open("http://www.stanford.edu/group/cocolab/cgi-bin/dj/WWW/"+ x + "/Experiment.php", 'Experiment', 'fullscreen=yes, scrollbars=auto');
    }
    else {
        alert("You must accept the hit before you can start the experiment" );
    }

}

function sendData() {
    exp.data[0].workerId = turk.workerId;
    exp.data[0].cond = exp.condition;
    exp.data[0].mpd = exp.mpd;
    exp.data[0].Browser = BrowserDetect.browser;
    exp.data[0].OS = BrowserDetect.OS;
    exp.data[0].screenH= exp.height;
    exp.data[0].screenW= exp.width;

    updateParams();

    var datafin =  {};
    datafin[exp.name] = JSON.stringify(exp.data);

    $.ajax({
        type: "POST",
        url:  "../shared/php/addHit.py",
        data: {ID: turk.hitId, sandbox: exp.sandbox},
        success: function(message) {console.log("addedHit: " + message);},
        error: function(xhr, textStatus, errorThrown) { alert(textStatus); }
    });

    $.ajax({
        type: "POST",
        url:  "../shared/php/handle_data.php",
        data: datafin,
        success: function() {console.log("data saved"); },
        error: function(xhr, textStatus, errorThrown) { alert(textStatus); }
    });

}

function sendData_old() {
    var turkData= [7, 2];
    exp.data[0].workerId = turk.workerId;
    exp.data[0].cond = exp.condition;

    var datafin =  {};
    datafin[exp.name] = JSON.stringify(exp.data);

    $.ajax({
        type: "POST",
        url:  "../shared/php/handle_data.php",
        data: datafin,
        success: function() { turk.submit(turkData); },
        error: function(xhr, textStatus, errorThrown) { alert(textStatus); }
    });
}

function newTable_old() {
    var getUnique = function(){
        var u = {}, a = [];
        for(var i = 0, l = this.length; i < l; ++i){
            if(this[i] in u)
                continue;
            a.push(this[i]);
            u[this[i]] = 1;
        }
        return a;
    };
    var sqlKind = [" VARCHAR(25), "," INT, " ];
    var list_keys=[];
    $.each(exp.data, function(key, val){
        // console.log('outer ikeys is: ' + key, ' ivals is: ' + val);
        $.each(val, function(ikeys, ivals) {
            //          console.log('inner ikeys is: ' + ikeys, ' ivals is: '+ ivals);
            list_keys.push([ikeys, (1*isNumber(ivals))]);
        });

    });

    var keys = getUnique.apply(list_keys);
    //var keys = _.unique(list_keys);
    keys.push(['sid', 1]);
    var mysql_begin="CREATE TABLE " + exp.name +"(id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id), ";

    $.each(keys, function(i, val) {
        mysql_begin = mysql_begin + val[0] + sqlKind[val[1]];
    });
    mysql_begin = mysql_begin.substring(0, mysql_begin.length-2) + ")";
    return mysql_begin;

}

function newTable(data, name) {
    data = typeof data !== 'undefined' ? data : exp.data;
    name = typeof name !== 'undefined' ? name : exp.name;

    var getUnique = function(){
        var u = {}, a = [];
        for(var i = 0, l = this.length; i < l; ++i){
            if(this[i] in u)
                continue;
            a.push(this[i]);
            u[this[i]] = 1;
        }
        return a;
    };
    var sqlKind = [" VARCHAR(25), "," INT, ", " FLOAT, "];
    var list_keys=[];
    $.each(data, function(key, val){
        // console.log('outer ikeys is: ' + key, ' ivals is: ' + val);
        $.each(val, function(ikeys, ivals) {
            // console.log('inner ikeys is: ' + ikeys, ' ivals is: '+ ivals);
            list_keys.push([ikeys, (function(x){
                var ret = (1*isNumber(x));
                if(ret) return((1 * ((1*x) % 1 != 0)) + ret);
                else return(ret);})(ivals)]);
        });

    });

    var keys = getUnique.apply(list_keys);
    //var keys = _.unique(list_keys);
    keys.push(['sid', 1]);
    var mysql_begin="CREATE TABLE `" + name +"`(id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id), ";

    $.each(keys, function(i, val) {
        mysql_begin = mysql_begin + "`" + val[0] + "`" + sqlKind[val[1]];
        //mysql_begin = mysql_begin + val + sqlKind[0];
    });
    mysql_begin = mysql_begin.substring(0, mysql_begin.length-2) + ")";
    return mysql_begin;

}


function makeTable() {
    var x=newTable();
    $.ajax({
        type: "POST",
        url:  "../shared/php/create.php",
        data: {command: JSON.stringify(x)},
        success: function() { console.log("success"); },
        error: function(xhr, textStatus, errorThrown) { alert(textStatus); }
    });
    //makeSID();
}

function makeTableAll(data) {
    _.each(data, function(data, name){
        var x=newTable(data, exp.name + "_" + name);
        $.ajax({
            type: "POST",
            url:  "../shared/php/create.php",
            data: {command: JSON.stringify(x)},
            success: function() { console.log("success"); },
            error: function(xhr, textStatus, errorThrown) { alert(textStatus); }
        });
    });
    //makeSID();
}

function sendAllData(data){
    _.each(data, function(data, name){
        var datafin={};
        datafin[exp.name + "_" + name] = JSON.stringify(data);
        $.ajax({
            type: "POST",
            url:  "../shared/php/handle_data.php",
            data: datafin,
            success: function() { console.log("All good");
                                  exp.data_sent=1;
                                },
            error: function(xhr, textStatus, errorThrown) { alert(textStatus); }
        });
    });
}

function makeSID() {
    var alter = "ALTER TABLE SID ADD "  + exp.name + " INT";
    $.ajax({
        type: "POST",
        url:  "../shared/php/create.php",
        data: {command: JSON.stringify(alter)},
        success: function() { console.log("success"); },
        error: function(xhr, textStatus, errorThrown) { alert(textStatus); }
    });
    sendJustData("SID", _.map(_.range(1,1000), function(x){return({sid:x});}));
}

function calc_relative_sizes() {
    //  var offset=screen.width/2-(parseInt($('.slide').css('width'), 10 )/2);
    var offset= ($(window).width()-22)/5;
    $('#progress').css( 'width', offset -30);
    $('.slide').css('width', $(window).width()-21);
    //exp is full screen
    $('.exp').css('height' , $(window).height());
    $('.exp').css('width',  $(window).width());

    //offset slide
    //  $('.slide').css({'left' : offset});
    //  $('.slide').css('width', $(window).width()*(4/5));
    //  $('.slide').css('width', ($('.exp').width()-22)*(4/5));

    //don't offset slide
    //$('.slide').css({'left' : 0});
    //  $('.slide').css('width', $('.exp').width());
    //  $('.slide').css('overflow', 'hidden');
    exp.height = $(window).height(); // $('.exp').css('height');
    exp.width = $(window).width();

    //Center all the things we need to
    //$('#sim_slide').centerhin();
    //  $('button.bCent').css({'left' : exp.width/2-30});
    $('.bcent').centerh();

    //  $('#training_sort_cont').centerh();
    //  $('#sim_cont').centerh();

}

function makeASCII() {
    // var the_char = Math.floor(Math.random()*(123-33) + 33);
    var the_char = Math.floor(Math.random()*(90 -65) + 65);
    return(String.fromCharCode(the_char));
}


function extract(data, where) {
    for (var key in data) {
        where[key] = data[key];
    }
}

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function insertParam(key, value) {
    key = escape(key); value = escape(value);

    var kvp = document.location.search.substr(1).split('&');
    if (kvp == '') {
        document.location.search = '?' + key + '=' + value;
    }
    else {

        var i = kvp.length; var x; while (i--) {
            x = kvp[i].split('=');

            if (x[0] == key) {
                x[1] = value;
                kvp[i] = x.join('=');
                break;
            }
        }

        if (i < 0) { kvp[kvp.length] = [key, value].join('='); }
        return(kvp);
        //this wil); reload the page, it's likely better to store this until finished
        //document.location.search = kvp.join('&');
    }
}

function addParams(data, url){
    if(url === undefined) url=window.location.href;
    var dataString = [];

    for(var key in data) {
        if (data.hasOwnProperty(key)) {
            dataString.push(key+"="+escape(data[key]));
        }
    }

    url += "?" + dataString.join("&");
    window.location.href = url;

}

function roundNumber(num, dec) {
    var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
    return result;
}


function textWrap(x,y, r, content, maxWidth, size){

    var t = r.text(x, y).attr('text-anchor', 'start');
    //var maxWidth = 100;
    var words = content.split(" ");

    var tempText = "";
    for (var i=0; i<words.length; i++) {
        t.attr("text", tempText + " " + words[i]);
        if (t.getBBox().width > maxWidth) {
            tempText += "\n" + words[i];
        } else {
            tempText += " " + words[i];
        }
    }

    t.attr({"text": tempText.substring(1), "font-size": size });
}

function position_debug() {
    $(document).mousedown(function(e){
        console.log(e.pageX +', '+ e.pageY);
    });
}

// $(document).ready(
// function(){exp=make_exp();}
// );

function oldworker() {
    $.ajax({
        type: "POST",
        url:  "../shared/php/old_worker.php",
        data: {ID: turk.workerId, table:exp.tables},
        success: function(response) {
            php.wid=response * 1;
            console.log("php says: " + response);},
        error: function(xhr, textStatus, errorThrown) { alert(textStatus); }
    });};

_.mixin({
    swap : function(arr, ind1, ind2) {
        var temp = arr[ind1];
        arr[ind1] = arr[ind2];
        arr[ind2] = temp;
        return arr;
    }
});

// _.mixin({
//   shift : function(arr, ind1, ind2) {
//       var temp = arr[ind1];
//       arr[ind1] = arr[ind2];
//       arr[ind2] = temp;
//     return arr;
//   }
// });


function addData(key,val) {
    exp.data[exp.data.length-1][key]= val;
}

function getData(key) {
    return exp.data[exp.data.length-1][key];
}

function makeid(len)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function preload2(arrayOfImages) {
    $(arrayOfImages).each(function () {
        $('<img />').attr('src',this).appendTo('body').css('display','none');
    });
}

function preload() {
                var images = new Array();
                for (i = 0; i < preload.arguments.length; i++) {
                    images[i] = new Image();
                    images[i].src = preload.arguments[i];
                }
}

// preload([
//     'img/imageName.jpg',
//     'img/anotherOne.jpg',
//     'img/blahblahblah.jpg'
// ]);

function exp_sizing(){
    exp.width=800;
    exp.height=600;
    $('.slide').css('width', exp.width);
    $('.slide').css('height', exp.height);
    $('.exp').css('height', exp.height+2);
    $('.slide_wrapper').css('width', exp.width);
    $('.slide_wrapper').css('height', exp.height);
}

randomChar = (function (){
    var charSet = _.shuffle(["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]);
    return function(){return charSet.pop();};
})();

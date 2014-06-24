//Make dialog boxes, probably separate this into a fixed and other frame file eventually.
$(document).ready(function() {
    $.dialog = $('<div></div>')
        .html("You cannot try the hit multiple times. If you are trying to open the hit again due to an error in the hit, please <a href=\"mailto:djthorne@stanford.edu\">Email Me</a>")
        .dialog({
            autoOpen: false,
            title: 'Warning'
        });
});

$(document).ready(
    function()  {
        //        exp=make_exp();
        $.readit = $('<div></div>')
            .html("That was awfully fast. Please read carefully. If you don't"
                  + " understand the instructions, your participation actually"
                  + " hurts my understanding of what is going on.")
            .dialog({
                autoOpen: false,
                title: 'Warning'
            });

        $.dblclick = $('<div></div>')
            .html("You cannot try the hit multiple times. If you are trying to open the hit again due to an error in the hit, please <a href=\"mailto:djthorne@stanford.edu\">Email Me</a>")
            .dialog({
                autoOpen: false,
                title: 'Warning'
            });
        $.repeat = $('<div></div>')
            .html("You have already done a hit in this series. You cannot complete this hit, thank you for your work!")
            .dialog({
                autoOpen: false,
                title: 'Warning'
            });
        $.size = $('<div></div>')
            .html("Your screen is not large enough to complete this hit. Thanks for your intererst. If you have any comments please <a href=\"mailto:djthorne@stanford.edu\">Email Me</a>")
            .dialog({
                autoOpen: false,
                title: 'Warning'
            });
        $.height = $('<div></div>')
            .html("Be aware that your screen isn't tall enough to show all the content. You will have to scroll down on each page to make sure you see everything")
            .dialog({
                autoOpen: false,
                title: 'Warning'
            });
        $.max = $('<div></div>')
            .html("This hit requires your screen to be maximized. please maximize your screen and refresh the browser. If you have any comments please <a href=\"mailto:djthorne@stanford.edu\">Email Me</a>")
            .dialog({
                autoOpen: false,
                title: 'Warning'
            });
        $.accept = $('<div></div>')
            .html("You must accept the hit before you can start the experiment")
            .dialog({
                autoOpen: false,
                title: 'Warning'
            });
    });


function immediate_check(){
      if(php.wid == 1) {
        allgood=0;
        $.repeat.dialog('open');
    }
    browserCheck();
}

function prune_worker(){
    var allgood = 1,
        height = $(window).height(),
        width = $(window).width(),
        screen_height = screen.height,
        screen_width = screen.width;
    if(php.wid == 1) {
        allgood=0;
        $.repeat.dialog('open');
    }
    if (height < 601){
        $.height.dialog('open');
    }

    // if (width < 800 || height < ){
    //     $.size.dialog('open');
    //     allgood=0;
    // }
    // if (screen_width - width > 150 || screen_height - width >  150){
    //     $.max.dialog('open');
    //     allgood=0;
    // }
    allgood=browserCheck(allgood);
    return allgood;
}

function experiment_proceed(){
    if(turk.workerId){
        var good = prune_worker();
        if(good){
            exp.go();
        }
    }
    else{
        $.accept.dialog('open');
    }
}

function index_f(name) {
    if(turk.workerId){
        if (typeof(exp.opened)==='undefined') {
            if(typeof(name)==='undefined') name = exp.name;
            exp.opened = 1;
            makeWindow(name);
        }
        else  {
            $.dblclick.dialog('open');
        }
    }
    else {
        $.accept.dialog('open');
    }
}

function browserCheck(allgood) {
    $.browser = $('<div></div>').dialog({
        autoOpen: false,
        title: 'Warning'
    });
    //Make sure they are not using IE etc.
    if(BrowserDetect.OS == "Windows") {
        if( BrowserDetect.browser != "Chrome" && BrowserDetect.browser != "Firefox"){
            $.browser.html("You are using an unsupported browser (" +
                           BrowserDetect.browser+ ').' + "  You can only"
                           + " complete this hit with Chrome and Firefox");
            $.browser.dialog('open');
            console.log(BrowserDetect.browser);
            allgood=0;
        }
    }
    else{
        if(BrowserDetect.browser != "Chrome" && BrowserDetect.browser !=
           "Safari" && BrowserDetect.browser != "Firefox"){
            $.browser.html("You are using an unsupported browser (" +
                           BrowserDetect.browser+ ').' + "  You can only"
                           + " complete this hit with Safari, Chrome, Firefox.");
            $.browser.dialog('open');
            console.log(BrowserDetect.browser);
            allgood=0;
        }
    }
    return allgood;
}


// function browserCheck() {
//     var okay=1;
//     //Make sure they are not using IE etc.
//     if(BrowserDetect.OS == "Windows") {
//         if( BrowserDetect.browser != "Firefox"){
//             $('#browser').html("You are using an unsupported browser (" + BrowserDetect.browser+ ').' + "  You can only complete this hit with firefox");
//             console.log(BrowserDetect.browser);
//             showSlide("berror");
//         }
//         else {
//             showSlide("i0");
//         }
//     }
//     else{
//         if(BrowserDetect.browser != "Chrome" && BrowserDetect.browser != "Firefox" && BrowserDetect.browser != "Safari" ){
//             $('#browser').html("You are using an unsupported browser (" + BrowserDetect.browser+ ').' + "  You can only complete this hit with safari, firefox, or chrome.");
//             console.log(BrowserDetect.browser);
//             showSlide("berror");
//         }
//         else {
//             showSlide("i0");
//         }
//     }
//}

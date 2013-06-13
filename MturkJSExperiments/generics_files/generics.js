qnum = 0;
qtotal = 3;

function instructions() {showSlide("instructions");}

function trialInfo() {
  showSlide("trialInfo");
}

function trialQ() {
  showSlide("trialQ");
}

function trialSubmit() {
  proportion = $("#propform").serialize();
  document.getElementById("propform").reset();
  qnum++;
  if (qnum < qtotal) {trialInfo();} else {language();}
}

function language() {
  showSlide("language");
  $("#lgerror").hide();
  $("#lgsubmit").click(function(){
    lang = $("#lgform").serialize();
    if (lang.length > 5) {
      lang = lang.slice(3,lang.length);
      //experiment.data["language"] = lang;
      showSlide("finished");
      setTimeout(function() {turk.submit(experiment.data)}, 1000);
    }
  });
}

function showSlide(id) {$(".slide").hide();$("#"+id).show();}

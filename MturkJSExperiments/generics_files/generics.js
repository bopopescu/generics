qnum = 0;
qtotal = 1;

function instructions() {showSlide("instructions");}

function trialInfo() {
  examples = ["horns1", "nohorns2", "horns3"];
  for (i=0; i<examples.length; i++) {
    var img = document.createElement("img");
    img.src = "generics_files/" + examples[i] + ".png";
    var imagesSpan = document.getElementById("images");
    imagesSpan.appendChild(img);
  }
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
      //setTimeout(function() {turk.submit(experiment.data)}, 1000);
    }
  });
}

function showSlide(id) {$(".slide").hide();$("#"+id).show();}

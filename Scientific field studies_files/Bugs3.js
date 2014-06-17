// Gen Bugs Experiment1
// 5/20/2013 - class project with Steve Skentzos
// Overview: 
//      (1) Helper
//      (2) Parameters and Stimulus Setup 
//      (3) Control Flow

// ---------------- 1. HELPER ------------------
// random function
function random(a,b) 
{
    if (typeof b == "undefined") 
    {
		a = a || 2;
		return Math.floor(Math.random()*a);
    } 
    else 
    {
		return Math.floor(Math.random()*(b-a+1)) + a;
    }
}

// shuffle function
function shuffle (a) 
{ 
    var o = [];
    for ( var i=0; i < a.length; i++) { o[i] = a[i]; }
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), 
	 x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

// show slide function
function showSlide(id) 
{
    $(".slide").hide(); //jquery - all elements with class of slide - hide
    $("#"+id).show(); //jquery - element with given id - show
}

String.prototype.capitalize = function() 
{
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.slice2 = function(a)
{
	return this.charAt(a) + this.charAt(a+1);
}

// ---------------- 2. STIMULUS SETUP ------------------

showSlide("instructions");

var facesDataset = 2;
var facesDatasetSize = 12;

var training_rows = 4;
var training_columns = 5;
var trainings_per_category = 4;
var categories = 4;

var sliderMoved = false;
var timestamp;

var drawnObject;
var tokens = [];
// 
//var distributions = shuffle(["beta", "binary", "uniform", "uniform_low"]);
//var distributions = shuffle(["beta", "uniform", "uniform_low"]);
//var distributions = shuffle(["uniform", "uniform_low", "uniform", "uniform_low", "uniform", "uniform_low"]);

var distForSampling = 
{
	// These distributions are the number of tokens per type that have the target feature.
	// Each distribution should have the same number of elements as the number of trainings_per_category above.
	// The max value within each distribution is the product of training_rows and training_columns above.
	
	beta: shuffle([0, .05, .95, 1]),
	binary: shuffle([0, 0, 1, 1]),
	uniform: shuffle([0, .33333, .66667, 1]),
	uniform_low: shuffle([0, .16667, .33333, .5])
};

var stimuli_critical = [];

var withinConditions = shuffle([{condition: "no-utt", distribution: "uniform"},{condition: "no-utt", distribution: "uniform_low"},{condition: "critical", distribution: "uniform"},{condition: "critical", distribution: "uniform_low"}]);

var domains = shuffle(["bug","bird","tree","microbe","monster"]);

var bug_features = ["wings","antennae"];
var tree_features = ["berries", "leaves"];
var bird_features = ["plumed crests", "tails"];
var microbe_features = ["spikes", "bumps"];
var monster_features = ["horns", "teeth"];

// --words--
//var words = shuffle(["feps", "zots", "daxes", "lorps", "zims", "glorps", "borts", "wugs", "fints", "zubs", "heans", "joms"]);

var words = shuffle(["wosts", "wocks", "thogs", "snims", "ripts", "quogs", "polts", "poches", "murps", "mulbs", "morks", "mopts", "monxes", "mones", "moges", "lides", "hoils", "hoffs", "hisps", "hinxes", "hifes", "hetts", "fraws", "fings", "ficks", "blims"]);


var nameImageRandomizer = [];
for (var i = 0; i<facesDatasetSize; i++)
{
	nameImageRandomizer[i] = i;
}
nameImageRandomizer = shuffle(nameImageRandomizer);

var male_names = shuffle(["James", "John", "Robert", "Michael", "William", "David", "Richard", "Charles"]);
male_names_index = -1;

var female_names = shuffle(["Mary", "Patricia", "Linda", "Barbara", "Elizabeth", "Jennifer", "Maria", "Susan"]);
female_names_index = -1;

var jSlider;

var scale = 0.5;
var domain_index = 1;
var training_index = 1;
var word_index = 0;

var name;
var sex;
var prompt_image;

var thing;
var thing_features;
var critical_feature;

var feature1 = 0;
var feature2 = 0;	

var init = 1;		


// ---------------- 3. CONTROL FLOW ------------------
// PRE-LOAD IMAGES

showSlide("instructions");

// MAIN EXPERIMENT
var experiment = {
     // stimulus variables - bookkeeping, send these to turk
	browser: BrowserDetect.browser,
	condition: 'withinSubject',
    
    // MOVE TO NEXT CATEGORY
    next_category: function ()
    {
    		prompt_image = '<center><br/><img src="Faces' + facesDataset + '/Face' + nameImageRandomizer[domain_index-1] + '.png" width=100px height=120px><br/</center>';
    		experiment['image'+domain_index] = 'Faces' + facesDataset + '/Face' + nameImageRandomizer[domain_index-1] + '.png';
			$("#familiarizationImage").html(prompt_image);
			$("#familiarizationImage2").html(prompt_image);

			experiment['condition' + domain_index] = withinConditions[domain_index-1].condition;
			experiment['distribution' + domain_index] = withinConditions[domain_index-1].distribution;
			distForSampling = 
			{
				// These distributions are the number of tokens per type that have the target feature.
				// Each distribution should have the same number of elements as the number of trainings_per_category above.
				// The max value within each distribution is the product of training_rows and training_columns above.
				
				beta: shuffle([0, .05, .95, 1]),
				binary: shuffle([0, 0, 1, 1]),
				uniform: shuffle([0, .33333, .66667, 1]),
				uniform_low: shuffle([0, .16667, .33333, .5])
			};

			sex = "male";
			name;
			if 
			(
				(facesDataset == 1 && (nameImageRandomizer[domain_index-1] == 3 || nameImageRandomizer[domain_index-1] == 8 || nameImageRandomizer[domain_index-1] == 10)) ||
				(facesDataset == 2 && (nameImageRandomizer[domain_index-1] == 0 || nameImageRandomizer[domain_index-1] == 4 || nameImageRandomizer[domain_index-1] == 5 || nameImageRandomizer[domain_index-1] == 6  || nameImageRandomizer[domain_index-1] == 8  || nameImageRandomizer[domain_index-1] == 11 ))
				
			)
			{
				sex = "female";
			}
			
			if (sex == "male")
			{
				male_names_index++;
				name = male_names[male_names_index];	
			}
			else
			{
				female_names_index++;
				name = female_names[female_names_index];	
			}
		
			critical_feature = random(2);						
			
			feature1 = 0;
			feature2 = 0;			
			
			if (critical_feature == 0)
			{
				feature1 = 0;
				feature2 = 1;
			}
			else
			{
				feature1 = 1;
				feature2 = 0;
			}							
    },

    // FAMILIARIZATION DISPLAY FUNCTION
    next_familiarization: function() {
        // Allow experiment to start if it's a turk worker OR if it's a test run
		if (window.self == window.top | turk.workerId.length > 0) 
		{
			var prompt_html;
			window.scrollTo(0,0);
			
			switch (domains[domain_index - 1])
			{
				case "tree":
					thing = new Stimuli.Tree();
					thing_features = tree_features;
					
					experiment['baseBerryColor' + domain_index] = thing.baseBerryColor;
					experiment['baseLeafColor' + domain_index] = thing.baseLeafColor;
					experiment['baseTrunkColor' + domain_index] = thing.baseTrunkColor;
					experiment['baseHeight' + domain_index] = thing.baseHeight;
					experiment['baseWidth' + domain_index] = thing.baseWidth;
					break;
					
				case "bug":
					thing = new Stimuli.Bug();
					thing_features = bug_features;

					experiment['baseBodyColor' + domain_index] = thing.baseBodyColor;
					experiment['baseWingsColor' + domain_index] = thing.baseWingsColor;
					experiment['baseAntennaeColor' + domain_index] = thing.baseAntennaeColor;
					experiment['baseBodyFatness' + domain_index] = thing.baseBodyFatness;
					experiment['baseHeadFatness' + domain_index] = thing.baseHeadFatness;
					break;
				case "bird":
					thing = new Stimuli.Bird();
					thing_features = bird_features;
					
					experiment['baseColor' + domain_index] = thing.baseColor;
					experiment['baseCrestColor' + domain_index] = thing.baseCrestColor;
					experiment['baseTailColor' + domain_index] = thing.baseTailColor;
					experiment['baseHeadStretch' + domain_index] = thing.baseHeadStretch;
					experiment['baseBodyStretch' + domain_index] = thing.baseBodyStretch;
					break;					
				case "microbe":
					thing = new Stimuli.Microbe();
					thing_features = microbe_features;
					
					experiment['baseColor' + domain_index] = thing.baseColor;
					experiment['xRadius' + domain_index] = thing.baseXRadius;
					experiment['yRadius' + domain_index] = thing.baseYRadis;
					experiment['spikesColor' + domain_index] = thing.baseSpikesColor;
					experiment['bumpsColor' + domain_index] = thing.baseBumpsColor;
					break;					
				case "monster":
					thing = new Stimuli.Monster();
					thing_features = monster_features;
					
					experiment['baseTallness' + domain_index] = thing.baseTallness;
					experiment['baseFatness' + domain_index] = thing.baseFatness;
					experiment['baseColor' + domain_index] = thing.baseColor;
					experiment['baseAccentColor' + domain_index] = thing.baseAccentColor;
					break;					
			}

			if (training_index == 1)
			{
				experiment.next_category();
				prompt_html = "<center>Meet " + name + ". </br></br>" + name + " is a scientist, collecting data for a field study about the <strong>" + thing_features[critical_feature] + "</strong> on " + domains[domain_index-1] + "s. </br></br> In " + (sex=="male"?"his":"her") + " study " + (sex=="male"?"he":"she") + " first came across some <strong>" + words[word_index] + "</strong>.<br/>";
				prompt_html += "</br> Below are the <strong>" + words[word_index] + "</strong> that " + name + " saw. Please study them and their <strong>" + thing_features[critical_feature] + "</strong> before going on.</br></br>";
			}
			else
			{
				prompt_html = "<center>Later on, " + name + "  came across another kind of " + domains[domain_index-1] + " called <strong>\"" + words[word_index] + '\"</strong>.<br/>'
				prompt_html += "</br> Please study the <strong>" + words[word_index] + "</strong> and their <strong>" + thing_features[critical_feature] + "</strong> below before continuing. </center></br>";
			}		
			
			$("#familiarizationText").html(prompt_html);
			
			experiment['criticalFeature' + domain_index] = thing_features[critical_feature];
			
			experiment['name' + domain_index] = name;
			experiment['sex' + domain_index] = sex;
			
			var training_html = "<center>";
			for (var row=0;row<training_rows;row++)
			{				
				for (var col=0;col<training_columns;col++)
				{
					var index = row*training_columns + col;
					training_html += '<svg id="svg' + String(index) + '"></svg>'
				}
				training_html += "<br/>";
			}
			training_html += "</center>";
								
			$("#familiarizationObjects").html(training_html);
			
			experiment['domain' + domain_index] = domains[domain_index - 1];
			experiment['priorDistribution' + domain_index] = withinConditions[domain_index - 1].distribution;
			
			experiment['lowLevel' + domain_index + "_" + training_index] = distForSampling[withinConditions[domain_index - 1].distribution][training_index-1];
			
			stimuli_critical = [];

			var i;
			for (i = 0; i < Math.round(distForSampling[withinConditions[domain_index - 1].distribution][training_index-1]*training_rows*training_columns); i++)
			{
				stimuli_critical[i] = true;
			}
			for (; i < training_rows*training_columns; i++)
			{
				stimuli_critical[i] = false;
			}
			stimuli_critical = shuffle(stimuli_critical);			
					
			for (var row=0; row<training_rows; row++)
			{				
				for (var col=0; col<training_columns; col++)
				{
					var index = row*training_columns + col;
					drawnObject = thing.draw("svg" + String(index), stimuli_critical[index] || feature1, stimuli_critical[index] || feature2, scale);
					drawnObject['index'] = domain_index + "_" + training_index + "_" + (index + 1);
					tokens.push(drawnObject);
				}
			}
			showSlide("train");				
			timestamp = (new Date()).getTime();
		}
    },

    // CHECK THAT FAMILIARIZARION IS DONE
    check_fam: function() {
		famNextButton.blur(); 
		experiment['RT' + domain_index + "_" + training_index] = (new Date()).getTime() - timestamp;
		training_index++;
		word_index++;
		if (training_index < trainings_per_category + 1)
		{
			experiment.next_familiarization();
		}
		else
		{
			domain_index++;
			training_index = 1;
			experiment.next_test();
		}
    },
    
    advance: function() 
    {
    	word_index++;
		experiment.next_category();
		experiment.next_familiarization();
    
    },
  
	 // MAIN DISPLAY FUNCTION
    next_test: function() 
    {				
    	var question_html = "<center>During the study, " + name + " also came across several <strong>" + words[word_index] + "</strong>, another kind of " + domains[domain_index-2] + '.</br></br>';
    	if (withinConditions[domain_index-2].condition == "critical") 
    	{
			question_html +=  ' ' + (sex=="male"?"He":"She") + " tells you: " 
			 	+ '<strong><font size="26"></br></br></br>"' + words[word_index].capitalize() + ' have ' + thing_features[critical_feature] + '." </font></strong></center></br>'; 
    	} 
    	 
		question_html +=  '<center></br>Out of 100 <strong>' + words[word_index] + '</strong>, how many do you think have <strong>' + thing_features[critical_feature] + '</strong>?</center></br>';
    	 	
    	$("#question").html(question_html) 
    	$("#leftanchor").html("0")
		$("#rightanchor").html("100") 
    	
		showSlide("test");	
		timestamp = (new Date()).getTime();
		
		init = 1;

		jSlider = new Slider('my-slider', {
			speed: 20,
			callback: function(value) 
			{
				experiment["qResponse" + (domain_index-1)] = value;
				sliderMoved = true;
		    	$("#centeranchor").html("Out of 100 <strong>" + words[word_index] + "</strong>: <strong>" + Math.floor(value / .01) + "</strong> would have <strong>" + thing_features[critical_feature] + "</strong>");
			},
			animation_callback: function(value) 
			{
				if (init == 0)
				{
		    		$("#centeranchor").html("Out of 100 <strong>" + words[word_index] + "</strong>: <strong>" + Math.floor(value / .01) + "</strong> would have <strong>" + thing_features[critical_feature] + "</strong>");
		    	}
			}
	 	});
	 	
	
		jSlider.setValue(.5,true);
		sliderMoved = false;	
		$("#centeranchor").html("Out of 100 <strong>" + words[word_index] + "</strong>: <strong>-</strong> would have <strong>" + thing_features[critical_feature] + "</strong>");
		window.setTimeout('init = 0;',500);
		
    },
    
    // SELECT FUNCTION (called in test slide)
    select: function () {
		if (!sliderMoved)
		{
			$("#checkMessage2").html('<font color="red">' + 
					   'Please make sure you have answered all the questions!' + 
					   '</font>');
		} 
		else 
		{
			experiment['RT' + (domain_index - 1) + "_test"] = (new Date()).getTime() - timestamp;
			if (domain_index == categories+1)
			{
				experiment.exit_survey();
			}
			else
			{
				jSlider.setValue(0,true);
				sliderMoved = false;	
				$("#checkMessage2").html('');
				experiment.advance();
			} 
		}
	},

	exit_survey: function()
	{
		showSlide("check");
	},

   // FINISHED BUTTON CHECKS EVERYTHING AND THEN ENDS
    check_finished: function() {
		if (document.getElementById("language").value.length < 1) {
			$("#exitMessage").html('<font color="red">' + 
					   'Please make sure you have answered all the questions!' + 
					   '</font>');
		} else {
			
			experiment.language = document.getElementById("language").value;
			experiment.comment = document.getElementById("comments").value;
			
			experiment.tokens = tokens;
			experiment.end();
		}
    },

    // END FUNCTION 
    end: function () {
    
        showSlide("finished");
        setTimeout(function () {
            turk.submit(experiment);
        }, 500); 
    }
}
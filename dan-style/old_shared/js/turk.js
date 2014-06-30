var turk = {};

(function() {
	var param = function(url, name ) {
	  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	  var regexS = "[\\?&]"+name+"=([^&#]*)";
	  var regex = new RegExp( regexS );
	  var results = regex.exec( url );
	  return ( results == null ) ? "" : results[1];
	}
	
	var src = param(window.location.href, "assignmentId") ? window.location.href : document.referrer;
	
	var keys = ["assignmentId","hitId","workerId","turkSubmitTo"];
	keys.map(
		function(key) {
			turk[key] = unescape(param(src, key));
		}
	);
	
	turk.previewMode = (turk.assignmentId == "ASSIGNMENT_ID_NOT_AVAILABLE");
	
	turk.submit = function(data) {
		var assignmentId = turk.assignmentId;
		var turkSubmitTo = turk.turkSubmitTo;
		
		if (!assignmentId || !turkSubmitTo) return;
		
		var dataString = [];
		
		for(var key in data) {
			if (data.hasOwnProperty(key)) {
				dataString.push(key+"="+escape(data[key]));
			}
		}
		dataString.push("assignmentId="+assignmentId);
		
		var url = turkSubmitTo + "/mturk/externalSubmit?" + dataString.join("&");
		window.location.href = url;
	}
    
    turk.blank = function(data) {
		var assignmentId = turk.assignmentId;
		var turkSubmitTo = turk.turkSubmitTo;
		
		
		var dataString = [];
		
		for(var key in data) {
			if (data.hasOwnProperty(key)) {
				dataString.push(key+"="+escape(data[key]));
			}
		}
		dataString.push("assignmentId="+assignmentId);
		
		var url = turkSubmitTo + "/mturk/externalSubmit?" + dataString.join("&");
		turk.url= url;
		return url;
	}
    
})();
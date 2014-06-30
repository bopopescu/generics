//Underscore supplanted
// var getUnique = function(){
//     var u = {}, a = [];
//     for(var i = 0, l = this.length; i < l; ++i){
//         if(this[i] in u)
//             continue;
//         a.push(this[i]);
//         u[this[i]] = 1;
//     }
//     return a;
// }

// Array.method('removeE', function (e) {
//                  var i=-1;
//                  if (toType(e) === "array") {
//                      i=$.inArray(e, this);
//                  }
//                  else if  (toType(e) === "object") {
//                      $.each(this, function(index, value){if (JSON.stringify(value) === JSON.stringify(e) && i==-1){
//                                                              i = index;                                                   }

//                                                         });
//                  }
//                  if (i!=-1){
//                      this.splice(i,1);
//                  }
//                  return this;
//              });

// Array.method('removeA', function (e) {
//                  var i=$.inArray(e, this);
//                  while(i != -1) {
//                      var i=$.inArray(e, this);
//                      this.splice(i,1);
//                  }
//                  return this;

//              });

// Array.method('peek', function () {
//                  var el = this.shift();
//                  this.unshift(el);
//                  return el;

//              });

// Array.method('peekback', function () {
//                  var el = this.pop();
//                  this.push(el);
//                  return el;
//              });

// Array.prototype.max = function() {
//     return Math.max.apply(null, this);
// };

// Array.prototype.min = function() {
//     return Math.min.apply(null, this);
// };

// Array.prototype.last = function() {
//     return this[this.length-1];
// };
//Returns a function that takes an object, and returns the value of its // 'name' property
// var pluck = function(name) {
//     return function(object) {
//         return object[name];
//     };
// };
// function shuffle(o) {
//     for(var j, x, i = o.length; i; j = parseInt(Math.random() * i, 10), x = o[--i], o[i] = o[j], o[j] = x);
//         return o;
// }

// function thru(begin, end, reps) {
//     if (reps == undefined) reps =1;
//     var r = [];
//     for(var i=0; i< reps; i++) {
//         for(var b =begin; b <= end; b++) {
//             r.push(b);
//         }
//     }
//     return r;
// }

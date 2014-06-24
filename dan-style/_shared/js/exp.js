 make_exp = function() {
            var f = {};
            f.structure = [];
            f.data = [];
            f.slideIndex = -1;
            f.go= function(x) {
                if (typeof _s !== 'undefined' && _s.end) {
                    _s.end();
                }
                if (this.slideStartTime) addData("slide_time", getTimeOffset(this.slideStartTime));
                this.slideStartTime = new Date();
                this.slideIndex++;
                var all = this.structure[this.slideIndex];
                var slide_name = all.split(".")[0];
                var _version = all.split(".")[1];
                console.log("Beginning "+ slide_name);
                _s = this.slides[slide_name];
                console.log(_version);
                if (_version) {
                    _s.version= _version;
                }
                else if (_s && _s.version){
                    _s.version= "default";
                }
                $('#progress').css('visibility', 'hidden');
                if(_s != undefined) {
                    _s.init();
                }
                else {
                    showSlide(slide_name);
                }
                if (x !=0 && x != undefined){
                    this.go(x-1);
                }
            };
            f.goto_slide = function(s_name, leave_pointer){
                if (!leave_pointer) this.slideIndex+=1 + this.structure.slice(this.slideIndex+1).indexOf(s_name);
                var all = s_name;
                var slide_name = all.split(".")[0];
                var _version = all.split(".")[1];
                console.log("Beginning "+ slide_name);
                _s = this.slides[slide_name];
                console.log(_version);
                if (_version) {
                    _s.version= _version;
                }
                else if (_s && _s.version){
                    _s.version= "default";
                }
                $('#progress').css('visibility', 'hidden');
                if(_s != undefined) {
                    _s.init();
                }
                else {
                    showSlide(slide_name);
                }

            };
            f.back= function(t) {
                this.slideIndex--;
                var slide_name = this.structure[this.slideIndex];
                console.log("Beginning "+ slide_name);
                _s = this.slides[slide_name];
                if(_s != undefined) {
                   _s.init();
                }
                else {
                    showSlide(slide_name);
                }
            };


            f.get_current_slide = function(){
                return this.slides[this.structure[this.slideIndex]];
            };

            f.start = function() {
                exp.go();
            };
            f.phase = 0;

            return f;
        };
        exp=make_exp();

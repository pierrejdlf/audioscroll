// for each audio file
function asaudio(id,filepath,pan) {
	this.opts = {
		id: id,
		path: filepath,
		pan: pan
	};
	this.playing = false;
	this.audio = new Howl({
		urls: [this.opts.path],
		autoplay: false,
		loop: true,
		volume: 0.1,
		onend: function() {
			//console.log('playback end. looping.');
		}
	});
	this.play = function() {
		this.playing = true;
		this.audio.pos3d(this.opts.pan);
		this.audio.play();
		console.log(">>> start: "+this.opts.id);
	};
	this.stop = function() {
		this.playing = false;
		this.audio.stop();
		console.log(">>> stop: "+this.opts.id);
	}
	return this;
}

// general controller
function ascroll() {

    as = {};
    as.opts = {
    	contentUrl: "data/content.html",
    	mediaUrl: "data/media/",
    };

    as.swiper = null;
    as.audios = {};
    as.top = $("body").scrollTop();

    as.init = function() {
    	console.log("go.");
    	as.loadContent();
    	//as.swiperInit();
    	as.scrollzipInit();
    };
    as.getDirection = function() {
    	var ntop = $("body").scrollTop();
    	var res = ntop-as.top;
    	as.top = ntop;
    	return res>0;
    };
    // load text
    as.loadContent = function() {
    	$.get(as.opts.contentUrl).success(function(data) {
    		// display content
    		as.content = data;
    		$("#content").html(data);

    		// load all triggers as audios
    		$("#content").find(".trigger").each(function() {
    			var e = $(this);
    			var file = e.data("audio");
    			var pan = +e.data("pan");
    			e.html("●"+file[0]);
    			if(!as.audios.hasOwnProperty(file)) {
    				var fPath = as.opts.mediaUrl+file;
    				console.log("detected: "+fPath);
    				as.audios[file] = new asaudio(file,fPath,pan);
    			}
    		});
    	});
    };
    // this is the show/hide triggers event listener
    as.action = function(e,enter) {
		var id = e.data("audio");
		var action = e.data("action");
		var h = as.audios[id];
		var down = as.getDirection();
    	console.log("audio:trigger:down("+down+"):enter("+enter+"):"+action+":"+id);
    	var on = action=="on";
    	var off = action=="off";
    	var playing = h.playing;
    	if(enter && down && on && !playing) h.play();
    	if(enter && down && off && playing) h.stop();
    	if(!enter && !down && on && playing) h.stop();
    	if(enter && !down && off && !playing) h.play();
    };
    as.scrollzipInit = function() {
		$(document).scrollzipInit();
		$(window).on("load scroll resize", function(){
			$('.trigger').scrollzip({
				showFunction: function() { as.action($(this),true); },
				hideFunction: function() { as.action($(this),false); },
				showShift       : 50,//optional
				hideShift       : 50,//optional
				//wholeVisible  : true,//optional
			});
			$('p').scrollzip({
				showFunction: function() { },//$(this).addClass("visible"); },
				hideFunction: function() { },//$(this).removeClass("visible"); },
				showShift: 100,
				hideShift: 100,
			});
		});
    };
    as.swiperInit = function() {
        as.swiper = new Swiper("#swiper",{
            mode: 'vertical',
            scrollContainer: true,
            freeMode: true,
            // keyboardControl:    true,
            // centeredSlides:     true,
            // offsetPxBefore:     200,
            // offsetPxAfter:      200,
            // onSlideChangeStart: function() {
            //     plo.swiperLoadNext();
            //     plo.map.panTo(plo.current.options);
            // },
            //onSetWrapperTransform:  plo.throttleInterpolater,
            //onResistanceBefore:     plo.swiperInterpolate,
            //onResistanceAfter:      plo.swiperInterpolate,
        });
    };
	
	as.init();
    return as;
   };
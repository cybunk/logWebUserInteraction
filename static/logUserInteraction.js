
var logUserInteraction = {
	init: function () {
		
		this.collector			= "http://127.0.0.1:5000/"
		this.myTempLog			= new Array();
		this.mouseLog 			= new Array();
		this.myOldLog			= new Array();
		
		this.config 			= {logMode:"sync",logMouse:true}; //"async"; "end";
		this.mouse		 		= {X:null,Y:null,OldX:null,OldY:null}
		this.time				= {time:null,OldTime:null,date:new Date()}
		this.isActive 			= true;
		this._this				= this;
		
		this.opensession();
		
		window.addEventListener('focus',this.onfocus,false);
		window.addEventListener('blur',this.onblur,false);
		window.addEventListener('mousemove',this.onmousemove,true);
		window.addEventListener('click',this.onclick,false);
		window.addEventListener('scroll',this.onscroll,false);

	},
	opensession :function(){
		this.time.time   = this.time.date.getTime();
		var message = {url:document.URL,
					   navigator:navigator,
					   screen:screen,
					   history:window.history,						
					   t:this.time.time};
		delete message.navigator.mimeTypes;
		delete message.navigator.plugins;
		delete message.navigator.geolocation;
		//console.log(message);
		
		$.post("/login", {'init':JSON.stringify(message)},
			function(data) {
				console.log("Data Loaded: " + data);
			});
	},
	sendtrail : function(){
		var ns  = logUserInteraction;
		trail   = JSON.stringify(ns.myTempLog);
		//console.log( trail);
		$.post("/trail", {'trail':trail},
			function(data) {
				console.log("Data Sent: " + data);
				this.myTempLog = new Array();
				this.myOldLog = ns.myTempLog.concat(ns.myOldLog);
			});
	},
	onfocus : function (event) {
		var ns = logUserInteraction;
		ns.isActive = true;
		ns.time.time   = ns.time.date.getTime();
		ns.myTempLog.push({t:ns.time.time,
						   e:"onfocus",
						   m:[event.clientX+document.body.scrollLeft,event.clientY+document.body.scrollTop],
						   p:[window.pageXOffset,window.pageYOffset]
						 });
		ns.sendtrail();
	},
	onblur : function (event) {
		var ns = logUserInteraction;
		ns.isActive = false;
		ns.time.time   = ns.time.date.getTime();
		ns.myTempLog.push({t:ns.time.time,
						   e:"onblur",
						   m:[event.clientX+document.body.scrollLeft,event.clientY+document.body.scrollTop]
						 });
		ns.sendtrail();
	},
	onmousemove : function(event){	
		//console.log(_this);
		var ns = logUserInteraction;
		ns.mouse.X = event.clientX+document.body.scrollLeft;
		ns.mouse.Y = event.clientY+document.body.scrollTop;
		ns.time.date   = new Date();
		ns.time.time   = ns.time.date.getTime();
		if (ns.myTempLog.length==0){
			ns.myTempLog.push({ t:ns.time.time,
								e:"onmousemove",
								m:[ns.mouse.X,ns.mouse.Y]
							  });
		}else{
			now = ns.time.time-ns.time.OldTime;
			ns.myTempLog.push({t:now,
							   m:[ns.mouse.X-ns.mouse.OldX,
							   ns.mouse.Y-ns.mouse.OldY]});
		}
		ns.mouse.OldX = ns.mouse.X;
		ns.mouse.OldY = ns.mouse.Y;
		ns.time.OldTime = ns.time.time;
	},
	onclick : function (){
		var ns = logUserInteraction;
		ns.time.time   = ns.time.date.getTime();
		ns.myTempLog.push({t:ns.time.time,
						   e:"onclick",
						   m:[ns.mouse.X,ns.mouse.Y]
						 });
		ns.sendtrail();
	},
	onscroll : function (e) {
		var ns = logUserInteraction;
		ns.time.time   = ns.time.date.getTime();
		ns.myTempLog.push({t:ns.time.time,
						   e:"onscroll",
						   m:[ns.mouse.X,ns.mouse.Y],
						   p:[window.pageXOffset,window.pageYOffset]
						 });
		ns.sendtrail();
	},
	onbeforeunload : function (e) {
	},
	onselect : function (e) {
	},
	onresize : function (e) {
	}
}
/*
ready(function(){
	//without Jquery
	logUserInteraction.init();
});
*/
$(document).ready(function() {
	// with jquery
	var LUI = logUserInteraction.init();
});
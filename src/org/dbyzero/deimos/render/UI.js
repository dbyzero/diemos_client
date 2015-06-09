/**
 *
 * org.dbyzero.deimos.render.UI Object
 *
 * @author dbyzero
 * @date : 2013/08/04
 * @description : UI to show things !
 *
 * */

(function(deimos,document,undefined) {

	var EventManager = org.dbyzero.tools.EventManager;

	deimos.render = deimos.render || {} ;

	deimos.render.UI = function(){

		//HTML
		var gamePopupHTML = ''+
		'<section id="org.dbyzero.deimos.gamePopup.main" style="background-color:#ebd3ad;width:200px;position:fixed;top:0px;left:0px;border:1px solid #9e6111;border-radius:5px;z-index:1000000;cursor:pointer">'+
			'<header style="width:194px;background-color:#fee895;height:20px;font-family:Arial;padding:3px;font-size:15px;border-radius:5px">'+
				'Deimos'+
				'<div id="org.dbyzero.deimos.gamePopup.message" style="transition:background-color 0.25s, border 0.25s;float:right;background-color:#ebd3ad;width:13px;height: 18px;border-right: 5px #AF9D7F solid;cursor:pointer"></div>'+
			'</header>'+
			'<section id="org.dbyzero.deimos.gamePopup.sectionChooseAvatar">'+
				'<select id="org.dbyzero.deimos.gamePopup.avatarList" name="choose_avatar" style="border:1px solid #333;background-color:#fff;margin:8px 0 8px 5px;width:105px" size="5"></select>'+
				'<input id="org.dbyzero.deimos.gamePopup.formChooseAvatar" type="button" value="Choose" style="border:1px solid #333;background-color:#fff;margin:0x; position: absolute; bottom: 55px; right: 4px;"> '+
			'</section>'+
			'<footer style="width:194px;background-color:#FFFAED;height:20px;font-family:Arial;padding:3px;font-size:10px;border-radius:5px;margin-bottom:0px;">'+
				'<span>FPS : <span id="org.dbyzero.deimos.gamePopup.indicatorFps">n/a</span></span> | '+
				'<span>LAG : <span id="org.dbyzero.deimos.gamePopup.indicatorLag">n/a</span></span>'+
			'</footer>'+
		'</section>';

		var popupContainerElement = document.createElement('div');
		popupContainerElement.innerHTML = gamePopupHTML;
		document.body.appendChild(popupContainerElement);

		var messageAreaElement = document.createElement('ul');
		messageAreaElement.id = 'org.dbyzero.deimos.messageArea';
		messageAreaElement.style.backgroundColor = 'rgb(255, 239, 219)';
		messageAreaElement.style.width = '0px';
		messageAreaElement.style.height = '98%';
		messageAreaElement.style.position = 'fixed';
		messageAreaElement.style.top = '0px';
		messageAreaElement.style.right = '0px';
		messageAreaElement.style.border = '1px solid #ccc';
		messageAreaElement.style.zIndex = '1000000';
		messageAreaElement.style.fontFamily = 'monospace';
		messageAreaElement.style.fontSize = '10px';
		messageAreaElement.style.overflow = 'auto';
		messageAreaElement.style.overflowX = 'hidden';
		messageAreaElement.style.listStyle = 'none';
		messageAreaElement.style.margin = '0';
		messageAreaElement.style.padding = '5px 5px 0 5px';
		messageAreaElement.style.transition = 'width 0.5s linear';
		messageAreaElement.style.display = 'none';
		document.body.appendChild(messageAreaElement);

		//EVENTS
		var popup = document.getElementById("org.dbyzero.deimos.gamePopup.main");
		var dragEnable = false;
		var oldX = null;
		var oldY = null;
		popup.onmousedown = function(e){
			dragEnable = true;
			oldX = e.x;
			oldY = e.y;
		};
		document.onmouseup = function(e){
			dragEnable = false;
			oldX = null;
			oldY = null;
		};
		document.onmousemove = function(e){
			if(dragEnable) {
				popup.style.top = parseInt(popup.style.top.slice(0,-2)) + (e.y - oldY) +"px";
				popup.style.left = parseInt(popup.style.left.slice(0,-2)) + (e.x - oldX) +"px";
				oldX = e.x;
				oldY = e.y;
			}
			e.preventDefault();
			return false;
		};
		document.getElementById("org.dbyzero.deimos.gamePopup.message").onclick = function(e){
			if(document.getElementById("org.dbyzero.deimos.messageArea").style.width === "190px") {
				document.getElementById("org.dbyzero.deimos.messageArea").style.width = "0px";
				setTimeout(function(){
					document.getElementById("org.dbyzero.deimos.messageArea").style.display = "none";
				}
				,500);
			} else {
				document.getElementById("org.dbyzero.deimos.messageArea").style.display = "block";
				setTimeout(function(){
					document.getElementById("org.dbyzero.deimos.messageArea").style.width = "190px";
				}
				,0);
			}
		};

		this.bind();
		this.maxConsoleRow = 100 ;
	}

	deimos.render.UI.prototype = {
		bind: function() {
			EventManager.register('org.dbyzero.deimos.console.write',this.addmessage.bind(this)) ;
			EventManager.register('org.dbyzero.deimos.console.writeError',this.addmessageError.bind(this)) ;
			EventManager.register('org.dbyzero.deimos.network.logged',this.onLogged.bind(this)) ;
			document.getElementById('org.dbyzero.deimos.gamePopup.formChooseAvatar').onclick = this.onAvatarChoosed.bind(this) ;
		},

		unbind : function(e) {
			EventManager.unregister('org.dbyzero.deimos.console.write');
			EventManager.unregister('org.dbyzero.deimos.console.writeError');
			EventManager.unregister('org.dbyzero.deimos.network.avatar_selected');
			EventManager.unregister('org.dbyzero.deimos.network.logged');
			// document.getElementById(deimos.Config.ui.disconnectDomId).onclick = null ;
		},

		//add a message to ui log
		addmessage : function(e) {
			var msgZone = document.getElementById(deimos.Config.ui.chatDomId) ;

			var dom_elem = document.createElement("li");
			dom_elem.innerText = e.detail.message ;
				msgZone.appendChild(dom_elem) ;
			this.cropConsoleRow(this.maxConsoleRow) ;
		},

		//add error message on ui
		addmessageError : function(e) {
			var msgZone = document.getElementById(deimos.Config.ui.chatDomId) ;
			document.getElementById('org.dbyzero.deimos.gamePopup.message').style.backgroundColor = 'red' ;
			document.getElementById('org.dbyzero.deimos.gamePopup.message').style.borderColor = 'red' ;
			setTimeout(function(){
				document.getElementById('org.dbyzero.deimos.gamePopup.message').style.backgroundColor = '#ebd3ad' ;
				document.getElementById('org.dbyzero.deimos.gamePopup.message').style.borderColor = '#AF9D7F' ;
			},250);

			var dom_elem = document.createElement("li");
			dom_elem.className = 'error' ;
			dom_elem.innerText = e.detail.message ;
				msgZone.appendChild(dom_elem) ;
			this.cropConsoleRow(this.maxConsoleRow) ;
		},

		//clear what I cannot see
		cropConsoleRow : function(max) {
			var msgZone = document.getElementById(deimos.Config.ui.chatDomId) ;
			while(msgZone.getElementsByTagName('li').length > max) {
				msgZone.childNodes[0].remove();
			}
			msgZone.scrollTop = msgZone.scrollHeight;
		},

		updateLag : function(lag) {
			document.getElementById(deimos.Config.ui.indication.lag).innerHTML = lag+'ms';
		},

		updateFPS : function(fps) {
			var nbrIntegrate = 50;
			deimos.Engine.pastFPS.unshift(fps);
			deimos.Engine.pastFPS.length = Math.min(deimos.Engine.pastFPS.length,nbrIntegrate);
			var interpolatedFPS = parseInt(deimos.Engine.pastFPS.reduce(function(p,c){return p+c;})/nbrIntegrate);
			document.getElementById(deimos.Config.ui.indication.fps).innerHTML = interpolatedFPS;
		},

		//show list of avatar
		onLogged: function(e) {
			var _t = deimos.Engine._t;

			//adding avatar choice
			var i = 0 ;
			var avatars = e[_t.MESSAGE][_t.AVATARS];
			for(avatar in avatars) {
				var option = new Option(avatars[avatar][_t.NAME],avatars[avatar][_t.ID]);;
				document.getElementById('org.dbyzero.deimos.gamePopup.avatarList').appendChild(option) ;
				i++;
			}

			document.getElementById('org.dbyzero.deimos.gamePopup.avatarList').selectedIndex = 0;
			// document.getElementById(deimos.Config.ui.chooseAvatar.sectionDomId).style.display = 'block' ;
			EventManager.fire("org.dbyzero.deimos.console.write",{"detail":{"message":"Authenticated to the server"}});
		},

		onAvatarChoosed : function(event){
			var _t = deimos.Engine._t;
			var avatar = null;
			
			var list_avatar = document.getElementById('org.dbyzero.deimos.gamePopup.avatarList');
			if(!!list_avatar.options[list_avatar.selectedIndex]) {
				avatar = list_avatar.options[list_avatar.selectedIndex].value;
			}

			if(!!avatar) {
				EventManager.fire("org.dbyzero.deimos.ui.avatarSelected",avatar);
			} else {
				EventManager.fire("org.dbyzero.deimos.console.write",{"detail":{"message":"Unknow avatar"}});
			}
		},
	}
})(org.dbyzero.deimos, document);
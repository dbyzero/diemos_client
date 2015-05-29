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
		'<section id="org.dbyzero.deimos.gamePopup.main" style="background-color:#ebd3ad;width:200px;position:fixed;top:0px;left:0px;border:1px solid #9e6111;border-radius:5px;z-index:15;cursor:pointer">'+
			'<header style="width:194px;background-color:#fee895;height:20px;font-family:Arial;padding:3px;font-size:15px;border-radius:5px">'+
				'Deimos - <span style="font-style:italic">alpha</span>'+
				'<div id="org.dbyzero.deimos.gamePopup.message" style="transition:background-color 0.25s, border 0.25s;float:right;background-color:#ebd3ad;width:13px;height: 18px;border-right: 5px #AF9D7F solid;cursor:pointer"></div>'+
			'</header>'+
			'<section id="org.dbyzero.deimos.gamePopup.sectionLogin" style="display:block">'+
				'<form action="" method="post" id="org.dbyzero.deimos.gamePopup.loginForm" name="org.dbyzero.deimos.gamePopup.loginForm">'+
					'<input type="text" value="lolo" style="border:1px solid #333;background-color:#fff;margin:15px 0 0 15px;" placeholder=" login" id="org.dbyzero.deimos.gamePopup.loginInput"/>'+
					'<input type="password" value="toto" style="border:1px solid #333;background-color:#fff;margin:5px 0 0 15px;" placeholder=" password" id="org.dbyzero.deimos.gamePopup.passwordInput"/>'+
					'<input type="submit" style="border:1px solid #333;background-color:#fff;margin:5px 0 10px 15px;cursor:pointer" value=" login"/>'+
				'</form>'+
			'</section>'+
			'<section id="org.dbyzero.deimos.gamePopup.sectionChooseAvatar" style="font-size:10px;display:none">'+
				'<form name="org.dbyzero.deimos.gamePopup.formChooseAvatar" method="post" action="" id="org.dbyzero.deimos.gamePopup.formChooseAvatar">'+
					'<select id="org.dbyzero.deimos.gamePopup.avatarList" name="choose_avatar" style="border:1px solid #333;background-color:#fff;margin:8px 0 8px 5px;width:105px" size="5"></select>'+
					'<input id="" type="submit" value="Choose" style="border:1px solid #333;background-color:#fff;margin:0x; position: absolute; bottom: 55px; right: 4px;"> '+
				'</form>'+
			'</section>'+
			'<input type="button" value="logout" id="org.dbyzero.deimos.gamePopup.disconnect" style="border:1px solid #333;background-color:#fff;margin:4px 0 0 15px; position: absolute;top:0px;right:32px;cursor:pointer;display:none">'+
			'<footer style="width:194px;background-color:#FFFAED;height:20px;font-family:Arial;padding:3px;font-size:10px;border-radius:5px;margin-bottom:0px;">'+
				'<span>SERVER : <span style="width: 8px; height: 8px; background-color: red; display: inline-block; border-radius: 4px; margin: 1px 0 -1px 0;" id="org.dbyzero.deimos.gamePopup.indicatorServer"></span></span>'+
				' | <span>CONNECTION : <span style="width: 8px; height: 8px; background-color: red; display: inline-block; border-radius: 4px; margin: 1px 0 -1px 0;" id="org.dbyzero.deimos.gamePopup.indicatorConnected"></span></span>'+
				'<br/>'+
				'<span>v'+deimos.version+' | '+
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
		messageAreaElement.style.zIndex = '14';
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
				var translation = "translate3d("+parseInt(popup.style.left.slice(0,-2)) - (parseInt(oldX) - e.x)+"px," +
									parseInt(popup.style.top.slice(0,-2)) - (parseInt(oldY) - e.y)+"px,0px)";
				popup.style.transform = translation;
				popup.style.webkitTransform = translation;

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

		document.getElementById(deimos.Config.ui.login.formDomId).onsubmit = this.onLogin.bind(this) ;
		document.getElementById(deimos.Config.ui.chooseAvatar.formDomId).onsubmit = this.onAvatarChoosed.bind(this) ;
		document.getElementById(deimos.Config.ui.disconnectDomId).onclick = this.onLogout.bind(this) ;

		this.maxConsoleRow = 100 ;

		//focus on login
		document.getElementById(deimos.Config.ui.login.inputLoginDomId).focus();
	}

	deimos.render.UI.prototype = {
		bind: function() {
			EventManager.register('org.dbyzero.deimos.network.logged',this.logged.bind(this)) ;
			EventManager.register('org.dbyzero.deimos.network.connected',this.connected.bind(this)) ;
			EventManager.register('org.dbyzero.deimos.network.disconnected',this.disconnected.bind(this)) ;
			EventManager.register('org.dbyzero.deimos.network.loggout',this.loggout.bind(this)) ;

			EventManager.register('org.dbyzero.deimos.console.write',this.addmessage.bind(this)) ;
			EventManager.register('org.dbyzero.deimos.console.writeError',this.addmessageError.bind(this)) ;
			EventManager.register('org.dbyzero.deimos.network.avatar_selected',this.avatarSelected) ;
		},

		unbind : function(e) {
			EventManager.unregister('org.dbyzero.deimos.network.logged');
			EventManager.unregister('org.dbyzero.deimos.network.connected');
			EventManager.unregister('org.dbyzero.deimos.network.disconnected');
			EventManager.unregister('org.dbyzero.deimos.network.loggout');
			EventManager.unregister('org.dbyzero.deimos.console.write');
			EventManager.unregister('org.dbyzero.deimos.console.writeError');
			EventManager.unregister('org.dbyzero.deimos.network.avatar_selected');
		},
		//show we are connected on UI
		connected : function(e) {
			document.getElementById(deimos.Config.ui.indication.serverStatus).style.backgroundColor = 'green' ;
			EventManager.fire("org.dbyzero.deimos.console.write",{"detail":{"message":"Connected"}});
		},

		//show we are disconnected on UI
		disconnected : function(e) {
			document.getElementById(deimos.Config.ui.indication.serverStatus).style.backgroundColor = 'red' ;
			this.loggout();
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
		logged: function(e) {
			var _t = deimos.Engine._t;

			//changing states
			document.getElementById(deimos.Config.ui.indication.serverStatus).style.backgroundColor = 'green' ;
			document.getElementById(deimos.Config.ui.indication.connectionStatus).style.backgroundColor = 'green' ;
			document.getElementById(deimos.Config.ui.login.sectionDomId).style.display = 'none' ;
			document.getElementById(deimos.Config.ui.disconnectDomId).style.display = 'block' ;

			//adding avatar choice
			var i = 0 ;
			var avatars = e[_t.MESSAGE][_t.AVATARS];
			for(avatar in avatars) {
				var option = new Option(avatars[avatar][_t.NAME],avatars[avatar][_t.ID]);;
				document.getElementById(deimos.Config.ui.chooseAvatar.avatarListDomId).appendChild(option) ;
				i++;
			}

			document.getElementById(deimos.Config.ui.chooseAvatar.avatarListDomId).selectedIndex = 0;
			document.getElementById(deimos.Config.ui.chooseAvatar.sectionDomId).style.display = 'block' ;
			EventManager.fire("org.dbyzero.deimos.console.write",{"detail":{"message":"Authenticated to the server"}});
		},

		//show we are logout
		loggout : function(e) {
			console.log('Clean UI');
			if(document.getElementById(deimos.Config.ui.indication.connectionStatus)) document.getElementById(deimos.Config.ui.indication.connectionStatus).style.backgroundColor = 'red' ;
			if(document.getElementById(deimos.Config.ui.login.sectionDomId)) document.getElementById(deimos.Config.ui.login.sectionDomId).style.display = 'block' ;
			if(document.getElementById(deimos.Config.ui.disconnectDomId)) document.getElementById(deimos.Config.ui.disconnectDomId).style.display = 'none' ;
			if(document.getElementById(deimos.Config.ui.chooseAvatar.sectionDomId)) document.getElementById(deimos.Config.ui.chooseAvatar.sectionDomId).style.display = 'none' ;
			if(document.getElementById(deimos.Config.ui.indication.lag)) document.getElementById(deimos.Config.ui.indication.lag).innerHTML = 'n/a' ;
			if(document.getElementById(deimos.Config.ui.indication.fps)) document.getElementById(deimos.Config.ui.indication.fps).innerHTML = 'n/a' ;
			if(document.getElementById(deimos.Config.ui.chooseAvatar.avatarListDomId)) document.getElementById(deimos.Config.ui.chooseAvatar.avatarListDomId).innerHTML = '' ;

			var main = document.getElementById('org.dbyzero.deimos.gamePopup.main');
			if(main) main.parentNode.removeChild(main);

			var messageArea = document.getElementById('org.dbyzero.deimos.messageArea');
			if(main) messageArea.parentNode.removeChild(messageArea);

			this.unbind();
			EventManager.fire("org.dbyzero.deimos.console.write",{"detail":{"message":"Disconnected"}});
		},

		onLogout : function(event){
			var message = {};
			var _t = deimos.Engine._t;
			message[_t.ACTION] = _t.ACTION_LOGOUT;
			message[_t.MESSAGE] = {};
			EventManager.fire("org.dbyzero.deimos.network.sendMessage",message);
			EventManager.fire("org.dbyzero.deimos.network.loggout");
			event.preventDefault();
		},

		onLogin : function(event){
			var login = document.getElementById(deimos.Config.ui.login.inputLoginDomId).value;
			var password = CryptoJS.MD5(document.getElementById(deimos.Config.ui.login.inputPasswordDomId).value).toString(CryptoJS.enc.Hex);
			var message = {};
			var _t = deimos.Engine._t;
			message[_t.ACTION] = _t.LOGIN;
			message[_t.MESSAGE] = {};
			message[_t.MESSAGE][_t.LOGIN] = login;
			message[_t.MESSAGE][_t.PASSWORD] = password;
			message[_t.MESSAGE][_t.MESSAGE_CURRENT_URL] = window.location.href;

			EventManager.fire("org.dbyzero.deimos.network.sendMessage",message);
			event.preventDefault();
		},

		onAvatarChoosed : function(event){
			var _t = deimos.Engine._t;
			var avatar = null;
			
			var list_avatar = document.forms[deimos.Config.ui.chooseAvatar.formDomId].choose_avatar ;
			if(!!list_avatar.options[list_avatar.selectedIndex]) {
				avatar = list_avatar.options[list_avatar.selectedIndex].value;
			}

			if(!!avatar) {
				var e = {} ;
				e[_t.ACTION] = _t.ACTION_CHOOSE_CHAR;
				e[_t.MESSAGE] = {};
				e[_t.MESSAGE][_t.MESSAGE_CHAR] = avatar;

				EventManager.fire("org.dbyzero.deimos.network.sendMessage",e);
			} else {
				EventManager.fire("org.dbyzero.deimos.console.write",{"detail":{"message":"Unknow avatar"}});
			}
			event.preventDefault();

		},

		//avatar is selected and confirmed by the backend
		avatarSelected: function(e) {
			var _t = deimos.Engine._t;
			if(!!e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.MESSAGE_ELEMENT_ID]) {
				document.getElementById(deimos.Config.ui.chooseAvatar.sectionDomId).style.display = 'none' ;
				EventManager.fire("org.dbyzero.deimos.network.gameStarted",e);
			} else {
				EventManager.fire("org.dbyzero.deimos.console.write",{"detail":{"message":"Avatar has no id "}});
			}
		}

	}
})(org.dbyzero.deimos, document);
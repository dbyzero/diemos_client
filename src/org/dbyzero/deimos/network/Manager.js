/**
 *
 * org.dbyzero.deimos.network.Manager Object
 *
 * @author dbyzero
 * @date : 2013/08/09
 * @description : Config of the application
 *
 * */

var org = org || {} ;
org.dbyzero = org.dbyzero || {} ;
org.dbyzero.deimos = org.dbyzero.deimos || {} ;

(function(deimos,document,undefined) {

	var EventManager = org.dbyzero.tools.EventManager;

	deimos.network = org.dbyzero.deimos.network || {} ;
	
	deimos.network.Manager = function() {
		//stub
	}

	//Can be use as an id too
	deimos.network.Manager.count = 0 ;

	deimos.network.Manager.prototype = {
		"init" : function() {
			//connection events
			EventManager.register('org.dbyzero.deimos.network.receivedMessage',this.receivedMessage.bind(this)) ;
			EventManager.register('org.dbyzero.deimos.network.sendMessage',this.sendMessage.bind(this)) ;
			EventManager.register('org.dbyzero.deimos.network.sendSync',this.sendSync.bind(this)) ;
		},
		"destroy" : function() {
			EventManager.unregister('org.dbyzero.deimos.network.receivedMessage') ;
			EventManager.unregister('org.dbyzero.deimos.network.sendMessage') ;
			EventManager.unregister('org.dbyzero.deimos.network.sendSync') ;
		},
		"receivedMessage" : function(e) {
			var _t = deimos.Engine._t;
			switch(e[_t.ACTION]) {
				case _t.ACTION_LOGGED_OK :
					if(e[_t.MESSAGE][_t.SESSION_ID] === undefined) {
						EventManager.fire("org.dbyzero.deimos.console.writeError",{"detail":{"message":"Error : Auth but no session id ? wtf ?"}});
						return ;
					}
					deimos.Engine.wsClient.session_id = e[_t.MESSAGE][_t.SESSION_ID];
					EventManager.fire('org.dbyzero.deimos.network.logged',e);
					break ;
				case _t.ACTION_CHOOSE_CHAR_OK :
					EventManager.fire("org.dbyzero.deimos.network.avatarSelectionConfirmed",e);
					break ;
				case _t.ACTION_ERROR :
					EventManager.fire("org.dbyzero.deimos.console.writeError",{"detail":{"message":"Error : "+JSON.stringify(e[_t.MESSAGE])}});
					break ;
				case _t.ACTION_SYNC :
					EventManager.fire("org.dbyzero.deimos.render.parseScene",e);
					break ;
				case _t.ACTION_SYNC_AVATAR :
					EventManager.fire("org.dbyzero.deimos.network.syncAvatar",e);
					break ;
				case _t.ACTION_SYNC_ITEM :
					EventManager.fire("org.dbyzero.deimos.network.syncItem",e);
					break ;
				case _t.ACTION_GET_ITEM_TEMPLATE :
					this.receivedItem(e);
					break ;
				case _t.ACTION_SYNC_PROJECTILE :
					EventManager.fire("org.dbyzero.deimos.network.syncProjectile",e);
					break ;
				case _t.ACTION_SYNC_MONSTER :
					EventManager.fire("org.dbyzero.deimos.network.syncMonster",e);
					break ;
				case _t.ACTION_REMOVE_PROJECTILE :
					EventManager.fire("org.dbyzero.deimos.network.removeProjectile",e);
					break ;
				case _t.ACTION_COLLIDE :
					EventManager.fire("org.dbyzero.deimos.network.actionCollide",e);
					break ;
				case _t.ACTION_ITEM_GRABBED :
					EventManager.fire("org.dbyzero.deimos.network.itemGrabbed",e);
					break ;
				case _t.ACTION_SYNC_ATTACK_ZONE :
					EventManager.fire("org.dbyzero.deimos.network.syncAttackZone",e);
					break ;
				default :
					EventManager.fire("org.dbyzero.deimos.console.writeError",{"detail":{"message":"Unknow status : "+JSON.stringify(e)}});
					break ;
			}
		},

		receivedItem: function(msg){
			var _t = deimos.Engine._t;
			var m = msg[_t['MESSAGE']];
			this.storeItemFromServer(m);
		},

		storeItemFromServer: function(item){
			var _t = deimos.Engine._t;
			var i = {};
			i.id = item[_t['ID']];
			i.name = item[_t['NAME']];
			i.kind = item[_t['MESSAGE_KIND']];
			i.size = item[_t['MESSAGE_SIZE']];
			i.skin = item[_t['MESSAGE_SKIN']];
			i.attack = item[_t['MESSAGE_ATTACK']];
			i.deltashow = item[_t['MESSAGE_DELTASHOW']];
			EventManager.fire("org.dbyzero.deimos.Engine.newItemStored."+i.id,i);
			deimos.Engine.itemTemplates[i.id] = i;
		},


		"sendActionMessage" : function(e) {
			if(typeof e.action !== 'string') {
				Log.error('Keyboard event not set to send message to server') ;
				return false;
			}
			this.sendMessage({'message':{'action':{'type':'keyboardEvent','event':e.action}}});
		},



		"sendMessage" : function(e) {
			//set date et session_id
			var _t = deimos.Engine._t;
			e[_t.SESSION_ID]	= deimos.Engine.wsClient.session_id;
			e[_t.TRACE_ID]		= deimos.network.Manager.count++;
			e[_t.DATE]			= Date.now();

			var data = {};
			data.message = e;

			if(deimos.Engine.wsClient === undefined) {
				throw new Error('Connection not ready');
			}

			// if(deimos.Engine.wsClient.readyState === WebSocket.CONNECTING) {
				// deimos.Engine.wsClient.onOpen = function() {
					console.log(deimos.Engine.wsClient);
					deimos.Engine.wsClient.send(data)
			// 	}
			// } else {
			// 	deimos.Engine.wsClient.send(data)
			// }
		},


		"askItemTemplate" : function(item_id, callback) {
			var _t = deimos.Engine._t;
			var message = {};
			message[_t.ACTION] = _t.ACTION_GET_ITEM_TEMPLATE;
			message[_t.MESSAGE] = {};
			message[_t.MESSAGE][_t.MESSAGE_ITEM_ID] = item_id;
			this.sendMessage(message);
		},


		"sendSync" : function(e) {
			var _t = deimos.Engine._t;
			var message = {};
			message[_t.ACTION] = _t.ACTION_SYNC;
			message[_t.MESSAGE] = {};
			message[_t.MESSAGE][_t.MESSAGE_SAYING] = deimos.Engine.avatar.saying;
			message[_t.MESSAGE][_t.MESSAGE_POSITION] = {
				'x':parseInt(deimos.Engine.avatar.position.x),
				'y':parseInt(deimos.Engine.avatar.position.y)
			};
			this.sendMessage(message);
		},


		//Handle success action from server here
		"successAction" : function(e) {
			switch(e.action) {
				case "info" :
					EventManager.fire("org.dbyzero.deimos.console.write",{"detail":{"message":"Info from server : "+JSON.stringify(data.message)}});
					break;
				default :
					EventManager.fire("org.dbyzero.deimos.console.write",{"detail":{"message":"Unknow action : "+JSON.stringify(data)}});
					break;
			}
		}
	}
})(org.dbyzero.deimos, document);
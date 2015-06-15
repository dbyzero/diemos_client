/**
 *
 * org.dbyzero.deimos.Engine Object
 *
 * @author dbyzero
 * @date : 2013/08/04
 * @description : Engine class manage the application
 *
 **/

(function(deimos,document,undefined) {

	/**
	 * org.dbyzero.deimos.Engine initializer
	 * 
	 * @param string wsUrl URL of websocket server
	 * @param string wsPort port of websocket server
	 * @param EngineMode Mode of the client, can be EngineMode.DEBUG to show logs
	 *
	 * */

	var KeyboardController = org.dbyzero.tools.KeyboardController;
	var EventManager = org.dbyzero.tools.EventManager;

	//used to translation
	var _t = null;

	deimos.Engine = {
		running : false,
		start : function (config){
			deimos.Engine.running = false;

			//Dom element Id where the game append 
			deimos.Engine.domId = config.domId;

			//making UI
			deimos.Engine.ui = new deimos.render.UI() ;
			deimos.Engine.lastUpdate = null;
			deimos.Engine.lastSync = null;
			deimos.Engine.needSync = false;
			deimos.Engine.itemTemplates = {}; 
			deimos.Engine.pastFPS = [];

			//stocking asset access
			deimos.Engine.assetURL = config.serverAssetURL;

			deimos.Engine._t = deimos.network.Message.CODE[deimos.Config.messageLevel];

			//set runlevel
			deimos.Engine.mode = ( 
				deimos.Config.mode == "debug" ? 
				deimos.Engine.Mode.DEBUG 
				: deimos.Engine.Mode.PROD 
			) ;

			//making network manager
			deimos.Engine.networkManager = new deimos.network.Manager();
			deimos.Engine.networkManager.init();

			//making main loop
			deimos.Engine.loop = new org.dbyzero.tools.Loop('main_loop',parseInt(1000/deimos.Config.FPS)) ;


			//setting websocket server
			deimos.Engine.wsUrl = config.serverURL;
			deimos.Engine.wsPort = config.serverPort ;
			deimos.Engine.wsClient = new deimos.network.WebsocketClient(deimos.Engine.wsUrl,deimos.Engine.wsPort,deimos.Engine.mode);

			//making scene
			deimos.Engine.scene = new deimos.render.Scene();

			bindEngineEvent();

			//login by token
			deimos.Engine.wsClient.connect() ;
			deimos.Engine.wsClient.session_id = config.sessionId;
			var _t = deimos.Engine._t;
			var message = {};
			message[_t['ACTION']] = _t['AUTH_BY_TOKEN'];
			message[_t['MESSAGE']] = {};
			deimos.Engine.networkManager.sendMessage(message);
		},

		stop: function (){
			//do nothing if already stopped
			// if(deimos.Engine.running === false) return;

			deimos.Engine.running = false;
			unbindGameEventKey();
			unbindEngineEvent();

			if(deimos.Engine.loop)
				deimos.Engine.loop.stop() ;

			if(deimos.Engine.avatar)
				deimos.Engine.avatar.cleanDom();

			if(deimos.Engine.scene)
				deimos.Engine.scene.destroy();

			if(deimos.Engine.networkManager)
				deimos.Engine.networkManager.destroy();

			if(deimos.Engine.ui)
				deimos.Engine.ui.loggout() ;

			if(deimos.Engine.zone)
				deimos.Engine.zone.destroy() ;

			if(deimos.Engine.wsClient)
				deimos.Engine.wsClient.close();

			delete deimos.Engine.avatar;
			delete deimos.Engine.zone;
			delete deimos.Engine.ui;
			delete deimos.Engine.pastFPS;
			delete deimos.Engine.itemTemplates; 
			delete deimos.Engine.needSync;
			delete deimos.Engine.lastSync;
			delete deimos.Engine.lastUpdate;
			delete deimos.Engine.assetURL;
			delete deimos.Engine._t;
			delete deimos.Engine.mode;
			delete deimos.Engine.networkManager;
			delete deimos.Engine.wsClient;
			delete deimos.Engine.scene;
			delete deimos.Engine.wsPort;
			delete deimos.Engine.wsUrl;
			delete deimos.Engine.loop;
		},

		keyHandlerUp: function(e){
			evtobj = window.event? event : e
			keyCode = evtobj.keyCode ;
		},

		keyHandlerDown: function(e){
		},

		/**
		 * MAIN GAME LOOP
		 */
		update: function(){
			if(deimos.Engine.running === false) return;

			//time things
			if(deimos.Engine.lastUpdate === null)
			{
				deimos.Engine.lastUpdate = new Date().getTime();
			}
			var now = new Date().getTime();
			var dt = now - deimos.Engine.lastUpdate;
			deimos.Engine.scene.update(dt,now) ;
			deimos.Engine.lastUpdate += dt;

			//sync things
			if(deimos.Engine.lastSync === null)
			{
				deimos.Engine.lastSync = new Date().getTime();
			}
			if(deimos.Engine.lastSync + deimos.Config.DELTA_SERVER_SYNC < now)
			{
				if(deimos.Engine.avatar !== undefined) {
					EventManager.fire("org.dbyzero.deimos.network.sendSync");
					deimos.Engine.lastSync = now;
				}
			}
		},

		initGameArea: function(e) {
			var _t = deimos.Engine._t;
			deimos.Engine.zone = new deimos.element.Zone(
				deimos.Engine.domId,
				e[_t.MESSAGE][_t.MESSAGE_GAME_AREA_NAME],
				e[_t.MESSAGE][_t.MESSAGE_GAME_AREA_WIDTH],
				e[_t.MESSAGE][_t.MESSAGE_GAME_AREA_HEIGHT],
				e[_t.MESSAGE][_t.MESSAGE_GAME_AREA_BLOCKS]
			);
		},

		startGame: function(e) {
			var _t = deimos.Engine._t;
			var skin					= e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.MESSAGE_SKIN];
			var id						= e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.MESSAGE_ELEMENT_ID];
			var name					= e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.NAME];
			var size					= e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.MESSAGE_SIZE];
			var deltashow				= e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.MESSAGE_DELTASHOW];
			var position				= e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.MESSAGE_POSITION];
			var move_speed				= e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.MESSAGE_MOVE_SPEED];
			var jump_speed				= e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.MESSAGE_JUMP_SPEED];
			var item_slot_head			= e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.ITEM_SLOT_HEAD];
			var item_slot_foot			= e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.ITEM_SLOT_FOOT];
			var item_slot_chest			= e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.ITEM_SLOT_CHEST];
			var item_slot_left_hand		= e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.ITEM_SLOT_LEFT_HAND];
			var item_slot_right_hand	= e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.ITEM_SLOT_RIGHT_HAND];
			var oriented				= e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.MESSAGE_ANIMATION][_t.MESSAGE_DIRECTION];
			//make avatar
			deimos.Engine.avatar = new deimos.element.Avatar(name,
				new org.dbyzero.tools.Vector(
					parseInt(position.x),
					parseInt(position.y)
				),
				//size from server because it's needed for collisions
				new org.dbyzero.tools.Vector(
					parseInt(size.x),
					parseInt(size.y)
				),
				id,
				deltashow,
				e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.MESSAGE_MASS]
			);
			deimos.Engine.avatar.maxHP = e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.MESSAGE_HP];
			deimos.Engine.avatar.HP = e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.MESSAGE_CURRENT_HP];

			if(parseInt(item_slot_head) > 0)
			{
				deimos.Engine.storeItemFromServer(e[_t.MESSAGE][_t.MESSAGE_ITEMS][_t.ITEM_SLOT_HEAD]);
			}
			if(parseInt(item_slot_foot) > 0)
			{
				deimos.Engine.storeItemFromServer(e[_t.MESSAGE][_t.MESSAGE_ITEMS][_t.ITEM_SLOT_FOOT]);
			}
			if(parseInt(item_slot_chest) > 0)
			{
				deimos.Engine.storeItemFromServer(e[_t.MESSAGE][_t.MESSAGE_ITEMS][_t.ITEM_SLOT_CHEST]);
			}
			if(parseInt(item_slot_left_hand) > 0)
			{
				deimos.Engine.storeItemFromServer(e[_t.MESSAGE][_t.MESSAGE_ITEMS][_t.ITEM_SLOT_LEFT_HAND]);
			}
			if(parseInt(item_slot_right_hand) > 0)
			{
				deimos.Engine.storeItemFromServer(e[_t.MESSAGE][_t.MESSAGE_ITEMS][_t.ITEM_SLOT_RIGHT_HAND]);
			}

			deimos.Engine.avatar.move_speed = move_speed;
			deimos.Engine.avatar.jump_speed = jump_speed;
			deimos.Engine.avatar.item_slot_head = item_slot_head;
			deimos.Engine.avatar.item_slot_foot = item_slot_foot;
			deimos.Engine.avatar.item_slot_chest = item_slot_chest;
			deimos.Engine.avatar.item_slot_left_hand = item_slot_left_hand;
			deimos.Engine.avatar.item_slot_right_hand = item_slot_right_hand;
			deimos.Engine.avatar.oriented = oriented;
			deimos.Engine.avatar.skin = skin;
			deimos.Engine.avatar.init();
			bindGameEventKey();

			//starting
			deimos.Engine.running = true;
			deimos.Engine.scene.dataToParse = e[_t.MESSAGE][_t.ACTION_SYNC];
			deimos.Engine.loop.start(deimos.Engine.update.bind(deimos.Engine));
		},

		getItemTemplate : function(itemId, callback) {
			//if not yet get, we ask for it, else, load the callback
			if(deimos.Engine.itemTemplates[itemId] === undefined) {
				deimos.Engine.networkManager.askItemTemplate(itemId);
				EventManager.register('org.dbyzero.deimos.Engine.newItemStored.'+itemId,function(item) {
					EventManager.unregister('org.dbyzero.deimos.Engine.newItemStored.'+itemId);
					callback(item);
				});
			} else {
				callback(deimos.Engine.itemTemplates[itemId]);
			}
		},

		onAvatarSelected : function(avatar) {
			var _t = deimos.Engine._t;
			var e = {} ;
			e[_t.ACTION] = _t.ACTION_CHOOSE_CHAR;
			e[_t.MESSAGE] = {};
			e[_t.MESSAGE][_t.MESSAGE_CHAR] = avatar;
			deimos.Engine.networkManager.sendMessage(e);
		},

		//avatar is selected and confirmed by the backend
		avatarSelectionConfirmed: function(e) {
			var _t = deimos.Engine._t;
			if(!!e[_t.MESSAGE][_t.MESSAGE_CHAR][_t.MESSAGE_ELEMENT_ID]) {
				document.getElementById(deimos.Config.ui.chooseAvatar.sectionDomId).style.display = 'none' ;
				EventManager.fire("org.dbyzero.deimos.engine.gameStarted",e);
			} else {
				EventManager.fire("org.dbyzero.deimos.console.write",{"detail":{"message":"Avatar has no id "}});
			}
		}
	}

	//private function
	var unbindEngineEvent = function(){
		EventManager.unregister('org.dbyzero.deimos.engine.gameStarted');
		EventManager.unregister('org.dbyzero.deimos.network.connected');
		EventManager.unregister('org.dbyzero.deimos.network.disconnected');
		EventManager.unregister('org.dbyzero.deimos.network.loggout');
		EventManager.unregister('org.dbyzero.deimos.network.logged') ;
		EventManager.unregister('org.dbyzero.deimos.ui.avatarSelected') ;
		EventManager.unregister('org.dbyzero.deimos.network.avatarSelectionConfirmed') ;
	}


	var bindEngineEvent = function(){
		EventManager.register('org.dbyzero.deimos.network.connected',function() {
			//for now we restart loop when it's needed
			// deimos.Engine.loop.start(deimos.Engine.update.bind(deimos.Engine)) ;
		});

		EventManager.register('org.dbyzero.deimos.engine.gameStarted',deimos.Engine.startGame);

		EventManager.register('org.dbyzero.deimos.network.disconnected',deimos.Engine.stop);
		EventManager.register('org.dbyzero.deimos.network.loggout',deimos.Engine.stop);

		EventManager.register('org.dbyzero.deimos.network.logged',deimos.Engine.initGameArea) ;


		EventManager.register('org.dbyzero.deimos.ui.avatarSelected',deimos.Engine.onAvatarSelected) ;
		EventManager.register('org.dbyzero.deimos.network.avatarSelectionConfirmed',deimos.Engine.avatarSelectionConfirmed) ;
	}


	//private function
	var unbindGameEventKey = function(){
		EventManager.unregister('org.dbyzero.tools.KeyboardController.keyPressed.'+KeyboardController.keys.ENTER);
		EventManager.unregister('org.dbyzero.tools.KeyboardController.keyPressed.'+KeyboardController.keys.SPACE);
		EventManager.unregister('org.dbyzero.tools.KeyboardController.keyPressed.'+KeyboardController.keys.ARROW_LEFT);
		EventManager.unregister('org.dbyzero.tools.KeyboardController.keyPressed.'+KeyboardController.keys.ARROW_RIGHT);
		EventManager.unregister('org.dbyzero.tools.KeyboardController.keyPressed.'+KeyboardController.keys.ARROW_DOWN);
		EventManager.unregister('org.dbyzero.tools.KeyboardController.keyPressed.'+KeyboardController.keys.ARROW_UP);
		EventManager.unregister('org.dbyzero.tools.KeyboardController.keyPressed.'+KeyboardController.keys.X);
		EventManager.unregister('org.dbyzero.tools.KeyboardController.keyPressed.'+KeyboardController.keys.n1);
		EventManager.unregister('org.dbyzero.tools.KeyboardController.keyPressed.'+KeyboardController.keys.n2);
		EventManager.unregister('org.dbyzero.tools.KeyboardController.keyReleased.'+KeyboardController.keys.ARROW_LEFT);
		EventManager.unregister('org.dbyzero.tools.KeyboardController.keyReleased.'+KeyboardController.keys.ARROW_RIGHT);
		EventManager.unregister('org.dbyzero.tools.KeyboardController.keyReleased.'+KeyboardController.keys.ARROW_DOWN);
		EventManager.unregister('org.dbyzero.deimos.avatar.move.left');
		EventManager.unregister('org.dbyzero.deimos.avatar.move.right');
		EventManager.unregister('org.dbyzero.deimos.avatar.move.left.stop');
		EventManager.unregister('org.dbyzero.deimos.avatar.move.right.stop');
		EventManager.unregister('org.dbyzero.deimos.avatar.jump');
		EventManager.unregister('org.dbyzero.deimos.avatar.speak');
		EventManager.unregister('org.dbyzero.deimos.avatar.speak.stop');

		/**
		 * For Test
		 */
		EventManager.unregister('org.dbyzero.deimos.test.popitem');
	}


	//private function
	var bindGameEventKey = function(){
		//LEFT
		KeyboardController.addManagedKey(KeyboardController.keys.ENTER);
		KeyboardController.addManagedKey(KeyboardController.keys.SPACE);
		KeyboardController.addManagedKey(KeyboardController.keys.ARROW_LEFT);
		KeyboardController.addManagedKey(KeyboardController.keys.ARROW_RIGHT);
		KeyboardController.addManagedKey(KeyboardController.keys.ARROW_DOWN);
		KeyboardController.addManagedKey(KeyboardController.keys.ARROW_UP);
		KeyboardController.addManagedKey(KeyboardController.keys.X);
		KeyboardController.addManagedKey(KeyboardController.keys.n1);
		KeyboardController.addManagedKey(KeyboardController.keys.n2);

		EventManager.register('org.dbyzero.tools.KeyboardController.keyPressed.'+KeyboardController.keys.ENTER,function(){
			if(deimos.Engine.avatar.speaking) {
				EventManager.fire("org.dbyzero.deimos.avatar.speak.stop",{'action':'speak_stop'});
			} else {
				EventManager.fire("org.dbyzero.deimos.avatar.speak",{'action':'speak'});
			}
		});

		EventManager.register('org.dbyzero.tools.KeyboardController.keyPressed.'+KeyboardController.keys.ARROW_RIGHT,function(){
			if(!deimos.Engine.avatar.speaking) {
				EventManager.fire("org.dbyzero.deimos.avatar.move.right",{'action':'move_right'});
			}
		});

		EventManager.register('org.dbyzero.tools.KeyboardController.keyPressed.'+KeyboardController.keys.ARROW_LEFT,function(){
			if(!deimos.Engine.avatar.speaking) {
				EventManager.fire("org.dbyzero.deimos.avatar.move.left",{'action':'move_left'});
			}
		});

		//note : event is synchronizide on Avatar class when the engine really finish the move
		EventManager.register('org.dbyzero.tools.KeyboardController.keyReleased.'+KeyboardController.keys.ARROW_RIGHT,function(){
			if(!deimos.Engine.avatar.speaking) {
				EventManager.fire("org.dbyzero.deimos.avatar.move.right.stop",{'action':'move_right_stop'});
			}
		});

		//note : event is synchronizide on Avatar class when the engine really finish the move
		EventManager.register('org.dbyzero.tools.KeyboardController.keyReleased.'+KeyboardController.keys.ARROW_LEFT,function(){
			if(!deimos.Engine.avatar.speaking) {
				EventManager.fire("org.dbyzero.deimos.avatar.move.left.stop",{'action':'move_left_stop'});
			}
		});

		EventManager.register('org.dbyzero.tools.KeyboardController.keyPressed.'+KeyboardController.keys.ARROW_DOWN,function(){
			if(!deimos.Engine.avatar.speaking) {
				EventManager.fire("org.dbyzero.deimos.avatar.go.down",{'action':'go_down_active'});
			}
		});

		EventManager.register('org.dbyzero.tools.KeyboardController.keyReleased.'+KeyboardController.keys.ARROW_DOWN,function(){
			if(!deimos.Engine.avatar.speaking) {
				EventManager.fire("org.dbyzero.deimos.avatar.go.down.stop",{'action':'go_down_inactive'});
			}
		});

		EventManager.register('org.dbyzero.tools.KeyboardController.keyPressed.'+KeyboardController.keys.ARROW_UP,function(){
			if(!deimos.Engine.avatar.speaking) {
				EventManager.fire("org.dbyzero.deimos.avatar.jump",{'action':'jump'});
			}
		});

		EventManager.register('org.dbyzero.tools.KeyboardController.keyPressed.'+KeyboardController.keys.SPACE,function(){
			if(!deimos.Engine.avatar.speaking) {
				deimos.Engine.avatar.attack();
			}
		});
	}

	/**
	 * A Kind of enum for different modes
	 * 
	 * DEBUG shows a lot of log in browser
	 * PROD remove logs
	 *
	 * */
	deimos.Engine.Mode = {
		DEBUG : {value: 0, name:'debug'},
		PROD : {value: 1, name:'prod'}
	}
})(org.dbyzero.deimos, document);
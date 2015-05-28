/****
 *
 * org.dbyzero.deimos.network.WebsocketClient Object
 *
 * @author dbyzero
 * @date : 2013/05/04
 * @description : Use websocket to connect to distant server
 *
 **/
(function(deimos,document,undefined) {
	
	var EventManager = org.dbyzero.tools.EventManager;
	deimos.network = deimos.network || {} ;

	/**
	 * WebsocketClient constructor
	 * 
	 * @param string hostname of the remote websocket server
	 * @param int port of the remote websocket server
	 * @param WebsocketClientMode Mode of the client, can be WebsocketClientMode.DEBUG to show logs
	 *
	 * */
	deimos.network.WebsocketClient = function(hostname,port,mode) {
		this.retryConnection = null;
		this.server_hostname = hostname;
		this.server_port = port;
		this.connection_stream = 'ws://'+this.server_hostname+':'+this.server_port;

		this.server_connected = false;
		this.session_id = null;
	}


	deimos.network.WebsocketClient.prototype =  {
		/***
		 * Connection Method
		 * Use to connect to remote websocket server
		 *
		 * @return void
		 *
		 **/
		connect : function () {
			// if user is running mozilla then use it's built-in WebSocket
			window.WebSocket = window.WebSocket || window.MozWebSocket;

			var server_hostname = this.server_hostname ;
			var server_port = this.server_port ;

			var connection = new WebSocket(this.connection_stream);

			connection.onopen = this.onopen.bind(this) ;
			connection.onclose = this.onclose.bind(this) ;
			connection.onerror = this.onerror.bind(this) ;
			connection.onmessage = this.onmessage.bind(this) ;

			this.connection = connection ;
		},

		close : function () {
			// if user is running mozilla then use it's built-in WebSocket
			window.WebSocket = window.WebSocket || window.MozWebSocket;

			this.connection.close() ;
			delete this.connection ;
		},

		/***
		 * Send Message Method
		 *
		 * bind to Event org.dbyzero.deimos.network.sendMessage
		 * 
		 * @param Object trigged event
		 * @return void
		 *
		 **/
		send: function(e) {
			this.connection.send(JSON.stringify(e.message)) ;
		},

		tryRelog: function() {
			//try to reconnect each second
			//if(this.connection != null) this.connection.close() ;
			this.connection = new WebSocket(this.connection_stream);
			var relog = function(){
				EventManager.fire("org.dbyzero.deimos.console.write",{"detail":{"message":"Trying to reconnecting..."}});
				if(this.connection.readyState !== WebSocket.OPEN) {
					this.connection = new WebSocket(this.connection_stream);
				} else {
					this.connection.onopen = this.onopen.bind(this) ;
					this.connection.onclose = this.onclose.bind(this) ;
					this.connection.onerror = this.onerror.bind(this) ;
					this.connection.onmessage = this.onmessage.bind(this) ;

					EventManager.fire("org.dbyzero.deimos.network.connected",{});
					
					clearInterval(setintercalId) ;
				}
			} ;
			var setintercalId = setInterval(relog.bind(this),1000) ;
		},
		onopen: function (e) {
			EventManager.fire("org.dbyzero.deimos.network.connected",{});
			this.server_connected = true ;

			//check connection each 3s
			var poolAlive = function() {
				if(this.connection.readyState !== 1 && this.connection.server_connected == true) {
					EventManager.fire("org.dbyzero.deimos.console.write",{"detail":{"message":"Connection closed"}},{});
					EventManager.fire("org.dbyzero.deimos.network.disconnected",{});
					this.server_connected = false ;
				}
			} ;
			setInterval(poolAlive.bind(this), 3000);

		},
		onclose : function (e) {
			EventManager.fire("org.dbyzero.deimos.console.write",{"detail":{"message":"Connection closed"}});
			EventManager.fire("org.dbyzero.deimos.network.disconnected");
			this.session_id = null ;
			this.tryRelog() ;
			
		},
		onerror: function (error) {
			EventManager.fire("org.dbyzero.deimos.console.write",{"detail":{"message":"An error accured with the server"}});
			EventManager.fire("org.dbyzero.deimos.network.disconnected");
			this.session_id = null ;
			this.tryRelog() ;
		},
		onmessage: function (message) {
			var json_msg = JSON.parse(message.data) ;
			EventManager.fire("org.dbyzero.deimos.network.receivedMessage",json_msg) ;
		}
	}
})(org.dbyzero.deimos, document);
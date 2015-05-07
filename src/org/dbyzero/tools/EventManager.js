/**
 *
 * org.dbyzero.tools.EventManager Object
 *
 * @author dbyzero
 * @date : 2013/09/01
 * @description : Event Manager
 *
 */

var org = org || {} ;
org.dbyzero = org.dbyzero || {} ;
org.dbyzero.tools = org.dbyzero.tools || {} ;

(function(tools,document,undefined) {
	tools = org.dbyzero.tools || {} ;

	tools.EventManager = {} ;
	tools.EventManager.events = {} ;

	tools.EventManager.register = function(eventName,eventFunction) {
		tools.EventManager.events[eventName] = tools.EventManager.events[eventName] || {} ;
		if(tools.EventManager.events[eventName].listeners === undefined) {
			tools.EventManager.events[eventName].listeners = [] ;
		}
		tools.EventManager.events[eventName].listeners.push(eventFunction) ;
	}

	tools.EventManager.unregister = function(eventName) {
		delete tools.EventManager.events[eventName] ;
	}

	tools.EventManager.unregisterAll = function() {
		tools.EventManager.events = {} ;
	}

	tools.EventManager.fire = function(eventName,e) {
		if(tools.EventManager.events[eventName] == undefined) {
			//org.dbyzero.tools.Log.error('event ' + eventName + ' do not exists.') ;
			return ;
		}
		var listListener = tools.EventManager.events[eventName].listeners ;
		for(var i=0;i<listListener.length;i++) {
		if(listListener[i] === undefined) {
		org.dbyzero.tools.Log.error('function added to listener '+ eventName + ' is undefined') ;
		continue;
		}
			listListener[i](e) ;
		}
	}
})(org.dbyzero.tools, document);
/**
 *
 * org.dbyzero.tools.KeyboardController Object
 *
 * @author dbyzero
 * @date : 2013/10/29
 * @description : Handler keyboard event
 * 
 */

var org = org || {} ;
org.dbyzero = org.dbyzero || {} ;
org.dbyzero.tools = org.dbyzero.tools || {} ;

(function(tools,document,undefined) {

	var EventManager = tools.EventManager;
	/**
	 * Keyboard constructor
	 *
	 * */
	tools.KeyboardController = {};

	tools.KeyboardController.addManagedKey = function(key) {
		tools.KeyboardController.managedKeys[key] = true;
	}

	tools.KeyboardController.removeManagedKey = function(key) {
		delete tools.KeyboardController.managedKeys[key];
	}

	tools.KeyboardController.keyPressed = function(e) {
		var evtobj = window.event? event : e;
		var key = evtobj.keyCode;
		if(key in tools.KeyboardController.managedKeys){
			if(tools.KeyboardController.keyStatus[key] === true) return;
			tools.KeyboardController.keyStatus[key] = true;
			//console.log('pressed '+key);
			EventManager.fire("org.dbyzero.tools.KeyboardController.keyPressed."+key);
		}
	}

	tools.KeyboardController.keyReleased = function(e) {
		var evtobj = window.event? event : e;
		var key = evtobj.keyCode;
		if(key in tools.KeyboardController.managedKeys){
			if(tools.KeyboardController.keyStatus[key] === false) return;
			tools.KeyboardController.keyStatus[key] = false;
			//console.log('released '+key);
			EventManager.fire("org.dbyzero.tools.KeyboardController.keyReleased."+key);
		}
	}

	tools.KeyboardController.keyStatus = {};
	tools.KeyboardController.managedKeys = {};
	
	tools.KeyboardController.keys = {};
	tools.KeyboardController.keys.ENTER = 13;
	tools.KeyboardController.keys.SPACE = 32;
	tools.KeyboardController.keys.ARROW_LEFT = 37;
	tools.KeyboardController.keys.ARROW_RIGHT = 39;
	tools.KeyboardController.keys.ARROW_DOWN = 40;
	tools.KeyboardController.keys.ARROW_UP = 38;
	tools.KeyboardController.keys.n1 = 49;
	tools.KeyboardController.keys.n2 = 50;
	tools.KeyboardController.keys.n3 = 51;
	tools.KeyboardController.keys.n4 = 52;
	tools.KeyboardController.keys.n5 = 53;
	tools.KeyboardController.keys.X = 88;

	document.onkeydown  = tools.KeyboardController.keyPressed;
	document.onkeyup    = tools.KeyboardController.keyReleased;

   
})(org.dbyzero.tools, document);
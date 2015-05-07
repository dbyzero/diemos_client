/**
 *
 * User movement Object
 *
 * @author dbyzero
 * @date : 2013/10/28
 * @description : User movement force
 *
 **/

(function(deimos,document,undefined) {

	deimos.physic = deimos.physic || {} ;

	/**
	 * User Movement constructor
	 * 
	 * @param Vector physic
	 * 
	 **/

	deimos.physic.UserMovement = function (physic, type) {
		this.id = deimos.physic.UserMovement.lastid++;
		this.movement = physic;
		this.startTimestamp = new Date().getTime();
		this.durationIntegrated = 0;
		this.duration = null;
		this.type = type;
	}

	deimos.physic.UserMovement.lastid = 0;

})(org.dbyzero.deimos, document);
/**
 *
 * Avatar Object
 *
 * @author dbyzero
 * @date : 2013/08/09
 * @description : Avatar model
 *
 **/

(function(deimos,document,undefined) {

	var EventManager = org.dbyzero.tools.EventManager;
	deimos.element = deimos.element || {} ;

	/**
	 * Avatar constructor
	 *
	 **/
	var Avatar = deimos.element.Avatar = function (name,position,size,serverid,deltashow,mass) {
		Avatar._super.call(this,position,size,serverid,deltashow);
		this.domId = 'avatar_' + serverid + '_' + new Date().getTime() + '_' + Math.floor((Math.random()*1000000)+1); ;
		this.speaking = false ;
		this.speaker = null;
		this.move_speed = 0;
		this.jump_speed = 0;
		this.saying = "";
		this.lastSayed = 0;
		this.waitingForce = [];
		this.userInputs = {};
		this.item_slot_head = null;
		this.item_slot_foot = null;
		this.item_slot_chest = null;
		this.item_slot_left_hand = null;
		this.item_slot_right_hand = null;
		this.name = name;
		this.mass = mass;
		//object collisions are managed by server
		// this.collisionTypeEnabled['bonus'] = true;
	}

	org.dbyzero.tools.Inherit(deimos.element.Avatar, deimos.element.Element);

	deimos.element.Avatar.prototype.init = function(){
		Avatar._super.prototype.init.call(this);

		//set spritesheet
		this.domElem.style.backgroundImage = "url("+deimos.Engine.assetURL+"/spritesheet/char/"+this.serverid+"/spritesheet.png)";

		//add speaker
		this.initSpeaker(false);

		//events
		this.bindEvent();

		//show main name
		this.initName(true);

		//redraw HP to apply correct name width
		this.renderHP();

	}

	deimos.element.Avatar.prototype.bindEvent = function() {
		var _t = deimos.Engine._t;

		//bind speek event
		EventManager.register("org.dbyzero.deimos.avatar.speak",(function(e){
			this.setSpeaking(true) ;
			event.preventDefault();
		}).bind(this));

		EventManager.register("org.dbyzero.deimos.avatar.speak.stop",(function(){
			this.setSpeaking(false) ;
			event.preventDefault();
		}).bind(this));

		//bind movement event

		EventManager.register("org.dbyzero.deimos.avatar.move.left",(function(e){
			var force = new deimos.physic.UserMovement(
				new org.dbyzero.tools.Vector(-1 * this.move_speed,0),
				_t['LEFT']
			);
			this.addUserInputs(force);
			this.sendActionMessage(_t['ACTION_MOVE_START'],force);
			this.oriented = 'left';
		}).bind(this));

		EventManager.register("org.dbyzero.deimos.avatar.move.right",(function(e){
			var force = new deimos.physic.UserMovement(
				new org.dbyzero.tools.Vector(this.move_speed,0),
				_t['RIGHT']
			);
			this.addUserInputs(force);
			this.sendActionMessage(_t['ACTION_MOVE_START'],force);
			this.oriented = 'right';
		}).bind(this));

		EventManager.register("org.dbyzero.deimos.avatar.move.left.stop",(function(e){
			this.removeUserInputs(_t['LEFT']);
		}).bind(this));

		EventManager.register("org.dbyzero.deimos.avatar.move.right.stop",(function(e){
			this.removeUserInputs(_t['RIGHT']);
		}).bind(this));

		//bind jump event
		EventManager.register("org.dbyzero.deimos.avatar.jump",(function(e){
			if(!this.isLanded == false && this.speaking == false) {
				var force = new deimos.physic.UserMovement(
					new org.dbyzero.tools.Vector(0,parseInt('-'+this.jump_speed)),
					_t['JUMP']
				);
				this.addForceNextStep(force.movement) ;
				this.sendActionMessage(_t['ACTION_JUMP'],force);

			}
		}).bind(this));

		EventManager.register("org.dbyzero.deimos.avatar.go.down",(function(e){
			this.goingDown = true;
			this.unlanded();
			this.sendActionMessage(_t['ACTION_GOING_DOWN']);
		}).bind(this));

		EventManager.register("org.dbyzero.deimos.avatar.go.down.stop",(function(e){
			this.goingDown = false;
			this.sendActionMessage(_t['ACTION_GOING_DOWN_STOP']);
		}).bind(this));
	}

	deimos.element.Avatar.prototype.unbindEvent = function() {
		//bind speek event
		EventManager.unregister("org.dbyzero.deimos.avatar.speak");
		EventManager.unregister("org.dbyzero.deimos.avatar.speak");
		EventManager.unregister("org.dbyzero.deimos.avatar.move.left.stop");
		EventManager.unregister("org.dbyzero.deimos.avatar.move.right.stop");
		EventManager.unregister("org.dbyzero.deimos.avatar.move.left");
		EventManager.unregister("org.dbyzero.deimos.avatar.move.right");
		EventManager.unregister("org.dbyzero.deimos.avatar.jump");
		EventManager.unregister("org.dbyzero.deimos.avatar.go.down");
		EventManager.unregister("org.dbyzero.deimos.avatar.go.down.stop");
	}

	deimos.element.Avatar.prototype.sendActionMessage = function(type, force) {
		var _t = deimos.Engine._t;
		var message = {};
		message[_t['ACTION']] = type;
		message[_t['MESSAGE']] = {};
		if(force !== undefined) {
			message[_t['MESSAGE']][_t['MESSAGE_MOVE_ID']] = force.id;
			message[_t['MESSAGE']][_t['MESSAGE_MOVE_TYPE']] = force.type;
			message[_t['MESSAGE']][_t['MESSAGE_MOVE_START']] = force.startTimestamp;
			message[_t['MESSAGE']][_t['MESSAGE_DURATION']] = force.duration;
		}
		message[_t['MESSAGE']][_t['MESSAGE_POSITION']] = {};
		message[_t['MESSAGE']][_t['MESSAGE_POSITION']].x = parseInt(this.position.x);
		message[_t['MESSAGE']][_t['MESSAGE_POSITION']].y = parseInt(this.position.y);
		deimos.Engine.networkManager.sendMessage(message);
	}

	//adding user keyboard (or other input ?) events
	deimos.element.Avatar.prototype.addUserInputs = function(mvt) {
		this.userInputs[mvt.id] = mvt ;
	}


	//removing user keyboard (or other input ?) events
	deimos.element.Avatar.prototype.removeUserInputs = function(type) {
		for(id in this.userInputs) {
			var input = this.userInputs[id];
			if(input.type === type) {
				input.duration = new Date().getTime() - input.startTimestamp;
			}
		}
	}

	//adding force next step
	deimos.element.Avatar.prototype.addForceNextStep = function(force) {
		this.waitingForce.push(force) ;
	}

	deimos.element.Avatar.prototype.addingWaitingForces = function() {
		var forces = this.waitingForce;
		for(force in forces) {
			this.velocity.add(forces[force]);
			this.waitingForce.splice(0,1);
		}
	}

	deimos.element.Avatar.prototype.update = function(dt, now) {

		//toggle speaker if needed
		if(this.speaking) {
			var new_saying = this.getSaying();
			if(this.saying !== new_saying) {
				this.saying = new_saying;
				EventManager.fire('org.dbyzero.deimos.network.sendSync');
			}
		} else {
			if(this.lastSayed + 5000 < now && this.saying !== '') {
				this.speaker.hide();
				this.speaker.setText('');
				this.saying = '';
				EventManager.fire('org.dbyzero.deimos.network.sendSync');
			} 
		}

		//call parent update
		Avatar._super.prototype.update.call(this,dt,now);

		//adding user action through keyboard to the movement
		for(id in this.userInputs) {
			var input = this.userInputs[id];
			this.toMove.x += parseFloat(input.movement.x * dt/1000 * Math.min(1,input.durationIntegrated/100));//to make possible small mvt
			this.toMove.y += parseFloat(input.movement.y * dt/1000);
			input.durationIntegrated = input.durationIntegrated + dt;


			//finish the interpolation
			if(input.duration !== null) {
				//si on a trop integrer, on change le total integrer a la l'integration reel
				//pour ne pas faire de retour
				input.duration = Math.max(input.durationIntegrated,input.duration);
				var missingIntegration = input.duration - input.durationIntegrated;

				this.toMove.x += parseFloat((input.movement.x * missingIntegration/1000));
				this.toMove.y += parseFloat((input.movement.y * missingIntegration/1000));

				this.sendActionMessage(deimos.Engine._t['ACTION_MOVE_STOP'],input);
				delete this.userInputs[id];
			}
		}
	}

	deimos.element.Avatar.prototype.onMove = function() {
		Avatar._super.prototype.onMove.call(this);
		this.renderName();
		this.renderSpeaker();
	}

	deimos.element.Avatar.prototype.onJustLand = function() {
		EventManager.fire("org.dbyzero.deimos.network.sendSync");
	}

	deimos.element.Avatar.prototype.onUnland = function() {
		EventManager.fire("org.dbyzero.deimos.network.sendSync");
	}

	deimos.element.Avatar.prototype.render = function() {
		if(Avatar._super.prototype.render.call(this)) {
			this.renderName();
			this.renderSpeaker();
			if(!!this.HP) this.renderHP();
		}
	}

	deimos.element.Avatar.prototype.getSaying = function() {
		var txt = this.speaker.getText();
		txt = txt.replace(/<(?:.|\n)*?>/gm, '');
		txt = txt.replace(/'/gm, "\'");
		txt = txt.replace(/"/gm, '\"');
		txt = txt.replace(/\{/gm, "(");
		txt = txt.replace(/\}/gm, ")");
		return txt;
	};


})(org.dbyzero.deimos, document);
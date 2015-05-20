/**
 *
 * Avatar Object
 *
 * @author dbyzero
 * @date : 2013\asc sxz08/09
 * @description : ServerAvatar model
 *
 **/

(function(deimos,document,undefined) {

	deimos.element = deimos.element || {} ;

	/**
	 * ServerAvatar constructor
	 *
	 **/
	var ServerAvatar = deimos.element.ServerAvatar = function (name,position,velocity,acceleration,size,mass,userInputVelocity,serverid,deltashow) {
		ServerAvatar._super.call(this,position,size,serverid,deltashow);
		this.domId = 'server_avatar_' + serverid + '_' + new Date().getTime() + '_' + Math.floor((Math.random()*1000000)+1); ;
		this.userInputVelocity = userInputVelocity ;
		this.name = name;
		this.mass = mass;
		//used for smooth move
		this.dtIntegrationInput = 0;
		this.lastUserInputVelocityX = 0;
	}

	org.dbyzero.tools.Inherit(deimos.element.ServerAvatar, deimos.element.Element);

	deimos.element.ServerAvatar.prototype.init = function() {
		ServerAvatar._super.prototype.init.call(this);

		this.domElem.style.backgroundImage = "url("+deimos.Engine.assetURL+"/spritesheet/char/"+this.serverid+"/spritesheet.png)";

		this.initSpeaker(true);
		this.initName();

		//load weapon
		if(!!this.item_slot_right_hand) {
			this.initWeapon(this.item_slot_right_hand.id);
		}

		if(!!this.HP) this.initHP();
		//object collisions are managed by server
		// this.collisionTypeEnabled['bonus'] = true;
	};

	deimos.element.ServerAvatar.prototype.update = function(dt,now) {

		ServerAvatar._super.prototype.update.call(this,dt,now);

		if(this.lastUserInputVelocityX !== this.userInputVelocity.x) {
			this.dtIntegrationInput = 0;
			this.lastUserInputVelocityX = this.userInputVelocity.x;
		}
		// this.toMove.x += parseFloat(this.userInputVelocity.x * this.dtIntegrationInput/1000)/;
		// this.toMove.y += parseFloat(this.userInputVelocity.y * dt/1000)/;
		this.toMove.x = parseFloat(this.toMove.x + this.userInputVelocity.x * dt/1000 * Math.min(1,this.dtIntegrationInput/100));//to make possible small mvt
		this.toMove.y = parseFloat(this.toMove.y + this.userInputVelocity.y * dt/1000);
		this.dtIntegrationInput += dt;

		this.speaker.setText(this.saying);
		if( this.saying.length > 0 ) {
			this.speaker.show();
		} else {
			this.speaker.hide();
		}
	};

	deimos.element.ServerAvatar.prototype.onMove = function() {
		ServerAvatar._super.prototype.onMove.call(this);
		this.renderName();
		this.renderSpeaker();
		if(!!this.HP) this.renderHP();
	};

	deimos.element.ServerAvatar.prototype.render = function() {
		if(ServerAvatar._super.prototype.render.call(this))	{
			this.renderName();
			this.renderSpeaker();
		}
	}

	deimos.element.ServerAvatar.prototype.destroy = function() {
		ServerAvatar._super.prototype.destroy.call(this);
		delete deimos.Engine.scene.avatars[this.serverid];
	}

})(org.dbyzero.deimos, document);
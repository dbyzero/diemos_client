/**
 *
 * Monster Object
 *
 * @author dbyzero
 * @date : 2014/11/24
 * @description : Monster model
 *
 **/

(function(deimos,document,undefined) {

	deimos.element = deimos.element || {} ;

	/**
	 * Monster constructor
	 *
	 **/
	var Monster = deimos.element.Monster = function (serverid,position,velocity,acceleration,size,mass,templateid,skin,color,name,damage,orientation,deltashow) {
		Monster._super.call(this,position,size,serverid,deltashow);
		this.domId = 'monster_' + serverid + '_' + new Date().getTime() + '_' + Math.floor((Math.random()*1000000)+1); ;
		this.velocity = velocity;
		this.acceleration = acceleration;
		this.speaking = false ;
		this.speaker = null;
		this.move_speed = 0;
		this.jump_speed = 0;
		this.saying = "";
		this.lastSayed = 0;
		this.skin = skin;
		this.templateId = templateid;
		this.color = color;
		this.name = name;
		this.damage = damage;
		this.mass = mass;
	}

	org.dbyzero.tools.Inherit(deimos.element.Monster, deimos.element.Element);

	deimos.element.Monster.prototype.init = function(){
		Monster._super.prototype.init.call(this);
		this.domElem.className = "monster_"+this.skin;

		//set spritesheet
		this.domElem.style.backgroundImage = "url("+deimos.Engine.assetURL+"/spritesheet/monster/"+this.templateId+"/color/"+this.color+"/spritesheet.png)";

		//add speaker
		this.initSpeaker(false);

		//show main name
		if(!!this.name) {
			this.initName(true);

			//redraw HP to apply correct name width
			this.renderHP();
		}

		this.nameWidth = dom_elem_name.offsetWidth;
		this.nameHeight = dom_elem_name.offsetHeight;

		//load weapon
		if(!!this.weaponId) {
			this.initWeapon(this.weaponId);
		}
		//object collisions are managed by server
		// this.collisionTypeEnabled['avatars'] = true;
	}

	deimos.element.Monster.prototype.update = function(dt, now) {
		//call parent update
		Monster._super.prototype.update.call(this,dt,now);

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
	}

	deimos.element.Monster.prototype.onMove = function() {
		Monster._super.prototype.onMove.call(this);
		if(!!this.name) this.renderName();
		if(this.saying.length > 0) this.renderSpeaker();
	}

	deimos.element.Monster.prototype.render = function() {
		if(Monster._super.prototype.render.call(this)) {
			if(!!this.name) this.renderName();
			if(this.saying.length > 0) this.renderSpeaker();
		}
	}

	deimos.element.Monster.prototype.onBlockCollisionLeft = function() {
		this._tempBlockCollisionLeftRight();
	}

	deimos.element.Monster.prototype.onBlockCollisionRight = function() {
		this._tempBlockCollisionLeftRight();
	}

	deimos.element.Monster.prototype.onAreaCollisionLeft = function() {
		this._tempBlockCollisionLeftRight();
	}

	deimos.element.Monster.prototype.onAreaCollisionRight = function() {
		this._tempBlockCollisionLeftRight();
	}

	deimos.element.Monster.prototype._tempBlockCollisionLeftRight = function() {
		this.velocity.x = -1*parseInt(this.velocity.x);
	}

	/**
	 * Name
	 */
	deimos.element.Monster.prototype.initName = function () {
		var dom_elem_name = document.createElement("div");
		dom_elem_name.setAttribute("id",this.domId+'_name') ;

		dom_elem_name.style.position = "absolute";
		dom_elem_name.innerHTML = this.name;
		dom_elem_name.style.display  = 'none' ;
		dom_elem_name.style.fontSize = '12px';
		dom_elem_name.style.fontWeight = 'bold';
		dom_elem_name.style.color = '#'+this.color;
		dom_elem_name.style.zIndex = 10;
		dom_elem_name.style.opacity = 0.7;
		dom_elem_name.style.textShadow = 'white -2px -2px 2px, white 2px 2px 2px, white -2px 2px 2px, white 2px -2px 2px';

		deimos.Engine.zone.area.appendChild(dom_elem_name) ;
		dom_elem_name.style.display  = 'block' ;

		this.domElemName = document.getElementById(this.domId+'_name');

		this.renderName.call(this);
	}

	deimos.element.Monster.prototype.destroy = function() {
		Monster._super.prototype.destroy.call(this);
		delete deimos.Engine.scene.monsters[this.serverid];
	}

})(org.dbyzero.deimos, document);
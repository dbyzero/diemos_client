/**
 *
 * Avatar Object
 *
 * @author dbyzero
 * @date : 2014/11/07
 * @description : Projectile model
 *
 **/

(function(deimos,document,undefined) {

	deimos.element = deimos.element || {} ;

	/**
	 * Projectile constructor
	 *
	 **/
	var Projectile = deimos.element.Projectile = function (serverid,position,velocity,acceleration,size,mass,templateId,skin,color,damage,orientation,ownerId,deltashow) {
		Projectile._super.call(this,position,size,serverid,deltashow);
		this.domId = 'projectile_' + serverid + '_' + new Date().getTime() + '_' + Math.floor((Math.random()*1000000)+1); ;
		this.owner = null;
		this.velocity = velocity;
		this.acceleration = acceleration;
		this.skin = skin;
		this.orientation = orientation;
		this.damage = damage;
		this.mass = mass;
	}

	org.dbyzero.tools.Inherit(deimos.element.Projectile, deimos.element.Element);

	deimos.element.Projectile.prototype.init = function() {
		Projectile._super.prototype.init.call(this);
		this.domElem.style.backgroundImage = "url("+deimos.Engine.assetURL+"/images/spritesheet/"+this.skin+".png)";
		if(this.orientation === 'left'){
			this.domElem.style.backgroundPositionY = '-'+(this.height)+'px';
		}
		//object collisions are managed by server
		// this.collisionTypeEnabled['avatars'] = true;
		// this.collisionTypeEnabled['monsters'] = true;
		this.collisionTypeEnabled['plateforme'] = false;
	};
	deimos.element.Projectile.prototype.onAreaCollisionTop = function(collisionCoord, collisionElement) {
		//do nothing !
	}

	deimos.element.Projectile.prototype.onAreaCollision = function(collisionCoord, collisionElement) {
		this.onBlockCollision(collisionCoord, collisionElement);
	};

	deimos.element.Projectile.prototype.onBlockCollision = function(collisionCoord, collisionElement) {
		deimos.Engine.scene.destroyProjectile(this);
	};

	deimos.element.Projectile.prototype.destroy = function() {
		Projectile._super.prototype.destroy.call(this);
		delete deimos.Engine.scene.projectiles[this.serverid];
	}

})(org.dbyzero.deimos, document);
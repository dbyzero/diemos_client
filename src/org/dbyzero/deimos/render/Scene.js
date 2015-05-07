/**
 *
 * org.dbyzero.deimos.render.Scene Object
 *
 * @author dbyzero
 * @date : 2013/08/09
 * @description : Scene where action appends !
 *
 **/

var org = org || {} ;
org.dbyzero = org.dbyzero || {} ;

(function(deimos, document, undefined) {
	var Vector = org.dbyzero.tools.Vector;
	var EventManager = org.dbyzero.tools.EventManager;

	deimos.render = org.dbyzero.deimos.render || {} ;

	deimos.render.Scene = function() {
		this.items			= {};
		this.blocks			= {};
		this.avatars		= {};
		this.projectiles	= {};
		this.attackZones	= {};
		this.monsters		= {};
		this.dataToParse	= {};
		this.addListener();
	}

	deimos.render.Scene.prototype.parseData = function(data) {
		if(!deimos.Engine.running) return false;
		var _t = deimos.Engine._t;

		/**
		 * AVATARS 
		 */
		//sync avatars
		var avatarUpdated = [];
		var avatars = data[_t.MESSAGE][_t.AVATARS];
		for(var k in avatars) {
			if(this.syncAvatar(avatars[k])) {
				avatarUpdated.push(parseInt(avatars[k][_t['MESSAGE_ELEMENT_ID']]));
			}
		}

		//clean avatar
		for(var i in deimos.Engine.scene.avatars) {
			var av_id = deimos.Engine.scene.avatars[i].serverid;
			if(avatarUpdated.indexOf(av_id) === -1) {
				this.avatars[av_id].destroy();
			}
		}

		/**
		 * ITEMS 
		 */
		//sync items
		var items = data[_t.MESSAGE][_t.ITEMS];
		var itemUpdated = [];
		for(var id in items) {
			this.syncItem(items[id]);
			itemUpdated.push(id);
		}

		//clean items
		for(var item_id in deimos.Engine.scene.items) {
			if(itemUpdated.indexOf(item_id) === -1) {
				this.items[item_id].cleanDom();
				delete this.items[item_id];
			}
		}

		/**
		 * MONSTERS 
		 */
		//sync items
		var monsters = data[_t.MESSAGE][_t.MONSTERS];
		var monsterUpdated = [];
		for(var id in monsters) {
			this.syncMonster(monsters[id]);
			monsterUpdated.push(id);
		}

		//clean items
		for(var monster_id in this.monsters) {
			if(monsterUpdated.indexOf(monster_id) === -1) {
				this.monsters[monster_id].cleanDom();
				delete this.monsters[monster_id];
			}
		}

		/**
		 * PROJECTILES 
		 */
		//sync items
		var projectiles = data[_t.MESSAGE][_t.PROJECTILES];
		var projectileUpdated = [];
		for(var id in projectiles) {
			this.syncProjectile(projectiles[id]);
			projectileUpdated.push(id);
		}

		//clean items
		for(var projectile_id in this.projectiles) {
			if(projectileUpdated.indexOf(projectile_id) === -1) {
				this.projectiles[projectile_id].cleanDom();
				delete this.projectiles[projectile_id];
			}
		}
	}
	
	//@return total periode integrated
	deimos.render.Scene.prototype.update = function(dt,now) {
		if(!!this.dataToParse) {
			var _t = deimos.Engine._t;
			var data = {};
			data[_t['MESSAGE']] = this.dataToParse;
			this.parseData(data);
			this.dataToParse = undefined;
		}

		deimos.Engine.ui.updateFPS(parseInt(1000/dt));

		//update
		var keys,i,avatar,monster;
		keys = Object.keys(this.items);
		for(i=0;i<keys.length;i++) {
			this.items[keys[i]].update(dt,now);
		}
		keys = Object.keys(this.avatars);
		for(i=0;i<keys.length;i++) {
			this.avatars[keys[i]].update(dt,now);
		}
		keys = Object.keys(this.projectiles);
		for(i=0;i<keys.length;i++) {
			this.projectiles[keys[i]].update(dt,now);
		}
		keys = Object.keys(this.monsters);
		for(i=0;i<keys.length;i++) {
			this.monsters[keys[i]].update(dt,now);
		}
		keys = Object.keys(this.attackZones);
		for(i=0;i<keys.length;i++) {
			if(this.attackZones[keys[i]].update(dt,now) == false){
				this.attackZones[keys[i]].destroy();
				delete this.attackZones[keys[i]];
			};
		}
		if(deimos.Engine.avatar !== undefined) {
			deimos.Engine.avatar.update(dt,now) ;
		}

		//move and render entities !
		keys = Object.keys(this.avatars);
		for(i=0;i<keys.length;i++) {
			avatar = this.avatars[keys[i]];
			avatar.move();
			avatar.updateAnimation();
		}
		//move and render projectiles !
		keys = Object.keys(this.projectiles);
		for(i=0;i<keys.length;i++) {
			this.projectiles[keys[i]].move();
		}
		//move and render entities !
		keys = Object.keys(this.items);
		for(i=0;i<keys.length;i++) {
			this.items[keys[i]].move();
		}
		//move and render monsters !
		keys = Object.keys(this.monsters);
		for(i=0;i<keys.length;i++) {
			monster = this.monsters[keys[i]];
			monster.move();
			monster.updateAnimation();
		}

		//avatar move+render+things
		if(deimos.Engine.avatar !== undefined) {
			deimos.Engine.avatar.updateAnimation() ;
			deimos.Engine.avatar.move() ;
			deimos.Engine.avatar.addingWaitingForces() ;
		}
	}

	deimos.render.Scene.prototype.addListener = function() {
		EventManager.register('org.dbyzero.deimos.network.syncItem',this.syncItem.bind(this)) ;
		EventManager.register('org.dbyzero.deimos.network.syncAvatar',this.syncAvatar.bind(this)) ;
		EventManager.register('org.dbyzero.deimos.network.syncMonster',this.syncMonster.bind(this)) ;
		EventManager.register('org.dbyzero.deimos.network.actionCollide',this.elementCollision.bind(this)) ;
		EventManager.register('org.dbyzero.deimos.network.syncProjectile',this.syncProjectile.bind(this)) ;
		EventManager.register('org.dbyzero.deimos.network.syncAttackZone',this.syncAttackZone.bind(this)) ;
		EventManager.register('org.dbyzero.deimos.network.itemGrabbed',this.itemGrabbed.bind(this)) ;
	}

	deimos.render.Scene.prototype.removeListener = function() {
		EventManager.unregister('org.dbyzero.deimos.network.syncItem') ;
		EventManager.unregister('org.dbyzero.deimos.network.syncAvatar') ;
		EventManager.unregister('org.dbyzero.deimos.network.syncMonster') ;
		EventManager.unregister('org.dbyzero.deimos.network.actionCollide') ;
		EventManager.unregister('org.dbyzero.deimos.network.syncProjectile') ;
		EventManager.unregister('org.dbyzero.deimos.network.syncAttackZone') ;
		EventManager.unregister('org.dbyzero.deimos.network.itemGrabbed') ;
	}

	deimos.render.Scene.prototype.addItem = function(item) {
		this.items[item.serverid] = item;
	}

	deimos.render.Scene.prototype.syncAvatar = function(e) {
		//wait game start before start..
		if(!deimos.Engine.running) return;

		var _t = deimos.Engine._t;
		var avatar;
		//si on recoit la requete et pas que l'avatar on l'extrait
		if(e[_t['MESSAGE']] !== undefined) {
			avatar = e[_t['MESSAGE']];
		} else {
			avatar = e;
		}

		var av_id = avatar[_t.MESSAGE_ELEMENT_ID];

		//make special sync if it is the current avatar
		if( deimos.Engine.avatar !== undefined && 
			av_id === deimos.Engine.avatar.serverid
		) {
			deimos.Engine.avatar.positionServer.x = avatar[_t.MESSAGE_POSITION].x;
			deimos.Engine.avatar.positionServer.y = avatar[_t.MESSAGE_POSITION].y;
			deimos.Engine.currentLag = new Date().getTime() - avatar[_t.MESSAGE_TIMESTAMP];
			deimos.Engine.ui.updateLag(deimos.Engine.currentLag);
			deimos.Engine.avatar.correctPositionWithServer();

			//stop here if we don't want to show mirror
			if( deimos.Config.showOwnMirror === false )	return false;
		}

		var local_avatar = this.avatars[avatar[_t['MESSAGE_ELEMENT_ID']]];
		//make it if needed
		if(local_avatar === undefined) {
			local_avatar = this.avatars[av_id] = new deimos.element.ServerAvatar(
				avatar[_t.NAME],
				new org.dbyzero.tools.Vector(avatar[_t.MESSAGE_POSITION].x, avatar[_t.MESSAGE_POSITION].y),
				new org.dbyzero.tools.Vector(avatar[_t.MESSAGE_VELOCITY].x, avatar[_t.MESSAGE_VELOCITY].y),
				new org.dbyzero.tools.Vector(avatar[_t.MESSAGE_ACCELERATION].x, avatar[_t.MESSAGE_ACCELERATION].y),
				new org.dbyzero.tools.Vector(avatar[_t.MESSAGE_SIZE].x, avatar[_t.MESSAGE_SIZE].y),
				avatar[_t.MESSAGE_MASS],
				new org.dbyzero.tools.Vector(avatar[_t.MESSAGE_USER_INPUT_VELOCITY].x, avatar[_t.MESSAGE_USER_INPUT_VELOCITY].y),
				av_id,
				avatar[_t.MESSAGE_DELTASHOW]
			) ;
			local_avatar.oriented = avatar[_t.MESSAGE_ANIMATION][_t.MESSAGE_DIRECTION];

			var skin = avatar[_t.MESSAGE_SKIN];

			local_avatar.HP = avatar[_t.MESSAGE_CURRENT_HP];
			local_avatar.maxHP = avatar[_t.MESSAGE_HP];
			local_avatar.skin = skin;
			local_avatar.initAnimation();

			local_avatar.deltashow = avatar[_t.MESSAGE_DELTASHOW];

			local_avatar.init();
		}

		//synchro des infos
		local_avatar.moveSpeed				= avatar[_t.MESSAGE_MOVE_SPEED];
		local_avatar.jumpSpeed				= avatar[_t.MESSAGE_JUMP_SPEED];
		local_avatar.goingDown				= avatar[_t.MESSAGE_GOING_DOWN];
		local_avatar.velocity.x				= avatar[_t.MESSAGE_VELOCITY].x;
		local_avatar.velocity.y				= avatar[_t.MESSAGE_VELOCITY].y;
		// do not synchro position on fly to get smoothy movement
		local_avatar.isLanded = avatar[_t.MESSAGE_LANDED];
		if(local_avatar.isLanded === true)
		{
			local_avatar.position.x				= avatar[_t.MESSAGE_POSITION].x;
			local_avatar.position.y				= avatar[_t.MESSAGE_POSITION].y;
			local_avatar.acceleration.x			= avatar[_t.MESSAGE_ACCELERATION].x;
			local_avatar.acceleration.y			= avatar[_t.MESSAGE_ACCELERATION].y;
		}
		local_avatar.userInputVelocity.x	= avatar[_t.MESSAGE_USER_INPUT_VELOCITY].x;
		local_avatar.userInputVelocity.y	= avatar[_t.MESSAGE_USER_INPUT_VELOCITY].y;
		local_avatar.saying					= avatar[_t.MESSAGE_SAYING];
		local_avatar.item_slot_head			= avatar[_t.ITEM_SLOT_HEAD];
		local_avatar.item_slot_chest		= avatar[_t.ITEM_SLOT_CHEST];
		local_avatar.item_slot_foot			= avatar[_t.ITEM_SLOT_FOOT];
		local_avatar.item_slot_left_hand	= avatar[_t.ITEM_SLOT_LEFT_HAND];
		local_avatar.item_slot_right_hand	= avatar[_t.ITEM_SLOT_RIGHT_HAND];

		local_avatar.HP = avatar[_t.MESSAGE_CURRENT_HP];
		local_avatar.maxHP = avatar[_t.MESSAGE_HP];

		local_avatar.render();
		return true;
	}

	deimos.render.Scene.prototype.syncItem = function(e) {
		//wait game start before start..
		if(!deimos.Engine.running) return;

		var _t = deimos.Engine._t;
		var item;

		//si on recoit la requete et pas que l'avatar on l'extrait
		if(e[_t['MESSAGE']] !== undefined) {
			item = e[_t['MESSAGE']];
		} else {
			item = e;
		}

		var local_item = this.items[item[_t['ID']]];

		//if item is not on the scene we nake it
		if(local_item === undefined) {
			local_item = new deimos.element.Item(
				item[_t.ID],
				new Vector(item[_t.MESSAGE_POSITION].x,item[_t.MESSAGE_POSITION].y), //position
				new Vector(item[_t.MESSAGE_VELOCITY].x,item[_t.MESSAGE_VELOCITY].y), //velocity
				new Vector(item[_t.MESSAGE_ACCELERATION].x,item[_t.MESSAGE_ACCELERATION].y), //acceleration
				new Vector(item[_t.MESSAGE_SIZE].x,item[_t.MESSAGE_SIZE].y), //size
				item[_t.MESSAGE_MASS], //name
				item[_t.MESSAGE_ELEMENT_ID], //name
				item[_t.MESSAGE_SKIN], //skin
				item[_t.MESSAGE_COLOR], //skin
				item[_t.NAME], //skin
				item[_t.MESSAGE_ORIENTATION], //skin
				item[_t.MESSAGE_DELTASHOW] //skin
			);
			local_item.init();
			deimos.Engine.scene.addItem(local_item);
		} else {
			local_item.position .x = item[_t.MESSAGE_POSITION].x;
			local_item.position.y = item[_t.MESSAGE_POSITION].y;
			local_item.velocity.x = item[_t.MESSAGE_VELOCITY].x;
			local_item.velocity.y = item[_t.MESSAGE_VELOCITY].y;
			local_item.acceleration.x = item[_t.MESSAGE_ACCELERATION].x;
			local_item.acceleration.y = item[_t.MESSAGE_ACCELERATION].y;
		}
	}

	deimos.render.Scene.prototype.syncProjectile = function(e) {
		//wait game start before start..
		if(!deimos.Engine.running) return;

		var _t = deimos.Engine._t;
		var msg;

		if(e[_t['MESSAGE']] !== undefined) {
			msg = e[_t['MESSAGE']];
		} else {
			msg = e;
		}

		//make it if needed
		if(this.projectiles[msg[_t['ID']]] === undefined) {
			var projectile = new deimos.element.Projectile(
				msg[_t['ID']],
				new Vector(msg[_t['MESSAGE_POSITION']].x,msg[_t['MESSAGE_POSITION']].y),
				new Vector(msg[_t['MESSAGE_VELOCITY']].x,msg[_t['MESSAGE_VELOCITY']].y),
				new Vector(msg[_t['MESSAGE_ACCELERATION']].x,msg[_t['MESSAGE_ACCELERATION']].y),
				msg[_t['MESSAGE_SIZE']],
				msg[_t['MESSAGE_MASS']],
				msg[_t['MESSAGE_ELEMENT_ID']],
				msg[_t['MESSAGE_SKIN']],
				msg[_t['MESSAGE_COLOR']],
				msg[_t['MESSAGE_DAMAGE']],
				msg[_t['MESSAGE_ORIENTATION']],
				msg[_t['MESSAGE_OWNER']],
				msg[_t['MESSAGE_DELTASHOW']]
			);
			projectile.init();
			projectile.name = 'Projectile '+msg[_t['ID']];
			this.projectiles[msg[_t['ID']]] = projectile;
			if(this.avatars[msg[_t['MESSAGE_OWNER']]] !== undefined) {
				this.avatars[msg[_t['MESSAGE_OWNER']]].lastAttack = new Date().getTime();
			}
		} else {
			var projectile				= this.projectiles[msg[_t['ID']]];
			projectile.velocity.x		= msg[_t.MESSAGE_VELOCITY].x;
			projectile.velocity.y		= msg[_t.MESSAGE_VELOCITY].y;
			projectile.position.x		= msg[_t.MESSAGE_POSITION].x;
			projectile.position.y		= msg[_t.MESSAGE_POSITION].y;
			projectile.acceleration.x	= msg[_t.MESSAGE_ACCELERATION].x;
			projectile.acceleration.y	= msg[_t.MESSAGE_ACCELERATION].y;
			projectile.orientation		= msg[_t.MESSAGE_ORIENTATION];
		}
	}

	deimos.render.Scene.prototype.syncMonster = function(e) {
		//wait game start before start..
		if(!deimos.Engine.running) return;

		var _t = deimos.Engine._t;
		var msg;

		if(e[_t['MESSAGE']] !== undefined) {
			msg = e[_t['MESSAGE']];
		} else {
			msg = e;
		}

		//make it if needed
		if(this.monsters[msg[_t['ID']]] === undefined) {
			var monster = new deimos.element.Monster(
				msg[_t['ID']],
				new Vector(msg[_t['MESSAGE_POSITION']].x,msg[_t['MESSAGE_POSITION']].y),
				new Vector(msg[_t['MESSAGE_VELOCITY']].x,msg[_t['MESSAGE_VELOCITY']].y),
				new Vector(msg[_t['MESSAGE_ACCELERATION']].x,msg[_t['MESSAGE_ACCELERATION']].y),
				msg[_t['MESSAGE_SIZE']],
				msg[_t['MESSAGE_MASS']],
				msg[_t['MESSAGE_ELEMENT_ID']],
				msg[_t['MESSAGE_SKIN']],
				msg[_t['MESSAGE_COLOR']],
				msg[_t['NAME']],
				msg[_t['MESSAGE_DAMAGE']],
				msg[_t['MESSAGE_ORIENTATION']],
				msg[_t['MESSAGE_DELTASHOW']]
			);
			monster.HP = msg[_t['MESSAGE_CURRENT_HP']];
			monster.maxHP = msg[_t['MESSAGE_HP']];
			monster.init();
			this.monsters[msg[_t['ID']]] = monster;
		} else {
			var monster				= this.monsters[msg[_t['ID']]];
			monster.velocity.x		= msg[_t.MESSAGE_VELOCITY].x;
			monster.velocity.y		= msg[_t.MESSAGE_VELOCITY].y;
			monster.position.x		= msg[_t.MESSAGE_POSITION].x;
			monster.position.y		= msg[_t.MESSAGE_POSITION].y;
			monster.acceleration.x	= msg[_t.MESSAGE_ACCELERATION].x;
			monster.acceleration.y	= msg[_t.MESSAGE_ACCELERATION].y;
			monster.orientation		= msg[_t.MESSAGE_ORIENTATION];
			monster.HP = msg[_t['MESSAGE_CURRENT_HP']];
			monster.maxHP = msg[_t['MESSAGE_HP']];
		}
	}

	deimos.render.Scene.prototype.syncAttackZone = function(e) {
		//wait game start before start..
		if(!deimos.Engine.running) return;

		var _t = deimos.Engine._t;
		var msg;

		if(e[_t['MESSAGE']] !== undefined) {
			msg = e[_t['MESSAGE']];
		} else {
			msg = e;
		}

		//add it if needed
		var attackZone = new deimos.element.AttackZone(
			msg[_t['MESSAGE_ELEMENT_ID']],
			msg[_t['MESSAGE_POSITION']],
			msg[_t['MESSAGE_SIZE']],
			msg[_t['MESSAGE_OWNER']],
			msg[_t['MESSAGE_DURATION']]
		);
		this.attackZones[attackZone.id] = attackZone;

		if(this.avatars[msg[_t['MESSAGE_OWNER']]] !== undefined) {
			this.avatars[msg[_t['MESSAGE_OWNER']]].lastAttack = new Date().getTime();
		}

		attackZone.render();
	}

	deimos.render.Scene.prototype.itemGrabbed = function(e) {
		//wait game start before start..
		if(!deimos.Engine.running) return;

		//clear item
		var _t = deimos.Engine._t;
		var item = this.items[e[_t['MESSAGE']][_t['MESSAGE_ITEM']]];
		item.cleanDom();
		delete this.items[item.serverid];
		//TODO add it to list of item in client side

		//correct avatar position
		var av_id = e[_t['MESSAGE']][_t['MESSAGE_TO']];
		var avatar = null;
		if( deimos.Engine.avatar !== undefined && 
			av_id === deimos.Engine.avatar.serverid
		) {
			avatar = deimos.Engine.avatar;
		} else {
			avatar = deimos.Engine.scene.avatars[av_id];
		}
		avatar.position.x = e[_t['MESSAGE']][_t['MESSAGE_TO_POSITION']].x;
		avatar.position.y = e[_t['MESSAGE']][_t['MESSAGE_TO_POSITION']].y;
		avatar.render();
		avatar.onMove();
	}

	deimos.render.Scene.prototype.destroyProjectile = function(projectile) {
		//if exsists
		if(!!this.projectiles[projectile.serverid]) {
			this.projectiles[projectile.serverid].cleanDom();
			delete this.projectiles[projectile.serverid];
		}
	}

	deimos.render.Scene.prototype.elementCollision = function(e) {
		var _t = deimos.Engine._t;
		var message = e[_t['MESSAGE']];
		var fromElement = null;
		var toElement = null;
		var isDead = message[_t.MESSAGE_IS_DEAD];
		switch(message[_t.MESSAGE_FROM_TYPE])
		{
			case _t.MESSAGE_MONSTER:
				fromElement = this.monsters[message[_t.MESSAGE_FROM]];
				break;
			case _t.MESSAGE_ITEM:
				fromElement = this.items[message[_t.MESSAGE_FROM]];
				break;
			case _t.MESSAGE_PROJECTILE:
				fromElement = this.projectiles[message[_t.MESSAGE_FROM]];
				break;
			case _t.MESSAGE_AVATAR:
				var id = message[_t.MESSAGE_FROM];
				if(id === deimos.Engine.avatar.serverid) {
					fromElement = deimos.Engine.avatar;
				} else {
					fromElement = this.avatars[id];
				}
				break;
		}
		if(!fromElement) return;

		switch(message[_t.MESSAGE_TO_TYPE])
		{
			case _t.MESSAGE_MONSTER:
				toElement = this.monsters[message[_t.MESSAGE_TO]];
				break;
			case _t.MESSAGE_ITEM:
				toElement = this.items[message[_t.MESSAGE_TO]];
				break;
			case _t.MESSAGE_PROJECTILE:
				toElement = this.projectiles[message[_t.MESSAGE_TO]];
				break;
			case _t.MESSAGE_AVATAR:
				var id = message[_t.MESSAGE_TO];
				if(id === deimos.Engine.avatar.serverid) {
					toElement = deimos.Engine.avatar;
				} else {
					toElement = this.avatars[id];
				}
				break;
		}
		if(!toElement) return;

		fromElement.position.x = message[_t.MESSAGE_FROM_POSITION].x;
		fromElement.position.y = message[_t.MESSAGE_FROM_POSITION].y;
		toElement.position.x = message[_t.MESSAGE_TO_POSITION].x;
		toElement.position.y = message[_t.MESSAGE_TO_POSITION].y;
		fromElement.render();
		toElement.render();

		toElement.touched(fromElement);
		if(isDead) {
			toElement.die();
		}
	}

})(org.dbyzero.deimos, document);
/**
 *
 * Element Object
 *
 * @author dbyzero
 * @date : 2014/03/22
 * @description : Element model
 *
 **/

(function(deimos,document,undefined) {

	var Vector = org.dbyzero.tools.Vector;
	deimos.element = deimos.element || {};

	/**
	 * Avatar constructor
	 *
	 **/
	deimos.element.Element = function (position,size,serverid,deltashow) {
		this.class = 'element';
		this.name = null;
		this.nameWidth = null;
		this.nameHeight = null;
		this.position = position;
		this.velocity = new org.dbyzero.tools.Vector(0,0);
		this.acceleration = new org.dbyzero.tools.Vector(0,0);
		this.width = size.x;
		this.height = size.y;
		this.lastUpdate = null;
		this.mass = 1;
		this.toMove = Vector.Zero();
		this.deltashow = deltashow; //translatoin vector applied to the render
		this.dictClass = {}; //dictonnairy linking DOM css class and states
		this.positionServer = {x:0,y:0};
		this.attackRate = 100;
		this.inMove = false;
		this.isLanded = false;
		this.landedBlock = null;
		this.skin = null;
		this.goingDown = false;
		this.oriented = 'right';
		this.serverid = serverid;
		this.currentAction = null;
		this.domElemName = null;
		this.domElemHP = null;
		this.speaker = null;
		this.damage = null;
		this.projectileTranslation = {};
		this.projectileTranslation.left = {'x':0,'y':0};
		this.projectileTranslation.right = {'x':0,'y':0};
		//map to set with what elements are collidable
		this.collisionTypeEnabled = {};

		this.collisionTypeEnabled['blocks'] = true;
		this.collisionTypeEnabled['gameArea'] = true;
		this.collisionTypeEnabled['plateforme'] = true;

		//object collisions are managed by server
		this.collisionTypeEnabled['bonus'] = false;
		this.collisionTypeEnabled['projectiles'] = false;
		this.collisionTypeEnabled['monsters'] = false;
		this.collisionTypeEnabled['avatars'] = false;
		this.maxHP = null;
		this.HP = null;

		//store information for collisions
		this.vertexTL = new Vector(this.position.x, this.position.y);
		this.vertexBL = new Vector(this.position.x, this.position.y + this.height);
		this.vertexTR = new Vector(this.position.x + this.width, this.position.y);
		this.vertexBR = new Vector(this.position.x + this.width, this.position.y + this.height);

		this.skipNextUpdateAndMove = false;
	}


	deimos.element.Element.prototype = {
		init: function() {
			//make dom element
			var dom_elem = document.createElement("div");
			dom_elem.setAttribute("id",this.domId);

			dom_elem.style.width = parseInt(this.width + this.deltashow.x*2)+'px';
			dom_elem.style.height  = parseInt(this.height + this.deltashow.y*2)+'px';

			dom_elem.style.display  = 'block';
			dom_elem.style.position  = 'absolute';

			var translation = "translate3d("+(this.position.x-this.deltashow.x)+"px,"+(this.position.y-this.deltashow.y)+"px,0px)";
			dom_elem.style.transform = translation;
			dom_elem.style.webkitTransform = translation;

			deimos.Engine.zone.area.appendChild(dom_elem);

			this.domElem = document.getElementById(this.domId);
			this.domElemWidth = this.domElem.offsetWidth;//usefull for positionning name and speaker
			this.domElemHeight = this.domElem.offsetHeight;//usefull for positionning name and speaker

			this.initAnimation();

			if(!!this.HP) {
				this.initHP();
			}
		},

		destroy: function() {
			this.cleanDom();
		},

		initAnimation: function() {
			this.dictClass['walking_right']		= this.skin+'AnimationWalkingRight';
			this.dictClass['walking_left']		= this.skin+'AnimationWalkingLeft';
			this.dictClass['standing_right']	= this.skin+'AnimationStandingRight';
			this.dictClass['standing_left']		= this.skin+'AnimationStandingLeft';
			this.dictClass['flying_right']		= this.skin+'AnimationFlyingRight';
			this.dictClass['flying_left']		= this.skin+'AnimationFlyingLeft';
			this.dictClass['shooting_right']	= this.skin+'AnimationShootingRight';
			this.dictClass['shooting_left']		= this.skin+'AnimationShootingLeft';
			this.dictClass['front']				= this.skin+'AnimationFront';
		},

		getDomElem: function() {
			return this.domElem;
		},

		update: function(dt, now) {
			if(!!this.skipNextUpdateAndMove) {
				return;
			}

			//fly if we have a negative vertical deplacement OR we leave our blocks
			if((this.isLanded && this.velocity.y < 0) ||
				(!!this.landedBlock && (this.position.x + this.width < this.landedBlock.vertexTL.x || this.position.x > this.landedBlock.vertexTR.x ))) {
				this.unlanded();
			}

			//adding gravity if we are not landed or outside of our landed block
			if(!this.isLanded) {
				this.acceleration = deimos.physic.Gravity.duplicate();
				this.acceleration.y *=  this.mass;
			} else {
				this.acceleration.y = 0;
			}

			var returnIntegrate = org.dbyzero.tools.Physics.integrateKM4(this.position,this.velocity,this.acceleration,dt/1000);
			this.toMove.x += returnIntegrate.dx.x;
			this.toMove.y += returnIntegrate.dx.y;
			this.velocity.x += returnIntegrate.dv.x;
			this.velocity.y += returnIntegrate.dv.y;
			this.toMove.x += (this.velocity.x * dt/1000);
			this.toMove.y += (this.velocity.y * dt/1000);

			this.toMove.x = this.toMove.x;
			this.toMove.y = this.toMove.y;

			this.lastUpdate = now;
		},

		move: function() {
			if(!!this.skipNextUpdateAndMove) {
				this.skipNextUpdateAndMove = false;
				return;
			}

			if( this.toMove.x === 0 && this.toMove.y ===0) {
				this.currentAction = 'stand';
				return false;
			} else {
				var currentMovement = this.toMove;
			}

			var initialPosition = {x:this.position.x,y:this.position.y};
			var domElem = this.domElem;

			//move ~~~~~
			this.position.add(currentMovement);

			//check collision with Zone
			if(this.position.x < 0) {
				this.position.x = 0;
				this.onAreaCollisionLeft();
			}
			if(this.position.x + this.width > deimos.Engine.zone.width) {
				this.position.x = deimos.Engine.zone.width - this.width;
				this.onAreaCollisionRight();
			}
			if(this.position.y < 0) {
				this.position.y = 0;
				this.onAreaCollisionTop();
			}
			if(this.position.y + this.height > deimos.Engine.zone.height) {
				this.position.y = deimos.Engine.zone.height - this.height;
				this.onAreaCollisionBottom();
			}

			//colision with bloacks
			if(this.collisionTypeEnabled['blocks']) this.checkBlocksCollision( currentMovement );
			if(this.collisionTypeEnabled['bonus']) this.checkElementCollision( currentMovement, deimos.Engine.scene.items );
			if(this.collisionTypeEnabled['monsters']) this.checkElementCollision( currentMovement, deimos.Engine.scene.monsters );
			if(this.collisionTypeEnabled['projectiles']) this.checkElementCollision( currentMovement, deimos.Engine.scene.projectiles );

			var deltaMove = org.dbyzero.tools.Vector.Sub(this.position,initialPosition);
			if(deltaMove.x != 0 || deltaMove.y !=0) {
				//send sync when move
				this.inMove = true;
				this.render();
				this.onMove();
			} else {
				this.inMove = false
			}

			//reset movement
			this.toMove = Vector.Zero();

			//set animation
			this.currentAction;
			if(deltaMove.x !== 0) {
				this.currentAction = 'walk';
				if(deltaMove.x > 0) this.oriented = 'right';
				if(deltaMove.x < 0) this.oriented = 'left';
			} else {
				this.currentAction = 'stand';
			}
			if(deltaMove.y != 0) this.currentAction = 'fly';

		},

		checkBlocksCollision: function( currentMovement ) {
			//check for collision
			var blocks = org.dbyzero.deimos.Engine.zone.blocks;
			var testCollision = null;
			var keys = Object.keys(blocks);
			var block,i;
			for(i = 0; i < keys.length; i++) {
				block = blocks[keys[i]];
				//do not check if we not collide on plateforme
				if(block.type.type === 'plateform' && !this.collisionTypeEnabled['plateforme']) {
					continue;
				}
				//we dont check for collision if avatar go bottom and block is a plateform
				//collision from avatar bottom
				if(block.type.type != 'plateform' || (block.type.type == 'plateform' && this.goingDown == false)) {
					if(currentMovement.y > 0) {
						testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
							this.vertexBL,
							{x:this.position.x,y:this.position.y + this.height},
							block.vertexTL,
							block.vertexTR
						);
						
						if(testCollision !== false) {
							this.onBlockCollisionBottom(testCollision,block);
							continue;
						}

						testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
							this.vertexBR,
							{x:this.position.x + this.width,y:this.position.y + this.height},
							block.vertexTL,
							block.vertexTR
						);
						
						if(testCollision !== false) {
							this.onBlockCollisionBottom(testCollision,block);
							continue;
						}
					}
				}

				//we stop here for plateforme
				if(block.type.type == 'plateform') continue;

				//collision from avatar top
				if(currentMovement.y < 0) {
					testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
						this.vertexTL,
						{x:this.position.x,y:this.position.y},
						block.vertexBL,
						block.vertexBR
					);
					
					if(testCollision !== false) {
						this.onBlockCollisionTop(testCollision,block);
						continue;
					}

					testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
						this.vertexTR,
						{x:this.position.x + this.width,y:this.position.y},
						block.vertexBL,
						block.vertexBR
					);
					
					if(testCollision !== false) {
						this.onBlockCollisionTop(testCollision,block);
						continue;
					}
				}

				//collision from avatar left
				if(currentMovement.x < 0) {
					testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
						this.vertexTL,
						{x:this.position.x,y:this.position.y},
						block.vertexTR,
						block.vertexBR
					);
					
					if(testCollision !== false) {
						this.onBlockCollisionLeft(testCollision,block);
						continue;
					}

					testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
						this.vertexBL,
						{x:this.position.x,y:this.position.y + this.height},
						block.vertexTR,
						block.vertexBR
					);
					
					if(testCollision !== false) {
						this.onBlockCollisionLeft(testCollision,block);
						continue;
					}
				}

				//collision from avatar right
				if(currentMovement.x > 0) {
					testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
						this.vertexTR,
						{x:this.position.x + this.width,y:this.position.y},
						block.vertexTL,
						block.vertexBL
					);
					
					if(testCollision !== false) {
						this.onBlockCollisionRight(testCollision,block);
						continue;
					}

					testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
						this.vertexBR,
						{x:this.position.x + this.width,y:this.position.y + this.height},
						block.vertexTL,
						block.vertexBL
					);
					
					if(testCollision !== false) {
						this.onBlockCollisionRight(testCollision,block);
						continue;
					}
				}
			}
		},

		checkElementCollision: function( currentMovement, elements ) {
			var testCollision = null;
			var keys = Object.keys(elements);
			var i,element;
			for(i = 0; i < keys.length; i++) {
				element = elements[keys[i]];
				//collision from avatar bottom
				if(currentMovement.y > 0) {
					testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
						this.vertexBL,
						{x:this.position.x,y:this.position.y + this.height},
						element.vertexTL,
						element.vertexTR
					);
					
					if(testCollision !== false) {
						this.onElementCollisionBottom(testCollision,element);
						continue;
					}

					testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
						this.vertexBR,
						{x:this.position.x + this.width,y:this.position.y + this.height},
						element.vertexTL,
						element.vertexTR
					);
					
					if(testCollision !== false) {
						this.onElementCollisionBottom(testCollision,element);
						continue;
					}
				}

				//collision from avatar top
				if(currentMovement.y < 0) {
					testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
						this.vertexTL,
						{x:this.position.x,y:this.position.y},
						element.vertexBL,
						element.vertexBR
					);
					
					if(testCollision !== false) {
						this.onElementCollisionTop(testCollision,element);
						continue;
					}

					testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
						this.vertexTR,
						{x:this.position.x,y:this.position.y},
						element.vertexBL,
						element.vertexBR
					);
					
					if(testCollision !== false) {
						this.onElementCollisionTop(testCollision,element);
						continue;
					}
				}

				//collision from avatar left
				if(currentMovement.x < 0) {
					testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
						this.vertexTL,
						{x:this.position.x,y:this.position.y},
						element.vertexTR,
						element.vertexBR
					);
					
					if(testCollision !== false) {
						this.onElementCollisionLeft(testCollision,element);
						continue;
					}

					testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
						this.vertexBL,
						{x:this.position.x,y:this.position.y + this.height},
						element.vertexTR,
						element.vertexBR
					);
					
					if(testCollision !== false) {
						this.onElementCollisionLeft(testCollision,element);
						continue;
					}
				}

				//collision from avatar right
				if(currentMovement.x > 0) {
					testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
						this.vertexTR,
						{x:this.position.x + this.width,y:this.position.y},
						element.vertexTL,
						element.vertexBL
					);
					
					if(testCollision !== false) {
						this.onElementCollisionRight(testCollision,element);
						continue;
					}

					testCollision = org.dbyzero.tools.Physics.SegmentsCollision(
						this.vertexBR,
						{x:this.position.x + this.width,y:this.position.y + this.height},
						element.vertexTL,
						element.vertexBL
					);
					
					if(testCollision !== false) {
						this.onElementCollisionRight(testCollision,element);
						continue;
					}
				}
			}
		},

		render: function() {
			var dom_elem = this.domElem;
			if(this.position !== undefined) {
				var translation = "translate3d("+parseInt(this.position.x - parseInt(this.deltashow.x))+"px,"+parseInt(this.position.y - parseInt(this.deltashow.y))+"px,0px)";
				dom_elem.style.transform = translation;
				dom_elem.style.webkitTransform = translation;

				if(!!this.HP) {
					this.renderHP();
				}

				return true;
			}
			return false;
		},

		landed: function(element) {
			this.isLanded = true;
			this.landedBlock = element;
			this.onJustLand()
		},

		unlanded: function() {
			this.isLanded = false;
			this.landedBlock = null;
			this.onUnland()
		},

		onJustLand: function() {
			//stub
		},

		onUnland: function() {
			//stub
		},

		onMove: function() {
			this.vertexTL.x = this.position.x;
			this.vertexTL.y = this.position.y;
			this.vertexBL.x = this.position.x;
			this.vertexBL.y = this.position.y + this.height;
			this.vertexTR.x = this.position.x + this.width;
			this.vertexTR.y = this.position.y;
			this.vertexBR.x = this.position.x + this.width;
			this.vertexBR.y = this.position.y + this.height;
		},

		onBlockCollision: function( collisionCoord, collisionElement ) {
		},

		onAreaCollision: function() {
			//stub
		},

		onElementCollision: function(collisionCoord, collisionElement) {
			collisionElement.destroy();
		},

		onAreaCollisionRight: function() {
			this.velocity.x = 0;
			this.onAreaCollision();
		},

		onAreaCollisionLeft: function() {
			this.velocity.x = 0;
			this.onAreaCollision();
		},

		onAreaCollisionTop: function() {
			this.velocity.y = 0;
			this.onAreaCollision();
		},

		onAreaCollisionBottom: function() {
			this.velocity.y = 0;
			this.onAreaCollision();
			this.landed(false);
		},

		onElementCollisionRight: function(collisionCoord, collisionElement) {
			this.onElementCollision(collisionCoord, collisionElement);
		},

		onElementCollisionLeft: function(collisionCoord, collisionElement) {
			this.onElementCollision(collisionCoord, collisionElement);
		},

		onElementCollisionTop: function(collisionCoord, collisionElement) {
			this.onElementCollision(collisionCoord, collisionElement);
		},

		onElementCollisionBottom: function(collisionCoord, collisionElement) {
			this.onElementCollision(collisionCoord, collisionElement);
		},

		onBlockCollisionBottom: function( collisionCoord, collisionElement ) {
			this.landedBlock = collisionElement;
			this.position.y = collisionCoord.y - this.height;
			this.velocity.y = 0;
			this.landed(collisionElement);
			this.onBlockCollision(collisionCoord, collisionElement );
		},

		onBlockCollisionTop: function( collisionCoord, collisionElement ) {
			this.position.y = collisionCoord.y;
			this.velocity.y = 0;
			this.onBlockCollision(collisionCoord, collisionElement );
		},

		onBlockCollisionLeft: function( collisionCoord, collisionElement ) {
			this.position.x = collisionCoord.x;
			this.velocity.x = 0;
			this.onBlockCollision(collisionCoord, collisionElement );
		},

		onBlockCollisionRight: function( collisionCoord, collisionElement ) {
			this.position.x = collisionCoord.x - this.width;
			this.velocity.x = 0;
			this.onBlockCollision(collisionCoord, collisionElement );
		},

		correctPositionWithServer:function(timestamp){
			//fix position from server
			var stepInPast = parseInt((deimos.Engine.currentLag)  / deimos.Config.INTERPOLATION_TIMESTEP);

			var deltaX = this.positionServer.x - parseInt(this.position.x);
			var deltaY = this.positionServer.y - parseInt(this.position.y);
			var squareHypothenus = deltaX*deltaX + deltaY*deltaY;
			if(deimos.Config.SQUARE_AUTHORITY < squareHypothenus) {
				this.position.x = this.positionServer.x;
				this.position.y = this.positionServer.y;
				this.skipNextUpdateAndMove = true;
				this.onMove();
				this.render();
				//we unland it to check collision with new position
				this.unlanded();
			}
		},

		bindEvent : function() {
			//stub
		},

		unbindEvent : function() {
			//stub
		},

		updateAnimation : function() {
			if(this.oriented !== 'right' && this.oriented !== 'left') throw 'Unknow direction '+this.oriented;
			var domElem = this.domElem;
			var classAnimation = null;

			if(this.isAttacking()) {
				classAnimation = this.dictClass['shooting_'+this.oriented];
			} else {
				switch(this.currentAction){
					case "fly":
						classAnimation = this.dictClass['flying_'+this.oriented];
						break;
					case "jump":
						classAnimation = this.dictClass['jumping_'+this.oriented];
						break;
					case "walk":
						classAnimation = this.dictClass['walking_'+this.oriented];
						break;
					default:
						classAnimation = this.dictClass['standing_'+this.oriented];
						break;
				}
			}

			domElem.className = classAnimation;
		},

		/**
		 * Name
		 */
		initName : function (main) {
			var dom_elem_name = document.createElement("div");
			dom_elem_name.setAttribute("id",this.domId+'_name') ;

			dom_elem_name.style.position = "absolute";
			dom_elem_name.innerHTML = this.name;
			dom_elem_name.style.display  = 'none' ;
			dom_elem_name.style.fontSize = '16px';
			dom_elem_name.style.fontWeight = 'bold';
			dom_elem_name.style.color = !!main ? 'rgb(128, 151, 224)' : 'rgb(224, 128, 128)';
			dom_elem_name.style.zIndex = 10;
			dom_elem_name.style.textShadow = 'white -2px -2px 2px, white 2px 2px 2px, white -2px 2px 2px, white 2px -2px 2px';

			deimos.Engine.zone.area.appendChild(dom_elem_name) ;
			dom_elem_name.style.display  = 'block' ;

			this.domElemName = document.getElementById(this.domId+'_name');

			this.nameWidth = dom_elem_name.offsetWidth;
			this.nameHeight = dom_elem_name.offsetHeight;

			this.renderName.call(this);
		},

		/**
		 * Name
		 */
		initHP : function () {
			var domElemHP = document.createElement("div");
			domElemHP.setAttribute("id",this.domId+'_hp') ;

			domElemHP.style.position = "absolute";
			domElemHP.style.display  = 'none' ;
			domElemHP.style.zIndex = 10;
			domElemHP.style.width = ((this.HP/this.maxHP) * this.nameWidth)+'px';
			domElemHP.style.height = '3px';
			domElemHP.style.backgroundColor = '#A4C3A0';

			deimos.Engine.zone.area.appendChild(domElemHP) ;
			domElemHP.style.display  = 'block' ;

			this.domElemHP = document.getElementById(this.domId+'_hp');

			this.renderHP.call(this);
		},

		renderHP : function () {
			domElemHP = this.domElemHP ;
			var left = parseInt(this.position.x+(parseInt((this.domElemWidth-(2*this.deltashow.x))/2)-parseInt(this.nameWidth/2)));
			var top = parseInt(this.position.y-6);
			var translation = "translate3d("+left+"px,"+top+"px,0px)";
			domElemHP.style.transform = translation;
			domElemHP.style.webkitTransform = translation;
			domElemHP.style.width = ((this.HP/this.maxHP) * this.nameWidth)+'px';
		},

		renderName : function () {
			dom_elem_name = this.domElemName ;
			var left = parseInt(this.position.x+(parseInt((this.domElemWidth-(2*this.deltashow.x))/2)-parseInt(this.nameWidth/2)));
			var top = parseInt(this.position.y-this.nameHeight-6);
			var translation = "translate3d("+left+"px,"+top+"px,0px)";
			dom_elem_name.style.transform = translation;
			dom_elem_name.style.webkitTransform = translation;
		},

		/**
		 * Speaker
		 */
		initSpeaker : function (readonly) {
			this.speaker = new deimos.element.Speaker(this.domId, readonly) ;
			this.speaker.init();
		},

		renderSpeaker : function () {
			this.speaker.render(this.position.x - 50 ,this.position.y - 74);
		},

		setSpeaking : function (bool) {
			this.speaking = bool ;
			if(bool) {
				this.renderSpeaker();
				this.speaker.show();
			} else {
				this.lastSayed = new Date().getTime();
				this.speaker.leaveFocus();
				if(this.saying.length === 0) this.speaker.hide();
			}
		},

		isAttacking : function() {
			return (
				!!this.attack && //if has attack 
				(this.lastAttack + this.attackRate > new Date().getTime()) //and attack in timer
			);
		},

		attack : function(whichOne) {
			if(!whichOne) {
				if(!this.isAttacking()) {
					this.lastAttack = new Date().getTime();
					var _t = deimos.Engine._t;
					var message = {};
					message[_t['ACTION']] = _t['ACTION_ATTACK'];
					message[_t['MESSAGE']] = {};
					message[_t['MESSAGE']][_t['MESSAGE_DIRECTION']] = this.oriented;
					message[_t['MESSAGE']][_t['MESSAGE_POSITION']] = {};
					message[_t['MESSAGE']][_t['MESSAGE_POSITION']].x = parseInt(this.position.x);
					message[_t['MESSAGE']][_t['MESSAGE_POSITION']].y = parseInt(this.position.y);
					deimos.Engine.networkManager.sendMessage(message);
				} else {
					Log.info('Have to wait');
				}
				
			} else {
				Log.error('Only main attack is implemented');
			}
		},

		touched: function(elementCollision) {
			var damage = elementCollision.damage;
			if(isFinite(damage)) {
				this.HP -= damage;
				this.renderHP();
			}
		},

		die: function(elementCollision) {
			this.destroy();
		},

		cleanDom: function() {
			this.unbindEvent();
			if(!!this.speaker) this.cleanDomSpeaker();
			if(this.domElemHP) this.cleanDomHP();
			if(this.domElemName) this.cleanDomName();
			if(this.domElem) this.cleanDomElem();
		},

		cleanDomElem : function() {
			var nodeAvatar = this.domElem;
			var parentNode = nodeAvatar.parentNode;
			if(parentNode) parentNode.removeChild(nodeAvatar);
		},

		cleanDomName : function() {
			var dom_elem_name = this.domElemName ;
			var parentNode = dom_elem_name.parentNode;
			if(parentNode) parentNode.removeChild(dom_elem_name);
		},

		cleanDomHP : function() {
			var dom_elem_hp = this.domElemHP ;
			var parentNode = dom_elem_hp.parentNode;
			if(parentNode) parentNode.removeChild(dom_elem_hp);
		},

		cleanDomSpeaker : function() {
			var speakingBox = this.speaker.domElem;
			var parentNode = speakingBox.parentNode;
			if(parentNode) parentNode.removeChild(speakingBox);
		}
	}

})(org.dbyzero.deimos, document);
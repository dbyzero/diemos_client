/**
 *
 * Item Object
 *
 * @author dbyzero
 * @date : 2014/11/27
 * @description : Item model
 *
 **/

(function(deimos,document,undefined) {

	deimos.element = deimos.element || {} ;

	/**
	 * Item constructor
	 *
	 **/
	var Item = deimos.element.Item = function (serverid,position,velocity,acceleration,size,mass,templateid,skin,color,name,orientation,deltashow) {
		Item._super.call(this,position,size,serverid,deltashow);
		this.domId = 'item_' + serverid + '_' + new Date().getTime() + '_' + Math.floor((Math.random()*1000000)+1); ;
		this.velocity = velocity;
		this.acceleration = acceleration;
		this.move_speed = 0;
		this.jump_speed = 0;
		this.skin = skin;
		this.templateId = templateid;
		this.color = color;
		this.name = name;
		this.deltashow = deltashow;
		this.mass = mass;
	}

	org.dbyzero.tools.Inherit(deimos.element.Item, deimos.element.Element);


	deimos.element.Item.prototype.init = function(){
		Item._super.prototype.init.call(this);
		this.domElem.className = "item_"+this.skin;

		//set spritesheet
		this.domElem.style.backgroundImage = "url("+deimos.Config.remoteServer.assetURL+"/spritesheet/item/"+this.templateId+"/"+this.color+"/spritesheet.png)";
		this.domElem.style.backgroundPositionX = "-800px";

		//show main name
		if(!!this.name) this.initName(true);

		this.nameWidth = dom_elem_name.offsetWidth;
		this.nameHeight = dom_elem_name.offsetHeight;
	}

	deimos.element.Item.prototype.onMove = function() {
		Item._super.prototype.onMove.call(this);
		if(!!this.name) this.renderName();
	}

	deimos.element.Item.prototype.render = function() {
		if(Item._super.prototype.render.call(this)) {
			if(!!this.name) this.renderName();
		}
	}

	/**
	 * Name
	 */
	deimos.element.Item.prototype.initName = function () {
		if(this.name !== '') {
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
	}

	deimos.element.Item.prototype.destroy = function() {
		Item._super.prototype.destroy.call(this);
		delete deimos.Engine.scene.items[this.serverid];
	}

})(org.dbyzero.deimos, document);
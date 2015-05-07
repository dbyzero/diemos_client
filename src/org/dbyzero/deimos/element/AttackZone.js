/**
 *
 * org.dbyzero.deimos.element.AttackZone Object
 *
 * @author dbyzero
 * @date : 2015/01/21
 * @description : Attack zone create to damage other entities
 *
 **/


(function(deimos,document,undefined) {
	var Vector = org.dbyzero.tools.Vector;
	deimos.element = deimos.element || {} ;

	/**
	 * AttackZone constructon
	 * 
	 * @param position Vector position of the block inside the zone
	 * @param size Vector size of the block inside the zone
	 *
	 * */
	deimos.element.AttackZone = function(id,position,size,ownerId,duration) {
		this.id			= id;
		this.domId		= 'attackzone-'+id;
		this.position	= position;
		this.size		= size;
		this.ownerId	= ownerId;
		this.duration	= duration;
		this.vertexTL = new Vector(position.x,				position.y);
		this.vertexTR = new Vector(position.x + size.x,		position.y);
		this.vertexBL = new Vector(position.x,				position.y + size.y);
		this.vertexBR = new Vector(position.x + size.x,		position.y + size.y);
		this.lastUpdate = new Date().getTime();
	}

	deimos.element.AttackZone.prototype.render = function(dt, now) {
		var dom_elem = document.createElement("div");
		dom_elem.setAttribute("id",this.domId);

		dom_elem.style.width = parseInt(this.size.x)+'px';
		dom_elem.style.height  = parseInt(this.size.y)+'px';

		dom_elem.style.display  = 'block';
		dom_elem.style.position  = 'absolute';

		dom_elem.style.backgroundColor  = '#333';
		dom_elem.style.opacity  = '0.5';

		var translation = "translate3d("+(this.position.x)+"px,"+(this.position.y)+"px,0px)";
		dom_elem.style.transform = translation;
		dom_elem.style.webkitTransform = translation;

		deimos.Engine.zone.area.appendChild(dom_elem);

		this.domElem = document.getElementById(this.domId);
		this.domElemWidth = this.domElem.offsetWidth;//usefull for positionning name and speaker
		this.domElemHeight = this.domElem.offsetHeight;//usefull for positionning name and speaker
	}

	deimos.element.AttackZone.prototype.update = function(dt, now) {
		this.duration += (this.lastUpdate - new Date().getTime());
		if(this.duration < 0) {
			return false;
		}
	}

	deimos.element.AttackZone.prototype.destroy = function() {
		this.cleanDom();
	}

	deimos.element.AttackZone.prototype.cleanDom = function() {
		var parentNode =  this.domElem.parentNode;
		if(parentNode) parentNode.removeChild(this.domElem);
	}

})(org.dbyzero.deimos, document);
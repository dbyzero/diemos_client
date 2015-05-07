/**
 *
 * org.dbyzero.deimos.element.Zone Object
 *
 * @author dbyzero
 * @date : 2013/08/04
 * @description : Zone game
 *
 **/


(function(deimos,document,undefined) {
	deimos.element = deimos.element || {} ;
	
	/**
	 * Zone constructon
	 * 
	 * @param domId document id of the gamezone, where the action append !
	 *
	 * */
	deimos.element.Zone = function(name, domId, blocks) {
		this.area = document.getElementById(domId) ;
		this.width = this.area.offsetWidth;
		this.height = this.area.offsetHeight;
		this.blocks = blocks ;
		this.name = name ;
	}

	deimos.element.Zone.prototype = {
		addBlockById : function(blockId,type) {
			var domElem = document.getElementById(blockId) ;
			var position = new org.dbyzero.tools.Vector(domElem.offsetLeft,domElem.offsetTop) ;
			var size = new org.dbyzero.tools.Vector(domElem.offsetWidth,domElem.offsetHeight) ;

			var type = (type == 'plateforme' ? deimos.element.Block.type.PLATEFORM : deimos.element.Block.type.BLOCK) ;
			var block = new deimos.element.Block(position,size,type) ;
			this.addBlock(block) ;
		},
		addBlock : function(block) {
			this.blocks.push(block) ;
		},
	}

})(org.dbyzero.deimos, document);
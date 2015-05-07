/**
 *
 * org.dbyzero.deimos.element.Block Object
 *
 * @author dbyzero
 * @date : 2013/08/21
 * @description : Block game
 *
 **/


(function(deimos,document,undefined) {
	var Vector = org.dbyzero.tools.Vector;
	deimos.element = deimos.element || {} ;

	/**
	 * Block constructon
	 * 
	 * @param position Vector position of the block inside the zone
	 * @param size Vector size of the block inside the zone
	 *
	 * */
	deimos.element.Block = function(position,size,type) {
		this.position 	= position ;
		this.height	= size.y ;
		this.width	= size.x ;
		this.type	= type ;
		this.id = 'block_'+position.x+'_'+position.y+'_'+size.x+'_'+size.y+'_'+Math.floor(Math.random() * 100000 + 1) ;
		this.vertexTL = new Vector(position.x,                  position.y);
		this.vertexTR = new Vector(position.x + size.x,         position.y);
		this.vertexBL = new Vector(position.x,                  position.y + size.y);
		this.vertexBR = new Vector(position.x + size.x,         position.y + size.y);
	}

	deimos.element.Block.type = {
		BLOCK : {value: 0, type:'block'},
		PLATEFORM : {value: 1, type:'plateform'},
	}

})(org.dbyzero.deimos, document);
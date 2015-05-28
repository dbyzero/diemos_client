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
	deimos.element.Zone = function(name, domId, width, height, blocks) {
		this.area = document.getElementById(domId) ;
		this.width = width;
		this.height = height;
		this.name = name ;
		this.blocks = [] ;
		this.domBlocks = [] ;
		var keys = Object.keys(blocks);
		for (var i = 0; i < keys.length; i++) {
			var block = blocks[keys[i]];
			this.addBlock(block);
		};
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
			var domBlock = document.createElement('div');
			domBlock.style.position = 'absolute';
			domBlock.style.backgroundColor = 'red';
			domBlock.style.width = block.width+'px';
			domBlock.style.height = block.height+'px';
			domBlock.style.left = block.position.x+'px';
			domBlock.style.top = block.position.y+'px';
			domBlock.style.backgroundColor = 'rgb(186, 186, 186)';
			this.area.appendChild(domBlock);
			this.blocks.push(block) ;
			this.domBlocks.push(domBlock) ;
		},

		destroy : function(block) {
			console.log('destroying zone');
			var keys = Object.keys(this.domBlocks);
			for (var i = 0; i < keys.length; i++) {
				var domBlock = this.domBlocks[keys[i]];
				var parentNode = domBlock.parentNode;
				if(parentNode) parentNode.removeChild(domBlock);
			};
			delete this.blocks;
			delete this.domBlocks;
		}
	}

})(org.dbyzero.deimos, document);
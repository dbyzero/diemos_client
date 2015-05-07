/**
 *
 * org.dbyzero.deimos.analyse.Manual
 *
 * @author dbyzero
 * @date : 2014/08/30
 * @description : Analyser by manually game area by browser
 *
 * */

var org = org || {} ;
org.dbyzero = org.dbyzero || {} ;
org.dbyzero.deimos = org.dbyzero.deimos || {} ;
org.dbyzero.deimos.analyser = org.dbyzero.deimos.analyser || {} ;

(function(deimos,document,undefined) {
	deimos.analyser.Manual = function(domID){
		this.areaDomId = domID;
		this.areaZone = document.getElementById(domID);
		this.blocksById = [];
		this.blocksByClass = [];
		this.blocksByTag = [];
		this.blocksParsed = [];
	}
	deimos.analyser.Manual.prototype.addBlock = function(selector, plateforme){
		//if ID
		var regex = new RegExp('^#','i');
		if(regex.test(selector)) {
			this.addBlockById(selector.substr(1),plateforme);
			return;
		}
		//if Class
		var regex = new RegExp('^\.','i');
		if(regex.test(selector)) {
			this.addBlockByClass(selector.substr(1),plateforme);
			return;
		}
		//if sector
		this.addBlockByTag(selector,plateforme);
		return this;
	}
	deimos.analyser.Manual.prototype.addBlockById = function(domId, plateforme){
		this.blocksById.push({'selector':domId,'plateforme':!!plateforme});
		return this;
	}
	deimos.analyser.Manual.prototype.addBlockByClass = function(className, plateforme){
		this.blocksByClass.push({'selector':className,'plateforme':!!plateforme});
		return this;
	}
	deimos.analyser.Manual.prototype.addBlockByTag = function(tagName, plateforme){
		this.blocksByTag.push({'selector':tagName,'plateforme':!!plateforme});
		return this;
	}
	deimos.analyser.Manual.prototype.getCoords = function(domContent,domBlock){
		//browse all parent to domContent to add there coord
		var left = 0;
		var top = 0;
		var domBrowse = domBlock; 
		while(domBrowse.offsetParent != domContent) {
			if(domBrowse.offsetParent == null) {
				return null;
			}
			left += domBrowse.offsetLeft;
			top += domBrowse.offsetTop;
			domBrowse = domBrowse.offsetParent;
		}
		left += domBrowse.offsetLeft;
		top += domBrowse.offsetTop;
		return {'left':left,'top':top};
	}
	deimos.analyser.Manual.prototype.addDomBlock = function(domBlock,id,block){
		//temp var used on process
		var coords,blockLeft,blockTop,blockHeight,blockWidth,blockJson;

		coords = this.getCoords(this.areaZone,domBlock);
		if(coords === null) {
			console.log('block is not a child of the area');
			return;
		}
		blockLeft = coords.left;
		blockTop = coords.top;
		blockHeight = domBlock.offsetHeight;
		blockWidth = domBlock.offsetWidth;
		blockJson = {
			"position":{"x":blockLeft,"y":blockTop},
			"height":blockHeight,"width":blockWidth,
			"type":{"value":0,"type":((block.plateforme)?'plateform':'blocks')},
			"id":"block-"+id+"-by-id-"+block.selector,
			"vertexTL":{"x":blockLeft,"y":blockTop},
			"vertexTR":{"x":blockLeft + blockWidth,"y":blockTop},
			"vertexBL":{"x":blockLeft,"y":blockTop + blockHeight},
			"vertexBR":{"x":blockLeft + blockWidth,"y":blockTop + blockHeight}
		}
		this.blocksParsed.push(blockJson);
	}
	deimos.analyser.Manual.prototype.exec = function(){
		console.log('...parsing');
		this.blocksParsed = [];

		//temp var used on process
		var blockId = 1;
		var domBlock,domBlocks,coords;

		//by id
		for (var i = 0; i < this.blocksById.length; i++) {
			domBlock = document.getElementById(this.blocksById[i].selector);
			this.addDomBlock(domBlock,blockId++,this.blocksById[i]);
		};

		//by class
		for (var iClass = 0; iClass < this.blocksByClass.length; iClass++) {
			domBlocks = document.getElementsByClassName(this.blocksByClass[iClass].selector);
			for (var j = 0; j < domBlocks.length; j++) {
				var domBlock = domBlocks[j];
				this.addDomBlock(domBlock,blockId++,this.blocksByClass[iClass]);
			};
		};

		//by section 
		//TODO
		console.log('done!');
		console.log(JSON.stringify(this.blocksParsed));
	}

})(org.dbyzero.deimos, document);

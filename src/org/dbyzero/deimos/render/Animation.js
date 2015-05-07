/**
 * Important : Actuellement deprecated mais on le garde si besoin en reto compat
 * 
 * org.dbyzero.deimos.render.Animation Object
 *
 * @author dbyzero
 * @date : 2013/08/10
 * @description : Animation model
 *
 * */

(function(deimos,document,undefined) {

	deimos.render = deimos.render || {} ;

	/**
	 * Animation constructor
	 * 
	 * @param spritesheet string of the animation spritesheet link
	 * @param speed integer delay between each animation in ms
	 *
	 * */
	deimos.render.Animation = {}

	deimos.render.Animation.Type = {
		WALK_RIGHT : {value: 0, type:'walk', direction:'right'},
		WALK_LEFT : {value: 1, type:'walk', direction:'left'},

		JUMP_RIGHT : {value: 2, type:'jump', direction:'right'},
		JUMP_LEFT : {value: 3, type:'jump', direction:'left'},
		
		SEE_RIGHT : {value: 4, type:'see', direction:'right'},
		SEE_LEFT : {value: 5, type:'see', direction:'left'},
		
		FLY_RIGHT : {value: 6, type:'fly', direction:'right'},
		FLY_LEFT : {value: 7, type:'fly', direction:'left'},
	}

	deimos.render.Animation.factory = function(type, direction, value) {
		var anim = null;
		for(var k in animation) {
			anim = animation[k];
			if(anim.value === value) return anim;
			if(anim.direction === direction && anim.type === type) return anim;
		}
		throw new Execption("Animation not find, args:"+Array.slice(arguments).join(','));
	}

})(org.dbyzero.deimos, document);
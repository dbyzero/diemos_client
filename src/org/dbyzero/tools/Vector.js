/**
 *
 * org.dbyzero.tools.Vector util class
 *
 * @author dbyzero
 * @date : 2013/08/09
 * @description : Vector tools
 *
 */
 
var org = org || {} ;
org.dbyzero = org.dbyzero || {} ;
org.dbyzero.tools = org.dbyzero.tools || {} ;

(function(tools,document,undefined) {

	/**
	 * Vector constructor
	 */

	tools.Vector = function(x,y) {
		this.x = x ;
		this.y = y ;
	}

	tools.Vector.Zero = function() {
		return new tools.Vector(0,0);
	}

	tools.Vector.Sum = function(vector1,vector2) {
		return new tools.Vector(parseFloat(vector1.x) + parseFloat(vector2.x), parseFloat(vector1.y) + parseFloat(vector2.y)) ;
	}

	tools.Vector.Sub = function(vector1,vector2) {
		return new tools.Vector(parseFloat(vector1.x) - parseFloat(vector2.x), parseFloat(vector1.y) - parseFloat(vector2.y)) ;
	}

	tools.Vector.Dot = function(vector1,vector2) {
		return new tools.Vector(parseFloat(vector1.x) * parseFloat(vector2.x), parseFloat(vector1.y) * parseFloat(vector2.y)) ;
	}

	tools.Vector.Scalar = function(vector1,scal) {
		return new tools.Vector(parseFloat(vector1.x) * scal, parseFloat(vector1.y) * scal) ;
	}

	tools.Vector.prototype.add = function(vectorToAdd) {
		this.x = vectorToAdd.x + this.x ;
		this.y = vectorToAdd.y + this.y ;
	}

	tools.Vector.prototype.sub = function(vectorToAdd) {
		this.x = vectorToAdd.x - this.x ;
		this.y = vectorToAdd.y - this.y ;
	}

	tools.Vector.prototype.dot = function(vec_) {
		this.x = vec_.x * this.x ; 
		this.y = vec_.y * this.y ;
	}

	tools.Vector.prototype.scalar = function(scal) {
		this.x = scal * this.x ;
		this.y = scal * this.y ;
	}

	tools.Vector.prototype.duplicate = function() {
		return new tools.Vector(this.x,this.y) ;
	}

	tools.Vector.prototype.lengthSquare = function() {
		return (this.x*this.x + this.y*this.y) ;
	}

	//if possible, prefeatr lengthSquare who is faster
	tools.Vector.prototype.length = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y) ;
	}

	tools.Vector.prototype.toString = function() {
		return this.x+"x"+this.y;
	}
})(org.dbyzero.tools, document);
/**
 *
 * org.dbyzero.tools.Inherit Object
 *
 * @author dbyzero
 * @date : 2014/03/22
 * @description : Inherit tools
 * 
 */

var org = org || {} ;
org.dbyzero = org.dbyzero || {} ;
org.dbyzero.tools = org.dbyzero.tools || {} ;

(function(tools,document,undefined) {

	tools.Inherit = function(obj, parent) {

		for (var prop in parent) {
			obj[prop] = parent[prop];
		}

		obj._super = parent;
		obj.prototype = Object.create(parent.prototype, {
			constructor: {
				value: obj,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
	}
})(org.dbyzero.tools,document);
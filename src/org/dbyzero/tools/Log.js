/**
 *
 * org.dbyzero.tools.Log Object
 *
 * @author dbyzero
 * @date : 2013/07/28
 * @description : Log model
 * 
 */
var org = org || {} ;
org.dbyzero = org.dbyzero || {} ;
org.dbyzero.tools = org.dbyzero.tools || {} ;

(function(tools,document,undefined) {

	//private
	var getDate = function(msg) {
		var d = new Date() ;
		return '('+
			d.getFullYear() + '/' + 
			str_pad(d.getMonth(),2,'0') + '/' + 
			str_pad(d.getDate(),2,'0') + ' ' + 
			str_pad(d.getHours(),2,'0') + ':' + 
			str_pad(d.getMinutes(),2,'0') + ':' + 
			str_pad(d.getSeconds(),2,'0') + ')' ;
	};
	var str_pad = function (input, pad_length, pad_string, pad_type) {
		// http://kevin.vanzonneveld.net
		// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// + namespaced by: Michael White (http://getsprink.com)
		// +      input by: Marco van Oort
		// +   bugfixed by: Brett Zamir (http://brett-zamir.me)
		// *     example 1: str_pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT');
		// *     returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
		// *     example 2: str_pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH');
		// *     returns 2: '------Kevin van Zonneveld-----'
		var half = '',
		pad_to_go;

		var str_pad_repeater = function (s, len) {
		var collect = '',
		i;

		while (collect.length < len) {
		collect += s;
		}
		collect = collect.substr(0, len);

		return collect;
		};

		input += '';
		pad_string = pad_string !== undefined ? pad_string : ' ';

		if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH') {
			pad_type = 'STR_PAD_LEFT';
		}
		if ((pad_to_go = pad_length - input.length) > 0) {
			if (pad_type === 'STR_PAD_LEFT') {
				input = str_pad_repeater(pad_string, pad_to_go) + input;
			} else if (pad_type === 'STR_PAD_RIGHT') {
				input = input + str_pad_repeater(pad_string, pad_to_go);
			} else if (pad_type === 'STR_PAD_BOTH') {
				half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
				input = half + input + half;
				input = input.substr(0, pad_length);
			}
		}

		return input;
	}

	/**
	 * Log methods
	 *
	 * */
	tools.Log = {
		"gay" : function(msg) {
			console.log('rainbow:' + ' ' + getDate() + ' : ' + msg)
		},
		"success" : function(msg) {
			console.log('success:' + ' ' + getDate() + ' : ' + msg)
		},
		"info" : function(msg) {
			console.log('info:' + '    ' + getDate() + ' : ' + msg)
		},
		"debug" : function(msg) {
			console.log('debug:' + '   ' + getDate() + ' : ' + msg)
		},
		"warning" : function(msg) {
			console.warn('warning:' + ' ' + getDate() + ' : ' + msg)
		},
		"error" : function(msg) {
			console.error('error:' + '   ' + getDate() + ' : ' + msg)
		},
		"alert" : function(msg) {
			console.error('alert:' + '   ' + getDate() + ' : ' + msg)
		}
	}
})(org.dbyzero.tools, document);
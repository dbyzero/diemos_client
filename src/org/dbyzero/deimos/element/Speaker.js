/**
 *
 * Speaker Object
 *
 * @author dbyzero
 * @date : 2013/08/29
 * @description : Speaker model
 *
 **/

(function(deimos,document,undefined) {

	deimos.element = deimos.element || {} ;

	/***
	 * Speaker constructor
	 * 
	 **/
	deimos.element.Speaker = function (avId, readonly) {
		this.id = 'speaker_' + avId + '_' + Math.floor((Math.random()*1000000)+1);
		this.readonly = readonly;
	}


	deimos.element.Speaker.prototype = {
		init: function() {
			var gamezone = deimos.Engine.zone.area ;
				
			//make dom element
			var dom_elem = document.createElement("div");
			dom_elem.setAttribute("class","speaker") ;
			dom_elem.setAttribute("id",this.id) ;
			//dom_elem.style.backgroundColor = 'red' ;

			if(this.readonly) {
				dom_elem.style.backgroundPosition = '0px -100px' ;
			}
			var textArea = document.createElement("textarea") ;
			if(this.readonly) {
				textArea.readOnly = true; 
			}
			dom_elem.appendChild(textArea) ;
			gamezone.appendChild(dom_elem) ;
			this.domElem = document.getElementById(this.id);
		},

		getText: function() {
			var domElem = this.domElem;
			return domElem.childNodes[0].value ;
		},

		setText: function(txt) {
			var domElem = this.domElem;
			domElem.childNodes[0].value = txt;
		},

		show: function() {
			var domElem =  this.domElem;
			domElem.style.display = 'block';
			if(this.readonly !== true)
			{
				domElem.childNodes[0].focus() ;
			}
		},

		hide: function() {
			var domElem =  this.domElem;
			domElem.style.display = 'none';
			domElem.childNodes[0].value = '';
			if(this.readonly !== true)
			{
				this.leaveFocus();
			}
		},

		leaveFocus: function() {
			var domElem =  this.domElem;
			domElem.childNodes[0].blur() ;
		},

		render: function(x,y) {
			var domElem =  this.domElem;
			var translation = "translate3d("+x+"px,"+y+"px,0px)";
			domElem.style.transform = translation;
			domElem.style.webkitTransform = translation;
		}
	}

})(org.dbyzero.deimos, document);
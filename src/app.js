var oldOnLoadFunction = window.onload;
window.onload = function(){
	org.dbyzero.deimos.version = '0.1.3';

	if(!!oldOnLoadFunction) {
		oldOnLoadFunction();
	}

	//start game if all is good in configuration
	if(org.dbyzero.deimos.Engine.init() === true)
		org.dbyzero.deimos.Engine.start() ;

};
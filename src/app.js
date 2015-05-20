var oldOnLoadFunction = window.onload;
window.onload = function(){
	org.dbyzero.deimos.version = '0.1.3';

	if(!!oldOnLoadFunction) {
		oldOnLoadFunction();
	}

	//start game if all is good in configuration
	serverUrl = "localhost";
	serverPort = 1337;
	serverAssetURL = "http://localhost:1080";

	if(org.dbyzero.deimos.Engine.init(serverUrl,serverPort,serverAssetURL) === true)
		org.dbyzero.deimos.Engine.start() ;

};
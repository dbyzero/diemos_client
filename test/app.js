var oldOnLoadFunction = window.onload;
window.onload = function(){
	org.dbyzero.deimos.version = '0.1.3';

	if(!!oldOnLoadFunction) {
		oldOnLoadFunction();
	}

	//start game if all is good in configuration
	var config = {
		serverUrl : "localhost",
		serverPort : 40004,
		serverAssetURL : "http://localhost:8080"
	};

	org.dbyzero.deimos.Engine.start(config);

};
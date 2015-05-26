/**
 *
 * org.dbyzero.deimos.Config Object
 *
 * @author dbyzero
 * @date : 2013/08/09
 * @description : Config of the application
 *
 * */

var org = org || {} ;
org.dbyzero = org.dbyzero || {} ;
org.dbyzero.deimos = org.dbyzero.deimos || {} ;

(function(deimos,document,undefined) {
	deimos.Config = {};
	deimos.Config.FPS = 60;
	deimos.Config.mode = "debug",
	deimos.Config.messageLevel = "verbose",
	deimos.Config.FPS = 60;
	deimos.Config.GAME_SPEED = 33;
	deimos.Config.SQUARE_AUTHORITY = 100*100;
	deimos.Config.DELTA_SERVER_SYNC = 5000;
	deimos.Config.showOwnMirror = false;

	/******
	 * UI
	 *****/
	deimos.Config.ui = {};

	deimos.Config.ui.chatDomId = 'org.dbyzero.deimos.messageArea';
	deimos.Config.ui.disconnectDomId = 'org.dbyzero.deimos.gamePopup.disconnect';

	deimos.Config.ui.indication = {};
	deimos.Config.ui.indication.lag = 'org.dbyzero.deimos.gamePopup.indicatorLag';
	deimos.Config.ui.indication.fps = 'org.dbyzero.deimos.gamePopup.indicatorFps';
	deimos.Config.ui.indication.connectionStatus = 'org.dbyzero.deimos.gamePopup.indicatorConnected';
	deimos.Config.ui.indication.serverStatus = 'org.dbyzero.deimos.gamePopup.indicatorServer';

	deimos.Config.ui.login = {};
	deimos.Config.ui.login.formDomId = 'org.dbyzero.deimos.gamePopup.loginForm';
	deimos.Config.ui.login.sectionDomId = 'org.dbyzero.deimos.gamePopup.sectionLogin';
	deimos.Config.ui.login.inputLoginDomId = 'org.dbyzero.deimos.gamePopup.loginInput';
	deimos.Config.ui.login.inputPasswordDomId = 'org.dbyzero.deimos.gamePopup.passwordInput';

	deimos.Config.ui.chooseAvatar = {};
	deimos.Config.ui.chooseAvatar.sectionDomId = 'org.dbyzero.deimos.gamePopup.sectionChooseAvatar';
	deimos.Config.ui.chooseAvatar.formDomId = 'org.dbyzero.deimos.gamePopup.formChooseAvatar';
	deimos.Config.ui.chooseAvatar.avatarListDomId = 'org.dbyzero.deimos.gamePopup.avatarList';
	deimos.Config.zone = {};

})(org.dbyzero.deimos, document);
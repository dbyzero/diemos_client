/**
 *
 * org.dbyzero.deimos.network.Message Object
 *
 * @author dbyzero
 * @date : 2013/02/02
 * @description : Network message
 *
 * */

var org = org || {};
org.dbyzero = org.dbyzero || {};
org.dbyzero.deimos = org.dbyzero.deimos || {};

(function(deimos,document,undefined) {
	deimos.network = org.dbyzero.deimos.network || {};
	
	deimos.network.Message = {};

	deimos.network.Message.CODE = {
		"text":{
			"DATE":"d",
			"ID":"i",
			"ACTION":"t",
			"ACTION_ERROR":"e",
			"ACTION_LOGGED_OK":"o",
			"ACTION_LOGGED_NOK":"n",
			"ACTION_SYNC":"=",
			"ACTION_SYNC_AVATAR":"#",
			"ACTION_SYNC_ITEM":"[",
			"ACTION_SYNC_MONSTER":"{",
			"ACTION_CHOOSE_CHAR":"r",
			"ACTION_CHOOSE_CHAR_OK":"+",
			"ACTION_MOVE_START":"a",
			"ACTION_MOVE_STOP":"6",
			"ACTION_JUMP":"j",
			"ACTION_GET_ITEM_TEMPLATE":"F",
			"ACTION_SYNC_PROJECTILE":"L",
			"ACTION_REMOVE_PROJECTILE":"Q",
			"ACTION_LOGOUT":"V",
			"ACTION_COLLIDE":"@",
			"ACTION_ITEM_GRABBED":"á",
			"ACTION_SYNC_ATTACK_ZONE":"è",
			"MESSAGE":"m",
			"MESSAGE_MOVE_ID":"9",
			"MESSAGE_MOVE_TYPE":"7",
			"MESSAGE_MOVE_START":"f",
			"MESSAGE_CHAR":"c",
			"MESSAGE_CHARNAME":"_",
			"MESSAGE_POSITION":"p",
			"MESSAGE_VELOCITY":"v",
			"MESSAGE_USER_INPUT_VELOCITY":"y",
			"MESSAGE_ACCELERATION":"z",
			"MESSAGE_SIZE":"/",
			"MESSAGE_SKIN":"~",
			"MESSAGE_SPEAK":"s",
			"MESSAGE_SHOOT":"x",
			"MESSAGE_DETAIL":">",
			"MESSAGE_MOVE_SPEED":"1",
			"MESSAGE_JUMP_SPEED":"2",
			"MESSAGE_ANIMATION":"3",
			"MESSAGE_SAYING":"4",
			"MESSAGE_TIMESTAMP":"b",
			"MESSAGE_DIRECTION":"5",
			"MESSAGE_DURATION":"(",
			"MESSAGE_ELEMENT_ID":")",
			"MESSAGE_BGCOLOR":"8",
			"MESSAGE_ITEM_ID":"G",
			"MESSAGE_KIND":"H",
			"MESSAGE_ITEMS":"I",
			"MESSAGE_DAMAGE":"J",
			"MESSAGE_DAMAGE_TYPE":"K",
			"MESSAGE_ORIENTATION":"N",
			"MESSAGE_MASS":"O",
			"MESSAGE_DELTA":"P",
			"MESSAGE_OWNER":"S",
			"MESSAGE_DELTASHOW":"W",
			"MESSAGE_CURRENT_URL":"Y",
			"MESSAGE_GAME_AREA_DOM_ID":"Z",
			"MESSAGE_GAME_AREA_BLOCKS":"?",
			"MESSAGE_GAME_AREA_NAME":"!",
			"MESSAGE_GAME_MAX_INSTANCE":"ú",
			"MESSAGE_GAME_MAX_USER":"ã",
			"MESSAGE_GOING_DOWN":"*",
			"MESSAGE_ATTACK":"T",
			"MESSAGE_COLOR":"`",
			"MESSAGE_MONSTER":"<",
			"MESSAGE_AVATAR":">",
			"MESSAGE_PROJECTILE":"ù",
			"MESSAGE_ITEM":"/",
			"MESSAGE_FROM":"ñ",
			"MESSAGE_FROM_TYPE":".",
			"MESSAGE_FROM_POSITION":",",
			"MESSAGE_TO":"÷",
			"MESSAGE_TO_TYPE":"å",
			"MESSAGE_TO_POSITION":"ò",
			"MESSAGE_IS_DEAD":"ð",
			"MESSAGE_HP":"U",
			"MESSAGE_CURRENT_HP":"R",
			"MESSAGE_LANDED":"ä",
			"NAME":"h",
			"TRACE_ID":"q",
			"SESSION_ID":"k",
			"LOGIN":"l",
			"PASSWORD":"w",
			"AVATARS":"u",
			"ITEMS":"]",
			"LEFT":"0",
			"RIGHT":"é",
			"JUMP":"'",
			"PROJECTILES":"M",
			"MONSTERS":"}",
			"MESSAGE_ATTACK_TYPE":"T",
			"MESSAGE_ATTACK_MAIN":";",
			"ACTION_ATTACK":"X",
			"ITEM_SLOT_HEAD":"A",
			"ITEM_SLOT_CHEST":"B",
			"ITEM_SLOT_FOOT":"C",
			"ITEM_SLOT_LEFT_HAND":"D",
			"ITEM_SLOT_RIGHT_HAND":"E",
			"ACTION_GOING_DOWN_STOP":"&",
			"ACTION_GOING_DOWN":"%"
		},
		"verbose":{
			"DATE":"date",
			"ID":"id",
			"MESSAGE":"message",
			"ACTION":"action",
			"ACTION_ERROR":"error",
			"ACTION_LOGGED_OK":"login_ok",
			"ACTION_LOGGED_NOK":"loggued_nok",
			"ACTION_SYNC":"sync",
			"ACTION_SYNC_AVATAR":"avatar_sync",
			"ACTION_SYNC_ITEM":"item_sync",
			"ACTION_CHOOSE_CHAR":"return_charater",
			"ACTION_CHOOSE_CHAR_OK":"avatar_selected",
			"ACTION_MOVE_START":"move_start",
			"ACTION_MOVE_STOP":"move_stop",
			"ACTION_JUMP":"jump",
			"ACTION_REMOVE_PROJECTILE":"remove_projectile",
			"ACTION_GET_ITEM_TEMPLATE":"get_item",
			"ACTION_SYNC_PROJECTILE":"sync_projectile",
			"ACTION_LOGOUT":"logout",
			"ACTION_SYNC_MONSTER":"sync_monster",
			"ACTION_COLLIDE":"action_collide",
			"ACTION_ITEM_GRABBED":"item_grabbed",
			"ACTION_SYNC_ATTACK_ZONE":"attack_zone",
			"MESSAGE_MOVE_ID":"move_id",
			"MESSAGE_MOVE_TYPE":"move_type",
			"MESSAGE_MOVE_START":"move_start",
			"MESSAGE_CHAR":"character",
			"MESSAGE_CHARNAME":"character_name",
			"MESSAGE_POSITION":"position",
			"MESSAGE_VELOCITY":"velocity",
			"MESSAGE_USER_INPUT_VELOCITY":"user_input_velocity",
			"MESSAGE_ACCELERATION":"acceleration",
			"MESSAGE_SPEAK":"speak",
			"MESSAGE_SHOOT":"shoot",
			"MESSAGE_SIZE":"size",
			"MESSAGE_SKIN":"skin",
			"MESSAGE_DETAIL":"detail",
			"MESSAGE_MOVE_SPEED":"move_speed",
			"MESSAGE_JUMP_SPEED":"jump_speed",
			"MESSAGE_ANIMATION":"animation",
			"MESSAGE_SAYING":"saying",
			"MESSAGE_TIMESTAMP":"timestamp",
			"MESSAGE_DIRECTION":"direction",
			"MESSAGE_DURATION":"duration",
			"MESSAGE_ELEMENT_ID":"element_id",
			"MESSAGE_BGCOLOR":"bg_color",
			"MESSAGE_ITEM_ID":"item_id",
			"MESSAGE_KIND":"kind",
			"MESSAGE_ITEMS":"items",
			"MESSAGE_DAMAGE":"damage",
			"MESSAGE_DAMAGE_TYPE":"damage_type",
			"MESSAGE_ORIENTATION":"orientation",
			"MESSAGE_MASS":"mass",
			"MESSAGE_DELTA":"delta",
			"MESSAGE_OWNER":"owner",
			"MESSAGE_DELTASHOW":"delta_show",
			"MESSAGE_CURRENT_URL":"current_url",
			"MESSAGE_GAME_AREA_DOM_ID":"game_area_dom_id",
			"MESSAGE_GAME_AREA_BLOCKS":"game_area_blocks",
			"MESSAGE_GAME_AREA_NAME":"game_area_name",
			"MESSAGE_GAME_MAX_INSTANCE":"max_instance",
			"MESSAGE_GAME_MAX_USER":"max_user",
			"MESSAGE_GOING_DOWN":"going_down",
			"MESSAGE_ATTACK":"attack",
			"MESSAGE_COLOR":"color",
			"MESSAGE_MONSTER":"monster",
			"MESSAGE_AVATAR":"avatar",
			"MESSAGE_PROJECTILE":"projectile",
			"MESSAGE_ITEM":"item",
			"MESSAGE_FROM":"from",
			"MESSAGE_FROM_TYPE":"from_type",
			"MESSAGE_FROM_POSITION":"from_position",
			"MESSAGE_TO":"to",
			"MESSAGE_TO_TYPE":"to_type",
			"MESSAGE_TO_POSITION":"to_position",
			"MESSAGE_IS_DEAD":"is_dead",
			"MESSAGE_HP":"hp",
			"MESSAGE_CURRENT_HP":"current_hp",
			"MESSAGE_LANDED":"landed",
			"TRACE_ID":"trace_id",
			"SESSION_ID":"session_id",
			"LOGIN":"login",
			"NAME":"name",
			"PASSWORD":"password",
			"AVATARS":"avatars",
			"ITEMS":"items",
			"LEFT":"left",
			"RIGHT":"right",
			"JUMP":"jump",
			"PROJECTILES":"projectiles",
			"MONSTERS":"monsters",
			"MESSAGE_ATTACK_TYPE":"attack_type",
			"MESSAGE_ATTACK_MAIN":"attack_main",
			"ACTION_ATTACK":"action_attack",
			"ITEM_SLOT_HEAD":"item_slot_head",
			"ITEM_SLOT_CHEST":"item_slot_chest",
			"ITEM_SLOT_FOOT":"item_slot_foot",
			"ITEM_SLOT_LEFT_HAND":"item_slot_left_hand",
			"ITEM_SLOT_RIGHT_HAND":"item_slot_right_hand",
			"ACTION_GOING_DOWN_STOP":"action_going_down",
			"ACTION_GOING_DOWN":"action_going_down_stop"
		}
	}
})(org.dbyzero.deimos, document);
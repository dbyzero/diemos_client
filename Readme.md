

Clients :

(x) model
	entity  (stocker son dom)
	avatar  (stocker son dom)
	scene   (stocker son dom ?)
	speaker (stocker son dom)
	block
	userMovement (need ?)
x render
	x UI (enlever pas mal de logique de la dedans)
	x Animation (deprecated ?)
	x Frame (deprecated ?)
network
	message
	websocket
	manager
Engine (faire un tour)
	-loop
	-bind/dispatch event





Server :

actions
	-***
dao
	-***
handler
	-actionHandler
	-messageHandler
(x) model (check si .data = db datas partout)
	-account
	-session
	-server
	-scene
	-physics
	-avatar
	-userMovement (force?)
utils
	-Log
	-Loop
	-Vector2
node_modules
	-async
	-colors
	-mongodb
	-mongoose
	-undescore
	-underscore_string
	-util
	-webssocket
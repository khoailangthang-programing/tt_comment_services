const btnComment = $("#btn-comment")
const frmComment = $("#frm-comment")
const listComments = $("#list-comments")
const frmName = $("#frm-name")
const notify = $("span.notify")
const alert = $("span.message")
const publicMessage = $("#public-messages").children("#messages")
var player0 = function (playerName, message) { 
	return "<div class='col-lg-12 player0'><p class='label label-success'>" + playerName + "</p><div class='well'>" + message + "</div></div>";
}
var player1 = function (playerName, message) { 
	return "<div class='col-lg-12 player1'><p class='label label-info'>" + playerName + "</p><div class='well'>" + message + "</div></div>";
}
var itemMessage = function (message) {
	return "<li class='list-group-item list-group-item-success'>" + message + "</li>";
}

// var socketer = io.sails.connect();
// socketer.on("connect", function () {
// 	console.log("Connected");
// });

btnComment.on("click", function () {
	let comment = frmComment.val();
	let name = frmName.val();
	if(!name || name.length < 2 || typeof name == "undefined") {
		name = "MOD-0101"
	}
	io.socket.post('/post-demo', {name: name, comment: comment}, function (resData, jwRes) {
		if(parseInt(resData.status) == 1) {
			let comment = player0(resData.data.u, resData.data.c);
			listComments.prepend(comment);
		}
	});
})
io.socket.on("commented", function (event) {
	if(parseInt(event.status) == 1) {
		let comment = player0(event.data.u, event.data.c);
		listComments.prepend(comment);
	}
	let newlyCom = parseInt(notify.text());
	if(isNaN(newlyCom)) {
		newlyCom = 0;
	}
	notify.text(newlyCom + 1);
})

io.socket.get('/demo-comment', (resData, jwRes) => {
	console.log(jwRes);
});
io.socket.on('connected', event => {
	let item = itemMessage(event.message)
	publicMessage.prepend(item)
})
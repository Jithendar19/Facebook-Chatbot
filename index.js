'use strict' // For strict variable declaration

//Dependencies
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

//Creating an express app
const app = express()

//Set PORT
app.set('port', (process.env.PORT || 5000))

//To process data
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())

let token = "My token"

//ROUTES

app.get('/', function(req, res) {
	res.send("Hi I am a chatbot")
})

//Facebook
app.get('/webhook/', function(req, res) {
	if(req.query['hub.verify_token'] === "jeethu"){
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong Token")
})

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for(let i = 0; i < messaging_events.length; i++){
		let event = messaging_events[i]
	    let sender = event.sender.id
		if(event.message && event.message.text){
			let text = event.message.text
			sendText(sender, "Text echo :" + text.substring(0,100))
		}
	}
    res.sendStatus(200)
})	

function sendText(sender, text){
	let messageData = {text: text}
	request({
		url : "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token : token},
		method : "POST",
		json : {
			recipient : {id : sender},
			message : messageData
		}
	}, function (error, response, body) {
		if(error)
			console.log("sending error")
		else if(response.body.error){
			console.log("response body error")
		}
	})
}

//Listen to requests at the port
app.listen(app.get('port'), function() {
	console.log("running : port")
})

#!/usr/bin/env node
'use strict';

var socket = require('socket.io-client');
var push = require('pushover-notifications');

var p = new push({
    user: process.env['PUSHOVER_USER'],
    token: process.env['PUSHOVER_TOKEN'],
});

var URL = 'https://' + process.argv[2] + '.meatspac.es/';
var watchwords = {};
var re = /\w+/g;


process.argv[3].split(',').forEach(function(w){
	watchwords[w] = true;
});

console.log(Object.keys(watchwords));

var c = socket.connect(URL);
	
c.on('connect', function(){ console.log('oh god'); });

c.on('message', function(m) {
	var message;
	try {
		message = m.chat.value.message;
	} catch (e) {}

	if (!message) return;

	if (message.match(re).map(function(s){
		return s.toLowerCase();
	}).reduce(function(found, word) {
		return found || (word in watchwords);
	}, false)) {
		p.send({
			message: message
		});
	}
});

c.on('error', function(){ console.log(arguments); });

'use strict';
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
var Kafka = require('no-kafka');
var client = [];
var history = [];

io.on('connection', (socket) => {
  console.log('USER CONNECTED');
  //io.emit('history-notifications',history);
  socket.on('connect-client', function (user) {
    if (client.indexOf(user) === -1) {
      client.push(user);
     
    }
     io.emit('client-list', client);
    console.log('Connected-Clients')
    client.forEach(val => {
      console.log(val);
    });
  });

  socket.on('disconnect-client', function (user) {
    console.log(client.indexOf(user));
    if (client.indexOf(user) != -1) {
      client.pop()[client.indexOf(user)];
       io.emit('client-list', client);
    }
   
    console.log('After Disconnect-Clients')
    client.forEach(val => {
      console.log(val);
    });
  });


  socket.on('chat', function (msg) {
    io.emit('chat', { time: (new Date()).getTime(), message: msg });
  });

  socket.on('disconnect', function () {
    console.log('USER DISCONNECTED');
  });

});


http.listen(8091, () => {
  console.log('started on port 8091');
  var consumer = new Kafka.SimpleConsumer({
    connectionString: 'http://kafka:9092',
    clientId: 'no-kafka-client'
  });

  // data handler function can return a Promise 
  var notificationHandler = function (messageSet, topic, partition) {
    messageSet.forEach(function (m) {
      console.log(topic, partition, m.offset, m.message.value.toString('utf8'));

      if (topic == "guru") {
        history.push({ time: (new Date()).getTime(), message: m.message.value.toString('utf8') });
        io.emit('live-notifications', [{ time: (new Date()).getTime(), message: m.message.value.toString('utf8') }]);
      }
      else if (topic == "chat-room") {

        io.emit('chat', { time: (new Date()).getTime(), message: m.message.value.toString('utf8') });
      }
    });
  };


  return consumer.init().then(function () {
    // Subscribe partitons 0 and 1 in a topic: 
    var v1 = consumer.subscribe('guru', [0], { offset: 3 }, notificationHandler);
    var v2 = consumer.subscribe('chat-room', [0], notificationHandler);
    //	var v2= consumer.subscribe('Sample', [0, 1], dataHandler);
    var arr = [];
    arr.push([v1]);
    arr.push([v2]);
    return arr;

  });
});
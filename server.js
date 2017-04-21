'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'development') {
  require('node-env-file')('.env');
  console.log('Running Development!');
}

var state = false, io;

require('mahrio').runServer( process.env, __dirname ).then( function(server){

  io = require('socket.io').listen( server.listener );

  io.on('connection', function( socket ){
    console.log('socket listening...' + socket.id); // Record the connection

    socket.emit( 'event:hello' ); // Send message exclusively to new connection

    socket.on( 'disconnect', function(){
      console.log('goodbye socket...' + socket.id ); // Record the disconnection
    });
  });

  setInterval( function(){
    io.sockets.emit('event:led:state', state = !state );
  }, 1000);

  // ASSETS
  server.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: ['../public/assets/']
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: function( request, reply ){
      reply.view('index');
    }
  });
});

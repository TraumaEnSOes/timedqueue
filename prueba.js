const TimedQueue = require( './timedqueue.js' );
const UtilModule = require( 'util' );

function onTimeout( val, timeout, forced ) {
  console.log( `value: ${val}, timeout: ${timeout}, forced: ${forced}` );
}

var queue = new TimedQueue( ),
    idx = [ ];

queue.on( 'timeout', onTimeout );

for( let x = 0; x < 5; ++x ) idx[x] = queue.enqueue( x, x * 900 );

queue.dequeue( idx[3] );

queue.dump( );
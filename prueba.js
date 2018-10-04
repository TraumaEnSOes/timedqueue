const TimedQueue = require( './timedqueue.js' );
const UtilModule = require( 'util' );

function inspect( ...args ) {
  var curr,
      idx = -1;

  while( curr = args[++idx] ) process.stdout.write( UtilModule.inspect( curr, { depth: Infinity } ) );

  process.stdout.write( '\n' );
}

function onTimeout( val, expected, real ) {
  console.log( 'Timeout. value:', val, 'expected:', expected.toString( ).substr( -5 ), 'real:', real.toString( ).substr( -5 ) );
}

var queue = new TimedQueue( ),
    idx = [ ];

queue.on( 'timeout', onTimeout );

for( let x = 0; x < 5; ++x ) idx[x] = queue.enqueue( x, x * 900 );

// queue.dequeue( idx[3] );

queue.$dump( );
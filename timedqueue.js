const { EventEmitter } = require( 'events' );

class Node {
  constructor( val, timeout ) {
    this.value = val;
    this.timeout = timeout;
    this.prev = null;
    this.next = null;
  }
};

class TimedQueue extends EventEmitter {
  $check( ) {
    var now = Date.now( ),
        iter = this.$back;

    // Recorremos la lista desde el final hasta el principio.
    while( ( iter !== null )  && ( iter.timeout < now ) ) {
      // Emitimos el evento.
      if( iter.timeout ) {
        setTimeout( doEmit.bind( this, iter.value, iter.timeout ) );
        iter.timeout = 0;
      }

      iter = iter.prev;
    }

    if( iter === null ) {
      // Si se cumple, la cola está vacía.
      this.$front = null;
      this.$back = null;
      clearInterval( this.$intervalId );
      this.$intervalId = null;
    } else {
      // Quedan mas elementos.
      // Cortamos la lista por aquí.
      iter.next = null;
      this.$back = iter;
    }

    function doEmit( val, to ) { this.emit( 'timeout', val, to, false ); }
  }

//@ifdef TIMEQUEUE_DUMP
  dump( ) {
    if( this.$front === null ) {
      console.log( '{ EMPTY }' );
    } else {
      var iter = this.$front;

      while( iter !== null ) {
        console.log( `{ ${iter.value}, ${iter.timeout} }` );
        iter = iter.next;
      }
    }
  }
//@endif

  force( node ) {
    this.dequeue( node );
    setInterval( doEmit.bind( this, node.value, node.timeout ) );
    node.timeout = 0;

    function doEmit( val, to ) { self.emit( 'timeout', val, to, true ); }
  }

  clear( ) {
    this.$front = null;
    this.$back = null;
    if( this.$intervalId !== null ) {
      clearInterval( this.$intervalId );
      this.$intervalId = null;
    }
  }

  constructor( interval, timeout ) {
    interval = ( interval === undefined ) ? 250 : interval;
    timeout = ( timeout === undefined ) ? 1000 : timeout;

    super( );

    this.$interval = interval;
    this.$timeout = timeout;
    this.$front = null;
    this.$back = null;
    this.$intervalId = null;
  }

  enqueue( val, timeout ) {
    timeout = ( timeout === undefined ) ? this.$timeout : timeout;

    var node = new Node( val, Date.now( ) + timeout );

    if( this.$front === null ) {
      // Caso fácil. Cola vacía.
      this.$front = node;
      this.$back = node;
      this.$intervalId = setInterval( this.$check.bind( this ), this.$interval );
    } else {
      // Cola no vacía.
      // La recorremos desde el final hasta el principio,
      // buscando un nodo con un timeout menor que el nuestro.
      let iter = this.$back;

      while( ( iter.prev !== null ) && ( iter.timeout > timeout ) )iter = iter.prev;

      if( iter.prev === null ) {
        // Hemos llegado al primer nodo.
        node.next = this.$front;
        this.$front.prev = node;
        this.$front = node;
      } else {
        // Nos colocamos entre 2 nodos.
        node.next = iter.next.prev;
        node.prev = iter;
        iter.next.prev = node;
        iter.next = node;
      }
    }

    return node;
  }

  dequeue( node )  {
    node.timeout = 0;
    if( this.$front === this.$back ) {
      // Caso fácil. Solo hay un elemento.
      clearInterval( this.$intervalId );
      this.$front = null;
      this.$back = null;
      this.$intervalId = null;

      return;
    }

    // Hay mas de un elemento.
    if( node.prev !== null ) node.prev.next = node.next;
    if( node.next !== null ) node.next.prev = node.prev;

    if( this.$front === node ) {
      this.$front = node.next;
    } else if( this.$back === node ) {
      this.$back = node.prev;
    }
  }
};

module.exports = TimedQueue;

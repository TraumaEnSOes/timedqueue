const { EventEmitter } = require( 'events' );

class Node {
  constructor( val, timeout ) {
    this.value = val;
    this.timeout = timeout;
    this.prev = false;
    this.next = false;
  }
};

class TimedQueue extends EventEmitter {
  $check( ) {
    var now = Date.now( ),
        iter = this.$back;

    // Recorremos la lista desde el final hasta el principio.
    iter = this.$back;

    while( ( iter !== false ) && ( iter.timeout < now ) ) {
      // Emitimos el evento.
      if( iter.timeout ) {
        this.emit( 'timeout', iter.value, iter.timeout, now );
        iter.timeout = 0;
      }

      iter = iter.prev;
    }

    if( iter === false ) {
      // Si se cumple, la cola está vacía.
      this.$front = false;
      this.$back = false;
      clearInterval( this.$intervalId );
      this.$intervalId = false;
    } else {
      // Quedan mas elementos.
      // Cortamos la lista por aquí.
      iter.next = false;
      this.$back = iter;
    }
  }

  $dump( ) {
    if( this.$front === false ) {
      console.log( '{ EMPTY }' );
    } else {
      var iter = this.$front;

      while( iter !== false ) {
        let text = iter.timeout.toString( ).substr( -5 );
        console.log( `{ ${text}, ${iter.value} }` );
        iter = iter.next;
      }
    }
  }

  force( node ) {
    this.emit( 'timeout', node.value, iter.timeout, Date.now( ) );
    this.dequeue( node );
  }

  clear( ) {
    this.$front = false;
    this.$back = false;
    if( this.$intervalId ) clearInterval( this.$intervalId );
    this.$intervalId = false;
  }

  constructor( interval, timeout ) {
    super( );

    this.$interval = ( interval === undefined ) ? 250 : interval;
    this.$timeout = ( timeout === undefined ) ? 5000 : timeout;
    this.$front = false;
    this.$back = false;
    this.$intervalId = false;
  }

  clear( ) {
    this.$front = false;
    this.$back = false;
    if( this.$intervalId !== false ) {
      clearInterval( this.$intervalId );
      this.$intervalId = false;
    }
  }

  enqueue( val, timeout ) {
    timeout = ( timeout === undefined ) ? this.$timeout : timeout;

    var node = new Node( val, Date.now( ) + timeout );

    if( this.$front === false ) {
      // Caso fácil. Cola vacía.
      this.$front = node;
      this.$back = node;
      this.$intervalId = setInterval( this.$check.bind( this ), this.$interval );
    } else {
      // Cola no vacía.
      // La recorremos desde el final hasta el principio,
      // buscando un nodo con un timeout menor que el nuestro.
      let iter = this.$back;

      while( ( iter.prev !== false ) && ( iter.timeout > timeout ) )iter = iter.prev;

      if( iter.prev === false ) {
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

    if( this.$intervalId === false ) this.$intervalId = setInterval( this.$check.bind( this ), this.$interval );
    return node;
  }

  dequeue( node ) {
    node.timeout = 0;
    if( this.$front === this.$back ) {
      // Caso fácil. Solo hay un elemento.
      clearInterval( this.$intervalId );
      this.$front = false;
      this.$next = false;
      this.$intervalId = false;

      return;
    }

    // Hay mas de un elemento.
    if( node.prev !== false ) node.prev.next = node.next;
    if( node.next !== false ) node.next.prev = node.prev;

    if( this.$front === node ) {
      this.$front = node.next;
    } else if( this.$back === node ) {
      this.$back = node.prev;
    }
  }
};

module.exports = TimedQueue;

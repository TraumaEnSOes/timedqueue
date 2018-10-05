# timedqueue
Cola de valores, con avisos de tiempo expirado. Hereda de `EventEmitter`.

## Eventos

### timeout( data, timeout, forced )
El tiempo de vida del valor `data` ha expirado.

`data`: el valor, tal y como se pasó al llamar a `TimedData::enqueue( )`.

`timeout`: hora límite, que ya pasó.

`forced`: boolean. Indica si se usó la función `force( )`.

## Funciones

### TimedQueue( [ interval ][,timeout ] )
Constructor.

`interval`: intervalo establecido en milisegundos (con `setInterval( )`) en el que se comprobaran los elementos expirados. Opcional, por defecto 250ms.

`timeout`: tiempo de expiración en milisegundos por defecto, a partir del momento de insertar el elemento. Opcional, por defecto 1000ms.

### TimedQueue::enqueue( data [ ,timeout ] )
Introducir un elemento en la cola.

`data`: valor a introducir.

`timeout`: opcional. Tiempo en milisegundos para que expire, a partir de ahora. Si se omite, se usa el tiempo indicado en el constructor de `TimedQueue`.

`return`: { } que se puede usar para sacar de la cola el elemento.

### TimedQueue.dequeue( item )
Sacar un elemento de la cola.

`item` es un valor retornado por `TimedQueue.enqueue( )`.

### TimedQueue.clear( )
Vaciar la cola.

### TimedQueue::force( item )
Fuerza la expiración de un elemento, sacándolo de la cola y emitiendo el evento `timeout` const `forced === true`.

`item`: elemento, tal y como lo devolvió `TimedQueue.enqueue( )`.

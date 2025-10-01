//Mongo Explicacion
// Modelos de documentos y BSON
//      Documentos: es la unidad basica de datos en MongoDB, similar a una fila en una tabla 
//                  relacional.
//      Coleccion: es un grupo de documentos, similar a una tabla en una base de datos 
//                  relacional.
//      BSON: es un formato binario que MongoDB utiliza para almacenar documentos. 
//                  Es similar a JSON pero incluye tipos de datos adicionales como Date y Binary.
//      Esquema: es la estructura que define los campos y tipos de datos de los documentos en 
//                  una coleccion. MongoDB es esquematicamente flexible, lo que significa que 
//                  los documentos en una coleccion no necesitan tener la misma estructura.
//      ODM (Object Data Modeling): es una biblioteca que proporciona una capa de abstraccion
//                  para interactuar con MongoDB utilizando objetos de JavaScript. Mongoose es 
//                  un ODM popular para Node.js.

// Lectura y escritura de datos
//      Atomicidad por documentos: MongoDB garantiza que las operaciones de escritura en un solo
//                  documento son atomicas, lo que significa que se completan en su totalidad o no se 
//                  realizan en absoluto.
//      Unidades de trabajo naturales:Mientras que en las bases de datos relacionales (SQL) harias multiples
//                  operaciones para completar una tarea, en MongoDB, a menudo puedes completar la misma 
//                  tarea con una sola operacion en un documento.

// Esquema flexible
//      Flexibilidad:No es obligatorio definir un esquema rigido para las colecciones. Los documentos en la misma
//                  coleccion pueden tener diferentes campos y estructuras.
//      Evolucion del esquema: Puedes agregar o eliminar campos de los documentos en cualquier momento sin 
//                  afectar a otros documentos en la coleccion.

// Consulta y agregacion   
//      Lenguaje de consulta: MongoDB utiliza un lenguaje de consulta basado en JSON que es intuitivo y facil
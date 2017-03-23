---
title: Advanced features in steps
layout: doc_page.html
order: 9
---

## Procesos asíncronos en steps.

Cada una de las fases de un step realmente son promesas y reciben dos métodos resolve y reject

```js
  [...]

  run: function(resolve, reject){
     resolve();
  }

  [...]
```

Realmente al final de cada fase se está ejecutando la function resolve de la promesa asociada, pero **se hace de una manera automática**. Si no se hace nada con estas functions el step se comporta como si todo fuera sincrono.

### ¿Cómo manejar promesas y callbacks en un step?

Para desactivar la ejecución automática de resolve en un step es necesario hacer un return de algo distinto de undefined.

```js
  [...]

  run: function(resolve, reject){
     return true;
  }

  [...]
```

**(\*) Importante: (NO RECOMENDABLE, MEJOR USAR UN PLUGIN)** Si queremos que algún step siga ejecutando algo en background y seguir con la ejecución del resto de steps simplemente no hacer un return de nada. Muy util para que funcionen procesos en background que necesitemas para la ejecución de la flow completa.

Ejemplo de uso de promesas dentro de un step:

```js
[...]
    run : function(resolve, reject){
    [...]
        return this.execute("yo",this.promptArgs(["pisco-recipe"])).then(resolve,reject);
    }
[...]

```

- this.exexute devuelve una promesa, si hacemos return de esa promesa no estámos devolviendo undefined, por lo tanto el resolve de la promesa no será llamado automáticamente.
- al pasarle los resolve y reject mediante el then a la promesa el step terminará cuando esta promesa termine.

### Errores en steps

Si se produce un error en un step y este error no está controlado, **la ejecución de toda la flow parará**. Si queremos registrar un error pero no queremos parar la ejecución de todo el flow deberemos devolver un objeto con la variable keep: true

```js
[...]
    run : function(resolve, reject){

        reject({keep:true, error: txt});
    }
[...]

```

para parar la ejecución dando un error de una menera deliverada:

```js
 [...]
     run : function(resolve, reject){

        if (error)
         reject({error: text});
     }
 [...]

```

Adicionalmente se puede devolver más información sobre el error producido mediante *'data'*. Es especialmente útil en el caso en que se gerere un fichero junit y queremos que aparezcan el detalle del error en el entorno de integración continua (jenkins, bamboo o similar).

```js
 [...]
     run : function(resolve, reject){

        if (error)
         reject({error: text, data: details});
     }
 [...]

```

### Ejecuciones condicionales de steps.

Hace posible en función de unas comprobaciones iniciales, por ejemplo un parámetro de configuración o opción pasada por línea de comando, que la ejecución de un step se realice o no.

Para ello en la fase **check** del step deveremos devolver un objeto con el parámetro **skip:true** al ejecutar resolve.

```js
 [...]
     check : function(resolve, reject){

        if (this.params.needThisstep)
         resolve({skip: true});
     }
 [...]

```

El resto de las stages del step no se ejecutará. por ejemplo si en run limpiamos un directorio mediante este método el limpiado del directorio no se llevará a cabo.

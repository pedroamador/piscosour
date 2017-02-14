---
title: Steps
layout: doc_page.html
order: 2
---

# Trabajar con steps.

Un step es un paso de ejecución dentro de un flujo de ejecución.

Una vez creada nuestra receta nos situamos dentro del directorio que hemos creado.

    cd example-wrapper
    pisco config

pisco config nos ayuda a configurar nuestra receta.

![configuring our recipe](images/started6.png)

1. Nos pregunta si queremos establecer un nuevo tipo de repositorio por defecto. En nuestro ejemplo decimos **"yes"**
2. Nos pregunta el tipo de repositorio. El tipo de repositorio es el lugar donde se va a ejecutar el comando pisco. Normalmente se ejecutará en la raiz de un repositorio git. [Ver que es piscosour para el glosario de términos](what_is_piscosour.md).
Por ejemplo pondremos **"component"**
3. Pregunta por el nombre del step que queremos crear. Por ejemplo pondremos: **"show"**
4. El tipo de repositorio sobre el que va a actuar nuestro comando. Por ejemplo pondremos **"component"**
5. Nos pregunta si queremos añadir este step (paso) a una nueva flow (flujo). **"yes"**
6. Nos pregunta por el comando del flow. Será el comando usado para lanzar nuestra flow. **"demo"**
7. Establecemos el nombre corto del comando será el que aparezca en la ayuda del comando. **"demo execution"**
8. Nos pide una descripción para el comando. **"this is a demo execution"**
9. Seleccionar el tipo de flow que vamos a crear. **"normal"**

Listo! ya tenemos nuestro nuevo comando añadido! Pruebalo.

    node bin/pisco.js

ahora aparecerá en la ayuda de nuestra receta el nuevo comando.

![help is updated](images/started8.png)

    node bin/pisco.js demo

Ejecutará el nuevo flow que hemos creado con un solo step

![first step execution](images/started9.png)

## Echemos un vistazo a lo que hemos creado.

Se ha generado un módulo node con su package.json y los archivos fundamentales de pisco.

Este es el árbol resultante.

![recipe file tree](images/started7.png)

package.json:
```js
{
  "name": "example-wrapper",
  "version": "0.0.1",
  "description": "This is my first piscosour wrapper example",
  "main": "bin/pisco.js",
  "scripts": {
    "deps": "npm install"
  },
  "keywords": [
    "piscosour-recipe"
  ],
  "license": "ISC",
  "preferGlobal": true,
  "bin": {
    "example-tool": "bin/pisco.js"
  },
  "dependencies": {
    "piscosour": "~0.1.0"
  },
  "engines": {
    "node": ">=4.0.0"
  }
}
```

El step generado tiene esta pinta.

```js
'use strict';

module.exports = {
    description : "Brief description of step",

    check : function(){
        this.logger.info("#magenta","check","Check all pre-requisites for the execution");
    },

    config : function(){
        this.logger.info("#magenta","config","Preparing params for main execution");
    },

    run : function(){
        this.logger.info("#magenta","run","Run main execution");
    },

    prove : function(){
        this.logger.info("#magenta","prove","Prove that the run execution was ok");
    },

    notify : function(){
        this.logger.info("#magenta","notify","Recollect all execution information and notify");
    }

});


```

puedes ver este ejemplo aquí

[see this example in github](https://github.com/cellsjs/piscosour-examples)

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

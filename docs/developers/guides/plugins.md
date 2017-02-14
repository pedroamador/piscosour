---
title: Plugins
layout: doc_page.html
order: 6
---

# ¿Qué es un plugin de pisco?

Es un prototipo que sirve para compartir funcionalidad de manera transversal entre steps y flows. El prototipo plugin actúa de dos maneras claramente diferenciadas.

 1. Como hook (o interceptor previo) en cada una de las fases del step donde esté configurado.
 2. Como repositorio de addons (métodos añadidos al prototipo step) que añaden funcionalidad al objeto step de manera transparente.

este es el especto de un plugin tipo:

```js
'use strict';

module.exports = {
    description : "Test plugin",

    // ---- HOOKS ----

    check : function(step){
        this.logger.info("---------PLUGIN TEST--------");
        step.test_pluginAddon("Ejemplo");
    },

    // ---- ADDONS ----

    addons : {

        testPluginAddon: function (message) {
            this.logger.info("Test addon executed", name);
        }
    }
};
```

## HOOKS
 - En los hooks **this** será la referencia a la instancia step que se está ejecutando en ese momento, por lo tanto con todas las propiedades y funciones del step.
 - Las functions de los hooks deberán tener el mismo nombre que la fase (stage) que van a preceder.
 - Deberán devolver una Promesa o undefined. No está permitido hacer return de otro tipo de valor.

## ADDONS
 - Los addons son métodos que se añaden al prototipo step por lo tanto van a poderse ejecutar desde cualquier referencia a este prototipo.
 - Dentro de una función addon **this** hace referencia al step donde se está ejecutando, será una referencia a la instancia ejecutandose en ese momento con todo completamente cargado.
 - **ATENCIÓN: Los plugins añaden funciones al prototype step**. Para no sobreescribir funciones sensibles de step utilizar uno de estos dos métodos:

  1. (Recomendado): Prefijar las funciones añadidas con el nombre del plugin. En nuestro ejemplo será **test**.
  2. Crear un espacio de nombres: Esta solución pierde la referencia al **this** del propio step y habría que pasar el step al llamar a la función. En nuestro ejemplo:

  **plugin.js:**

```js
'use strict';

module.exports = {
    description : "Test plugin",

    // ---- HOOKS ----

    check : function(){
        this.logger.info("---------PLUGIN TEST--------");
        this.test.pluginAddon(this,"Ejemplo");
    },

    // ---- ADDONS ----

    addons : {
        test : {
            pluginAddon: function (step,message) {
                step.logger.info("Test addon executed", message);
            }
        }
    }
};
```


# ¿Cómo crear un plugin?

Los plugins se pueden crear en cualquier receta y podrán ser usados desde cualquier receta que importe esta receta. Crear un plugin es tan simple como:

1. Crear una carpeta plugins en la raíz de tu receta.
2. Crear una carpeta con el nombre que le queremos dar al plugin.
3. Crear un fichero llamado **plugin.js** dentro de esta carpeta con el contenido inidicado más arriba. Es conveniente añadir un fichero info.md con la documentación específica del plugin.
4. Listo! ya tienes tu plugin creado!

Es aconsejable crear plugins en recetas separadas, es decir, crear una receta unicamente con un plugin o varios relacionados dentro con el fin de hacer una mejor gestión de las dependencias que estos plugins necesiten.

# ¿Cómo usar un plugin?

Usar un plugin es muy sencillo, sigue estos pasos:

1. Si el plugin no está en tu receta importa el paquete npm de la receta donde se encuentre el plugin.

    npm install mis-plugins --save

2. Define el nombre del plugin en cualquiera de los "scopes" pisco piscosour.json, flow.json, params.json [Ver definición de parámetros](Load_Parameters.md).

en el caso de piscosour.json y flow.json

```js
[....]
  "params" : {
    "plugins" : ["test"]
  },
[....]
```

en el caso de params.json

```js
{
    "plugins" : ["test"]
}
```

3. Listo!. El plugin ejecutará todos los hooks que tenga asociados y el step tendrá disponible todos los addons que se hayan definido.

 En nuestro ejemplo este sería el código del step que usa el plugin test:

```js
 'use strict';

 module.exports = {
     description : "Plugins test step",

     config : function(resolve){
         this.logger.info("#magenta","config","Preparing params for main execution");
     },

     run : function(resolve){
         this.logger.info("#magenta","run","Run main execution");
         step.test_pluginAddon("our example!!");
     },

     prove : function(resolve){
         this.logger.info("#magenta","prove","Prove that the run execution was ok");
     },

     notify : function(resolve){
         this.logger.info("#magenta","notify","Recollect all execution information and notify");
     }
 };

```

Al ejecutar el step aparecerá nuesto mensaje:

![First plugin execution](images/plugins1.png)

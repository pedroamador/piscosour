---
title: Inquire
layout: doc_page.html
order: 6
---

Para ello será necesario configurar el parámetro prompts en el fichero **params.json**. La definición de parámetros en el array de prompts usa el formato del módulo inquirer

[Documentación de inquirer](https://www.npmjs.com/package/inquirer)

Se han añadido dos parámetros más a la configuración de inquirer:

 - **env**: Nombre de la variable de entorno que se intentará usar para resolver este parámetro antes de preguntar al usuario de manera interactiva.
 - **required**: (true/false) Establece si el campo es obligatorio o no.

```js
  "prompts": [
    {
      "type": "input",
      "name": "workingDir",
      "required" : true,
      "message": "Where do you want to work?",
      "env" : "bamboo_WORKING_DIR",
      "value" : "valor fijo"
    }
  ]
```

### Asignar funciones a los parámetros check, validate y choices.

Dado que params.json es un fichero json y no está permitido escribir código javascript se ha habilitado una forma de asignar funciones propias del step a los parámetros check, validate y choices de inquirer.

```js
  "prompts": [
    {
      "type": "input",
      "name": "workingDir",
      "required" : true,
      "message": "Where do you want to work?",
      "when" : "#workingDirFunction"
    }
  ]
```

mediante "#...nombre de la función" le decimos a piscosour que función tiene que ejecutar inquirer al cargar la variable.

Ahora en el step simplemente definimos:

```js
module.exports = {
    description : "Adding step to a flow",

    [...]

    workingDirFunction : function(answer){
        return answer.workingDir;
    },

    [...]
}
```

**answer** es el objeto completo con las respuestas del usuario.  

El parámetro será this.params.workingDir="workspace".

Creando la lista prompts en **params.json** automáticamente el step preguntará al usuario siempre que el parámetro no venga informado.
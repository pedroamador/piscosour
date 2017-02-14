---
title: Flows
layout: doc_page.html
order: 1
---
# Trabajar con flows

Los flows son los flujos de ejecución dentro de pisco, equivalen a un comando. Un flow no sabe nada del repoType, por lo tanto los flows se pueden usar con distintos repoType simplemente implementando todos los steps que integran dicho flow.
Los flows son simplemente ficheros json de configuración.

```js
{
  "type": "normal",
  "name": "Create from scratch",
  "description": "Starting a repository from scratch",
  "params" : {},
  "steps" : {
    "environment" : {
      "type": "flow"
    },
    "scaffolding" : {}
  }
}
```

**type**:

El type puede ser:

1. "normal": Aparecerá en el listado de comandos normales. (ejecutando la ayuda de la receta)
2. "internal": No aparece en el listado de comandos. Se usan para propositos internos dentro de otras flows. (en nuestro ejemplo environment es una flow internal)

**params**:

Serán los parámetros pasados a todos los steps de esa flow.

**name**, **description**:

Describen el flow serán las descripciones que aparecerán en el log cuando ejecutemos el flow.

**steps**:

Es un objeto con los steps que se van a ejecutar secuencialmente cuando ejecutemos el flow. Está en formato clave:valor la clave será el nombre del step y el valor es un objeto que podrá contener los parámetros concretos que recive el step en esa ejecución.

```
[...]
  "steps" : {
    "environment" : {
      "type": "flow",
      "params" {
        "clave" : "valor"
      }
    },
    "scaffolding" : {}
[...]
```

**NOTA:** No es conveniente usar los params dentro de una flow. Solo usar este supuesto en el caso de que queramos ejecutar un step con un valor de un parámetro concreto. [más información sobre parámetros](Load_Parameters.md)

El type puede ser "flow" o "step" si no se pone nada es de tipo "step".


## steps repetidos

En algunos casos puede ser necesario hacer uso del mismo step en varias ocasiones (pero con distintas parametrizaciones). Para estos casos es necesario diferenciar el step con un sufijo, separado por ':', de la siguiente forma *"mystep:suffix"*.

Ejemplo:

```
[...]
  "steps": {
    "mystep:first": {
      "params" {
        "key": "value1"
      }
    },
    "mystep:second": {
      "params"{
        "key": "value2"
      }
    }
  }
[...]
```

En el ejemplo hemos repetido el step 'mystep' dos veces, y hemos diferenciado los dos steps con los siguientes sufijos ":first", y ":second".

Se recomienda que el nombre del sufijo sea descriptivo y que indique en que lo diferencia.


## Comunicación entre steps

Los steps pueden emitir y recibir información información de otros steps. En el flow se puede configurar qué parámetros se reciben de otros steps.

Ejemplo:

```
[...]
  "steps": {
    "mystep1": { },
    "mystep2": {
      "input"{
        "key": { "mystep1" : "value" }
      }
    }
  }
[...]
```

En este caso, mystep2 recibe el parametro key a partir de mystep1.

Más información en [Parameters transmition between steps](Parameters_between_steps.md)

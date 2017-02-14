---
title: Communication between steps
layout: doc_page.html
order: 3
---

# Parameters transmision between steps

Sometimes we need a generated parameter in one step into another step. This is the way to do this.

## Define output parameters

There is a special stage in steps called **'emit'**. The emit behaviour is wide different from other stages behaviours.

   1. Allways has to return an key:value object with the parameters we want to expose to others steps.
   2. **emit** doesn't recive resolve and reject method so allways is synchronous

As other stages **emit** is optional

Example in any step.js:

```js
    emit : function(){
        return {
            whatever : "any text value",
            whatevermore : {
                some: "thing",
                someArray: []
            }
        }
    }
```

## Connect outputs with inputs in other steps.

- This is can be done only in **flow.json**.
- Input are always set into **this.params**

flow.json example:

```js
    [...]

  "steps" : {
    "test1" : {},
    "test2" : {
      "inputs" : {
        "inWhatever" : {"test1": "whatever"}
      }
    }

    [...]

```

This example set **this.params.inWhatever** parameter of **test2** step with the value of whatever output parameter emit by **test1** step

**(*) Important:** Obviously inputs only can get values from previous steps.

So in our example:

    console.log(this.params.inWhatever)

result:

    any text value

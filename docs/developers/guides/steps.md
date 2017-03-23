---
title: Steps
layout: doc_page.html
order: 2
---

# Steps

Steps often belong to an execution [flow](./flows.html), and usually are executed in a [context](./contexts.html).

Contexts are implements with three files in the recipe:

```
-rwxr-xr-x    1 pisco  staff   steps/step-name/config.js
-rwxr-xr-x    1 pisco  staff   steps/step-name/index.js
-rwxr-xr-x    1 pisco  staff   steps/step-name/info.md
```

Note, it exists a [scaffold generator tool](#scaffold)

## Configuration

The `config.js` file has the definition of the step. A example is:

```json
{
  "name": "sayHello",
  "description": "Say Hello World",
  "contexts": [
    "context-name"
  ]
}
```

The `config.js` can configure the following fields:

- `name`: short name of the step, it must be a descriptive and unique.
- `description`: is a short description about the step.
- `contexts`: array of contexts which step can be executed, example: `"contexts": [ "context1", "context2" ]`
- `isGenerator`: if the steps creates a context, then this flag must be with a 'true' value.
- `prompts`: object with the list of [inquire prompts](./inquire.html) of the step.
- `plugins`: object with the list of [plugins](./plugins.html) injected into the step.
- `requirements`: object with the list of [requirements](./requirements.html)p.
- And others user defined paramaters, see [parameters](./parameters.html) for more information.

## Implementation

The `index.js` file implements the flow. The [scaffold](#scaffold) generates a file like this:

```javascript
'use strict';

module.exports = {
  check: function() {
    this.logger.info('#blue', 'Check if all you need to execute this step exists');
  },

  config: function() {
    this.logger.info('#yellow', 'Config the step to run');
  },

  run: function(ok, ko) {
    this.sh('echo Run main execution of the step', ko, true);
  },

  prove: function() {
    this.logger.info('#green', 'Check if the step has run ok');
  },

  notify: function() {
    this.logger.info('#grey', 'Notify the end of the shot to someone or something');
  },

  emit: function() {
    this.logger.info('#white', 'Emit the result of the step to other steps. Allow communication between steps');
    return { message: 'emit a message' };
  }
};
```

The stages of a step are used to:

1. `check`: check if all you need to execute this step exists.
1. `config`: config the step to run.
1. `run`: run main execution of the step.
1. `prove`: check if the step has run ok.
1. `notify`: notify the end of the shot to someone or something.
1. `emit`: emit the result of the step to other steps. Allow communication between steps.

Please see [stages of a step](./stages.html) for more information. And check [advanced step feature](./steps-advanced.html) to help you how to implement those stages.

## Documentation

The `info.md` file just explain the context with a markdown format:

```markdown
# Step step-name

The description about the step.
```

## <a name="scaffold"></a>Scaffold generator

Pisco provides a scaffold generator. Launch it placed inside your recipe with:

```sh
$ cd your-recipe
$ pisco recipe:add-step
```

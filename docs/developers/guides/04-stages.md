---
title: Stages
layout: doc_page.html
order: 4
---

# Stages

In a step, the `index.js` file implements the flow. The [scaffold](./steps.html#scaffold) generates a file like this:

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

And the stages of a step are used to:

1. `check`: check if all you need to execute this step exists.
1. `config`: config the step to run.
1. `run`: run main execution of the step.
1. `prove`: check if the step has run ok.
1. `notify`: notify the end of the shot to someone or something.
1. `emit`: emit the result of the step to other steps. Allow communication between steps.

## Promises

Note that all the stages are [promises](https://developer.mozilla.org/docs/Web/JavaScript/Referencia/Objetos_globales/Promise) functions, they has two optional paramenter 'resolve', 'reject';

A example with `resolve` and `reject`:

```javascript
module.exports = {
  run: function(resolve, reject) {
    if (this.params.jsonIsWellFormed) {
      resolve();
    } else {
      reject();
    }
    return;
  }
};
```

## `check` stage

Check if all you need to execute this step exists. Here you can see some examples:

- System requirement. But check first [requirements](./requirements.html) configuration options.
- Maybe check if some step inputs are all well formed. For example a json well formed.
- Or check if the environment has a global variable setted.
- ...

## `config` stage

Config the step to run. Do you need to config something, this is the stage to do it.

## `run` stage

Run main execution of the step. This stage hope that all that it need to implement a process is 'ok', because it has been provide by the above stage.

## `proove` stage

Check if the step has run ok.

- If artifacts has been well built.
- or if there is a inexpected file created.

## `notify` stage

Notify the end of the shot to someone or something.

- Email to an address.
- Notify to a slack channel.
- ...

## `emit` stage

Emit the result of the step to other steps. Allow communication between steps.

See [parameters between steps](./08-parametes_between_steps.html) for more information.

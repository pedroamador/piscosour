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

## check

## config

## run

## proove

## notify

## emit
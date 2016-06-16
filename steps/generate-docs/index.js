'use strict';

let fs = require('fs');
let path = require('path');
let docs = require('../../../lib/docs');

module.exports = {

  pkg: {},

  run: function() {
    this.pkg = this.fsReadConfig(this.pkgFile);
    this.logger.info('#magenta', 'run', 'Merge all info.md of flows and steps in the readme.md');

    var bundle = [];

    bundle = this._addBundle(this._getStarted(), null, bundle);
    bundle = this._addBundle('# Recipes', null, bundle);
    bundle = this._addBundle(this._infoRecipe(), null, bundle);
    bundle = this._addBundle('# Commands', null, bundle);
    bundle = this._addBundle(this._commandsIndex(), null, bundle);
    this._infoFlows(bundle);
    bundle = this._addBundle('\n# Plugins', null, bundle);
    this._infoPlugins(bundle);

    this.fsAppendBundle(bundle, 'README.md', ' Installing ' + this.pkg.name);
  },

  _getStarted: function() {
    var content = `Install ${this.pkg.name} globally\n\n`;
    content += `    npm install -g ${this.pkg.name}`;
    return content;
  },

  _commandsIndex: function() {

    var content = '';
    var enriched = docs.enrichCommands(null, true);

    Object.getOwnPropertyNames(enriched).forEach((recipeKey) => {
      var recipe = enriched[recipeKey].___recipe;
      if (recipe) {
        if (recipeKey !== 'piscosour') {
          content += `\n**from ${recipe.name}  v.${recipe.version}:**\n\n`;
          Object.getOwnPropertyNames(enriched[recipeKey]).forEach((command) => {
            if (command !== '___recipe') {
              var enrich = enriched[recipeKey][command];
              var piscoCfg = this.fsReadConfig(this.piscoFile);
              content += `- **${piscoCfg.cmd} ${command}** ( ${enrich.description} )\n`;
            }
          });
        }
      }
    });
    return content;

  },

  _infoRecipe: function() {
    var content = '|Name|Version|Description|\n';
    content += '|---|---|---|\n';
    Object.getOwnPropertyNames(this.piscoConfig.recipes).forEach((recipeName) => {
      var recipe = this.piscoConfig.recipes[recipeName];
      if (recipe.name) {
        content += '|' + recipe.name + '|' + recipe.version + '|' + recipe.description + '|\n';
      }
    });
    return content;
  },

  _infoPlugins: function(bundle) {
    Object.getOwnPropertyNames(this.piscoConfig.recipes).forEach((recipeName) => {
      var recipe = this.piscoConfig.recipes[recipeName];
      var dirPlugins = path.join(recipe.dir, 'plugins');
      if (recipe.name && this.fsExists(dirPlugins) && recipeName !== 'piscosour') {
        this.logger.info('#green', 'reading', dirPlugins);
        var plugins = fs.readdirSync(dirPlugins);

        plugins.forEach((dir) => {
          this.logger.info('processing plugin', '#cyan', dir, '...');
          var fileMd = path.join(recipe.dir, 'plugins', dir, 'info.md');
          var file = path.join(recipe.dir, 'plugins', dir, 'plugin.js');
          bundle = this._addBundle('## ' + dir, fileMd, bundle, true);
        });
      }
    });
  },

  _infoFlows: function(bundle) {
    Object.getOwnPropertyNames(this.piscoConfig.recipes).forEach((recipeName) => {
      var recipe = this.piscoConfig.recipes[recipeName];
      var dirFlow = path.join(recipe.dir, 'flows');
      if (recipe.name && this.fsExists(dirFlow) && recipeName !== 'piscosour') {
        this.logger.info('#green', 'reading', dirFlow);
        var flows = fs.readdirSync(dirFlow);
        flows.forEach((dir) => {
          this.logger.info('processing flow', '#cyan', dir, '...');
          var flow = this.fsReadConfig(path.join(recipe.dir, 'flows', dir, 'flow.json'));
          if (flow.type === 'normal') {
            this._infoFlow(bundle, flow, dir);
          }
        });
      }
    });
  },

  _infoFlow: function(bundle, flow, dir, p) {
    var file = path.join(process.cwd(), 'flows', dir, 'info.md');
    bundle = this._addBundle('## ' + dir + ': \'' + flow.name + '\'', file, bundle, true, flow.description);

    var n = 1;
    Object.getOwnPropertyNames(flow.steps).forEach((stepName) => {
      var step = flow.steps[stepName];
      this.logger.info('#green', 'reading', 'step', '#cyan', stepName);
      stepName = stepName.indexOf(':') >= 0 ? stepName.split(':')[0] : stepName;
      if (step.type === 'flow') {
        var flowStep = this.fsReadConfig(path.join(process.cwd(), 'flows', stepName, 'flow.json'));
        this._infoFlow(bundle, flowStep, '# ' + n + '. (Flow) ' + stepName, n);
        n++;
      } else {
        Object.getOwnPropertyNames(this.piscoConfig.recipes).forEach((recipeName) => {
          var recipe = this.piscoConfig.recipes[recipeName];
          if (recipe.name && recipe.steps && recipe.steps[stepName]) {
            file = path.join(recipe.dir, 'steps', stepName, 'info.md');
            var info = this.piscoConfig.getStepInfo(stepName);
            bundle = this._addBundle('\n### ' + n + (p ? '.' + p : '') + '. ' + stepName + ': \'' + info.description + '\'', file, bundle, true, this._infomd(info));
            n++;

            this.piscoConfig.contexts.forEach((type) => {
              file = path.join(recipe.dir, 'steps', stepName, type, 'info.md');
              bundle = this._addBundle('\n#### For type ' + type + ':', file, bundle);
            });
          }
        });
      }
    });
  },

  _infomd: function(info) {
    var r = '```\n';
    r += 'Contexts:';
    info.types.forEach((type, i, a) => {
      r += '  ' + type;
      if (i < a.length - 1) {
        r += ',';
      }
    });
    r += '\nRecipes:';
    info.recipes.forEach((recipe, i, a) => {
      r += ' ' + recipe.name + ' (' + recipe.version + ')';
      if (i < a.length - 1) {
        r += '\n              ';
      }
    });
    r += '\n```';
    return r;
  },

  _addBundle: function(title, file, bundle, force, subtitle) {
    if (!file || this.fsExists(file) || force) {
      bundle.push({
        title: title,
        subtitle: subtitle,
        file: file
      });
    }
    return bundle;
  }
};

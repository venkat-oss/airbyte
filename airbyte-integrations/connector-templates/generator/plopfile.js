'use strict';
const path = require('path');
const rimraf = require('rimraf');

const getSuccessMessage = function(connectorName, outputPath){
    return `
🚀 🚀 🚀 🚀 🚀 🚀

Success! 

Your ${connectorName} connector has been created at ${path.resolve(outputPath)}.

Follow instructions in NEW_SOURCE_CHECKLIST.md to finish your connector.

Questions, comments, or concerns? Let us know at:
Slack: https://slack.airbyte.io
Github: https://github.com/airbytehq/airbyte

We're always happy to provide you with any support :)
`
}

const TEMPLATES_ROOT = '..';
const CONNECTORS_ROOT = '../../connectors';

const SCAFFOLDS = [
  {
    name: 'source-python',
    description: 'Generate an Airbyte Source written in Python',
    outputName: 'source-{{dashCase name}}',
    dotfiles: ['.gitignore.hbs', '.dockerignore.hbs']
  },
  {
    name: 'source-singer',
    description: 'Generate an Airbyte Source written on top of a Singer Tap.',
    outputName: 'source-{{dashCase name}}-singer',
    dotfiles: ['.gitignore.hbs', '.dockerignore.hbs']
  },
  {
    name: 'source-generic',
    description: 'Use if none of the other templates apply to your use case.',
    outputName: 'source-{{dashCase name}}',
    dotfiles: ['.gitignore.hbs']
  }
];

module.exports = function (plop) {
  let deleteFirst = process.env.DELETE_FIRST === 'true';

  plop.setActionType('emitSuccess', function(answers, config, plopApi){
    console.log(getSuccessMessage(answers.name, plopApi.renderString(config.outputPath, answers)));
  });

  plop.setActionType('deleteFirst', function(answers, config, plopApi){
    rimraf.sync(plopApi.renderString(config.outputPath, answers));
  });

  SCAFFOLDS.forEach(function (scaffold) {
    const templateRoot = `${TEMPLATES_ROOT}/${scaffold.name}`;
    const connectorRoot = `${CONNECTORS_ROOT}/${scaffold.outputName}`;

    let actions = []

    if (deleteFirst) {
      actions.push({type: 'deleteFirst', outputPath: connectorRoot});
    }

    actions.push({
      type:'addMany',
      abortOnFail: true,

      base: templateRoot,
      templateFiles: `${templateRoot}/**/*`,
      destination: connectorRoot,
    });

    scaffold.dotfiles.forEach(function (filename) {
      actions.push({
        type:'add',
        abortOnFail: true,

        templateFile: `${templateRoot}/${filename}`,
        path: `${connectorRoot}/${filename.replace(/\.hbs$/, '')}`
      });
    });

    actions.push({type: 'emitSuccess', outputPath: connectorRoot});

    plop.setGenerator(scaffold.name, {
      description: scaffold.description,
      prompts: [{type: 'input', name: 'name', message: 'Source name, without the "source-" prefix e.g: "google-analytics"'}],
      actions
    });
  });

};

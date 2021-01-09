'use strict';
const path = require('path');

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

module.exports = function (plop) {
  const sourcePythonName = 'source-python';
  const sourceSingerName = 'source-singer';
  const sourceGenericName = 'source-generic';

  const templateDir = '..';
  const sourcePythonInputRoot = `${templateDir}/${sourcePythonName}`;
  const sourceSingerInputRoot = `${templateDir}/${sourceSingerName}`;
  const sourceGenericInputRoot = `${templateDir}/${sourceGenericName}`;

  const outputDir = '../../connectors';
  const sourcePythonOutputRoot = `${outputDir}/source-{{dashCase name}}`;
  const sourceSingerOutputRoot = `${outputDir}/source-{{dashCase name}}-singer`;
  const sourceGenericOutputRoot = `${outputDir}/source-{{dashCase name}}`;

  plop.setActionType('emitSuccess', function(answers, config, plopApi){
      console.log(getSuccessMessage(answers.name, plopApi.renderString(config.outputPath, answers)));
  });

  plop.setGenerator(sourcePythonName, {
    description: 'Generate an Airbyte Source written in Python',
    prompts: [{type: 'input', name: 'name', message: 'Source name, without the "source-" prefix e.g: "google-analytics"'}],
    actions: [{
      type:'addMany',
      abortOnFail: true,

      base: sourcePythonInputRoot,
      templateFiles: `${sourcePythonInputRoot}/**/**`,
      destination: sourcePythonOutputRoot,
    },
    // plop doesn't add dotfiles by default so we manually add them
    {
      type:'add',
      abortOnFail: true,

      templateFile: `${sourcePythonInputRoot}/.gitignore.hbs`,
      path: `${sourcePythonOutputRoot}/.gitignore`
    },
    {
      type:'add',
      abortOnFail: true,

      templateFile: `${sourcePythonInputRoot}/.dockerignore.hbs`,
      path: `${sourcePythonOutputRoot}/.dockerignore`
    },
    {type: 'emitSuccess', outputPath: sourcePythonOutputRoot}]
  });

  plop.setGenerator(sourceSingerName, {
    description: 'Generate an Airbyte Source written on top of a Singer Tap.',
    prompts: [{type: 'input', name: 'name', message: 'Source name, without the "source-" prefix e.g: "google-analytics"'}],
    actions: [{
      type:'addMany',
      abortOnFail: true,

      base: sourceSingerInputRoot,
      templateFiles: `${sourceSingerInputRoot}/**/*`,
      destination: sourceSingerOutputRoot,
    },
    {
      type:'add',
      abortOnFail: true,

      templateFile: `${sourceSingerInputRoot}/.gitignore.hbs`,
      path: `${sourceSingerOutputRoot}/.gitignore`
    },
    {
      type:'add',
      abortOnFail: true,

      templateFile: `${sourceSingerInputRoot}/.dockerignore.hbs`,
      path: `${sourceSingerOutputRoot}/.dockerignore`
    },
    {type: 'emitSuccess', outputPath: sourceSingerOutputRoot},
  ]});

  plop.setGenerator(sourceGenericName, {
    description: 'Use if none of the other templates apply to your use case.',
    prompts: [{type: 'input', name: 'name', message: 'Source name, without the "source-" prefix e.g: "google-analytics"'}],
    actions: [{
      type:'addMany',
      abortOnFail: true,

      base: sourceGenericInputRoot,
      templateFiles: `${sourceGenericInputRoot}/**/*`,
      destination: sourceGenericOutputRoot,
    },
    {
      type:'add',
      abortOnFail: true,

      templateFile: `${sourceGenericInputRoot}/.gitignore.hbs`,
      path: `${sourceGenericOutputRoot}/.gitignore`
    },
    {type: 'emitSuccess', outputPath: sourceGenericOutputRoot}
  ]});

};

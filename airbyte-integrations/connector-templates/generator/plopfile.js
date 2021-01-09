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
  const outputDir = '../../connectors';
  const templateRootDir = '..'

  const sourcePythonName = 'source-python';
  const sourcePythonInputRoot = `${templateRootDir}/${sourcePythonName}`;
  const sourcePythonOutputRoot = `${outputDir}/source-{{dashCase name}}`;

  plop.setActionType('emitSuccess', function(answers, config, plopApi){
    console.log(getSuccessMessage(answers.name, plopApi.renderString(config.outputPath, answers)));
  });

  plop.setGenerator(sourcePythonName, {
    description: 'Generate an Airbyte Source written in Python',
    prompts: [{
      type: 'input', name: 'name', message: 'Source name, without the "source-" prefix e.g: "google-analytics"'
    }],
    actions: [{
      type:'addMany',
      abortOnFail: true,

      templateFiles: `${sourcePythonInputRoot}/**/*`,
      base: sourcePythonInputRoot,
      globOptions: { dot: true, unique: true },

      destination: sourcePythonOutputRoot
    },
    {type: 'emitSuccess', outputPath: sourcePythonOutputRoot}
  ]});

  const sourceSingerName = 'source-singer';
  const sourceSingerInputRoot = `${templateRootDir}/${sourceSingerName}`;
  const sourceSingerOutputRoot = `${outputDir}/source-{{dashCase name}}-singer`;

  plop.setGenerator(sourceSingerName, {
    description: 'Generate an Airbyte Source written on top of a Singer Tap.',
    prompts: [{type: 'input', name: 'name', message: 'Source name, without the "source-" prefix e.g: "google-analytics"'}],
    actions: [{
      abortOnFail: true,
      type:'addMany',
      destination: sourceSingerOutputRoot,
      base: sourceSingerInputRoot,
      templateFiles: `${sourceSingerInputRoot}/**/**`,
      globOptions: { dot: true }
    },
    {type: 'emitSuccess', outputPath: sourceSingerOutputRoot}
  ]});

  const sourceGenericName = 'source-generic';
  const sourceGenericInputRoot = `${templateRootDir}/${sourceGenericName}`;
  const sourceGenericOutputRoot = `${outputDir}/source-{{dashCase name}}`;

  plop.setGenerator(sourceGenericName, {
      description: 'Use if none of the other templates apply to your use case.',
      prompts: [{
        type: 'input', name: 'name', message: 'Source name, without the "source-" prefix e.g: "google-analytics"'
      }],
      actions: [
        {
          abortOnFail: true,
          type:'addMany',
          destination: sourceGenericOutputRoot,
          base: sourceGenericInputRoot,
          templateFiles: `${sourceGenericInputRoot}/**/**`,
          globOptions: { dot: true }
        },
        {
          type:'add',
          abortOnFail: true,
          templateFile: `${sourceGenericInputRoot}/.gitignore.hbs`,
          path: `${sourceGenericOutputRoot}/.gitignore`
        },
        {type: 'emitSuccess', outputPath: sourceGenericOutputRoot}
      ]
    });


};

module.exports = {
  default: [
    '--require-module ts-node/register',
    '--require stepDefinitions/*.ts'
  ].join(' ')
}

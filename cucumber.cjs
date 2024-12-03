module.exports = {
    default: [
    '--require-module ts-node/register',
    '--require ./e2e/steps/*.ts',
    './e2e/features/*.feature'
    ].join(' ')
}
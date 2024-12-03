module.exports = {
    overrides: [
        {
            files: ['*.js', '*.ts'],
            extends: 'love',
            rules: {
                "@typescript-eslint/no-misused-promises": "error",
                "@typescript-eslint/strict-boolean-expressions": "off"
            }
        }
    ]
};
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  globals: {
    ga: true
  },
  extends: `airbnb`,
  rules: {
    'no-console': [
      `warn`,
      {
        allow: [
          `info`,
          `time`,
          `timeEnd`,
          `warn`,
          `error`
        ],
      },
    ],
    'func-style': [
      'error',
      'declaration',
      {
        'allowArrowFunctions': true
      }
    ],
    'react/prop-types': 0,
    'react/no-unknown-property': 0,
    'max-len': [
      `error`,
      120
    ]
  }
}

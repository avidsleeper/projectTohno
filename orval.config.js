module.exports = {
  tohno: {
    output: {
      mode: 'tags-split',
      target: 'apps/tohno/src/app/api/generated/tohno.ts',
      schemas: 'apps/tohno/src/app/api/generated/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './apps/tohno/src/app/api/axios-instance.ts',
          name: 'AXIOS_INSTANCE',
        },
      },
    },
    input: {
      target: 'https://raw.githubusercontent.com/ClairKirsch/nanaya/master/openapi.json',
    },
  },
};
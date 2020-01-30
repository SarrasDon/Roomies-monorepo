// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mongoDBstring:
    'mongodb://Donatos:ds6943754250@cluster0-shard-00-00-tjkib.mongodb.net:27017,cluster0-shard-00-01-tjkib.mongodb.net:27017,cluster0-shard-00-02-tjkib.mongodb.net:27017/dev?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
  authSecret: 'someSecret'
};

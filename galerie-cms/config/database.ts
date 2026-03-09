export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', env('POSTGRESQL_ADDON_HOST', 'localhost')),
      port: env.int('DATABASE_PORT', env.int('POSTGRESQL_ADDON_PORT', 5432)),
      database: env('DATABASE_NAME', env('POSTGRESQL_ADDON_DB', 'galerie_cms')),
      user: env('DATABASE_USERNAME', env('POSTGRESQL_ADDON_USER', 'strapi')),
      password: env('DATABASE_PASSWORD', env('POSTGRESQL_ADDON_PASSWORD', 'strapi')),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});

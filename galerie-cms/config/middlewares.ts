const S3_ORIGINS = [
  process.env.S3_ENDPOINT,
  'https://cellar-c2.services.clever-cloud.com',
].filter(Boolean);

const CORS_ORIGINS = [
  'http://localhost:4321',
  process.env.FRONT_URL,
].filter(Boolean) as string[];

export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:', ...S3_ORIGINS],
          'media-src': ["'self'", 'data:', 'blob:', 'https:', ...S3_ORIGINS],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: CORS_ORIGINS,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  {
    name: 'strapi::favicon',
    config: {
      path: 'public/favicon.svg',
    },
  },
  'strapi::public',
];

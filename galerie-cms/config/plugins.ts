export default ({ env }) => {
  // Clever Cloud Cellar injecte CELLAR_ADDON_KEY_ID / CELLAR_ADDON_KEY_SECRET / CELLAR_ADDON_HOST
  const awsAccessKey = env('AWS_ACCESS_KEY_ID', env('CELLAR_ADDON_KEY_ID', ''));

  if (!awsAccessKey) {
    return {};
  }

  const cellarHost = env('CELLAR_ADDON_HOST', '');
  const s3Endpoint = env('S3_ENDPOINT', cellarHost ? `https://${cellarHost}` : '');

  const providerOptions: Record<string, unknown> = {
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: env('AWS_ACCESS_SECRET', env('CELLAR_ADDON_KEY_SECRET', '')),
    },
    region: env('AWS_REGION', 'eu-west-1'),
    params: {
      Bucket: env('AWS_BUCKET', 'galerie-medias'),
    },
  };

  if (s3Endpoint) {
    providerOptions.endpoint = s3Endpoint;
    providerOptions.forcePathStyle = true;
  }

  return {
    upload: {
      config: {
        provider: '@strapi/provider-upload-aws-s3',
        providerOptions,
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    },
  };
};

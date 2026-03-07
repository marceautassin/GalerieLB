export default ({ env }) => {
  const awsAccessKey = env('AWS_ACCESS_KEY_ID', '');

  if (!awsAccessKey) {
    return {};
  }

  const providerOptions: Record<string, unknown> = {
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: env('AWS_ACCESS_SECRET'),
    },
    region: env('AWS_REGION'),
    params: {
      Bucket: env('AWS_BUCKET'),
    },
  };

  const s3Endpoint = env('S3_ENDPOINT', '');
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

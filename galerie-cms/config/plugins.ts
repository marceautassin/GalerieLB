export default ({ env }) => {
  const awsAccessKey = env('AWS_ACCESS_KEY_ID', '');

  if (!awsAccessKey) {
    return {};
  }

  return {
    upload: {
      config: {
        provider: '@strapi/provider-upload-aws-s3',
        providerOptions: {
          accessKeyId: awsAccessKey,
          secretAccessKey: env('AWS_ACCESS_SECRET'),
          region: env('AWS_REGION'),
          params: {
            Bucket: env('AWS_BUCKET'),
          },
        },
      },
    },
  };
};

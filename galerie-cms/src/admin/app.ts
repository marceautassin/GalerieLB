import { installUploadInterceptor } from './upload-interceptor';

export default {
  config: {
    locales: ['fr'],
    head: {
      favicon: './extensions/favicon.svg',
    },
  },
  bootstrap() {
    installUploadInterceptor();
  },
};

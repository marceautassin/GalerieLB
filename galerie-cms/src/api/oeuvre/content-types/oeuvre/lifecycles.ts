import { slugify } from '../../../../lib/slugify';

export default {
  beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    const { data } = event.params;
    if (!data.slug && data.titre) {
      data.slug = slugify(data.titre as string);
    }
  },
  beforeUpdate(event: { params: { data: Record<string, unknown> } }) {
    const { data } = event.params;
    if (data.titre && !data.slug) {
      data.slug = slugify(data.titre as string);
    }
  },
};

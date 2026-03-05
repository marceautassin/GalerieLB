import { slugify } from '../../../../lib/slugify';

export default {
  beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    const { data } = event.params;
    if (!data.slug && data.nom) {
      data.slug = slugify(data.nom as string);
    }
  },
  beforeUpdate(event: { params: { data: Record<string, unknown> } }) {
    const { data } = event.params;
    if (data.nom && !data.slug) {
      data.slug = slugify(data.nom as string);
    }
  },
};

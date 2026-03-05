export default {
  beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    const { data } = event.params;
    if (!data.dateEnvoi) {
      data.dateEnvoi = new Date().toISOString();
    }
  },
};

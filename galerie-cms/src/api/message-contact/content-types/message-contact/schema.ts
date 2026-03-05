export default {
  kind: "collectionType",
  collectionName: "messages-contact",
  info: {
    singularName: "message-contact",
    pluralName: "messages-contact",
    displayName: "MessageContact",
    description: "Message reçu via le formulaire de contact",
  },
  options: {
    draftAndPublish: false,
  },
  pluginOptions: {},
  attributes: {
    nom: {
      type: "string",
      required: true,
    },
    email: {
      type: "email",
      required: true,
    },
    message: {
      type: "text",
      required: true,
    },
    referenceOeuvre: {
      type: "string",
    },
    referenceExposition: {
      type: "string",
    },
    dateEnvoi: {
      type: "datetime",
    },
  },
};

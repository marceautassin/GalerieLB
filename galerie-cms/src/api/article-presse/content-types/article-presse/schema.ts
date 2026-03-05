export default {
  kind: "collectionType",
  collectionName: "articles-presse",
  info: {
    singularName: "article-presse",
    pluralName: "articles-presse",
    displayName: "ArticlePresse",
    description: "Article de presse de la Galerie Louis Barrand",
  },
  options: {
    draftAndPublish: true,
  },
  pluginOptions: {},
  attributes: {
    titre: {
      type: "string",
      required: true,
    },
    type: {
      type: "enumeration",
      enum: ["pdf", "lien"],
      required: true,
    },
    fichierPdf: {
      type: "media",
      multiple: false,
      required: false,
      allowedTypes: ["files"],
    },
    urlExterne: {
      type: "string",
    },
    visuel: {
      type: "media",
      multiple: false,
      required: false,
      allowedTypes: ["images"],
    },
  },
};

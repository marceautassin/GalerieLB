export default {
  kind: "collectionType",
  collectionName: "artistes",
  info: {
    singularName: "artiste",
    pluralName: "artistes",
    displayName: "Artiste",
    description: "Artiste exposé à la Galerie Louis Barrand",
  },
  options: {
    draftAndPublish: true,
  },
  pluginOptions: {},
  attributes: {
    nom: {
      type: "string",
      required: true,
    },
    biographie: {
      type: "richtext",
    },
    contexteArtistique: {
      type: "richtext",
    },
    photo: {
      type: "media",
      multiple: false,
      required: false,
      allowedTypes: ["images"],
    },
    slug: {
      type: "uid",
      targetField: "nom",
    },
    oeuvres: {
      type: "relation",
      relation: "oneToMany",
      target: "api::oeuvre.oeuvre",
      mappedBy: "artiste",
    },
  },
};

export default {
  kind: "singleType",
  collectionName: "a_propos",
  info: {
    singularName: "a-propos",
    pluralName: "a-propos-items",
    displayName: "APropos",
    description: "Informations sur la Galerie Louis Barrand",
  },
  options: {
    draftAndPublish: true,
  },
  pluginOptions: {},
  attributes: {
    biographieLouis: {
      type: "richtext",
    },
    photoLouis: {
      type: "media",
      multiple: false,
      required: false,
      allowedTypes: ["images"],
      description: "Portrait du galeriste, ratio 4:5 recommandé, visage cadré avec un peu d'espace au-dessus.",
    },
    textePrixMarcus: {
      type: "richtext",
    },
    adresse: {
      type: "text",
    },
    horaires: {
      type: "text",
    },
    telephone: {
      type: "string",
    },
    email: {
      type: "email",
    },
    linkedin: {
      type: "string",
    },
    instagram: {
      type: "string",
      regex: "^https?://.+",
      description: "URL complète du profil, commençant par https://",
    },
    vuesGalerie: {
      type: "media",
      multiple: true,
      required: false,
      allowedTypes: ["images"],
    },
    oeuvresMisesEnAvant: {
      type: "relation",
      relation: "manyToMany",
      target: "api::oeuvre.oeuvre",
    },
  },
};

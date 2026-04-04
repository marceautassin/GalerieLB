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

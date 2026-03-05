export default {
  kind: "collectionType",
  collectionName: "expositions",
  info: {
    singularName: "exposition",
    pluralName: "expositions",
    displayName: "Exposition",
    description: "Exposition de la Galerie Louis Barrand",
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
    dateDebut: {
      type: "date",
      required: true,
    },
    dateFin: {
      type: "date",
    },
    preface: {
      type: "richtext",
    },
    visuels: {
      type: "media",
      multiple: true,
      required: false,
      allowedTypes: ["images"],
    },
    statut: {
      type: "enumeration",
      enum: ["en-cours", "passee"],
      default: "en-cours",
    },
    slug: {
      type: "uid",
      targetField: "titre",
    },
    oeuvres: {
      type: "relation",
      relation: "manyToMany",
      target: "api::oeuvre.oeuvre",
      inversedBy: "expositions",
    },
  },
};

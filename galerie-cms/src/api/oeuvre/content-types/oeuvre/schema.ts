export default {
  kind: "collectionType",
  collectionName: "oeuvres",
  info: {
    singularName: "oeuvre",
    pluralName: "oeuvres",
    displayName: "Oeuvre",
    description: "Oeuvre d'art de la Galerie Louis Barrand",
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
    technique: {
      type: "string",
    },
    dimensions: {
      type: "string",
    },
    provenance: {
      type: "text",
    },
    visuels: {
      type: "media",
      multiple: true,
      required: false,
      allowedTypes: ["images"],
    },
    slug: {
      type: "uid",
      targetField: "titre",
    },
    artiste: {
      type: "relation",
      relation: "manyToOne",
      target: "api::artiste.artiste",
      inversedBy: "oeuvres",
    },
    thematiques: {
      type: "relation",
      relation: "manyToMany",
      target: "api::thematique.thematique",
      inversedBy: "oeuvres",
    },
    expositions: {
      type: "relation",
      relation: "manyToMany",
      target: "api::exposition.exposition",
      mappedBy: "oeuvres",
    },
  },
};

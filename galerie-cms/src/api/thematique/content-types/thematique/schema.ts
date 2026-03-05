export default {
  kind: "collectionType",
  collectionName: "thematiques",
  info: {
    singularName: "thematique",
    pluralName: "thematiques",
    displayName: "Thematique",
    description: "Thématique de classification des oeuvres",
  },
  options: {
    draftAndPublish: true,
  },
  pluginOptions: {},
  attributes: {
    nom: {
      type: "string",
      required: true,
      unique: true,
    },
    slug: {
      type: "uid",
      targetField: "nom",
    },
    oeuvres: {
      type: "relation",
      relation: "manyToMany",
      target: "api::oeuvre.oeuvre",
      mappedBy: "thematiques",
    },
  },
};

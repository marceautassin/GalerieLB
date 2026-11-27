import { YOUTUBE_URL_REGEX } from "../../../../lib/youtube-regex";

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
      description: "Obsolète : le statut est calculé depuis les dates.",
    },
    slug: {
      type: "uid",
      targetField: "titre",
    },
    videoYoutube: {
      type: "string",
      required: false,
      regex: YOUTUBE_URL_REGEX,
      description: "URL YouTube de la vidéo de l'exposition (youtube.com, youtu.be ou youtube-nocookie.com).",
    },
    lieu: {
      type: "string",
      required: false,
      description: "Exposition hors les murs : renseigner ce champ ET l'adresse du lieu (ex. Foire de Chatou). Les deux vides = la galerie.",
    },
    adresseLieu: {
      type: "text",
      required: false,
      description: "Exposition hors les murs : à renseigner avec le lieu, sur une ligne (ex. Île des Impressionnistes, 78400 Chatou). Les deux vides = la galerie.",
    },
    oeuvres: {
      type: "relation",
      relation: "manyToMany",
      target: "api::oeuvre.oeuvre",
      inversedBy: "expositions",
    },
  },
};

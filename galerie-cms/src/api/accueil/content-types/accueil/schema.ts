import { YOUTUBE_URL_REGEX } from "../../../../lib/youtube-regex";

export default {
  kind: "singleType",
  collectionName: "accueil",
  info: {
    singularName: "accueil",
    pluralName: "accueils",
    displayName: "Accueil",
    description: "Page d'accueil de la Galerie Louis Barrand",
  },
  options: {
    draftAndPublish: true,
  },
  pluginOptions: {},
  attributes: {
    videoYoutube: {
      type: "string",
      required: false,
      regex: YOUTUBE_URL_REGEX,
      description: "URL YouTube de la vidéo d'accueil (youtube.com, youtu.be ou youtube-nocookie.com).",
    },
    titreVideo: {
      type: "string",
    },
  },
};

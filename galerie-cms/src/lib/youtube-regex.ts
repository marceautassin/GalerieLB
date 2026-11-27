/**
 * Lien YouTube accepté par le CMS. Aligné sur `parseYoutubeId` du front
 * (galerie-front/src/lib/youtube.ts) : seuls les liens dont le site saura extraire
 * l'identifiant de 11 caractères sont acceptés, pour qu'une vidéo publiée s'affiche toujours.
 */
export const YOUTUBE_URL_REGEX =
  '^https?://(' +
  '(www\\.|m\\.)?youtube\\.com/watch\\?([^#]*&)?v=[A-Za-z0-9_-]{11}([&#].*)?' +
  '|((www\\.|m\\.)?youtube\\.com/(shorts|embed|live)|youtu\\.be|(www\\.)?youtube-nocookie\\.com/embed)/[A-Za-z0-9_-]{11}([?#/].*)?' +
  ')$';

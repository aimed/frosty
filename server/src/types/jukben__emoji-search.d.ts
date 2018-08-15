declare module '@jukben/emoji-search' {
  type Emoji = {
    category: string,
    char: string,
    fitzpatrick_scale: boolean,
    keywords: Array<string>,
    name: string,
  }
  function emojiSearch(search: string): Array<Emoji>;
  export default emojiSearch;
}
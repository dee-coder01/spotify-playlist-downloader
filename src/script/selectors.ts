export const selectors = {
  loginButton: '[data-testid="login-button"]',
  signInWithFacebook: '[data-testid="facebook-login"]',
  facebookUserName: '[id="email"]',
  facebookPassword: '[id="pass"]',
  facebookLoginButton: '[id="loginbutton"]',
  bottomPopupCloseButton: '[id="onetrust-close-btn-container"]',
  spotifySearchButton: '[href="/search"]',
  searchInput: '[data-testid="search-input"]',
  playlistSearchResult:
    '[data-testid="grid-container"] [data-testid="card-click-handler"]',
  playlistSongName: '[data-testid="internal-track-link"]',
  artistName: '[data-testid="internal-track-link"]+span',
  footer: '[data-testid="footer-div"]',
  playList: '//*[@role="presentation"]  //*[text()="Playlists"]',
};

export const youtubeSelectors = {
  firstSuggestion: '[id="content"] [id="dismissible"]',
  searchBox: '[id="search"]',
  searchBtn: '[id="search-icon-legacy"]',
  searchResult: '[id="contents"] ytd-video-renderer',
  muteBtn: '[title="Mute (m)"]',
};

export const downloaderSelectors = {
  input: '[id="id_url"]',
  searchBtn: '[id="search"]',
  downloadBtn: '[id^="download-mp4-"]',
  songName: ".container h6",
};

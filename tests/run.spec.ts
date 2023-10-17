import { test } from "@playwright/test";
import { Spotify } from "./spotify";
import { Youtube } from "./youtube";
import { Downloader } from "./downloader";
test.describe("should first", async () => {
  let spotify: Spotify;
  let youtube: Youtube;
  let downloader: Downloader;
  let playListName: string = "Bollywood";
  test.beforeEach(async ({ page }) => {
    spotify = new Spotify(page);
    youtube = new Youtube(page);
    downloader = new Downloader(page);
  });
  test("this is test", async () => {
    //facebook login creadentials
    //can comment login step if want to download public playlist 
    await test.step("Login to spotify", async () => {
      const userInfo = {
        userName: "userName",
        password: "pass",
      };
      await spotify.loginToSpotify(userInfo);
    });
    await test.step("Get list of songs from the playlist.", async () => {
      await spotify.getListOfSongs(playListName);
    });
    await test.step("Get youtube links.", async () => {
      await youtube.fetchLinks(playListName);
    });
    await test.step("Download the songs.", async () => {
      await downloader.downloadPlayList(playListName);
    });
  });
});

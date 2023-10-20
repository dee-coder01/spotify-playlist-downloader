import { test } from "@playwright/test";
import { Spotify } from "./spotify";
import { Youtube } from "./youtube";
import { Downloader } from "./downloader";
import { UserCredential } from "./types";
test.describe("should first", async () => {
  let spotify: Spotify;
  let youtube: Youtube;
  let downloader: Downloader;
  let playListName: string = process.env.PLAYLIST || "Bollywood";
  test.beforeEach(async ({ page }) => {
    spotify = new Spotify(page);
    youtube = new Youtube(page);
    downloader = new Downloader(page);
  });
  test("this is test", async () => {
    await test.step("Login to spotify", async () => {
      const userInfo: UserCredential = {
        userName: process.env.UNAME || "",
        password: process.env.PASS || "",
      };
      if (process.env.UNAME) await spotify.loginToSpotify(userInfo);
      else
        console.warn(
          "Skipping login step.\nOnly public playlist can be downloaded."
        );
    });
    await test.step("Get list of songs from the playlist.", async () => {
      // playListName = "Bollywood";
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

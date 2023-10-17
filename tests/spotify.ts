// file system module to perform file operations
import fs from "fs";
import { Page } from "@playwright/test";
import { selectors } from "./selectors";
import { writeContentToTheFile } from "./utils";
import { Song, UserCredential } from "./types";

export class Spotify {
  public songs: Song[] = [];
  protected page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  public async loginToSpotify(userCredential: UserCredential) {
    await this.page.goto("https://open.spotify.com/?");
    await this.hoverAndClick(selectors.loginButton);
    await this.page.waitForLoadState();
    await this.hoverAndClick(selectors.signInWithFacebook);
    await this.page.waitForLoadState();
    await this.page.locator(selectors.facebookUserName).clear();
    await this.page
      .locator(selectors.facebookUserName)
      .fill(userCredential.userName);
    while (true) {
      console.log("Running");
      if (
        await this.page
          .locator(selectors.facebookLoginButton)
          .isHidden({ timeout: 3000 })
      )
        break;
      await this.page.locator(selectors.facebookPassword).clear();
      await this.page
        .locator(selectors.facebookPassword)
        .fill(userCredential.password);
      // Manually click on "Sign in" button
      await this.page.waitForTimeout(10000);
    }
  }

  public async getListOfSongs(playlist: string): Promise<void> {
    await this.page.goto("https://open.spotify.com/?");
    await this.hoverAndClick(selectors.spotifySearchButton);
    await this.page.locator(selectors.searchInput).clear();
    await this.page.locator(selectors.searchInput).fill(playlist);
    await this.hoverAndClick(selectors.playList);
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState();
    await this.page.locator(selectors.playlistSearchResult).first().click();
    await this.page.waitForTimeout(1000);
    const songCollection: Song[] = [];
    let i = 0;
    while (true) {
      const element = this.page.locator(selectors.playlistSongName).nth(i);
      if (!(await element.allInnerTexts()).length) break;
      else await element.scrollIntoViewIfNeeded();
      let song: Song = {
        songName: await this.page
          .locator(selectors.playlistSongName)
          .nth(i)
          .innerText({ timeout: 3000 }),
        artist: await this.page
          .locator(selectors.artistName)
          .nth(i)
          .innerText(),
      };
      songCollection.push(song);
      i++;
    }
    console.log(JSON.parse(JSON.stringify(songCollection)));
    this.songs.push(...songCollection);
    await writeContentToTheFile(
      JSON.stringify(songCollection),
      `${playlist}.json`
    );
  }

  private async hoverAndClick(locator: string): Promise<void> {
    await this.page.locator(locator).hover();
    await this.page.locator(locator).click();
  }
}

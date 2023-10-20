import { Page } from "@playwright/test";
import fs from "fs";
import { youtubeSelectors } from "./selectors";
import { readContentFromFile, writeContentToTheFile } from "./utils";

export class Youtube {
  public links: string[] = [];
  protected page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  public async fetchLinks(playList: string) {
    await this.page.goto("https://www.youtube.com/");
    await this.page.locator(youtubeSelectors.searchBox).last().waitFor();
    const songs = JSON.parse(await readContentFromFile(`${playList}.json`));
    for (const song of songs) {
      let songString = "";
      if (song.songName) songString += " " + song.songName;
      if (song.artist) songString += " " + song.artist;
      if (songString === "") continue;
      await this.page
        .locator(youtubeSelectors.searchBox)
        .last()
        .fill(songString);
      await this.page.waitForTimeout(100);
      await this.page
        .locator(youtubeSelectors.searchBtn)
        .waitFor({ state: "visible" });
      const searchResult = this.page
        .locator(youtubeSelectors.searchResult)
        .first();
      while (!(await searchResult.isVisible({ timeout: 1000 }))) {
        await this.page.locator(youtubeSelectors.searchBtn).click();
      }
      await searchResult.click();
      const muteBtn = this.page.locator(youtubeSelectors.muteBtn);
      if (await muteBtn.isVisible()) await muteBtn.click();
      this.links.push(this.page.url());
    }
    await writeContentToTheFile(
      JSON.stringify(this.links),
      `${playList}-links.json`
    );
  }

  // private async getSongList(): Promise<string> {
  //   return new Promise((res) => {
  //     fs.readFile("output.json", { encoding: "utf-8" }, (err, data) => {
  //       if (err) {
  //         console.log("Something went wrong. " + err.message);
  //       }
  //       res(data);
  //     });
  //   });
  // }
}

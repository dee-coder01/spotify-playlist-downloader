import { Page } from "@playwright/test";
import { downloaderSelectors } from "./selectors";
import { readContentFromFile, writeContentToTheFile } from "./utils";

export class Downloader {
  protected page: Page;
  protected songs: string[] = [];
  constructor(page: Page) {
    this.page = page;
  }

  public async downloadPlayList(playList: string) {
    try {
      await this.page.goto("https://ssyoutube.com/en728yP/");
      const songLinks: string[] = JSON.parse(
        await readContentFromFile(`${playList}-links.json`)
      );
      for (const songLink of songLinks) {
        await this.page.locator(downloaderSelectors.input).fill(songLink);
        await this.page.locator(downloaderSelectors.searchBtn).click();
        const downloadPromise = this.page.waitForEvent("download");
        const [newTab] = await Promise.all([
          this.page.waitForEvent("popup"),
          await this.page
            .locator(downloaderSelectors.downloadBtn)
            .first()
            .click(),
        ]);
        if (newTab !== this.page) {
          await newTab.close();
        }
        const download = await downloadPromise;
        const songName = await this.page
          .locator(downloaderSelectors.songName)
          .last()
          .innerText();
        await download.saveAs(`${playList}/${songName}.mp4`);
        this.songs.push(songLink);
      }
    } catch (error) {
      console.log("Something went wrong: " + error.message);
    } finally {
      await writeContentToTheFile(
        JSON.stringify(this.songs),
        `${playList}-download-progress.json`
      );
    }
  }
}

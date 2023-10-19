import fs from "fs";

export async function writeContentToTheFile(content: string, fileName: string) {
  return new Promise((res) => {
    fs.writeFile(fileName, content, "utf8", function (err) {
      if (err) {
        console.log("An error occurred while writing JSON Object to File.");
        return console.log(err);
      }
      console.log("JSON file has been saved.");
      res("Success");
    });
  });
}

export async function readContentFromFile(fileName: string): Promise<string> {
  return new Promise((res) => {
    fs.readFile(fileName, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        console.log("Something went wrong. " + err.message);
      }
      res(data);
    });
  });
}

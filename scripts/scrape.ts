import axios from "axios";
import { getAllUrl } from "./pages";
import * as cheerio from "cheerio";

(async () => {
  const urls = await getAllUrl("https://www.blackkalu.com/");

  console.log(urls);

  urls.map(async (url) => {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);

    let body = $("body");
    body.each((index, item) => {
      if (
        item.name === "script" ||
        item.name === "footer" ||
        item.name === "header" ||
        item.name === "nav"
      ) {
        $(item).remove();
      }
    });

    body = $("body");

    if (urls.indexOf(url) === 4) {
      const text = body.text();
      // Need to clear all the javascript and footer and header
      console.log($.text());
    }
  });
})();

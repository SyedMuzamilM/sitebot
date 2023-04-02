import axios from "axios";
import * as cheerio from "cheerio";
import parse from "url-parse";

// stores the crawled webpages
// Could also store some metadata about the url to show to the user
const seenUrls: Record<string, boolean> = {};

// used to get the full url.
const getUrl = (link: string, host: string, protocol: string) => {
  if (link.includes("http" || "https")) {
    return link;
  } else if (link.startsWith("/")) {
    return `${protocol}//${host}${link}`;
  } else {
    return `${protocol}//${host}/${link}`;
  }
};

const crawl = async (url: string) => {
  // if the url is already crawled then reuturn
  if (seenUrls[url]) return;
  // Set the seen url to true
  seenUrls[url] = true;

  const { host, protocol } = parse(url);
  const response = await axios.get(url);

  const $ = cheerio.load(response.data);
  const links = $("a")
    .map((i, link) => link.attribs.href)
    .get();

  // For each link it will repeate the same process
  links
    .filter((link) => link.includes(host) || link.startsWith("/"))
    .forEach((link) => {
      crawl(getUrl(link, host, protocol));
    });
};

export const getAllUrl = async (url: string) => {
  await crawl(url);
  return Object.keys(seenUrls);
};

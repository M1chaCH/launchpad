import axios from "axios";
import {type CheerioAPI, load} from "cheerio";
import moment from "moment";

export interface VerseOfTheDayDto {
  failed?: boolean,
  passage: string,
  citation: string,
  version: string,
  imageUrl: string,
  copyrightHtml: string,
}

export type VerseOfTheDayLanguage = "en" | "de";

export async function getVerseOfTheDay(language: VerseOfTheDayLanguage): Promise<VerseOfTheDayDto> {
  try {
    const cachedVerseOfTheDay = getVerseOfTheDayFromCache(language);
    if (cachedVerseOfTheDay) {
      return cachedVerseOfTheDay;
    }

    const pageHtml = await downloadPage(language);

    const pageData = load(pageHtml);
    const nextJsData = parseNextJsData(pageData);

    const verses: string[] = nextJsData.props.pageProps.verses.map(v => v.content.replace(/\n/g, " "));
    const verseOfTheDay: string = verses.join(" ");
    const citation: string = nextJsData.props.pageProps.referenceTitle.title;
    const version: string = nextJsData.props.pageProps.versionData.local_abbreviation;
    const copyrightHtml: string = nextJsData.props.pageProps.versionData.copyright_short.html;

    const imageAnchor = pageData("a.block").first();
    const imgSrc = pageData(imageAnchor).find("img").attr()?.src;
    const image = `https://www.bible.com${imgSrc}`;

    const result: VerseOfTheDayDto = {
      passage: verseOfTheDay,
      citation,
      version,
      imageUrl: image,
      copyrightHtml
    };

    storeVerseOfTheDayInCache(language, result);

    return result;
  } catch (e: any) {
    console.error(e);
    return {
      failed: true,
      passage: "",
      citation: "",
      version: "",
      imageUrl: "",
      copyrightHtml: "",
    };
  }
}

async function downloadPage(language: VerseOfTheDayLanguage): Promise<string> {
  console.log(`Downloading verse of the day page for ${language}`);
  const response = await axios.get(`https://www.bible.com/${language}/verse-of-the-day`);

  if (response.status !== 200) {
    throw new Error(`Could not download page (${response.statusText}): ${JSON.stringify(response.data)}`);
  }

  return response.data;
}

function parseNextJsData(pageData: CheerioAPI) {
  const nextJsScript = pageData("script#__NEXT_DATA__").eq(0);
  if (!nextJsScript) {
    throw new Error("Could not find script with __NEXT_DATA__");
  }

  return JSON.parse(nextJsScript.html() ?? "");
}

const verseOfTheDayCache = new Map<VerseOfTheDayLanguage, VerseOfTheDayDto>();
const lastUpdatedCache = new Map<VerseOfTheDayLanguage, string>;

function getVerseOfTheDayFromCache(language: VerseOfTheDayLanguage): VerseOfTheDayDto | null {
  const lastUpdated = lastUpdatedCache.get(language);
  const expectedLastUpdated = getLastUpdatedNowValue();

  if (lastUpdated !== expectedLastUpdated) {
    return null;
  }

  return verseOfTheDayCache.get(language) ?? null;
}

function storeVerseOfTheDayInCache(language: VerseOfTheDayLanguage, verseOfTheDay: VerseOfTheDayDto) {
  verseOfTheDayCache.set(language, verseOfTheDay);
  lastUpdatedCache.set(language, getLastUpdatedNowValue());
}

function getLastUpdatedNowValue() {
  const now = moment();
  return `${now.month()}-${now.date()}`;
}

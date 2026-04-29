const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function getLunch() {
  const url = "https://ravintolafactory.com/lounasravintolat/ravintolat/factory-virtatalo/";
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const result = {
    updated: new Date().toISOString(),
    week: []
  };

  $(".list h3").each((i, el) => {
    const title = $(el).text().trim();

    if (!title.match(/maanantai|tiistai|keskiviikko|torstai|perjantai/i)) return;

    const nextP = $(el).next("p");

    if (!nextP.length) return;

    const menuText = nextP.html() || "";

    const items = menuText
      .split("<br>")
      .map(i => i.replace(/<[^>]+>/g, "").trim())
      .filter(i => i);

    result.week.push({
      day: title,
      menu: items
    });
  });

  fs.writeFileSync("index.json", JSON.stringify(result, null, 2));
}

getLunch();

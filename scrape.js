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

  console.log("🔍 Käydään H3 elementit läpi...");

  $("h3").each((i, el) => {
    const title = $(el).text().trim();

    console.log("H3 FOUND:", title);

    // matchataan viikonpäivät
    if (!title.match(/maanantai|tiistai|keskiviikko|torstai|perjantai/i)) {
      return;
    }

    const nextP = $(el).next("p");

    if (!nextP.length) {
      console.log("⚠️ Ei löytynyt <p> elementtiä:", title);
      return;
    }

    const html = nextP.html();

    if (!html) {
      console.log("⚠️ Tyhjä HTML:", title);
      return;
    }

    const items = html
      .split("<br>")
      .map(item =>
        item
          .replace(/<[^>]+>/g, "") // poista html tagit
          .replace(/\s+/g, " ")
          .trim()
      )
      .filter(item => item.length > 0);

    console.log("✅ Päivä parsittu:", title, items.length, "riviä");

    result.week.push({
      day: title,
      menu: items
    });
  });

  console.log("📦 LOPPUTULOS:");
  console.log(JSON.stringify(result, null, 2));

  fs.writeFileSync("index.json", JSON.stringify(result, null, 2));
}

getLunch();

// scraper.js
const axios = require('axios');
const cheerio = require('cheerio');

const PRODUCT_URL = 'https://epomaker.com/collections/deals-1?sort_by=best-selling&filter.p.product_type=Keyboard&filter.v.price.gte=&filter.v.price.lte=&section_id=template--22451015713076__main&page=';

async function scrapeProduct(url) {
  try {
    // 1. Fetch page HTML
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ProductScraper/1.0)'
      }
    });

    // 2. Load into Cheerio
    const $ = cheerio.load(html);

    // 3. Selectors (based on the page's structure)
    let links = $('a.m-product-card__link')
    link_array = []
    for (let i = 0; i < links.length; i++) {
      let link = $(links[i]);
      let href = link.attr('href');
      href = href.replace(/\?.*$/, '');
    link_array.push(href);
    }
    console.log('Links:', link_array);
    return link_array;
  } catch (err) {
    console.error('Error scraping product:', err.message);
    return null;
  }
}

(async () => {
    let links = []
    for (let page=1; page <= 6; page++) {
      const url = `${PRODUCT_URL}${page}`;
      console.log(`Scraping page ${page}...`);
      const product = await scrapeProduct(url);
      links = [...links, ...product]
    }
  if (links) {
    console.log('Scraped product links data:');
    console.log(links);
    //save to file
    const fs = require('fs');
    fs.writeFileSync('./product_links.json', JSON.stringify(links, null, 2), 'utf-8');
    console.log('Product links saved to product_links.json');
  } else {
    console.log('Failed to scrape links.');
  }
})();

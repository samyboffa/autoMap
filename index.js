const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const request = require('request');
const playwright = require('playwright');

// request('https://moisson-live.com/', (error, response, html) => {
//   console.log(html);
// });

const launchScript = async (pageDebut, pageFin) => {
  try {
    // const browser = await playwright.chromium.launch({ headless: false });
    // const page = await browser.newPage();

    // await page.goto('https://moisson-live.com');

    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage({ waitUntil: 'networkidle0' });
    page.setViewport({ width: 1500, height: 1000 });
    await page.setDefaultTimeout(60000);
    await page.goto('https://moisson-live.com/');
    await page.waitForTimeout(10000);

    await page.mouse.click(40, 200);
    //await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.waitForSelector('.leaflet-marker-icon');
    await page.waitForTimeout(5000);
    const icons = await page.$$('.leaflet-marker-icon');
    console.log(icons.length);
    for (let i = 6; i < icons.length; i++) {
      await page.waitForTimeout(5000);
      await icons[i].click();
      console.log(i);
      await page.waitForTimeout(5000);
      if (await page.$('h5')) {
        let title = await page.$eval('h5', (lis) => lis.textContent);
        console.log(title);
        if (title.includes('partagé')) {
          let content = await page.$eval('.table-hover', (lis) => lis.textContent);
          console.log(content);
        }

        await page.waitForSelector(
          'path[d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"]'
        );
        await page.waitForTimeout(5000);
        await page.click(
          'path[d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"]'
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
};

launchScript();

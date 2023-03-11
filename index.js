require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.post('/data', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(req.body.url, { timeout: 60000 });

  const productName = await page.$eval('#productTitle', el => el.innerText);
  
  let productPrice;
  try {
      productPrice = await page.$eval('#color_name_0_price', el => el.innerText);
  } catch (error) {
      try {
          productPrice = await page.$eval('#priceblock_ourprice', el => el.innerText);
      } catch (error) {
          try {
              productPrice = await page.$eval('#price_inside_buybox', el => el.innerText);
          } catch (error) {
              try {
                  productPrice = await page.$eval('.priceToPay, a-offscreen', el => el.innerText);
              } catch (error) {
                  console.log(error)
              }
          }
      }
  }

  res.json({productName , productPrice});
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

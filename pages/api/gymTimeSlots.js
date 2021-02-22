// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  // running on the Vercel platform.
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  // running locally.
  puppeteer = require("puppeteer");
}

export default async (req, res) => {
  const browser = await puppeteer.launch({
    args: chrome.args,
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.goto(
    "https://docs.google.com/forms/d/e/1FAIpQLSffxZ8i68wYTKzGI1d47koDxVTPu-Qg5S6TZJQn10QW4s9LFQ/viewform?gxids=7628"
  );

  let gyms = [
    {
      name: "CSE Active",
      timeSlots: [],
    },
    {
      name: "Stanley Ho",
      timeSlots: [],
    },
    {
      name: "B-Active",
      timeSlots: [],
    },
  ];

  await page.click("input[type=email]");
  await page.keyboard.type("hello@g.co");

  await page.click("input[aria-labelledby=i5]");
  await page.keyboard.type("bob ross");

  await page.click("input[aria-labelledby=i9]");
  await page.keyboard.type("12345678");

  for (let i = 0; i < gyms.length; i++) {
    await page.evaluate((i) => {
      const radioButtons = document.getElementsByClassName(
        "appsMaterialWizToggleRadiogroupOffRadio"
      );
      Array.from(radioButtons)[i].click();
    }, i);

    await page.evaluate(() => {
      const nextButton = Array.from(
        document.getElementsByClassName("appsMaterialWizButtonEl")
      )[0];
      nextButton.click();
    });

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    await page.evaluate(() => {
      const radioButtons = document.getElementsByClassName(
        "appsMaterialWizToggleRadiogroupOffRadio"
      );
      Array.from(radioButtons)[0].click();
    });

    await page.evaluate(() => {
      const nextButton = Array.from(
        document.getElementsByClassName("appsMaterialWizButtonEl")
      )[1];
      nextButton.click();
    });

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    const timeSlots = await page.evaluate(() => {
      const slots = document.getElementsByClassName(
        "quantumWizMenuPaperselectOption"
      );
      return Array.from(slots).map((slot) => slot.textContent);
    });

    gyms[i].timeSlots = timeSlots.slice(1);

    await page.evaluate(() => {
      const backButtton = Array.from(
        document.getElementsByClassName("appsMaterialWizButtonEl")
      )[0];
      backButtton.click();
    });

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    await page.evaluate(() => {
      const backButtton = Array.from(
        document.getElementsByClassName("appsMaterialWizButtonEl")
      )[0];
      backButtton.click();
    });

    await page.waitForNavigation({ waitUntil: "networkidle0" });
  }

  await browser.close();
  res.status(200).json(gyms);
};

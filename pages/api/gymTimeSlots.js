// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import puppeteer from "puppeteer";

const getTimeSlotsForGym = async (gymNumber, page) => {
  await page.goto(
    "https://docs.google.com/forms/d/e/1FAIpQLSffxZ8i68wYTKzGI1d47koDxVTPu-Qg5S6TZJQn10QW4s9LFQ/viewform?gxids=7628"
  );

  await page.click("input[type=email]");
  await page.keyboard.type("hello@g.co");

  await page.click("input[aria-labelledby=i5]");
  await page.keyboard.type("bob ross");

  await page.click("input[aria-labelledby=i9]");
  await page.keyboard.type("12345678");

  await page.evaluate((gymNumber) => {
    const radioButtons = document.getElementsByClassName(
      "appsMaterialWizToggleRadiogroupOffRadio"
    );
    Array.from(radioButtons)[gymNumber].click();
  }, gymNumber);

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

  return timeSlots.slice(1);
};

export default async (req, res) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
    ignoreHTTPSErrors: true,
  });

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

  const [cse, stanley, bActive] = await Promise.all([
    getTimeSlotsForGym(0, await browser.newPage()),
    getTimeSlotsForGym(1, await browser.newPage()),
    getTimeSlotsForGym(2, await browser.newPage()),
  ]);
  gyms[0].timeSlots = cse;
  gyms[1].timeSlots = stanley;
  gyms[2].timeSlots = bActive;

  await browser.close();
  res.status(200).json(gyms);
};

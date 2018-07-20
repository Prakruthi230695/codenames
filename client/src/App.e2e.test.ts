import * as puppeteer from 'puppeteer';

let browser: puppeteer.Browser;

beforeEach(async () => {
  browser = await puppeteer.launch();
});

afterEach(async () => {
  await browser.close();
});

it('End Turn button changes turn across players\'s screens (socket.on(endTurn))', async () => {
  expect.assertions(3);

  const page: puppeteer.Page = await browser.newPage();
  const page2: puppeteer.Page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000');
  await page2.goto('http://127.0.0.1:3000');
  await page.waitFor('li div div');
  await page2.waitFor('li div div');

  const text: string = await page.$eval('h1', x => x.innerText);
  const text2: string = await page2.$eval('h1', x => x.innerText);
  expect(text).toBe(text2);

  await page.click('button');
  await page2.waitForFunction((text2) => {
    return document.querySelector('h1').innerText !== text2;
  }, {}, text2);

  const textb: string = await page.$eval('h1', x => x.innerText);
  const text2b: string = await page2.$eval('h1', x => x.innerText);
  expect(text).not.toBe(textb);
  expect(textb).toBe(text2b);
});

it('loads up a new game for the first player (socket.on(createNewGame))', async () => {
  const page: puppeteer.Page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000');
  await page.waitFor('li div div');  // Test failure indicated by a timeout here.
});

it('clicking an unguessed tile changes its color. Repeat clicks to nothing (socket.on(guess))', async () => {
  expect.assertions(5);

  const page: puppeteer.Page = await browser.newPage();
  const page2: puppeteer.Page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000');
  await page2.goto('http://127.0.0.1:3000');
  await page.waitFor('li div div');
  await page2.waitFor('li div div');

  const bgColor: string = await page.$eval('li div div', tile => {
    return window.getComputedStyle(tile).getPropertyValue('background-color');
  });
  const bgColor2: string = await page2.$eval('li div div', tile => {
    return window.getComputedStyle(tile).getPropertyValue('background-color');
  });
  expect(bgColor).toBe(bgColor2);

  await page.click('li div div');
  const nextColorHandle2: puppeteer.JSHandle = await page2.waitForFunction((origColor) => {
    const tile = document.querySelector('li div div');
    const changedColor = window.getComputedStyle(tile).getPropertyValue('background-color');
    if (changedColor !== origColor) {
      return changedColor;
    }
  }, {}, bgColor);  //NB: need to pass an empty options obj if passing args.
  const bgColor2b: string = await nextColorHandle2.jsonValue();
  const bgColorb: string = await page.$eval('li div div', tile => {
    return window.getComputedStyle(tile).getPropertyValue('background-color');
  });
  expect(bgColor).not.toBe(bgColor2b);
  expect(bgColor2b).toBe(bgColorb);

  await page.click('li div div');
  await page2.waitFor(2000);  // Need some long time to ensure no server issue.
  const bgColorc: string = await page.$eval('li div div', tile => {
    return window.getComputedStyle(tile).getPropertyValue('background-color');
  });
  const bgColor2c: string = await page2.$eval('li div div', tile => {
    return window.getComputedStyle(tile).getPropertyValue('background-color');
  });
  expect(bgColorc).toBe(bgColor2c);
  expect(bgColor2b).toBe(bgColor2c);

}, 10000);

it('a new player\'s game matches the preexisting players\' (socket.on(joiningGame))', async () => {
  expect.assertions(4);

  const page: puppeteer.Page = await browser.newPage();
  const page2: puppeteer.Page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000');
  await page.waitFor('li div div');
  await page.click('li div div');

  // clicking and getting the new color.
  const bgColor: string = await page.$eval('li div div', tile => {
    return window.getComputedStyle(tile).getPropertyValue('background-color');
  });

  await page2.goto('http://127.0.0.1:3000');
  await page2.waitFor('li div div');

  const word: string = await page.$eval('li div div span', word => word.innerText);
  const word2: string = await page2.$eval('li div div span', word => word.innerText);
  const wordd: string = await page.$eval('li:nth-of-type(2) div div span', word => word.innerText);
  const word2d: string = await page2.$eval('li:nth-of-type(2) div div span', word => word.innerText);
  expect(word).toBe(word2);
  expect(wordd).toBe(word2d);

  const bgColor2: string = await page2.$eval('li div div', tile => {
    return window.getComputedStyle(tile).getPropertyValue('background-color');
  });
  expect(bgColor).toBe(bgColor2);

  const text: string = await page.$eval('h1', x => x.innerText);
  const text2: string = await page2.$eval('h1', x => x.innerText);
  expect(text).toBe(text2);
}, 10000);

it('propogates the new game board to other players on clicking New Game (socket.on(newGame))', async () => {
  expect.assertions(5);

  const page: puppeteer.Page = await browser.newPage();
  const page2: puppeteer.Page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000');
  await page2.goto('http://127.0.0.1:3000');
  await page.waitFor('li div div');
  await page2.waitFor('li div div');

  const word: string = await page.$eval('li div div span', word => word.innerText);
  const word2: string = await page2.$eval('li div div span', word => word.innerText);
  const wordd: string = await page.$eval('li:nth-of-type(2) div div span', word => word.innerText);
  const word2d: string = await page2.$eval('li:nth-of-type(2) div div span', word => word.innerText);
  expect(word).toBe(word2);
  expect(wordd).toBe(word2d);

  await page.click('fieldset + button');  // New Game button selector;
  await page.click('div[role="dialog"] button:last-of-type');  // Confirm dialog.
  await page.waitFor(2000);  // Need new data, but can't do wd === wd2 observer b/c no guarantee they're diff.

  const wordb: string = await page.$eval('li div div span', word => word.innerText);
  const word2b: string = await page2.$eval('li div div span', word => word.innerText);
  const wordc: string = await page.$eval('li:nth-of-type(2) div div span', word => word.innerText);
  const word2c: string = await page2.$eval('li:nth-of-type(2) div div span', word => word.innerText);
  expect(wordb).toBe(word2b);
  expect(wordc).toBe(word2c);

  const bothSame: boolean = word === wordb && wordd === wordc;
  expect(bothSame).toBeFalsy();
}, 10000);

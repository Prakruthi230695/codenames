import * as Nightmare from 'nightmare';


let nightmare1: Nightmare;
let nightmare2: Nightmare;

beforeEach(async () => {
  nightmare1 = new Nightmare({ show: true })
  nightmare2 = new Nightmare({ show: true })
  // console.log("start");
  await nightmare1
    .goto('http://127.0.0.1:3000');
  // console.log('gone to site');
  await nightmare2
    .goto('http://127.0.0.1:3000');
});

afterEach(async () => {
  await nightmare1.end();
  await nightmare2.end();
});

it('sockets turn changes via End Turn button', async () => {
  expect.assertions(6);

  // start out the same
  const startingTurnIndicator1 = await nightmare1
    .evaluate(() => document.querySelector('h1').innerText);
  const startingTurnIndicator2 = await nightmare2
    .evaluate(() => document.querySelector('h1').innerText);
  expect(startingTurnIndicator1).toBe(startingTurnIndicator2);

  // both change
  const oneClickTI1 = await nightmare1
    .click('button')
    .evaluate(() => document.querySelector('h1').innerText)
  const oneClickTI2 = await nightmare2
    .evaluate(() => document.querySelector('h1').innerText);
  expect(oneClickTI1).toBe(oneClickTI2);
  expect(oneClickTI1).not.toBe(startingTurnIndicator1);

  // toggling works
  const twoClickTI2 = await nightmare2
    .click('button')
    .evaluate(() => document.querySelector('h1').innerText)
  const twoClickTI1 = await nightmare1
    .evaluate(() => document.querySelector('h1').innerText);
  expect(twoClickTI1).toBe(twoClickTI2);
  expect(twoClickTI1).toBe(startingTurnIndicator2);
  expect(twoClickTI1).not.toBe(oneClickTI1);
});

// it('does stuff', async () => {
//   const turns: string[] = ['red', 'blue'];
//   console.log('start test');
//   // expect.assertions(1);
//   const text = await nightmare1
//     .click('button')
//     .evaluate(() => document.querySelector('h1').innerText)
//     // .end()
//   // console.log('did stuf on site')
//   console.log(text);
//   expect(text).toContain("TURN");
//   console.log('ran expect');
//   const text2 = await nightmare1
//     .click('button')
//     .evaluate(() => document.querySelector('h1').innerText)
//   console.log(text2);
//   expect(text2).toContain("TURN");
//   await nightmare1.end();
//   console.log('ended');
//   // await nightmare
//   //   .click('button')
//   //   .evaluate(() => document.querySelector('h1').innerText)
//   //   .end()
//   //   .then(console.log)
//   //   .catch(e => {
//   //     console.error('search failed:', e);
//   //   })
//   //   console.log("last");
// });

// it('does async', () => {
  // console.log(nightmare);
  // nightmare = nightmare.goto('http://127.0.0.1:3000').end();
  // console.log(nightmare);
// });
    // .wait('li div div')
    // .click('li div div')

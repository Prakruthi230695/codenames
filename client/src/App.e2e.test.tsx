import * as Nightmare from 'nightmare';


let nightmare1: Nightmare;
let nightmare2: Nightmare;

it('sockets turn changes via End Turn button', async () => {
  // expect.assertions(6);

  // setup
  nightmare1 = new Nightmare({ show: true })
  nightmare2 = new Nightmare({ show: true })
  await nightmare1
    .goto('http://127.0.0.1:3000');
  await nightmare2
    .goto('http://127.0.0.1:3000');

  // start out the same
  const startingTurnIndicator1 = await nightmare1
    .evaluate(() => document.querySelector('h1').innerText);
  const startingTurnIndicator2 = await nightmare2
    .evaluate(() => document.querySelector('h1').innerText);
  expect(startingTurnIndicator1).toBe(startingTurnIndicator2);

  // both change
  const oneClickTI1 = await nightmare1
    .click('button')
    .wait(1000)
    .evaluate(() => document.querySelector('h1').innerText)
    .then(resolve => resolve)
    .catch(error => console.log(error))
  const oneClickTI2 = await nightmare2
    .evaluate(() => document.querySelector('h1').innerText)
    .then(resolve => resolve)
    .catch(error => console.log(error))
  expect(oneClickTI1).toBe(oneClickTI2);
  expect(oneClickTI1).not.toBe(startingTurnIndicator1);

  // toggling works
  const twoClickTI2 = await nightmare2
    .click('button')
    .wait(1000)
    .evaluate(() => document.querySelector('h1').innerText)
    .then(resolve => resolve)
    .catch(error => console.log(error))
  const twoClickTI1 = await nightmare1
    .evaluate(() => document.querySelector('h1').innerText)
    .then(resolve => resolve)
    .catch(error => console.log(error))
  expect(twoClickTI1).toBe(twoClickTI2);
  expect(twoClickTI1).toBe(startingTurnIndicator2);
  expect(twoClickTI1).not.toBe(oneClickTI1);

  await nightmare1
    // .end()
    .halt("halted", () => console.log('halted'))
    // .then(function (result) {
    //   // nightmare1.proc.kill();
    // })
    // .catch(function (error) { console.error(error); });
  await nightmare2
    .halt("halted", () => console.log('halted'))
    // .end()
    // .then(function (result) {
    //   // nightmare2.proc.kill();
    // })
    // .catch(function (error) { console.error(error); });
});

// // This test will fail (if it fails) via a timeout. It just looks to see
// // that the grid is populated, which depends on a socket.io call.
// it('sockets create a new game if first to join', async () => {
//   nightmare1 = new Nightmare({ show: true })
//   await nightmare1
//     .goto('http://127.0.0.1:3000')
//     .wait('li div div span');
//
//   await nightmare1
//     .halt("halted", () => console.log('halted'));
// });

// it('sockets propogate clicks to changes in tile backgound color', async () => {
//   expect.assertions(3);
//
//   // setup
//   nightmare1 = new Nightmare({ show: true })
//   nightmare2 = new Nightmare({ show: true })
//   await nightmare1
//     .goto('http://127.0.0.1:3000')
//     .wait('li div div');
//   await nightmare2
//     .goto('http://127.0.0.1:3000')
//     .wait('li div div');
//
//   // first tile bg color starts off the same
//   const startingBGColor1 = await nightmare1
//     .evaluate(() => {
//       const tile = document.querySelector('li div div');
//       return window.getComputedStyle(tile).getPropertyValue('background-color');
//     });
//   const startingBGColor2 = await nightmare2
//     .evaluate(() => {
//       const tile = document.querySelector('li div div');
//       return window.getComputedStyle(tile).getPropertyValue('background-color');
//     });
//   expect(startingBGColor2).toBe(startingBGColor1);
//
//   const clickedBGColor1 = await nightmare1
//     .click('li div div')
//     .evaluate(() => {
//       const tile = document.querySelector('li div div');
//       return window.getComputedStyle(tile).getPropertyValue('background-color');
//     });
//   const clickedBGColor2 = await nightmare2
//     .evaluate(() => {
//       const tile = document.querySelector('li div div');
//       return window.getComputedStyle(tile).getPropertyValue('background-color');
//     });
//   expect(clickedBGColor1).toBe(clickedBGColor2);
//   expect(clickedBGColor1).not.toBe(startingBGColor1);
//   await nightmare1
//     .end()
//     .then(function (result) {})
//     .catch(function (error) { console.error(error); });
//   await nightmare2
//     .end()
//     .then(function (result) {})
//     .catch(function (error) { console.error(error); });
// });

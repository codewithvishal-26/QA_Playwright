const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const counterFile = path.join(__dirname, 'sharedCounter.json');

function readCounter() {
  if (!fs.existsSync(counterFile)) {
    fs.writeFileSync(counterFile, JSON.stringify({ count: 0 }));
  }
  return JSON.parse(fs.readFileSync(counterFile, 'utf-8')).count;
}

function writeCounter(value) {
  fs.writeFileSync(counterFile, JSON.stringify({ count: value }));
}

test.describe.serial('Race condition demo', () => {

  test('Test A reads, waits, then increments the shared counter', { tag: '@race' }, async () => {
    const current = readCounter();
    console.log('Test A read count as:', current);

    // Simulate some work happening (like a real page load/API call) before writing
    await new Promise(resolve => setTimeout(resolve, 1000));

    writeCounter(current + 1);
    console.log('Test A wrote count as:', current + 1);
  });

  test('Test B reads, waits, then increments the shared counter', { tag: '@race' }, async () => {
    const current = readCounter();
    console.log('Test B read count as:', current);

    await new Promise(resolve => setTimeout(resolve, 1000));

    writeCounter(current + 1);
    console.log('Test B wrote count as:', current + 1);
  });

});
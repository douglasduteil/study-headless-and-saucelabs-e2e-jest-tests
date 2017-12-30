//

const { Builder } = require('selenium-webdriver');
const { writeFileSync } = require('fs');
const { join } = require('path');

//

jest.setTimeout(60 * 1000);
process.env.USE_PROMISE_MANAGER = false;

//

const capability = require('./capability.json');

describe(capability.name, () => {
  const builder = new Builder();
  builder.withCapabilities({ ...capability });
  if (capability.server) {
    builder.usingServer(capability.server);
  }

  let browser;

  beforeAll(async () => {
    browser = await builder.build();
    const session = await browser.getSession();
    writeFileSync(join(__dirname, 'session'), session.getId());
    await browser.get('http://todomvc.com/examples/vanillajs/');
  });

  afterAll(async () => {
    await browser.quit();
  });

  it('should access to the page without error', () => {
    expect(true).toBeTruthy();
  });

  describe('When page is initially opened', () => {
    (capability.name === 'Internet Explorer 11' ||
    capability.name === 'Safari 11'
      ? it.skip
      : it)('should focus on the todo input field', async () => {
      const activeClass: string[] = await browser
        .executeScript(`return document.activeElement.classList`)
        .then(Array.from);

      expect(activeClass).toEqual(['new-todo']);
    });
  });
});

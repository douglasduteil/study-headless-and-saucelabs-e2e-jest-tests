//

import { Browser, launch, Page } from 'puppeteer';

//

let browser: Browser;
let page: Page;

beforeAll(async () => {
  browser = await launch({
    args: ['about:blank'],
    executablePath: process.env.CHROME_BIN
  });
});

afterAll(async () => {
  await browser.close();
});

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto('http://todomvc.com/examples/vanillajs/');
});

afterEach(async () => {
  await page.close();
});

describe('When page is initially opened', () => {
  it('should focus on the todo input field', async () => {
    const activeClass: string[] = await page.evaluate(() =>
      Array.from(document.activeElement.classList)
    );

    expect(activeClass).toEqual(['new-todo']);
  });
});

describe('No Todos', () => {
  it('should hide .main and .footer', async () => {
    expect(await isVisible.call(page, '.main')).toBeFalsy();
    expect(await isVisible.call(page, '.footer')).toBeFalsy();
  });
});

describe('New Todo', () => {
  const TODO_ITEM_ONE = 'buy some cheese';
  const TODO_ITEM_TWO = 'feed the cat';
  const TODO_ITEM_THREE = 'book a doctors appointment';

  afterEach(async () => {
    // HACK(douglasduteil): clear localStorage after each test
    // TodoMVC records everything by default
    await page.evaluate(() => localStorage.clear());
  });

  it('should allow me to add todo items', async () => {
    await page.keyboard.type(TODO_ITEM_ONE);
    await pressEnter.call(page);
    expect(
      await getText.call(page, '.todo-list li:nth-child(1) label')
    ).toEqual(TODO_ITEM_ONE);

    await page.keyboard.type(TODO_ITEM_TWO);
    await pressEnter.call(page);
    expect(
      await getText.call(page, '.todo-list li:nth-child(2) label')
    ).toEqual(TODO_ITEM_TWO);
  });

  it('should clear text input field when an item is added', async () => {
    await page.keyboard.type(TODO_ITEM_ONE);
    await pressEnter.call(page);
    expect(await getText.call(page, '.new-todo')).toEqual('');
  });

  it('should append new items to the bottom of the list', async () => {
    await page.keyboard.type(TODO_ITEM_ONE);
    await pressEnter.call(page);
    await page.keyboard.type(TODO_ITEM_TWO);
    await pressEnter.call(page);
    await page.keyboard.type(TODO_ITEM_THREE);
    await pressEnter.call(page);

    expect(await getText.call(page, '.todo-count')).toEqual('3 items left');

    expect(
      await getText.call(page, '.todo-list li:nth-child(1) label')
    ).toEqual(TODO_ITEM_ONE);
    expect(
      await getText.call(page, '.todo-list li:nth-child(2) label')
    ).toEqual(TODO_ITEM_TWO);
    expect(
      await getText.call(page, '.todo-list li:nth-child(3) label')
    ).toEqual(TODO_ITEM_THREE);
  });

  it('should trim text input', async () => {
    await page.keyboard.type(`    ${TODO_ITEM_ONE}     `);
    await pressEnter.call(page);
    expect(
      await getText.call(page, '.todo-list li:nth-child(1) label')
    ).toEqual(TODO_ITEM_ONE);
  });

  it('should show .main and .footer when items added', async () => {
    await page.keyboard.type(TODO_ITEM_ONE);
    await pressEnter.call(page);
    expect(await isVisible.call(page, '.main')).toBeTruthy();
    expect(await isVisible.call(page, '.footer')).toBeTruthy();
  });

  it.skip('should save the todos so they still appear after refresh', async () => {
    await page.keyboard.type(TODO_ITEM_ONE);
    expect(
      await getText.call(page, '.todo-list li:nth-child(1) label')
    ).toEqual(TODO_ITEM_ONE);

    await page.reload();

    expect(
      await getText.call(page, '.todo-list li:nth-child(1) label')
    ).toEqual(TODO_ITEM_ONE);
  });
});

async function isVisible(this: Page, selector: string): Promise<boolean> {
  if ((await this.$(selector)) === null) {
    throw new Error(`Cannot found "${selector}"`);
  }
  // HACK(douglasduteil): use elem as any because TS
  // Using actual typings would be better here...
  return this.$eval(selector, (elem: any) => {
    return (
      window.getComputedStyle(elem).getPropertyValue('display') !== 'none' &&
      elem.offsetHeight &&
      // Enforce boolean result (not number)
      true
    );
  });
}

async function getText(this: Page, selector: string): Promise<string> {
  if ((await this.$(selector)) === null) {
    throw new Error(`Cannot found "${selector}"`);
  }
  return this.$eval(selector, (elem: any) => elem.textContent);
}

async function pressEnter(this: Page) {
  // HACK(douglasduteil): use manual char code to press Enter
  // "await page.keyboard.press('Enter');"
  // would be ideal but sadly TodoMVC vanilla don't "support" it
  return this.keyboard.press(String.fromCharCode(13));
}

//

//
// Test strongly inspired by CypressIO TodoMVC example
// https://github.com/cypress-io/cypress-example-todomvc/blob/8f2b4fb701aa1dba34c26a1627344dcb77b1ca07/cypress/integration/app_spec.js
//

import { Browser, Page } from 'puppeteer';

//

const todoItem = (x: number) => `.todo-list li:nth-child(${x})`;

let page: Page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto('http://todomvc.com/examples/vanillajs/');
});

afterEach(async () => {
  await page.close();
});

test('should access to the page without error', () => {});
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

describe('Mark all as completed', () => {
  const TODO_ITEM_ONE = 'buy some cheese';
  const TODO_ITEM_TWO = 'feed the cat';
  const TODO_ITEM_THREE = 'book a doctors appointment';

  beforeEach(async () => {
    await page.keyboard.type(TODO_ITEM_ONE);
    await pressEnter.call(page);
    await page.keyboard.type(TODO_ITEM_TWO);
    await pressEnter.call(page);
    await page.keyboard.type(TODO_ITEM_THREE);
    await pressEnter.call(page);
  });

  afterEach(async () => {
    // HACK(douglasduteil): clear localStorage after each test
    // TodoMVC records everything by default
    await page.evaluate(() => localStorage.clear());
  });

  it('should allow me to mark all items as completed', async () => {
    await page.click('.toggle-all');

    expect(await getElementClasses.call(page, todoItem(1))).toContain(
      'completed'
    );
    expect(await getElementClasses.call(page, todoItem(2))).toContain(
      'completed'
    );
    expect(await getElementClasses.call(page, todoItem(3))).toContain(
      'completed'
    );
  });

  it('should allow me to clear the complete state of all items', async () => {
    await page.click('.toggle-all');
    await page.click('.toggle-all');

    expect(await getElementClasses.call(page, todoItem(1))).not.toContain(
      'completed'
    );
    expect(await getElementClasses.call(page, todoItem(2))).not.toContain(
      'completed'
    );
    expect(await getElementClasses.call(page, todoItem(3))).not.toContain(
      'completed'
    );
  });

  it('complete all checkbox should update state when items are completed / cleared', async () => {
    const firstTodoToggle = () => `${todoItem(1)} .toggle`;

    // Starts with nothing checked/marked
    expect(await isChecked.call(page, '.toggle-all')).toBeFalsy();
    expect(await isChecked.call(page, firstTodoToggle())).toBeFalsy();

    // Mark all the todos
    await page.click('.toggle-all');

    // All the todos are marked now
    expect(await isChecked.call(page, '.toggle-all')).toBeTruthy();
    expect(await isChecked.call(page, firstTodoToggle())).toBeTruthy();

    // Un-mark the first todo
    await page.click(firstTodoToggle());

    // All the todos aren't marked now
    // Changing the first todo changes the global mark
    expect(await isChecked.call(page, firstTodoToggle())).toBeFalsy();
    expect(await isChecked.call(page, '.toggle-all')).toBeFalsy();
  });
});

describe('Item', () => {
  const TODO_ITEM_ONE = 'buy some cheese';
  const TODO_ITEM_TWO = 'feed the cat';
  const firstTodoToggle = `${todoItem(1)} .toggle`;
  const secondTodoToggle = `${todoItem(2)} .toggle`;

  afterEach(async () => {
    // HACK(douglasduteil): clear localStorage after each test
    // TodoMVC records everything by default
    await page.evaluate(() => localStorage.clear());
  });

  it('should allow me to mark items as complete', async () => {
    await page.keyboard.type(TODO_ITEM_ONE);
    await pressEnter.call(page);
    await page.keyboard.type(TODO_ITEM_TWO);
    await pressEnter.call(page);

    await page.click(firstTodoToggle);
    expect(await getElementClasses.call(page, todoItem(1))).toContain(
      'completed'
    );
    expect(await getElementClasses.call(page, todoItem(2))).not.toContain(
      'completed'
    );

    await page.click(secondTodoToggle);
    expect(await getElementClasses.call(page, todoItem(1))).toContain(
      'completed'
    );
    expect(await getElementClasses.call(page, todoItem(2))).toContain(
      'completed'
    );
  });

  it('should allow me to un-mark items as complete', async () => {
    await page.keyboard.type(TODO_ITEM_ONE);
    await pressEnter.call(page);
    await page.keyboard.type(TODO_ITEM_TWO);
    await pressEnter.call(page);

    await page.click(firstTodoToggle);
    expect(await getElementClasses.call(page, todoItem(1))).toContain(
      'completed'
    );
    expect(await getElementClasses.call(page, todoItem(2))).not.toContain(
      'completed'
    );

    await page.click(firstTodoToggle);
    expect(await getElementClasses.call(page, todoItem(1))).not.toContain(
      'completed'
    );
    expect(await getElementClasses.call(page, todoItem(2))).not.toContain(
      'completed'
    );
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

async function isChecked(this: Page, selector: string): Promise<boolean> {
  if ((await this.$(selector)) === null) {
    throw new Error(`Cannot found "${selector}"`);
  }

  return this.$eval(selector, (elm: any) => elm.checked);
}

async function getText(this: Page, selector: string): Promise<string> {
  if ((await this.$(selector)) === null) {
    throw new Error(`Cannot found "${selector}"`);
  }
  return this.$eval(selector, (elem: any) => elem.textContent);
}

async function getElementClasses(
  this: Page,
  selector: string
): Promise<string[]> {
  if ((await this.$(selector)) === null) {
    throw new Error(`Cannot found "${selector}"`);
  }

  return this.$eval(selector, (elm: any) => Array.from(elm.classList));
}

async function pressEnter(this: Page) {
  // HACK(douglasduteil): use manual char code to press Enter
  // "await page.keyboard.press('Enter');"
  // would be ideal but sadly TodoMVC vanilla don't "support" it
  return this.keyboard.press(String.fromCharCode(13));
}

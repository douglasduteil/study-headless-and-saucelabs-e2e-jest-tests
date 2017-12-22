//

// tslint:disable:max-classes-per-file

//

import { Browser, launch, Page } from 'puppeteer';

//

interface Actor {
  log: (...msg: any[]) => void;
}

interface JestSuiteLike {
  id: string;
  parentSuite: JestSuiteLike | null;
  description: string;
  beforeEach: (fn: () => typeof beforeEach) => void;
  afterEach: (fn: () => typeof afterEach) => void;
  addChild: (fn: () => typeof it) => void;
}

class PuppeteerActor implements Actor {
  browser: Browser;
  page: Page;
  constructor() {}

  do(sth: string, cb: () => any) {
    test(`I ${sth}`, cb);
  }

  amOnPage(url: string) {
    test(`I am on page "${url}"`, async () => {
      await this.page.goto(url);
    });
  }

  log(...msg: any[]) {
    test('I log', () => {
      // tslint:disable-next-line:no-console
      console.log(...msg);
    });
  }
}

class JestCodecept<A> {
  suite: JestSuiteLike;

  constructor(public actor: A) {}
  feature(name: string) {
    this.suite = describe(name, () => {}) as any;
  }
  scenario(name: string, cb: (I: A) => void) {
    describe(name, () => {
      cb(this.actor);
    });
  }
}

const my1ctor = new PuppeteerActor();
const t = new JestCodecept(my1ctor);

beforeAll(async () => {
  t.actor.browser = await launch({
    args: ['about:blank'],
    executablePath: process.env.CHROME_BIN
  });
});

afterAll(async () => {
  await t.actor.browser.close();
});

beforeEach(async () => {
  t.actor.page = await t.actor.browser.newPage();
  await t.actor.page.goto('http://todomvc.com/examples/vanillajs/');
});

afterEach(async () => {
  await t.actor.page.close();
});

t.scenario('do 1 thing', I => {
  I.log('yolo');
});
t.scenario('do 2 thing', I => {
  I.amOnPage('http://todomvc.com/examples/vanillajs/');
});

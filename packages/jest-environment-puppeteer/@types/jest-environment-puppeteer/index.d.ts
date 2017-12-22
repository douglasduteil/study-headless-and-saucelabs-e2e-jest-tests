//

/// <reference types="node" />

import { Browser, launch } from 'puppeteer';

declare namespace NodeJS {
  interface Global {
    browser: Browser;
  }
}

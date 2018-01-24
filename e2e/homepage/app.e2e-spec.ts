import {} from 'jasminewd2';
import { browser } from 'protractor';

describe('Suite Homepage Lab1100', () => {
  beforeEach(() => {
    browser.get('/');
  });

  it('Title page should be Lab1100', () => {
    expect(browser.getTitle()).toEqual('Lab1100');
  });
});

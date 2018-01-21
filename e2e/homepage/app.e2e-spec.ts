import { browser } from 'protractor';

describe('Suite Homepage Lab1100',()=>{
  beforeEach(()=>{
    browser.get('/');
  });

  it('Title page should be Lab1100');
});

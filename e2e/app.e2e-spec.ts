import { AsiActiveAnalyticsPage } from './app.po';

describe('asi-active-analytics App', () => {
  let page: AsiActiveAnalyticsPage;

  beforeEach(() => {
    page = new AsiActiveAnalyticsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

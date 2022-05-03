import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { InfluenciadorComponentsPage, InfluenciadorDeleteDialog, InfluenciadorUpdatePage } from './influenciador.page-object';

const expect = chai.expect;

describe('Influenciador e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let influenciadorComponentsPage: InfluenciadorComponentsPage;
  let influenciadorUpdatePage: InfluenciadorUpdatePage;
  let influenciadorDeleteDialog: InfluenciadorDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Influenciadors', async () => {
    await navBarPage.goToEntity('influenciador');
    influenciadorComponentsPage = new InfluenciadorComponentsPage();
    await browser.wait(ec.visibilityOf(influenciadorComponentsPage.title), 5000);
    expect(await influenciadorComponentsPage.getTitle()).to.eq('nextLevelApp.influenciador.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(influenciadorComponentsPage.entities), ec.visibilityOf(influenciadorComponentsPage.noResult)),
      1000
    );
  });

  it('should load create Influenciador page', async () => {
    await influenciadorComponentsPage.clickOnCreateButton();
    influenciadorUpdatePage = new InfluenciadorUpdatePage();
    expect(await influenciadorUpdatePage.getPageTitle()).to.eq('nextLevelApp.influenciador.home.createOrEditLabel');
    await influenciadorUpdatePage.cancel();
  });

  it('should create and save Influenciadors', async () => {
    const nbButtonsBeforeCreate = await influenciadorComponentsPage.countDeleteButtons();

    await influenciadorComponentsPage.clickOnCreateButton();

    await promise.all([
      influenciadorUpdatePage.setNomeInput('nome'),
      influenciadorUpdatePage.setEmailInput('email'),
      influenciadorUpdatePage.setRegiaoInput('regiao'),
      influenciadorUpdatePage.setBioInput('bio'),
      influenciadorUpdatePage.setRedesInput('redes'),
      influenciadorUpdatePage.userSelectLastOption(),
    ]);

    expect(await influenciadorUpdatePage.getNomeInput()).to.eq('nome', 'Expected Nome value to be equals to nome');
    expect(await influenciadorUpdatePage.getEmailInput()).to.eq('email', 'Expected Email value to be equals to email');
    expect(await influenciadorUpdatePage.getRegiaoInput()).to.eq('regiao', 'Expected Regiao value to be equals to regiao');
    expect(await influenciadorUpdatePage.getBioInput()).to.eq('bio', 'Expected Bio value to be equals to bio');
    expect(await influenciadorUpdatePage.getRedesInput()).to.eq('redes', 'Expected Redes value to be equals to redes');

    await influenciadorUpdatePage.save();
    expect(await influenciadorUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await influenciadorComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Influenciador', async () => {
    const nbButtonsBeforeDelete = await influenciadorComponentsPage.countDeleteButtons();
    await influenciadorComponentsPage.clickOnLastDeleteButton();

    influenciadorDeleteDialog = new InfluenciadorDeleteDialog();
    expect(await influenciadorDeleteDialog.getDialogTitle()).to.eq('nextLevelApp.influenciador.delete.question');
    await influenciadorDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(influenciadorComponentsPage.title), 5000);

    expect(await influenciadorComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

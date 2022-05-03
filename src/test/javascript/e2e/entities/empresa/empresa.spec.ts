import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { EmpresaComponentsPage, EmpresaDeleteDialog, EmpresaUpdatePage } from './empresa.page-object';

const expect = chai.expect;

describe('Empresa e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let empresaComponentsPage: EmpresaComponentsPage;
  let empresaUpdatePage: EmpresaUpdatePage;
  let empresaDeleteDialog: EmpresaDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Empresas', async () => {
    await navBarPage.goToEntity('empresa');
    empresaComponentsPage = new EmpresaComponentsPage();
    await browser.wait(ec.visibilityOf(empresaComponentsPage.title), 5000);
    expect(await empresaComponentsPage.getTitle()).to.eq('nextLevelApp.empresa.home.title');
    await browser.wait(ec.or(ec.visibilityOf(empresaComponentsPage.entities), ec.visibilityOf(empresaComponentsPage.noResult)), 1000);
  });

  it('should load create Empresa page', async () => {
    await empresaComponentsPage.clickOnCreateButton();
    empresaUpdatePage = new EmpresaUpdatePage();
    expect(await empresaUpdatePage.getPageTitle()).to.eq('nextLevelApp.empresa.home.createOrEditLabel');
    await empresaUpdatePage.cancel();
  });

  it('should create and save Empresas', async () => {
    const nbButtonsBeforeCreate = await empresaComponentsPage.countDeleteButtons();

    await empresaComponentsPage.clickOnCreateButton();

    await promise.all([
      empresaUpdatePage.setNomeInput('nome'),
      empresaUpdatePage.setRegiaoInput('regiao'),
      empresaUpdatePage.setNichoInput('nicho'),
      empresaUpdatePage.setSiteInput('site'),
      empresaUpdatePage.userSelectLastOption(),
      // empresaUpdatePage.influenciadorSelectLastOption(),
    ]);

    expect(await empresaUpdatePage.getNomeInput()).to.eq('nome', 'Expected Nome value to be equals to nome');
    expect(await empresaUpdatePage.getRegiaoInput()).to.eq('regiao', 'Expected Regiao value to be equals to regiao');
    expect(await empresaUpdatePage.getNichoInput()).to.eq('nicho', 'Expected Nicho value to be equals to nicho');
    expect(await empresaUpdatePage.getSiteInput()).to.eq('site', 'Expected Site value to be equals to site');

    await empresaUpdatePage.save();
    expect(await empresaUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await empresaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Empresa', async () => {
    const nbButtonsBeforeDelete = await empresaComponentsPage.countDeleteButtons();
    await empresaComponentsPage.clickOnLastDeleteButton();

    empresaDeleteDialog = new EmpresaDeleteDialog();
    expect(await empresaDeleteDialog.getDialogTitle()).to.eq('nextLevelApp.empresa.delete.question');
    await empresaDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(empresaComponentsPage.title), 5000);

    expect(await empresaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

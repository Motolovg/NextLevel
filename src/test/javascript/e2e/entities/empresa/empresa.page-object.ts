import { element, by, ElementFinder } from 'protractor';

export class EmpresaComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-empresa div table .btn-danger'));
  title = element.all(by.css('jhi-empresa div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class EmpresaUpdatePage {
  pageTitle = element(by.id('jhi-empresa-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nomeInput = element(by.id('field_nome'));
  regiaoInput = element(by.id('field_regiao'));
  nichoInput = element(by.id('field_nicho'));
  siteInput = element(by.id('field_site'));

  userSelect = element(by.id('field_user'));
  influenciadorSelect = element(by.id('field_influenciador'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setNomeInput(nome: string): Promise<void> {
    await this.nomeInput.sendKeys(nome);
  }

  async getNomeInput(): Promise<string> {
    return await this.nomeInput.getAttribute('value');
  }

  async setRegiaoInput(regiao: string): Promise<void> {
    await this.regiaoInput.sendKeys(regiao);
  }

  async getRegiaoInput(): Promise<string> {
    return await this.regiaoInput.getAttribute('value');
  }

  async setNichoInput(nicho: string): Promise<void> {
    await this.nichoInput.sendKeys(nicho);
  }

  async getNichoInput(): Promise<string> {
    return await this.nichoInput.getAttribute('value');
  }

  async setSiteInput(site: string): Promise<void> {
    await this.siteInput.sendKeys(site);
  }

  async getSiteInput(): Promise<string> {
    return await this.siteInput.getAttribute('value');
  }

  async userSelectLastOption(): Promise<void> {
    await this.userSelect.all(by.tagName('option')).last().click();
  }

  async userSelectOption(option: string): Promise<void> {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect(): ElementFinder {
    return this.userSelect;
  }

  async getUserSelectedOption(): Promise<string> {
    return await this.userSelect.element(by.css('option:checked')).getText();
  }

  async influenciadorSelectLastOption(): Promise<void> {
    await this.influenciadorSelect.all(by.tagName('option')).last().click();
  }

  async influenciadorSelectOption(option: string): Promise<void> {
    await this.influenciadorSelect.sendKeys(option);
  }

  getInfluenciadorSelect(): ElementFinder {
    return this.influenciadorSelect;
  }

  async getInfluenciadorSelectedOption(): Promise<string> {
    return await this.influenciadorSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class EmpresaDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-empresa-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-empresa'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}

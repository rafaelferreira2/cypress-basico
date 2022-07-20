/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {

  const SECONDS = 3000
    beforeEach(() => {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
      cy.clock()
      cy.get('#firstName').type('Rafael' )
      cy.get('#lastName').type('Ferreira')
      cy.get('#email').type('email@mail.com')
      cy.get('#open-text-area').type('Apenas  testando a aplicação', {delay: 0})
      cy.contains('button', 'Enviar').click()

      cy.get('.success').should('be.visible')
      cy.tick(SECONDS)
      cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
      cy.clock()
      cy.get('#firstName').type('Rafael' )
      cy.get('#lastName').type('Ferreira')
      cy.get('#email').type('email#mail.com')
      cy.get('#open-text-area').type('Apenas  testando a aplicação', {delay: 0})
      cy.contains('button', 'Enviar').click()

      cy.get('.error').should('be.visible')
      cy.tick(SECONDS)
      cy.get('.error').should('not.be.visible')
    })

    it('Valida campo de telefone só aceita números', function() {
      cy.get('#phone').type('abcde').should('have.value', '')
      cy.get('#phone').type('12345').should('have.value', '12345')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
      cy.clock()
      cy.get('#firstName').type('Rafael' )
      cy.get('#lastName').type('Ferreira')
      cy.get('#email').type('email@mail.com')
      cy.get('#phone-checkbox').check()
      cy.get('#open-text-area').type('Apenas  testando a aplicação', {delay: 0})
      cy.contains('button', 'Enviar').click()

      cy.get('.error').should('be.visible')
      cy.get('.phone-label-span').should('be.visible')
      cy.tick(SECONDS)
      cy.get('.error').should('not.be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
      cy.get('#firstName')
        .type('Rafael' )
        .should('have.value', 'Rafael')
        .clear()
        .should('have.value', '')

      cy.get('#lastName')
        .type('Ferreira' )
        .should('have.value', 'Ferreira')
        .clear()
        .should('have.value', '')

      cy.get('#email')
        .type('email@mail.com' )
        .should('have.value', 'email@mail.com')
        .clear()
        .should('have.value', '')

      cy.get('#open-text-area')
        .type('Apenas  testando a aplicação' )
        .should('have.value', 'Apenas  testando a aplicação')
        .clear()
        .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
      cy.clock()
      cy.contains('button', 'Enviar').click()

      cy.get('.error').should('be.visible')
      cy.tick(SECONDS)
      cy.get('.error').should('not.be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function() {
      cy.clock()
      cy.fillMandatoryFieldsAndSubmit()
      cy.get('.success').should('be.visible')
      cy.tick(SECONDS)
      cy.get('.success').should('not.be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function() {
      cy.get('#product')
        .select('YouTube')
        .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
      cy.get('#product')
        .select('mentoria')
        .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function() {
      cy.get('#product')
        .select(1)
        .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function() {
      cy.get('input[type="radio"][value="feedback"]')
        .check()
        .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function() {
      cy.get('input[type="radio"][name="atendimento-tat"]')
        .should('have.length', 3)
        .each(function($radio) {
          cy.wrap($radio).check()
          cy.wrap($radio).should('be.checked')
        })
    })

    it('marca ambos checkboxes, depois desmarca o último', function() {
      cy.get('input[type="checkbox"]').check()
        .last().uncheck()
        .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', function() {
      cy.get('input[type="file"]#file-upload')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json')
        .should(function($input) {
          expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function() {
      cy.get('input[type="file"]#file-upload')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
        .then(input => {
          expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
      cy.fixture('example.json').as('sampleFile')
      cy.get('input[type="file"]#file-upload')
        .should('not.have.value')
        .selectFile('@sampleFile')
        .then(input => {
          expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
      cy.contains('Política de Privacidade').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicanco no link', function() {
      cy.get('div#privacy a')
        .invoke('removeAttr', 'target')
        .should('not.have.attr', 'target', '_blank')
        .click()

      cy.contains('Talking About Testing').should('be.visible')
    })
  })

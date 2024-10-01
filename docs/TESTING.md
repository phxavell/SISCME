# Guia de Testes para o SISCME

Este documento fornece uma visão geral das práticas de teste implementadas no projeto SISCME, incluindo diretrizes para a execução de testes unitários, de integração, e testes E2E. O objetivo é garantir que todos os contribuidores compreendam como testar efetivamente o código, contribuindo para a manutenção da qualidade e da estabilidade do sistema.

## Estrutura de Testes

O SISCME utiliza uma abordagem de testes automatizados para garantir a qualidade do software em todas as fases do desenvolvimento. A estrutura de testes é dividida da seguinte forma:

- **Testes Unitários**: Testam a menor unidade de código isoladamente (funções, métodos).
- **Testes de Integração**: Verificam a interação entre diferentes módulos ou serviços.
- **Testes E2E (End-to-End)**: Simulam cenários de usuários reais testando o sistema como um todo.

## Ferramentas de Teste

- **Backend (Django + DRF)**:
  - *pytest*: Utilizado para a escrita e execução dos testes unitários e de integração.
  - *Factory Boy*: Para a criação de objetos de teste.
  - *Django REST Framework Testing*: Para testar as APIs.

- **Frontend (React)**:
  - *Jest*: Para testes unitários e de snapshots.
  - *React Testing Library*: Para testes de componentes React.
  - *Cypress*: Para testes E2E.

## Executando os Testes

### Backend

Para executar os testes no backend, utilize o seguinte comando:

```bash
pytest
```

### Frontend

Para executar os testes unitários no frontend, use:

```bash
npm run test
```

Para testes E2E com Cypress, utilize:

```bash
npx cypress open
```

Práticas Recomendadas
---------------------

*   Escreva testes claros e concisos.
*   Use nomes descritivos para funções de teste.
*   Teste apenas um conceito por teste.
*   Utilize dados de teste que reflitam cenários reais de uso.
*   Revise os testes existentes antes de contribuir com novos testes para evitar duplicidade.

Contribuindo com Testes
-----------------------

Encorajamos contribuições que melhorem a cobertura e a qualidade dos testes. Ao adicionar novos recursos ou corrigir bugs, inclua testes relevantes que validem as mudanças. Siga as diretrizes de estilo e boas práticas do projeto.

Para contribuir com testes, crie um pull request com suas alterações, incluindo uma descrição clara do que foi testado e quaisquer considerações especiais necessárias para entender o teste.

Recursos
--------

*   [pytest Documentation](https://docs.pytest.org/en/latest/)
*   [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro)
*   [Cyress Documentation](https://docs.cypress.io/guides/overview/why-cypress.html)

Este guia é um trabalho em progresso, e feedbacks ou sugestões para melhorá-lo são sempre bem-vindos.

# Task List para Correção de Testes

## 1. Resolver Avisos `act(...)` nos Testes da Página de Registro

**Problema:** O React Testing Library está emitindo avisos de que atualizações de estado no componente `RegisterPage` não estão sendo envolvidas em blocos `act(...)`. Isso significa que o DOM pode não estar totalmente atualizado quando as asserções são feitas, levando a testes não confiáveis.

**Localização:**
*   `__tests__/pages/register.test.tsx` (arquivo de teste)
*   `app/register/page.tsx` (componente que está sendo testado, especificamente as linhas com `setIsLoading(false)` e `setError(...)` após interações assíncronas).

**Ações Necessárias:**
*   **Identificar testes afetados:** Revise `__tests__/pages/register.test.tsx` para encontrar os testes que interagem com o formulário de registro (ex: preenchimento de campos, clique no botão de submissão) e que causam atualizações de estado assíncronas (como chamadas de API).
*   **Envolver interações em `act()`:** Para cada teste afetado, envolva as ações do usuário (ex: `fireEvent.change`, `fireEvent.click`) e as asserções subsequentes dentro de um bloco `act()`. Se a interação for assíncrona, use `await act(async () => { ... });`.

    **Exemplo de como deve ficar no teste:**
    ```typescript
    import { render, screen, fireEvent, act } from '@testing-library/react';
    // ...
    it('should display an error message on failed registration', async () => {
      // Mock da API para simular falha
      jest.spyOn(api, 'register').mockRejectedValueOnce(new Error('Email already exists'));

      await act(async () => { // Envolver a renderização e interações assíncronas
        render(<RegisterPage />);
      });

      // Preencher formulário
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'existing@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
      });

      // Clicar no botão de registro
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Register/i }));
      });

      // Assertions
      expect(await screen.findByText('Email already exists')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument(); // Verifica que o loading sumiu
    });
    ```

## 2. Revisar e Testar o Tratamento de Erros na `RegisterPage`

**Problema:** O `console.error` "Registration error: Error: Email already exists" indica que a lógica de tratamento de erros na `RegisterPage` está sendo acionada. Embora o erro esteja sendo logado, o teste deve verificar se a mensagem de erro é exibida corretamente para o usuário na interface.

**Localização:**
*   `app/register/page.tsx` (lógica de tratamento de erro)
*   `__tests__/pages/register.test.tsx` (testes para verificar a exibição do erro)

**Ações Necessárias:**
*   **Verificar exibição de erro no componente:** Certifique-se de que a `RegisterPage` exibe a mensagem de erro (`setError`) de forma visível para o usuário (ex: um `div` com `role="alert"` ou um `p` com a mensagem).
*   **Adicionar asserção de erro no teste:** No teste que simula uma falha de registro (como o exemplo acima), adicione uma asserção para verificar se a mensagem de erro (`Email already exists`) aparece na tela.

## 3. Garantir que todos os testes passem após as correções

**Ação Necessária:**
*   Após implementar as correções acima, execute `npm run test` novamente e verifique se todos os testes passam sem avisos ou erros.
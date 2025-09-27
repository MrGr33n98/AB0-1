// Testar se o endpoint de dashboard funciona com algum token padrão
const API_BASE_URL = 'http://localhost:3001';

async function testDashboardWithAuth() {
  try {
    console.log('Testando endpoint /dashboard/stats com cabeçalhos...');
    console.log('URL base:', API_BASE_URL);
    
    const fullUrl = `${API_BASE_URL}/api/v1/dashboard/stats`;
    
    console.log('Testando com headers padrão...');
    const response1 = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    console.log(`Status sem auth: ${response1.status}`);
    
    // Talvez precise de um token padrão de admin para desenvolvimento
    console.log('Testando com token de desenvolvimento (se existir)...');
    const response2 = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer development-token', // Exemplo
      }
    });
    console.log(`Status com token fake: ${response2.status}`);
    
    // Testar com um token mais comum
    const response3 = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Token token="development-token"', // Outro formato comum
      }
    });
    console.log(`Status com formato Token: ${response3.status}`);
    
  } catch (error) {
    console.error('Erro ao testar autenticação:', error.message);
  }
}

testDashboardWithAuth();
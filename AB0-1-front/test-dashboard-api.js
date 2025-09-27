// Testar com a URL do .env.local
const API_BASE_URL = 'http://localhost:3001';

async function testDashboardStats() {
  try {
    console.log('Testando endpoint /dashboard/stats...');
    console.log('URL base:', API_BASE_URL);
    
    // Remover '/api/v1' se já estiver presente e adicionar corretamente
    const baseUrl = API_BASE_URL.replace(/\/api\/v1$/, ''); // Remove /api/v1 se estiver no final
    const fullUrl = `${baseUrl}/api/v1/dashboard/stats`;
    
    console.log('URL base corrigida:', baseUrl);
    console.log('URL completa:', fullUrl);
    
    const response = await fetch(fullUrl);
    console.log('Status da resposta:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Dados recebidos:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erro ao testar dashboard API:', error.message);
  }
}

testDashboardStats();
// Testar diferentes endpoints no servidor local
const API_BASE_URL = 'http://localhost:3001';

async function testLocalEndpoints() {
  try {
    console.log('Testando endpoints locais...');
    console.log('URL base:', API_BASE_URL);
    
    const endpoints = [
      '/api/v1/dashboard/stats',
      '/api/v1/categories',
      '/api/v1/companies',
      '/'
    ];
    
    for (const endpoint of endpoints) {
      const fullUrl = `${API_BASE_URL}${endpoint}`;
      console.log(`\nTestando: ${fullUrl}`);
      
      try {
        const response = await fetch(fullUrl);
        console.log(`Status: ${response.status}`);
        
        if (response.ok) {
          // Tente ler parte da resposta para ver se é JSON
          const text = await response.text();
          console.log('Resposta (primeiros 200 chars):', text.substring(0, 200));
          
          // Tente fazer parse se for JSON
          try {
            const jsonData = JSON.parse(text);
            console.log('JSON válido recebido');
          } catch (e) {
            console.log('Resposta não é JSON');
          }
        } else {
          console.log('Erro - não OK');
        }
      } catch (error) {
        console.log(`Erro ao acessar: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Erro geral:', error.message);
  }
}

testLocalEndpoints();
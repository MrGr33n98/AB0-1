// Testar endpoint de reviews
const API_BASE_URL = 'http://localhost:3001';

async function testReviewsEndpoint() {
  try {
    console.log('Testando endpoint de reviews...');
    console.log('URL base:', API_BASE_URL);
    
    const endpoints = [
      '/api/v1/reviews',
      '/api/v1/companies/reviews',
      '/api/v1/companies/1/reviews', // Testar com ID específico se existir
    ];
    
    for (const endpoint of endpoints) {
      const fullUrl = `${API_BASE_URL}${endpoint}`;
      console.log(`\nTestando: ${fullUrl}`);
      
      try {
        const response = await fetch(fullUrl);
        console.log(`Status: ${response.status}`);
        
        if (response.ok) {
          const text = await response.text();
          console.log('Resposta (primeiros 200 chars):', text.substring(0, 200));
          
          try {
            const jsonData = JSON.parse(text);
            console.log('JSON com sucesso');
          } catch (e) {
            console.log('Resposta não é JSON válido');
          }
        } else {
          console.log('Erro - não OK');
          
          // Mesmo com erro, tentar ler a resposta
          const text = await response.text();
          console.log('Resposta de erro:', text.substring(0, 200));
        }
      } catch (error) {
        console.log(`Erro ao acessar: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Erro geral:', error.message);
  }
}

testReviewsEndpoint();
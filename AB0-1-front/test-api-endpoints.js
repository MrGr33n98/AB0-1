const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function testApiEndpoints() {
  try {
    // Remover '/api/v1' se já estiver presente para formar a URL base
    const baseUrl = API_BASE_URL.replace(/\/api\/v1$/, '');
    
    console.log('URL base corrigida:', baseUrl);
    
    // Testar alguns endpoints para ver se a API está funcionando
    const endpoints = [
      '/api/v1/categories',
      '/api/v1/companies',
      '/api/v1/dashboard/stats',
      '/dashboard/stats', // Talvez o endpoint esteja sem o prefixo '/api/v1'
    ];
    
    for (const endpoint of endpoints) {
      const fullUrl = `${baseUrl}${endpoint}`;
      console.log(`\nTestando: ${fullUrl}`);
      
      try {
        const response = await fetch(fullUrl);
        console.log(`Status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Dados recebidos:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
          break; // Se encontrarmos um endpoint que funciona, podemos parar
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

testApiEndpoints();
// Testar endpoints de estatísticas alternativos
const API_BASE_URL = 'http://localhost:3001';

async function testStatsEndpoints() {
  try {
    console.log('Testando endpoints de estatísticas...');
    console.log('URL base:', API_BASE_URL);
    
    const endpoints = [
      '/api/v1/dashboard/stats',
      '/api/v1/stats',
      '/api/v1/admin/stats', // Às vezes endpoints de admin têm estatísticas
      '/api/v1/analytics',
      '/api/v1/summary',
      '/api/v1/counts', // Alguns sistemas têm endpoints para contagens
      '/api/v1/companies/counts', // ou algo específico
      '/api/v1/stats/public' // talvez haja uma versão pública
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
            console.log('Dados JSON completos:', JSON.stringify(jsonData, null, 2));
          } catch (e) {
            console.log('Resposta não é JSON válido');
          }
        } else {
          console.log('Erro - não OK');
          
          // Mesmo com erro, tentar ler a resposta para entender melhor
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

testStatsEndpoints();
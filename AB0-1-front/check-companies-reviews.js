// Buscar algumas empresas e verificar se têm informações de avaliações
const API_BASE_URL = 'http://localhost:3001';

async function checkCompaniesForReviews() {
  try {
    console.log('Buscando empresas para verificar informações de avaliações...');
    console.log('URL base:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/companies`);
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const text = await response.text();
      
      try {
        const companies = JSON.parse(text);
        console.log(`Encontradas ${Array.isArray(companies) ? companies.length : companies.companies?.length || 0} empresas`);
        
        // Mostrar informações relevantes de algumas empresas
        const companyList = Array.isArray(companies) ? companies : companies.companies || [];
        
        console.log('Primeiras 3 empresas (com informações de avaliação):');
        for (let i = 0; i < Math.min(3, companyList.length); i++) {
          const company = companyList[i];
          console.log(`- ID: ${company.id}, Nome: ${company.name}`);
          console.log(`  - rating: ${company.rating}`);
          console.log(`  - rating_avg: ${company.rating_avg}`);
          console.log(`  - rating_count: ${company.rating_count}`);
          console.log(`  - total_reviews: ${company.total_reviews}`);
          console.log('---');
        }
      } catch (e) {
        console.error('Erro ao fazer parse da resposta:', e.message);
      }
    } else {
      console.log('Erro - não OK');
      const text = await response.text();
      console.log('Resposta de erro:', text.substring(0, 200));
    }
  } catch (error) {
    console.error('Erro geral:', error.message);
  }
}

checkCompaniesForReviews();
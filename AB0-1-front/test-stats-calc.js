// Teste para verificar se os cálculos de estatísticas estão corretos
const API_BASE_URL = 'http://localhost:3001';

async function testStatsCalculation() {
  try {
    console.log('Testando cálculo de estatísticas...');
    
    // Buscar empresas
    const companiesResponse = await fetch(`${API_BASE_URL}/api/v1/companies`);
    // Buscar avaliações
    const reviewsResponse = await fetch(`${API_BASE_URL}/api/v1/reviews`);
    // Buscar produtos
    const productsResponse = await fetch(`${API_BASE_URL}/api/v1/products`);
    
    // Processar as respostas
    let companies = [];
    let reviews = [];
    let products = [];
    
    if (companiesResponse.ok) {
      const companiesData = await companiesResponse.json();
      companies = Array.isArray(companiesData) ? companiesData : companiesData.companies || [];
    }
    
    if (reviewsResponse.ok) {
      const reviewsData = await reviewsResponse.json();
      reviews = Array.isArray(reviewsData) ? reviewsData : reviewsData.reviews || [];
    }
    
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      products = Array.isArray(productsData) ? productsData : productsData.products || [];
    }
    
    console.log(`Empresas encontradas: ${companies.length}`);
    console.log(`Avaliações encontradas: ${reviews.length}`);
    console.log(`Produtos encontrados: ${products.length}`);
    
    // Mostrar informações de avaliações nas empresas
    console.log('\\nInformações de avaliações nas empresas:');
    companies.forEach(company => {
      console.log(`${company.name}: rating_avg=${company.rating_avg}, rating_count=${company.rating_count}`);
    });
    
    // Calcular estatísticas reais a partir dos dados
    const companiesCount = companies.length;
    
    // Calcular média de avaliações válidas
    const validRatings = companies
      .map(c => c.rating_avg || c.rating)
      .filter(r => r && r > 0);
    
    console.log(`\\nAvaliações válidas encontradas: ${validRatings.length}`);
    console.log(`Valores das avaliações: [${validRatings.join(', ')}]`);
    
    const averageRating = validRatings.length > 0
      ? (validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length)
      : 0;
    
    // Contar avaliações totais
    const totalReviews = companies.reduce((sum, company) => {
      return sum + (company.rating_count || 0);
    }, 0);
    
    console.log('\\nEstatísticas calculadas:');
    console.log(`- Empresas: ${companiesCount}`);
    console.log(`- Avaliação média: ${averageRating.toFixed(2)}`);
    console.log(`- Total de avaliações: ${totalReviews}`);
    console.log(`- Produtos: ${products.length}`);
  } catch (error) {
    console.error('Erro no teste:', error.message);
  }
}

testStatsCalculation();
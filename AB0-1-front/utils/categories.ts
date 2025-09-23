// This is a mock function for demonstration purposes.
// In a real application, this would fetch data from an API or database.
export async function getCategoryById(id: number) {
  // Simulate an API call
  return new Promise(resolve => {
    setTimeout(() => {
      const categories = [
        { id: 1, name: 'Energia Solar Residencial' },
        { id: 2, name: 'Energia Solar Comercial' },
        { id: 3, name: 'Energia Solar Rural' },
        { id: 4, name: 'Manutenção de Sistemas Solares' },
        { id: 5, name: 'Projetos e Engenharia Solar' },
      ];
      resolve(categories.find(cat => cat.id === id));
    }, 100);
  });
}

# Create default admin user
AdminUser.create!(
  email: 'felipe@admin.com',
  password: 'ZAbgbZeVAK+!5!',
  password_confirmation: 'ZAbgbZeVAK+!5!'
) if Rails.env.development? || Rails.env.production?

# Create companies
companies = [
  { name: 'Tech Solutions', description: 'Empresa de soluções tecnológicas', website: 'https://techsolutions.example.com', phone: '(11) 1234-5678', address: 'Rua da Tecnologia, 123' },
  { name: 'Digital Innovations', description: 'Inovações digitais para seu negócio', website: 'https://digitalinnovations.example.com', phone: '(11) 8765-4321', address: 'Avenida Digital, 456' },
  { name: 'Smart Systems', description: 'Sistemas inteligentes para automação', website: 'https://smartsystems.example.com', phone: '(11) 2468-1357', address: 'Praça da Automação, 789' }
]

companies.each do |company_attrs|
  Company.find_or_create_by!(name: company_attrs[:name]) do |company|
    company.assign_attributes(company_attrs)
    puts "Criada empresa: #{company.name}"
  end
end

# Get all companies for reference
all_companies = Company.all

# Create categories
categories = [
  { name: 'Software', seo_url: 'software', seo_title: 'Software', short_description: 'Soluções de software para empresas', description: 'Categoria que engloba todos os tipos de software empresarial', kind: 'product_category', status: 'active', featured: true },
  { name: 'Hardware', seo_url: 'hardware', seo_title: 'Hardware', short_description: 'Equipamentos e dispositivos físicos', description: 'Categoria para todos os tipos de hardware e equipamentos tecnológicos', kind: 'product_category', status: 'active', featured: false },
  { name: 'Serviços', seo_url: 'servicos', seo_title: 'Serviços de TI', short_description: 'Serviços de tecnologia', description: 'Serviços de consultoria, implementação e suporte em tecnologia', kind: 'service_category', status: 'active', featured: true },
  { name: 'Cloud', seo_url: 'cloud', seo_title: 'Soluções em Cloud', short_description: 'Serviços de computação em nuvem', description: 'Soluções baseadas em nuvem para empresas de todos os tamanhos', kind: 'product_category', status: 'active', featured: true }
]

categories.each do |category_attrs|
  Category.find_or_create_by!(name: category_attrs[:name]) do |category|
    category.assign_attributes(category_attrs)
    puts "Criada categoria: #{category.name}"
  end
end

# Create products
products = [
  { name: 'Software ERP', description: 'Sistema completo de gestão empresarial', short_description: 'ERP completo', price: 1999.99, sku: 'ERP001', stock: 100, status: 'active', featured: true, company: all_companies.sample },
  { name: 'CRM Avançado', description: 'Gerenciamento de relacionamento com clientes', short_description: 'CRM profissional', price: 1499.99, sku: 'CRM001', stock: 50, status: 'active', featured: true, company: all_companies.sample },
  { name: 'Sistema de Vendas', description: 'Plataforma para gestão de vendas online', short_description: 'Vendas online', price: 999.99, sku: 'SALES001', stock: 75, status: 'active', featured: false, company: all_companies.sample },
  { name: 'Automação de Marketing', description: 'Ferramenta para automação de campanhas de marketing', short_description: 'Marketing automation', price: 1299.99, sku: 'MKT001', stock: 30, status: 'active', featured: true, company: all_companies.sample },
  { name: 'Gestão de Projetos', description: 'Software para gerenciamento de projetos e equipes', short_description: 'Project management', price: 899.99, sku: 'PROJ001', stock: 60, status: 'active', featured: false, company: all_companies.sample }
]

products.each do |product_attrs|
  Product.find_or_create_by!(name: product_attrs[:name]) do |product|
    product.assign_attributes(product_attrs)
    puts "Criado produto: #{product.name}"
  end
end

puts "Seeds concluídos com sucesso!"

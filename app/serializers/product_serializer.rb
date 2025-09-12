class ProductSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :price, :company_id, :created_at, :updated_at,
             :short_description, :sku, :stock, :status, :featured, :seo_title, :seo_description
  
  # Remova qualquer referência a 'category' se não existir essa associação
  # belongs_to :category, if: -> { object.respond_to?(:category) }
  belongs_to :company, if: -> { object.respond_to?(:company) }
end

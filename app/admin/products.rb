ActiveAdmin.register Product do
  permit_params :name, :description, :short_description, :price, :image, 
                :company_id, :sku, :stock, :status, :featured, :seo_title, :seo_description,
                category_ids: []
  
  form do |f|
    f.inputs "Informações Básicas" do
      f.input :name
      f.input :short_description
      f.input :description
      f.input :price
      f.input :sku
      f.input :stock
    end
    
    f.inputs "Empresa e Status" do
      f.input :company
      f.input :status
      f.input :featured
    end
    
    f.inputs "Categorias" do
      f.input :categories, as: :check_boxes
    end
    
    f.inputs "SEO" do
      f.input :seo_title
      f.input :seo_description
    end
    
    f.inputs "Imagem" do
      f.input :image, as: :file, hint: f.object.image.attached? ? 
        image_tag(f.object.image.variant(resize_to_limit: [300, 200])) : "Nenhuma imagem anexada"
    end
    
    f.actions
  end
  
  show do
    attributes_table do
      row :name
      row :short_description
      row :description
      row :price
      row :sku
      row :stock
      row :company
      row :status
      row :featured
      row :categories do |product|
        product.categories.map { |c| c.name }.join(", ")
      end
      row :seo_title
      row :seo_description
      row :image do |product|
        if product.image.attached?
          image_tag product.image.variant(resize_to_limit: [600, 400])
        end
      end
      row :created_at
      row :updated_at
    end
  end
end

ActiveAdmin.register Company do
  # Update the permitted parameters to match your actual model attributes
  permit_params :name, :description, :website, :phone, :address, category_ids: []
  
  # Configuração de filtros personalizados
  filter :name
  filter :description
  filter :website
  filter :phone
  filter :address
  filter :created_at
  
  # Filtro personalizado para categorias
  filter :categories, label: 'Categories'
  
  form do |f|
    f.inputs do
      # Only include fields that exist in your Company model
      f.input :name
      # Remove email since it doesn't exist
      f.input :description
      f.input :website
      f.input :phone
      f.input :address
      # Remove city, state, zip, country if they don't exist
      
      # Add categories checkbox
      f.input :categories, as: :check_boxes
    end
    f.actions
  end
  
  # Update your index view to match actual attributes
  index do
    selectable_column
    id_column
    column :name
    # Remove email
    column :website
    column :phone
    column :created_at
    actions
  end
  
  # Update your show view to match actual attributes
  show do
    attributes_table do
      row :name
      # Remove email
      row :description
      row :website
      row :phone
      row :address
      # Remove city, state, zip, country
      row :created_at
      row :updated_at
      
      # Add categories display
      row :categories do |company|
        company.categories.map(&:name).join(", ")
      end
    end
  end
end

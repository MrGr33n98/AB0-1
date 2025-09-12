ActiveAdmin.register Company do
  # Your existing permit_params
  permit_params :name, :description, :website, :phone, :address, category_ids: []
  
  # Explicitly define filters to avoid the error
  filter :name
  filter :description
  filter :website
  filter :phone
  filter :address
  filter :created_at
  # Remove the automatic categories filter that's causing the error
  remove_filter :categories
  
  form do |f|
    f.inputs do
      f.input :name
      f.input :description
      f.input :website
      f.input :phone
      f.input :address
      
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

ActiveAdmin.register Company do
  # Your existing permit_params
  permit_params :name, :description, :website, :phone, :address, :banner, :logo, category_ids: []
  
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
      
      # Add banner upload field
      f.input :banner, as: :file, hint: f.object.banner.attached? ? 
        image_tag(url_for(f.object.banner), style: 'max-width:300px;max-height:200px') : 
        content_tag(:span, "No banner uploaded yet")
      
      # Add logo upload field
      f.input :logo, as: :file, hint: f.object.logo.attached? ? 
        image_tag(url_for(f.object.logo), style: 'max-width:150px;max-height:150px') : 
        content_tag(:span, "No logo uploaded yet")
      
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
    column :website
    column :phone
    column :created_at
    column "Banner" do |company|
      company.banner.attached? ? image_tag(url_for(company.banner), style: 'max-width:100px;max-height:70px') : "No banner"
    end
    column "Logo" do |company|
      company.logo.attached? ? image_tag(url_for(company.logo), style: 'max-width:50px;max-height:50px') : "No logo"
    end
    actions
  end
  
  # Update your show view to match actual attributes
  show do
    attributes_table do
      row :name
      row :description
      row :website
      row :phone
      row :address
      row :created_at
      row :updated_at
      
      # Add banner display
      row :banner do |company|
        if company.banner.attached?
          image_tag url_for(company.banner), style: 'max-width:300px;max-height:200px'
        else
          "No banner uploaded"
        end
      end
      
      # Add logo display
      row :logo do |company|
        if company.logo.attached?
          image_tag url_for(company.logo), style: 'max-width:150px;max-height:150px'
        else
          "No logo uploaded"
        end
      end
      
      # Add categories display
      row :categories do |company|
        company.categories.map(&:name).join(", ")
      end
    end
  end
end

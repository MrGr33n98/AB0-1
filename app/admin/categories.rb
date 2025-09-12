ActiveAdmin.register Category do
  # Permit params for categories
  permit_params :name, :description, :featured, :banner, :seo_url, :seo_title, :short_description, :parent_id, :kind, :status, company_ids: []
  
  # Define filters
  filter :name
  filter :description
  filter :featured
  filter :status
  filter :created_at
  
  form do |f|
    f.inputs do
      f.input :name
      f.input :description
      f.input :short_description
      f.input :seo_url
      f.input :seo_title
      f.input :featured
      f.input :status, as: :select, collection: ['active', 'inactive']
      f.input :kind, as: :select, collection: ['main', 'sub']
      f.input :parent_id, as: :select, collection: Category.where.not(id: f.object.id).map { |c| [c.name, c.id] }, include_blank: 'None'
      
      # Add banner image upload
      f.input :banner, as: :file, hint: f.object.banner.attached? ? image_tag(url_for(f.object.banner), style: 'max-width: 300px') : content_tag(:span, "No banner uploaded yet")
      
      # Add companies association
      f.input :companies, as: :check_boxes
    end
    f.actions
  end
  
  show do
    attributes_table do
      row :name
      row :description
      row :short_description
      row :seo_url
      row :seo_title
      row :featured
      row :status
      row :kind
      row :parent_id
      row :created_at
      row :updated_at
      
      # Display banner image
      row :banner do |category|
        if category.banner.attached?
          image_tag url_for(category.banner), style: 'max-width: 300px'
        else
          "No banner uploaded"
        end
      end
      
      # Display associated companies
      row :companies do |category|
        category.companies.map do |company|
          link_to company.name, admin_company_path(company)
        end.join(', ').html_safe
      end
    end
  end
  
  index do
    selectable_column
    id_column
    column :name
    column :description
    column :featured
    column :status
    column :kind
    column :created_at
    
    # Show company count in the index
    column "Companies" do |category|
      link_to "#{category.companies.count} companies", admin_category_path(category)
    end
    
    actions
  end
end

ActiveAdmin.register Category do
  permit_params :name, :description, :banner, :seo_url, :seo_title, :short_description, :parent_id, :kind, :status, :featured

  filter :name_cont, label: 'Name'
  filter :description_cont, label: 'Description'
  filter :short_description_cont, label: 'Short Description'
  filter :seo_title_cont, label: 'SEO Title'
  filter :seo_url_cont, label: 'SEO URL'
  filter :kind, as: :select
  filter :status, as: :select
  filter :featured, as: :boolean
  filter :created_at
  filter :updated_at
  
  form do |f|
    f.inputs do
      f.input :name
      f.input :description
      f.input :short_description
      f.input :seo_title
      f.input :seo_url
      f.input :parent_id, as: :select, collection: Category.all.map { |c| [c.name, c.id] }
      f.input :kind
      f.input :status
      f.input :featured
      f.input :banner, as: :file, hint: f.object.banner.attached? ? 
        image_tag(f.object.banner.variant(resize_to_limit: [300, 200])) : "Nenhum banner anexado"
    end
    f.actions
  end
  
  show do
    attributes_table do
      row :name
      row :description
      row :short_description
      row :seo_title
      row :seo_url
      row :parent
      row :kind
      row :status
      row :featured
      row :banner do |category|
        if category.banner.attached?
          image_tag category.banner.variant(resize_to_limit: [600, 400])
        end
      end
      row :created_at
      row :updated_at
    end
  end
end

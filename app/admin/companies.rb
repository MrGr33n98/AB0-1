ActiveAdmin.register Company do
  permit_params :name, :description, :website, :phone, :address
  
  index do
    selectable_column
    id_column
    column :name
    column :website
    column :phone
    column :created_at
    actions
  end
  
  filter :name
  filter :website
  filter :created_at
  
  form do |f|
    f.inputs do
      f.input :name
      f.input :description
      f.input :website
      f.input :phone
      f.input :address
    end
    f.actions
  end
end

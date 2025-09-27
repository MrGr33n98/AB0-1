ActiveAdmin.register Plan do
  # Update the permitted parameters if needed
  permit_params :name, :description, :price, :features
  
  # Fix the filters section - remove any reference to 'features'
  filter :name
  filter :description
  filter :price
  filter :created_at
  filter :updated_at
  
  index do
    selectable_column
    id_column
    column :name
    column :description
    column :price
    column :created_at
    actions
  end
  
  show do
    attributes_table do
      row :name
      row :description
      row :price
      row :features do |plan|
        if plan.features.present?
          # Converter o texto de features em uma lista, assumindo que estejam separadas por quebras de linha ou vírgulas
          features = plan.features.split(/[\n,]/).map(&:strip).reject(&:empty?)
          ul do
            features.each do |feature|
              li feature
            end
          end
        else
          "Nenhuma feature definida"
        end
      end
      row :created_at
      row :updated_at
    end
  end
  
  form do |f|
    f.inputs do
      f.input :name
      f.input :description
      f.input :price
      f.input :features, as: :text, input_html: { rows: 5 }, hint: "Insira cada feature em uma nova linha"
    end
    f.actions
  end
end

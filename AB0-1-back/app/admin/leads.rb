ActiveAdmin.register Lead do
  # Update the permitted parameters
  permit_params :name, :email, :phone, :company, :message, :company_id, :status, :source, :project_type, :budget_range, :timeline, :location
  
  # Explicitly define filters
  filter :name
  filter :email
  filter :phone
  filter :company  # nome da empresa
  filter :company_id, as: :select, collection: -> { Company.all.map { |c| [c.name, c.id] } }
  filter :status, as: :select, collection: ['new', 'contacted', 'qualified', 'converted', 'lost']
  filter :source
  filter :project_type
  filter :created_at
  filter :updated_at
  
  # Add CSV import functionality
  action_item :import_csv, only: :index do
    link_to 'Import Leads CSV', action: 'upload_csv'
  end

  collection_action :upload_csv do
    render "admin/csv/upload_leads_csv"
  end

  collection_action :import_csv, method: :post do
    if params[:csv_file].present?
      begin
        CSV.foreach(params[:csv_file].path, headers: true) do |row|
          Lead.create!(
            name: row['name'],
            email: row['email'],
            phone: row['phone'],
            company: row['company_name'], # alterar para evitar confusão com associação
            message: row['message'],
            company_id: row['company_id'],
            status: row['status'] || 'new',
            source: row['source'] || 'website'
          )
        end
        redirect_to collection_path, notice: "Leads imported successfully!"
      rescue => e
        redirect_to collection_path, alert: "Error importing: #{e.message}"
      end
    else
      redirect_to collection_path, alert: "No CSV file selected"
    end
  end
  
  index do
    selectable_column
    id_column
    column :name
    column :email
    column :phone
    column :company # texto livre
    column :company_id do |lead|
      lead.company&.name || "N/A"
    end
    column :status do |lead|
      status_tag(lead.status)
    end
    column :source
    column :created_at
    actions
  end
  
  form do |f|
    f.inputs do
      f.input :name
      f.input :email
      f.input :phone
      f.input :message
      f.input :company, label: "Nome da Empresa (texto)"  # campo de texto livre
      f.input :company_id, as: :select, collection: -> { Company.all.map { |c| [c.name, c.id] } }, include_blank: "Nenhuma empresa"
      f.input :status, as: :select, collection: [['Novo', 'new'], ['Contatado', 'contacted'], ['Qualificado', 'qualified'], ['Convertido', 'converted'], ['Perdido', 'lost']], include_blank: false
      f.input :source
      f.input :project_type
      f.input :budget_range
      f.input :timeline
      f.input :location
    end
    f.actions
  end
end

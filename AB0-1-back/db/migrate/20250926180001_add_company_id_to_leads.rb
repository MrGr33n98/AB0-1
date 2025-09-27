class AddCompanyIdToLeads < ActiveRecord::Migration[7.0]
  def change
    add_column :leads, :company_id, :bigint
    add_index :leads, :company_id
    
    # Adicionamos também campos para melhor rastreamento
    add_column :leads, :status, :string, default: 'new'
    add_column :leads, :source, :string, default: 'website'
    add_column :leads, :project_type, :string
    add_column :leads, :budget_range, :string
    add_column :leads, :timeline, :string
    add_column :leads, :location, :string
  end
end
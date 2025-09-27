class AddPlanIdToCompanies < ActiveRecord::Migration[7.0]
  def change
    add_column :companies, :plan_id, :bigint
    add_index :companies, :plan_id
    
    # Adicionamos também campos para informações do plano
    add_column :companies, :plan_expires_at, :datetime
    add_column :companies, :plan_status, :string, default: 'inactive'
  end
end
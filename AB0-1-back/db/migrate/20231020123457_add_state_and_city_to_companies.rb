class AddStateAndCityToCompanies < ActiveRecord::Migration[7.0]
  def change
    add_column :companies, :state, :string
    add_column :companies, :city, :string
  end
end
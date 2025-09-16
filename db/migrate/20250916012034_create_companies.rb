class CreateCompanies < ActiveRecord::Migration[7.0]
  def change
    create_table :companies do |t|
      t.string :name
      t.string :description
      t.string :address
      t.string :phone
      t.string :email
      t.timestamps
    end
  end
end

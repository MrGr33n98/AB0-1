class CreateProducts < ActiveRecord::Migration[7.0]
  def change
    # First create companies table if it doesn't exist
    create_table :companies do |t|
      t.string :name
      t.timestamps
    end

    # Then create products table
    create_table :products do |t|
      t.string :name
      t.text :description
      t.decimal :price
      t.references :company, foreign_key: true
      t.timestamps
    end
  end
end

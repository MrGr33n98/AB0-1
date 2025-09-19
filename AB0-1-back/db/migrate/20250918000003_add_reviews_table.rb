class AddReviewsTable < ActiveRecord::Migration[7.0]
  def change
    change_table :reviews do |t|
      t.references :company, null: false, foreign_key: true
      t.boolean :verified, default: false
      t.boolean :featured, default: false
    end

    # Update rating column to use decimal
    change_column :reviews, :rating, :decimal, precision: 2, scale: 1
    
    # Remove product reference as it's being replaced by company
    remove_reference :reviews, :product, foreign_key: true
    
    add_index :reviews, [:company_id, :user_id], unique: true
  end
end
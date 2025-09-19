class CreateCompaniesCategoriesManually < ActiveRecord::Migration[7.0]
  def up
    unless table_exists?(:categories_companies)
      create_table :categories_companies, id: false do |t|
        t.belongs_to :category, null: false
        t.belongs_to :company, null: false
        t.index [:category_id, :company_id]
        t.index [:company_id, :category_id]
      end
    end
  end

  def down
    drop_table :categories_companies if table_exists?(:categories_companies)
  end
end
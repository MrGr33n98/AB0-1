class Company < ApplicationRecord
  has_many :products
  
  validates :name, presence: true
  
  # Métodos para Ransack
  def self.ransackable_attributes(auth_object = nil)
    ["address", "created_at", "description", "id", "name", "phone", "updated_at", "website"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["products", "categories"] # Added categories to the ransackable associations
  end

  # Add this to your Company model if it doesn't exist
  # Change this line
  has_and_belongs_to_many :categories, join_table: 'categories_companies'
  # or
  # has_many :company_categories
  # has_many :categories, through: :company_categories
end

class Company < ApplicationRecord
  has_many :products
  has_and_belongs_to_many :categories, join_table: 'categories_companies'
  has_one_attached :banner
  
  validates :name, presence: true
  
  # Update ransackable_attributes and ransackable_associations
  def self.ransackable_attributes(auth_object = nil)
    ["address", "created_at", "description", "id", "name", "phone", "updated_at", "website"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["products", "categories", "banner_attachment", "banner_blob"]  # Add banner associations
  end
end

class Article < ApplicationRecord
  belongs_to :category
  belongs_to :product
  
  # Add these methods for Ransack
  def self.ransackable_attributes(auth_object = nil)
    ["category_id", "content", "created_at", "id", "product_id", "title", "updated_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["category", "product"]
  end
end

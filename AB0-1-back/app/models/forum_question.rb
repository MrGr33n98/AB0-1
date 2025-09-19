class ForumQuestion < ApplicationRecord
  belongs_to :user
  belongs_to :product
  belongs_to :category
  
  # Add ransackable attributes for ActiveAdmin
  def self.ransackable_attributes(auth_object = nil)
    ["category_id", "created_at", "description", "id", "product_id", "requested_at", 
     "status", "subject", "updated_at", "user_id"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["category", "product", "user"]
  end
end

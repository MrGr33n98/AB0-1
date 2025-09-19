class ProductAccess < ApplicationRecord
  belongs_to :product
  belongs_to :user
  
  # Add these methods for Ransack
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "product_id", "updated_at", "user_id"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["product", "user"]
  end
end

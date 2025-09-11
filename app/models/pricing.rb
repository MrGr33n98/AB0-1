class Pricing < ApplicationRecord
  belongs_to :product
  
  # Add these methods for Ransack
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "price", "product_id", "updated_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["product"]
  end
end

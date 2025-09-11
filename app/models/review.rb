class Review < ApplicationRecord
  belongs_to :product
  belongs_to :user
  
  # Update ransackable attributes to include comment
  def self.ransackable_attributes(auth_object = nil)
    ["comment", "created_at", "id", "product_id", "rating", "updated_at", "user_id"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["product", "user"]
  end
end

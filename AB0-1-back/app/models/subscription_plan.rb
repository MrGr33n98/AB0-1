class SubscriptionPlan < ApplicationRecord
  belongs_to :category
  belongs_to :plan
  belongs_to :product
  
  # Add these methods for Ransack
  def self.ransackable_attributes(auth_object = nil)
    ["category_id", "created_at", "id", "plan_id", "product_id", "updated_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["category", "plan", "product"]
  end
end

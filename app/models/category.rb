class Category < ApplicationRecord
  # Add association to Products
  has_and_belongs_to_many :products
  
  # Add Active Storage for banner image
  has_one_attached :banner
  
  # Add ransackable attributes for ActiveAdmin
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "name", "description", "updated_at", "seo_url", "seo_title", "short_description", "parent_id", "kind", "status", "featured"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["banner_attachment", "banner_blob", "badges", "parent", "products"]
  end
end

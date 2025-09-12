class Product < ApplicationRecord
  # Add association to Company
  belongs_to :company, optional: true
  
  # Add association to Categories
  has_and_belongs_to_many :categories
  
  # Add Active Storage for product image
  has_one_attached :image
  
  # Add validations
  validates :name, :price, presence: true
  
  # Method to get image URL
  def image_url
    return nil unless image.attached?
    Rails.application.routes.url_helpers.url_for(image)
  end
  
  # Add ransackable attributes for ActiveAdmin
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "name", "description", "price", "updated_at", "company_id",
     "short_description", "sku", "stock", "status", "featured", "seo_title", "seo_description"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["image_attachment", "image_blob", "company", "categories"]
  end
end

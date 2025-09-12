class Category < ApplicationRecord
  has_and_belongs_to_many :companies, join_table: 'categories_companies'
  has_and_belongs_to_many :products
  has_one_attached :banner

  def banner_url
    if banner.attached?
      # Use url_for instead of rails_blob_url to ensure we get a proper URL
      Rails.application.routes.url_helpers.url_for(banner)
    else
      nil
    end
  end
  
  # Make sure companies is included in ransackable_associations
  def self.ransackable_associations(auth_object = nil)
    ["banner_attachment", "banner_blob", "badges", "parent", "products", "companies"]
  end

  # Define which attributes can be searched using Ransack
  def self.ransackable_attributes(auth_object = nil)
    ["name", "description", "short_description", "seo_title", "seo_url", "kind", "status", "featured", "created_at", "updated_at"]
  end
end

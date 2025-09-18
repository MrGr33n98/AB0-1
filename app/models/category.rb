# app/models/category.rb
class Category < ApplicationRecord
  # Associations
  has_and_belongs_to_many :companies
  has_and_belongs_to_many :products
  has_one_attached :banner

  # Validations
  validates :name, presence: true, uniqueness: true
  validates :description, presence: true

  # Ransack configuration
  def self.ransackable_attributes(auth_object = nil)
    %w[id name description created_at updated_at featured status seo_url seo_title short_description]
  end

  def self.ransackable_associations(auth_object = nil)
    ["companies", "products", "banner_attachment", "banner_blob"]
  end

  # Custom JSON
  def as_json(options = {})
    super(options.merge(
      include: {
        companies: { only: [:id, :name] },
        products: { only: [:id, :name, :price] }
      },
      except: [:created_at, :updated_at]
    ))
  end
  
  # URL helpers for banner attachment
  def banner_url
    if banner.attached?
      Rails.application.routes.url_helpers.url_for(banner)
    end
  end
end

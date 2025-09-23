class CategorySerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :name, :seo_url, :seo_title,
             :short_description, :description,
             :parent_id, :kind, :status, :featured,
             :created_at, :updated_at, :banner_url
             
  has_many :companies
  has_many :products

  def banner_url
    if object.banner.attached?
      Rails.application.routes.url_helpers.rails_blob_url(object.banner, only_path: false)
    end
  end
end

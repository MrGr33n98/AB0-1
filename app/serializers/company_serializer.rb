class CompanySerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :website, :phone, :address, :created_at, :updated_at, :banner_url, :logo_url
  
  def banner_url
    if object.banner.attached?
      Rails.application.routes.url_helpers.url_for(object.banner)
    end
  end
  
  def logo_url
    if object.logo.attached?
      Rails.application.routes.url_helpers.url_for(object.logo)
    end
  end
end

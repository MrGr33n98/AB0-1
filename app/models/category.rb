class Category < ApplicationRecord
  has_and_belongs_to_many :companies, join_table: 'categories_companies'
  has_and_belongs_to_many :products
  has_one_attached :banner

  def banner_url
    return nil unless banner.attached?
    begin
      # Verificar se as configurações de host estão definidas
      if Rails.application.routes.default_url_options[:host].present?
        Rails.application.routes.url_helpers.url_for(banner)
      else
        # Se não houver host configurado, registrar erro e retornar nil
        Rails.logger.error("Host not configured for URL generation")
        nil
      end
    rescue => e
      Rails.logger.error("Error generating banner URL: #{e.message}")
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

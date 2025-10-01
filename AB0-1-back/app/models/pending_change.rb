# app/models/pending_change.rb
class PendingChange < ApplicationRecord
  belongs_to :company
  belongs_to :user, optional: true
  belongs_to :approved_by, class_name: 'AdminUser', optional: true

  validates :change_type, presence: true
  validates :status, inclusion: { in: %w[pending approved rejected] }

  scope :pending, -> { where(status: 'pending') }
  scope :approved, -> { where(status: 'approved') }
  scope :rejected, -> { where(status: 'rejected') }

  # Tipos de mudanças permitidos
  CHANGE_TYPES = %w[
    company_info
    categories
    banner
    product
    media
    cta_config
  ].freeze

  validates :change_type, inclusion: { in: CHANGE_TYPES }

  # Aplica as mudanças ao modelo principal
  def apply_changes!
    return unless status == 'approved'

    case change_type
    when 'company_info'
      apply_company_info_changes
    when 'categories'
      apply_category_changes
    when 'banner'
      apply_banner_changes
    when 'product'
      apply_product_changes
    when 'media'
      apply_media_changes
    when 'cta_config'
      apply_cta_changes
    end

    update!(applied_at: Time.current)
  end

  private

  def apply_company_info_changes
    company.update!(data['attributes'])
  end

  def apply_category_changes
    case data['action']
    when 'add'
      data['category_ids'].each do |cat_id|
        company.categories << Category.find(cat_id) unless company.categories.exists?(cat_id)
      end
    when 'remove'
      company.categories.delete(data['category_ids'])
    end
  end

  def apply_banner_changes
    # Logic for banner changes
  end

  def apply_product_changes
    # Logic for product changes
  end

  def apply_media_changes
    # Logic for media changes
  end

  def apply_cta_changes
    company.update!(
      cta_primary_label: data['cta_primary_label'],
      cta_primary_url: data['cta_primary_url'],
      cta_secondary_label: data['cta_secondary_label'],
      cta_secondary_url: data['cta_secondary_url'],
      cta_whatsapp_template: data['cta_whatsapp_template']
    )
  end
end

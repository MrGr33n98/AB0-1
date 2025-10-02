class CampaignReview < ApplicationRecord
  belongs_to :campaign
  belongs_to :user, optional: true
  belongs_to :product, optional: true
  belongs_to :company, optional: true

  scope :sponsored, -> { where(sponsored: true) }

  def self.ransackable_attributes(_auth_object = nil)
    %w[campaign_id company_id comment created_at id product_id rating updated_at user_id sponsored]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[campaign product company user]
  end
end

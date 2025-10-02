class ForumQuestion < ApplicationRecord
  belongs_to :user
  belongs_to :product, optional: true
  belongs_to :company, optional: true
  belongs_to :category

  scope :by_company, ->(cid) { where(company_id: cid) if cid.present? }

  # Add ransackable attributes for ActiveAdmin
  def self.ransackable_attributes(_auth_object = nil)
    %w[category_id company_id created_at description id product_id requested_at
       status subject updated_at user_id]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[category product company user]
  end
end

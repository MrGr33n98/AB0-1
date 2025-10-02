class Review < ApplicationRecord
  belongs_to :company
  belongs_to :user

  # Update ransackable attributes to include comment
  def self.ransackable_attributes(_auth_object = nil)
    %w[comment created_at id company_id rating updated_at user_id]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[company user]
  end
end

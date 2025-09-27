class Lead < ApplicationRecord
  # =========================
  # Associations
  # =========================
  belongs_to :company, optional: true

  # Add these methods for Ransack
  def self.ransackable_attributes(auth_object = nil)
    ["company", "created_at", "email", "id", "message", "name", "phone", "updated_at", "status", "source", "project_type", "budget_range", "timeline", "location"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["company"]
  end
end

class Plan < ApplicationRecord
  # =========================
  # Associations
  # =========================
  has_many :companies, dependent: :nullify

  # Add these methods for Ransack
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "description", "id", "name", "price", "features", "updated_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["companies"]
  end
end

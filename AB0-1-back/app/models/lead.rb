class Lead < ApplicationRecord
  # Add these methods for Ransack
  def self.ransackable_attributes(auth_object = nil)
    ["company", "created_at", "email", "id", "message", "name", "phone", "updated_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    []
  end
end

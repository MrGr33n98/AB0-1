class FeatureGroup < ApplicationRecord
  # Add these methods for Ransack
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "description", "id", "name", "updated_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    []
  end
end

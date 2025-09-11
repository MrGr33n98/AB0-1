class Company < ApplicationRecord
  has_many :products
  
  validates :name, presence: true
  
  # Métodos para Ransack
  def self.ransackable_attributes(auth_object = nil)
    ["address", "created_at", "description", "id", "name", "phone", "updated_at", "website"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["products"]
  end
end

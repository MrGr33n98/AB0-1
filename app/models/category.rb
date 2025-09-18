class Category < ApplicationRecord
  has_and_belongs_to_many :companies
  has_one_attached :banner
  
  validates :name, presence: true, uniqueness: true
  validates :description, presence: true
  
  def self.ransackable_attributes(auth_object = nil)
    %w[id name description created_at updated_at featured status]
  end
  
  def self.ransackable_associations(auth_object = nil)
    ["companies"]
  end
  
  def as_json(options = {})
    super(options.merge(
      include: {
        companies: { only: [:id, :name] }
      },
      except: [:created_at, :updated_at]
    ))
  end
end

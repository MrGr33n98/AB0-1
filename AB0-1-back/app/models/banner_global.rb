class BannerGlobal < ApplicationRecord
  has_one_attached :image
  validates :title, presence: true
  validates :link, presence: true

  def self.ransackable_attributes(auth_object = nil)
    ["title", "link", "created_at", "id"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["image_attachment", "image_blob"]
  end
end
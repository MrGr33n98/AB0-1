class BannerSerializer < ActiveModel::Serializer
  attributes :id, :title, :image_url, :link, :active, :sponsored, :banner_type, :position
end

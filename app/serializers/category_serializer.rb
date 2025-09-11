class CategorySerializer < ActiveModel::Serializer
  attributes :id, :name, :seo_url, :seo_title,
             :short_description, :description,
             :parent_id, :kind, :status, :featured,
             :created_at, :updated_at
end

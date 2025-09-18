ActiveAdmin.register Company do
  permit_params :name, :description, :website, :phone, :address, 
                :state, :city, :banner, :logo, :featured, :verified,
                :cnpj, :email, :whatsapp, :instagram, :facebook,
                :linkedin, :working_hours, :payment_methods,
                :certifications, :status, :founded_year, :employees_count,
                :awards, :partner_brands, :coverage_states, :coverage_cities,
                :latitude, :longitude, :minimum_ticket, :maximum_ticket,
                :financing_options, :response_time_sla, :languages,
                :email_public, :phone_alt, :facebook_url, :instagram_url,
                :linkedin_url, :youtube_url, :highlights, :about,
                :media_gallery, category_ids: []

  form do |f|
    f.inputs "Basic Information" do
      f.input :name
      f.input :description
      f.input :about
      f.input :highlights
      f.input :status, as: :select, collection: %w[active inactive pending blocked]
      f.input :featured
      f.input :verified
    end

    f.inputs "Contact & Location" do
      f.input :email
      f.input :email_public
      f.input :phone
      f.input :phone_alt
      f.input :whatsapp
      f.input :address
      f.input :state
      f.input :city
      f.input :latitude
      f.input :longitude
    end

    f.inputs "Business Details" do
      f.input :cnpj
      f.input :founded_year
      f.input :employees_count
      f.input :working_hours
      f.input :payment_methods
      f.input :minimum_ticket
      f.input :maximum_ticket
      f.input :financing_options
      f.input :response_time_sla
      f.input :languages
    end

    f.inputs "Coverage & Certifications" do
      f.input :coverage_states
      f.input :coverage_cities
      f.input :certifications
      f.input :awards
      f.input :partner_brands
    end

    f.inputs "Social Media" do
      f.input :website
      f.input :facebook_url
      f.input :instagram_url
      f.input :linkedin_url
      f.input :youtube_url
    end

    f.inputs "Media" do
      f.input :banner, as: :file
      f.input :logo, as: :file
      f.input :media_gallery
    end

    f.inputs "Categories" do
      f.input :categories, as: :check_boxes
    end

    f.actions
  end

  show do
    attributes_table do
      row :name
      row :description
      row :cnpj
      row :email
      row :website
      row :phone
      row :whatsapp
      row :address
      row :state
      row :city
      row :instagram
      row :facebook
      row :linkedin
      row :working_hours
      row :payment_methods
      row :certifications
      row :featured
      row :verified
      row :status
      row :average_rating
      row :reviews_count
      row :categories do |company|
        company.categories.pluck(:name).join(", ")
      end
      row :banner do |company|
        image_tag url_for(company.banner) if company.banner.attached?
      end
      row :logo do |company|
        image_tag url_for(company.logo) if company.logo.attached?
      end
    end
  end

  filter :name
  filter :description
  filter :state
  filter :city
  filter :featured
  filter :verified
  filter :status
  filter :created_at
  filter :categories

  index do
    selectable_column
    id_column
    column :name
    column :state
    column :city
    column :featured
    column :verified
    column :status
    column :created_at
    actions
  end
end

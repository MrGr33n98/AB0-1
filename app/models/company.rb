# app/models/company.rb
class Company < ApplicationRecord
  # Attachments
  has_one_attached :banner
  has_one_attached :logo

  # Associations
  has_and_belongs_to_many :categories
  has_many :reviews, dependent: :destroy

  # =========================
  # Validations
  # =========================
  validates :name, presence: true
  validates :description, presence: true

  validates :state, :city, presence: false
  validates :website, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]),
                                message: 'must be a valid URL' }, allow_blank: true
  validates :phone,   format: { with: /\A\([0-9]{2}\)\s[0-9]{4,5}-[0-9]{4}\z/,
                                message: 'must be in format (XX) XXXX-XXXX or (XX) XXXXX-XXXX' }, allow_blank: true
  validates :whatsapp,     format: { with: /\A\+?[0-9]{10,15}\z/,
                                     message: 'must be a valid WhatsApp number' }, allow_blank: true
  validates :email_public, format: { with: URI::MailTo::EMAIL_REGEXP,
                                     message: 'must be a valid email' }, allow_blank: true

  # =========================
  # Scopes
  # =========================
  scope :by_state,        ->(state) { where(state: state) if state.present? }
  scope :by_city,         ->(city)  { where(city: city)   if city.present? }
  scope :featured,        ->        { where(featured: true) }
  scope :verified,        ->        { where(verified: true) }
  scope :by_rating,       ->        { order(rating_avg: :desc) }
  scope :by_founded_year, ->        { order(founded_year: :asc) }

  # =========================
  # Ransack (busca/filters)
  # =========================
  def self.ransackable_attributes(_auth_object = nil)
    %w[
      id name description website phone address state city
      featured verified cnpj email_public instagram facebook linkedin
      working_hours payment_methods certifications status
      founded_year employees_count rating_avg rating_count
      created_at updated_at
    ]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[categories reviews]
  end

  # =========================
  # Domain / API helpers
  # =========================
  def average_rating
    rating_avg.present? ? rating_avg : reviews.average(:rating).to_f.round(1)
  end

  def reviews_count
    rating_count.present? ? rating_count : reviews.count
  end

  def years_in_business
    return nil unless founded_year.present?
    Time.current.year - founded_year
  end

  def build_ctas(context = 'detail', utm = {}, vars = {})
    CompanyCtaBuilder.new(self, context, utm, vars).build_all_ctas
  end

  def social_links
    links = {}
    links[:facebook]  = facebook_url  if respond_to?(:facebook_url)  && facebook_url.present?
    links[:instagram] = instagram_url if respond_to?(:instagram_url) && instagram_url.present?
    links[:linkedin]  = linkedin_url  if respond_to?(:linkedin_url)  && linkedin_url.present?
    links[:youtube]   = youtube_url   if respond_to?(:youtube_url)   && youtube_url.present?
    links.present? ? links : nil
  end

  def as_json(options = {})
    context = options.delete(:context) || 'detail'
    utm     = options.delete(:utm)     || {}
    vars    = options.delete(:vars)    || {}

    methods = [:average_rating, :reviews_count, :years_in_business, :social_links]
    methods << :ctas if options[:include_ctas]

    json = super(options.merge(
      methods: methods,
      include: {
        categories: { only: [:id, :name] }
      }
    ))

    begin
      banner_url = banner.attached? ? Rails.application.routes.url_helpers.url_for(banner) : nil
    rescue => e
      Rails.logger.error("Error generating banner URL: #{e.message}")
      banner_url = nil
    end
    
    begin
      logo_url = logo.attached? ? Rails.application.routes.url_helpers.url_for(logo) : nil
    rescue => e
      Rails.logger.error("Error generating logo URL: #{e.message}")
      logo_url = nil
    end
    
    json.merge!(
      banner_url: banner_url,
      logo_url: logo_url
    )

    json[:ctas] = build_ctas(context, utm, vars) if options[:include_ctas]
    json
  end

  def ctas
    build_ctas
  end
end

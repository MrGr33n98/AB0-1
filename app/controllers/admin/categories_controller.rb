require 'csv'

class Admin::CategoriesController < ApplicationController
  # Skip CSRF protection for API endpoints
  skip_before_action :verify_authenticity_token, only: [:import]
  
  def import
    if params[:file].nil?
      render json: { error: 'No file uploaded' }, status: :bad_request
      return
    end

    success_count = 0
    errors = []
    
    begin
      CSV.foreach(params[:file].path, headers: true) do |row|
        category = Category.new(
          name: row['name'],
          seo_url: row['seo_url'] || row['name'].parameterize,
          seo_title: row['seo_title'],
          short_description: row['short_description'],
          description: row['description'],
          parent_id: row['parent_id'].present? ? row['parent_id'] : nil,
          kind: row['kind'] || 'product',
          status: row['status'] || 'active',
          featured: row['featured'] == 'true'
        )
        
        if category.save
          success_count += 1
        else
          errors << "Row #{$. + 1}: #{category.errors.full_messages.join(', ')}"
        end
      end

      render json: { 
        message: "Import completed: #{success_count} categories created successfully", 
        errors: errors
      }, status: errors.empty? ? :ok : :partial_content
      
    rescue StandardError => e
      render json: { error: "Import failed: #{e.message}" }, status: :unprocessable_entity
    end
  end
end
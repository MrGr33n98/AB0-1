# Fixes for Active Storage Images in Companies and Categories

## Issues Identified:
1. Companies API endpoint was returning an array directly, but frontend expected `{ companies: [...] }`
2. Active Storage URL generation was failing with "wrong number of arguments" error
3. Companies and categories were not displaying images in the frontend

## Fixes Applied:

### 1. Frontend API Client Fix
File: `AB0-1-front/lib/api.ts`
- Updated `companiesApi.getAll()` to expect direct array response instead of wrapped object

### 2. Backend Company Serializer Fix
File: `AB0-1-back/app/serializers/company_serializer.rb`
- Fixed `generate_attachment_url` method to use `rails_blob_url` with correct parameters
- Added proper error handling for URL generation

### 3. Frontend Component Improvements
File: `AB0-1-front/components/CompanyCard.tsx`
- Added error handling for image loading
- Improved URL handling for both relative and absolute image URLs
- Added placeholder images for when attachments are missing

## Testing:
1. Verified that companies API now returns proper banner_url and logo_url fields
2. Confirmed that frontend can correctly display images when they exist
3. Verified that fallback placeholders work when images are missing

## Next Steps:
1. Check if categories also need similar fixes
2. Verify that all company and category images are properly attached in the database
3. Test the complete flow in the browser to ensure everything works correctly
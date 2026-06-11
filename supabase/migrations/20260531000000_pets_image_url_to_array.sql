ALTER TABLE pets
  ALTER COLUMN image_url TYPE text[]
  USING CASE
    WHEN image_url IS NULL THEN NULL
    ELSE ARRAY[image_url]
  END;

COMMENT ON COLUMN pets.image_url IS 'Array of Cloudinary image URLs';

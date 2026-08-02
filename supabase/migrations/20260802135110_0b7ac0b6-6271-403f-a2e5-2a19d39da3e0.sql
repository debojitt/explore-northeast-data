ALTER TABLE public.experiences
  ALTER COLUMN challenges TYPE text[] USING CASE WHEN challenges IS NULL OR challenges = '' THEN '{}'::text[] ELSE ARRAY[challenges] END,
  ALTER COLUMN challenges SET NOT NULL,
  ALTER COLUMN challenges SET DEFAULT '{}',
  ALTER COLUMN transport_option TYPE text[] USING CASE WHEN transport_option IS NULL OR transport_option = '' THEN '{}'::text[] ELSE ARRAY[transport_option] END,
  ALTER COLUMN transport_option SET NOT NULL,
  ALTER COLUMN transport_option SET DEFAULT '{}',
  ALTER COLUMN stay_option TYPE text[] USING CASE WHEN stay_option IS NULL OR stay_option = '' THEN '{}'::text[] ELSE ARRAY[stay_option] END,
  ALTER COLUMN stay_option SET NOT NULL,
  ALTER COLUMN stay_option SET DEFAULT '{}',
  ALTER COLUMN food_option TYPE text[] USING CASE WHEN food_option IS NULL OR food_option = '' THEN '{}'::text[] ELSE ARRAY[food_option] END,
  ALTER COLUMN food_option SET NOT NULL,
  ALTER COLUMN food_option SET DEFAULT '{}',
  ADD COLUMN challenges_note text;
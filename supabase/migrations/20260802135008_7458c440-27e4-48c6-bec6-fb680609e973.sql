CREATE TABLE public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  state text NOT NULL,
  district text,
  experience_type text[] NOT NULL DEFAULT '{}',
  duration text,
  difficulty text,
  age_group text[] NOT NULL DEFAULT '{}',
  ideal_season text[] NOT NULL DEFAULT '{}',
  challenges text,
  transport_option text,
  stay_option text,
  food_option text,
  ideal_for text[] NOT NULL DEFAULT '{}',
  sales_pointers text,
  operation_pointers text,
  nearby_experiences text,
  notes text,
  tags text[] NOT NULL DEFAULT '{}',
  hotel_contacts jsonb NOT NULL DEFAULT '[]'::jsonb,
  homestay_contacts jsonb NOT NULL DEFAULT '[]'::jsonb,
  cab_contacts jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.experiences TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.experiences TO authenticated;
GRANT ALL ON public.experiences TO service_role;

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Anyone can add experiences" ON public.experiences FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update experiences" ON public.experiences FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete experiences" ON public.experiences FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_experiences_updated_at
BEFORE UPDATE ON public.experiences
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX experiences_state_idx ON public.experiences (state);
CREATE INDEX experiences_created_at_idx ON public.experiences (created_at DESC);
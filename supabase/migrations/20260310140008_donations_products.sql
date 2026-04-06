-- Add missing columns to donations
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','completed','failed','refunded'));
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS product_id UUID;

-- Donation Products (businesses define up to 3 products with prices)
CREATE TABLE IF NOT EXISTS public.donation_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price > 0),
  image_url TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  total_donated INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.donation_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dp_select" ON public.donation_products FOR SELECT USING (true);
CREATE POLICY "dp_insert" ON public.donation_products FOR INSERT WITH CHECK (
  auth.uid() = (SELECT owner_id FROM public.businesses WHERE id = business_id)
);
CREATE POLICY "dp_update" ON public.donation_products FOR UPDATE USING (
  auth.uid() = (SELECT owner_id FROM public.businesses WHERE id = business_id)
);
CREATE POLICY "dp_delete" ON public.donation_products FOR DELETE USING (
  auth.uid() = (SELECT owner_id FROM public.businesses WHERE id = business_id)
);

CREATE INDEX idx_dp_business ON public.donation_products(business_id);
CREATE INDEX idx_dp_active ON public.donation_products(is_active);

-- Add product_id FK to donations
ALTER TABLE public.donations
  ADD CONSTRAINT fk_donations_product
  FOREIGN KEY (product_id) REFERENCES public.donation_products(id);

-- Function: enforce max 3 active products per business
CREATE OR REPLACE FUNCTION check_max_donation_products()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.donation_products WHERE business_id = NEW.business_id AND is_active = true) >= 3 THEN
    RAISE EXCEPTION 'Her isletme en fazla 3 aktif bagis urunu tanimlayabilir';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_max_donation_products
  BEFORE INSERT ON public.donation_products
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION check_max_donation_products();

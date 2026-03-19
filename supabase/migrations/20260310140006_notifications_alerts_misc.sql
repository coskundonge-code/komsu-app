-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  related_user_id UUID REFERENCES public.profiles(id),
  related_post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  related_listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id) WHERE NOT is_read;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Alerts
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id UUID NOT NULL REFERENCES public.neighborhoods(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  alert_severity TEXT DEFAULT 'low' CHECK (alert_severity IN ('low','medium','high','critical')),
  location_coords JSONB,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_neighborhood ON public.alerts(neighborhood_id, created_at DESC);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alerts_select" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "alerts_insert" ON public.alerts FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Reports
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  report_type TEXT NOT NULL,
  related_post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  related_comment_id UUID REFERENCES public.comments(id) ON DELETE SET NULL,
  related_user_id UUID REFERENCES public.profiles(id),
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','in_review','resolved','dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_insert" ON public.reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reports_select_own" ON public.reports FOR SELECT USING (auth.uid() = user_id);

-- Polls
CREATE TABLE IF NOT EXISTS public.polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  allow_multiple BOOLEAN DEFAULT FALSE,
  ends_at TIMESTAMPTZ,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  option_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "polls_select" ON public.polls FOR SELECT USING (true);
CREATE POLICY "poll_options_select" ON public.poll_options FOR SELECT USING (true);
CREATE POLICY "poll_votes_select" ON public.poll_votes FOR SELECT USING (true);
CREATE POLICY "poll_votes_insert" ON public.poll_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Address verifications
CREATE TABLE IF NOT EXISTS public.address_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending','document_uploaded','barcode_verified','approved','rejected','expired')),
  barcode_image_url TEXT,
  barcode_value TEXT,
  barcode_verified_at TIMESTAMPTZ,
  document_uploaded_at TIMESTAMPTZ,
  address_text TEXT,
  verified_neighborhood_id UUID REFERENCES public.neighborhoods(id),
  rejection_reason TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.address_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "av_select" ON public.address_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "av_insert" ON public.address_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "av_update" ON public.address_verifications FOR UPDATE USING (auth.uid() = user_id);

-- Listing quotas and payments
CREATE TABLE IF NOT EXISTS public.listing_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  year INTEGER NOT NULL,
  free_listings_used INTEGER DEFAULT 0,
  free_listings_limit INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, year)
);

ALTER TABLE public.listing_quotas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lq_select" ON public.listing_quotas FOR SELECT USING (auth.uid() = user_id);

-- Referral codes
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  code TEXT NOT NULL UNIQUE,
  max_uses INTEGER DEFAULT 3,
  current_uses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rc_select" ON public.referral_codes FOR SELECT USING (true);
CREATE POLICY "rc_insert" ON public.referral_codes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Updated at trigger function (reusable)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'profiles','neighborhoods','user_addresses','posts','comments',
    'listings','events','groups','businesses','business_reviews',
    'notifications','alerts','reports','polls','address_verifications'
  ]) LOOP
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', t);
  END LOOP;
END $$;

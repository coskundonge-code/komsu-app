export type Database = {

  public: {

    Tables: {

      profiles: {

        Row: { id: string; email: string; phone: string | null; full_name: string; avatar_url: string | null; bio: string | null; is_verified: boolean; is_admin: boolean; created_at: string; updated_at: string }

        Insert: { id?: string; email: string; phone?: string | null; full_name: string; avatar_url?: string | null; bio?: string | null; is_verified?: boolean; is_admin?: boolean; created_at?: string; updated_at?: string }

        Update: { id?: string; email?: string; phone?: string | null; full_name?: string; avatar_url?: string | null; bio?: string | null; is_verified?: boolean; is_admin?: boolean; created_at?: string; updated_at?: string }

        Relationships: []

      }

      neighborhoods: {

        Row: { id: string; name: string; slug: string; city: string; district: string; center_lat: number | null; center_lng: number | null; boundary: unknown | null; member_count: number; created_at: string }

        Insert: { id?: string; name: string; slug: string; city: string; district: string; center_lat?: number | null; center_lng?: number | null; boundary?: unknown | null; member_count?: number; created_at?: string }

        Update: { id?: string; name?: string; slug?: string; city?: string; district?: string; center_lat?: number | null; center_lng?: number | null; boundary?: unknown | null; member_count?: number; created_at?: string }

        Relationships: []

      }

      neighborhood_members: {

        Row: { user_id: string; neighborhood_id: string; role: string; joined_at: string }

        Insert: { user_id: string; neighborhood_id: string; role?: string; joined_at?: string }

        Update: { user_id?: string; neighborhood_id?: string; role?: string; joined_at?: string }

        Relationships: []

      }

      posts: {

        Row: { id: string; author_id: string; neighborhood_id: string; title: string | null; body: string | null; type: string; visibility: string; media_urls: string[] | null; is_pinned: boolean; reaction_count: number; comment_count: number; created_at: string }

        Insert: { id?: string; author_id: string; neighborhood_id: string; title?: string | null; body?: string | null; type?: string; visibility?: string; media_urls?: string[] | null; is_pinned?: boolean; reaction_count?: number; comment_count?: number; created_at?: string }

        Update: { id?: string; author_id?: string; neighborhood_id?: string; title?: string | null; body?: string | null; type?: string; visibility?: string; media_urls?: string[] | null; is_pinned?: boolean; reaction_count?: number; comment_count?: number; created_at?: string }

        Relationships: []

      }

      comments: {

        Row: { id: string; post_id: string; author_id: string; body: string; created_at: string }

        Insert: { id?: string; post_id: string; author_id: string; body: string; created_at?: string }

        Update: { id?: string; post_id?: string; author_id?: string; body?: string; created_at?: string }

        Relationships: []

      }

      reactions: {

        Row: { id: string; post_id: string; user_id: string; type: string; created_at: string }

        Insert: { id?: string; post_id: string; user_id: string; type: string; created_at?: string }

        Update: { id?: string; post_id?: string; user_id?: string; type?: string; created_at?: string }

        Relationships: []

      }

      listing_categories: {

        Row: { id: string; name: string; slug: string; icon: string | null; created_at: string }

        Insert: { id?: string; name: string; slug: string; icon?: string | null; created_at?: string }

        Update: { id?: string; name?: string; slug?: string; icon?: string | null; created_at?: string }

        Relationships: []

      }

      listings: {

        Row: { id: string; seller_id: string; neighborhood_id: string; category_id: string; title: string; description: string; price: number | null; condition: string; status: string; media_urls: string[] | null; created_at: string; updated_at: string }

        Insert: { id?: string; seller_id: string; neighborhood_id: string; category_id: string; title: string; description: string; price?: number | null; condition?: string; status?: string; media_urls?: string[] | null; created_at?: string; updated_at?: string }

        Update: { id?: string; seller_id?: string; neighborhood_id?: string; category_id?: string; title?: string; description?: string; price?: number | null; condition?: string; status?: string; media_urls?: string[] | null; created_at?: string; updated_at?: string }

        Relationships: []

      }

      lending_items: {

        Row: { id: string; user_id: string; title: string; description: string; category: string; lending_type: string; price_per_unit: number | null; time_unit: string | null; media_urls: string[] | null; status: string; neighborhood_id: string; created_at: string }

        Insert: { id?: string; user_id: string; title: string; description: string; category: string; lending_type: string; price_per_unit?: number | null; time_unit?: string | null; media_urls?: string[] | null; status?: string; neighborhood_id: string; created_at?: string }

        Update: { id?: string; user_id?: string; title?: string; description?: string; category?: string; lending_type?: string; price_per_unit?: number | null; time_unit?: string | null; media_urls?: string[] | null; status?: string; neighborhood_id?: string; created_at?: string }

        Relationships: []

      }

      businesses: {

        Row: { id: string; owner_id: string; name: string; slug: string; category_id: string; description: string | null; address: string; phone: string | null; website: string | null; logo_url: string | null; cover_url: string | null; lat: number | null; lng: number | null; is_verified: boolean; rating_avg: number | null; review_count: number; recommendation_count: number; created_at: string }

        Insert: { id?: string; owner_id: string; name: string; slug: string; category_id: string; description?: string | null; address: string; phone?: string | null; website?: string | null; logo_url?: string | null; cover_url?: string | null; lat?: number | null; lng?: number | null; is_verified?: boolean; rating_avg?: number | null; review_count?: number; recommendation_count?: number; created_at?: string }

        Update: { id?: string; owner_id?: string; name?: string; slug?: string; category_id?: string; description?: string | null; address?: string; phone?: string | null; website?: string | null; logo_url?: string | null; cover_url?: string | null; lat?: number | null; lng?: number | null; is_verified?: boolean; rating_avg?: number | null; review_count?: number; recommendation_count?: number; created_at?: string }

        Relationships: []

      }

      alerts: {

        Row: { id: string; neighborhood_id: string; created_by: string; title: string; body: string; severity: string; expires_at: string | null; created_at: string }

        Insert: { id?: string; neighborhood_id: string; created_by: string; title: string; body: string; severity?: string; expires_at?: string | null; created_at?: string }

        Update: { id?: string; neighborhood_id?: string; created_by?: string; title?: string; body?: string; severity?: string; expires_at?: string | null; created_at?: string }

        Relationships: []

      }

      conversations: {

        Row: { id: string; type: string; listing_id: string | null; title: string | null; created_at: string; updated_at: string }

        Insert: { id?: string; type: string; listing_id?: string | null; title?: string | null; created_at?: string; updated_at?: string }

        Update: { id?: string; type?: string; listing_id?: string | null; title?: string | null; created_at?: string; updated_at?: string }

        Relationships: []

      }

      conversation_participants: {

        Row: { conversation_id: string; user_id: string; last_read_at: string | null }

        Insert: { conversation_id: string; user_id: string; last_read_at?: string | null }

        Update: { conversation_id?: string; user_id?: string; last_read_at?: string | null }

        Relationships: []

      }

      messages: {

        Row: { id: string; conversation_id: string; sender_id: string; body: string; media_urls: string[] | null; is_read: boolean; created_at: string }

        Insert: { id?: string; conversation_id: string; sender_id: string; body: string; media_urls?: string[] | null; is_read?: boolean; created_at?: string }

        Update: { id?: string; conversation_id?: string; sender_id?: string; body?: string; media_urls?: string[] | null; is_read?: boolean; created_at?: string }

        Relationships: []

      }

      reports: {

        Row: { id: string; reporter_id: string; post_id: string | null; comment_id: string | null; reported_user_id: string | null; reason: string; description: string | null; status: string; created_at: string }

        Insert: { id?: string; reporter_id: string; post_id?: string | null; comment_id?: string | null; reported_user_id?: string | null; reason: string; description?: string | null; status?: string; created_at?: string }

        Update: { id?: string; reporter_id?: string; post_id?: string | null; comment_id?: string | null; reported_user_id?: string | null; reason?: string; description?: string | null; status?: string; created_at?: string }

        Relationships: []

      }

      moderation_actions: {

        Row: { id: string; moderator_id: string; report_id: string; action: string; reason: string | null; created_at: string }

        Insert: { id?: string; moderator_id: string; report_id: string; action: string; reason?: string | null; created_at?: string }

        Update: { id?: string; moderator_id?: string; report_id?: string; action?: string; reason?: string | null; created_at?: string }

        Relationships: []

      }

      business_reviews: {

        Row: { id: string; business_id: string; user_id: string; rating: number; body: string | null; created_at: string }

        Insert: { id?: string; business_id: string; user_id: string; rating: number; body?: string | null; created_at?: string }

        Update: { id?: string; business_id?: string; user_id?: string; rating?: number; body?: string | null; created_at?: string }

        Relationships: []

      }

      notifications: {

        Row: { id: string; user_id: string; type: string; title: string; body: string | null; is_read: boolean; link: string | null; created_at: string }

        Insert: { id?: string; user_id: string; type: string; title: string; body?: string | null; is_read?: boolean; link?: string | null; created_at?: string }

        Update: { id?: string; user_id?: string; type?: string; title?: string; body?: string | null; is_read?: boolean; link?: string | null; created_at?: string }

        Relationships: []

      }

      notification_preferences: {

        Row: { id: string; user_id: string; [key: string]: any }

        Insert: { id?: string; user_id: string; [key: string]: any }

        Update: { id?: string; user_id?: string; [key: string]: any }

        Relationships: []

      }

      events: {

        Row: { id: string; title: string; description: string | null; neighborhood_id: string; organizer_id: string; event_date: string; location: string | null; max_attendees: number | null; created_at: string }

        Insert: { id?: string; title: string; description?: string | null; neighborhood_id: string; organizer_id: string; event_date: string; location?: string | null; max_attendees?: number | null; created_at?: string }

        Update: { id?: string; title?: string; description?: string | null; neighborhood_id?: string; organizer_id?: string; event_date?: string; location?: string | null; max_attendees?: number | null; created_at?: string }

        Relationships: []

      }

      event_attendees: {

        Row: { event_id: string; user_id: string; status: string; created_at: string }

        Insert: { event_id: string; user_id: string; status?: string; created_at?: string }

        Update: { event_id?: string; user_id?: string; status?: string; created_at?: string }

        Relationships: []

      }

      groups: {

        Row: { id: string; name: string; description: string | null; neighborhood_id: string; creator_id: string; member_count: number; created_at: string }

        Insert: { id?: string; name: string; description?: string | null; neighborhood_id: string; creator_id: string; member_count?: number; created_at?: string }

        Update: { id?: string; name?: string; description?: string | null; neighborhood_id?: string; creator_id?: string; member_count?: number; created_at?: string }

        Relationships: []

      }

      group_members: {

        Row: { group_id: string; user_id: string; role: string; joined_at: string }

        Insert: { group_id: string; user_id: string; role?: string; joined_at?: string }

        Update: { group_id?: string; user_id?: string; role?: string; joined_at?: string }

        Relationships: []

      }

      content_moderation: {

        Row: { id: string; content_type: string; content_id: string; status: string; reason: string | null; moderator_id: string | null; created_at: string }

        Insert: { id?: string; content_type: string; content_id: string; status?: string; reason?: string | null; moderator_id?: string | null; created_at?: string }

        Update: { id?: string; content_type?: string; content_id?: string; status?: string; reason?: string | null; moderator_id?: string | null; created_at?: string }

        Relationships: []

      }

      user_profiles: {

        Row: { id: string; [key: string]: any }

        Insert: { id?: string; [key: string]: any }

        Update: { id?: string; [key: string]: any }

        Relationships: []

      }

      user_listing_quotas: {

        Row: { id: string; user_id: string; [key: string]: any }

        Insert: { id?: string; user_id: string; [key: string]: any }

        Update: { id?: string; user_id?: string; [key: string]: any }

        Relationships: []

      }

      payments: {

        Row: { id: string; [key: string]: any }

        Insert: { id?: string; [key: string]: any }

        Update: { id?: string; [key: string]: any }

        Relationships: []

      }

      donations: {

        Row: { id: string; [key: string]: any }

        Insert: { id?: string; [key: string]: any }

        Update: { id?: string; [key: string]: any }

        Relationships: []

      }

      mahallem_cards: {

        Row: { id: string; user_id: string; [key: string]: any }

        Insert: { id?: string; user_id: string; [key: string]: any }

        Update: { id?: string; user_id?: string; [key: string]: any }

        Relationships: []

      }

      card_transactions: {

        Row: { id: string; [key: string]: any }

        Insert: { id?: string; [key: string]: any }

        Update: { id?: string; [key: string]: any }

        Relationships: []

      }

      referral_codes: {

        Row: { id: string; user_id: string; code: string; [key: string]: any }

        Insert: { id?: string; user_id: string; code: string; [key: string]: any }

        Update: { id?: string; user_id?: string; code?: string; [key: string]: any }

        Relationships: []

      }

      referral_uses: {

        Row: { id: string; [key: string]: any }

        Insert: { id?: string; [key: string]: any }

        Update: { id?: string; [key: string]: any }

        Relationships: []

      }

      polls: {

        Row: { id: string; post_id: string; question: string; created_at: string }

        Insert: { id?: string; post_id: string; question: string; created_at?: string }

        Update: { id?: string; post_id?: string; question?: string; created_at?: string }

        Relationships: []

      }

      poll_options: {

        Row: { id: string; poll_id: string; text: string; vote_count: number }

        Insert: { id?: string; poll_id: string; text: string; vote_count?: number }

        Update: { id?: string; poll_id?: string; text?: string; vote_count?: number }

        Relationships: []

      }

      poll_votes: {

        Row: { id: string; poll_id: string; option_id: string; user_id: string }

        Insert: { id?: string; poll_id: string; option_id: string; user_id: string }

        Update: { id?: string; poll_id?: string; option_id?: string; user_id?: string }

        Relationships: []

      }

      business_categories: {

        Row: { id: string; name: string; slug: string; icon: string | null }

        Insert: { id?: string; name: string; slug: string; icon?: string | null }

        Update: { id?: string; name?: string; slug?: string; icon?: string | null }

        Relationships: []

      }

      business_discounts: {

        Row: { id: string; business_id: string; [key: string]: any }

        Insert: { id?: string; business_id: string; [key: string]: any }

        Update: { id?: string; business_id?: string; [key: string]: any }

        Relationships: []

      }

      business_recommendations: {

        Row: { id: string; business_id: string; user_id: string; [key: string]: any }

        Insert: { id?: string; business_id: string; user_id: string; [key: string]: any }

        Update: { id?: string; business_id?: string; user_id?: string; [key: string]: any }

        Relationships: []

      }

      group_posts: {

        Row: { id: string; group_id: string; author_id: string; body: string; created_at: string }

        Insert: { id?: string; group_id: string; author_id: string; body: string; created_at?: string }

        Update: { id?: string; group_id?: string; author_id?: string; body?: string; created_at?: string }

        Relationships: []

      }

      lending_requests: {

        Row: { id: string; lending_item_id: string; requester_id: string; status: string; created_at: string }

        Insert: { id?: string; lending_item_id: string; requester_id: string; status?: string; created_at?: string }

        Update: { id?: string; lending_item_id?: string; requester_id?: string; status?: string; created_at?: string }

        Relationships: []

      }

      listing_quotas: {

        Row: { id: string; [key: string]: any }

        Insert: { id?: string; [key: string]: any }

        Update: { id?: string; [key: string]: any }

        Relationships: []

      }

      address_verifications: {

        Row: { id: string; user_id: string; status: string; [key: string]: any }

        Insert: { id?: string; user_id: string; status?: string; [key: string]: any }

        Update: { id?: string; user_id?: string; status?: string; [key: string]: any }

        Relationships: []

      }

      user_addresses: {

        Row: { id: string; user_id: string; address_line: string | null; city: string | null; district: string | null; neighborhood_id: string | null; lat: number | null; lng: number | null; is_primary: boolean; verified_at: string | null; created_at: string }

        Insert: { id?: string; user_id: string; address_line?: string | null; city?: string | null; district?: string | null; neighborhood_id?: string | null; lat?: number | null; lng?: number | null; is_primary?: boolean; verified_at?: string | null; created_at?: string }

        Update: { id?: string; user_id?: string; address_line?: string | null; city?: string | null; district?: string | null; neighborhood_id?: string | null; lat?: number | null; lng?: number | null; is_primary?: boolean; verified_at?: string | null; created_at?: string }

        Relationships: []

      }

      badges: {

        Row: { id: string; slug: string; label: string; description: string; icon: string; color: string; criteria_type: string; criteria_threshold: number; is_active: boolean; created_at: string }

        Insert: { id?: string; slug: string; label: string; description: string; icon: string; color?: string; criteria_type: string; criteria_threshold?: number; is_active?: boolean; created_at?: string }

        Update: { id?: string; slug?: string; label?: string; description?: string; icon?: string; color?: string; criteria_type?: string; criteria_threshold?: number; is_active?: boolean; created_at?: string }

        Relationships: []

      }

      user_badges: {

        Row: { id: string; user_id: string; badge_id: string; earned_at: string }

        Insert: { id?: string; user_id: string; badge_id: string; earned_at?: string }

        Update: { id?: string; user_id?: string; badge_id?: string; earned_at?: string }

        Relationships: []

      }

    }

    Views: { [_ in never]: never }

    Functions: { [_ in never]: never }

    Enums: {

      post_type: 'general' | 'safety' | 'recommendation' | 'lost_found' | 'classified' | 'event' | 'poll'

      post_visibility: 'neighborhood' | 'nearby' | 'city'

      listing_condition: 'new' | 'like_new' | 'good' | 'fair'

      listing_status: 'active' | 'sold' | 'reserved' | 'expired'

      alert_severity: 'low' | 'medium' | 'high' | 'critical'

    }

    CompositeTypes: { [_ in never]: never }

  }

}


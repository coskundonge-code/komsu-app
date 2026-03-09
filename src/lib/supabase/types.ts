export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          phone: string | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      neighborhoods: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          city: string
          district: string
          postal_code: string | null
          latitude: number | null
          longitude: number | null
          cover_image_url: string | null
          member_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          city: string
          district: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          cover_image_url?: string | null
          member_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          city?: string
          district?: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          cover_image_url?: string | null
          member_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_addresses: {
        Row: {
          id: string
          user_id: string
          neighborhood_id: string
          street: string
          house_number: string
          apartment: string | null
          postal_code: string
          latitude: number | null
          longitude: number | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          neighborhood_id: string
          street: string
          house_number: string
          apartment?: string | null
          postal_code: string
          latitude?: number | null
          longitude?: number | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          neighborhood_id?: string
          street?: string
          house_number?: string
          apartment?: string | null
          postal_code?: string
          latitude?: number | null
          longitude?: number | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      neighborhood_members: {
        Row: {
          id: string
          user_id: string
          neighborhood_id: string
          role: 'member' | 'moderator' | 'admin'
          joined_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          neighborhood_id: string
          role?: 'member' | 'moderator' | 'admin'
          joined_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          neighborhood_id?: string
          role?: 'member' | 'moderator' | 'admin'
          joined_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          neighborhood_id: string
          post_type: 'general' | 'safety' | 'recommendation' | 'lost_found' | 'classified' | 'event' | 'poll'
          title: string
          content: string
          image_urls: string[] | null
          location: { lat: number; lng: number } | null
          visibility: 'public' | 'members_only'
          is_pinned: boolean
          is_archived: boolean
          comment_count: number
          reaction_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          neighborhood_id: string
          post_type: 'general' | 'safety' | 'recommendation' | 'lost_found' | 'classified' | 'event' | 'poll'
          title: string
          content: string
          image_urls?: string[] | null
          location?: { lat: number; lng: number } | null
          visibility?: 'public' | 'members_only'
          is_pinned?: boolean
          is_archived?: boolean
          comment_count?: number
          reaction_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          neighborhood_id?: string
          post_type?: 'general' | 'safety' | 'recommendation' | 'lost_found' | 'classified' | 'event' | 'poll'
          title?: string
          content?: string
          image_urls?: string[] | null
          location?: { lat: number; lng: number } | null
          visibility?: 'public' | 'members_only'
          is_pinned?: boolean
          is_archived?: boolean
          comment_count?: number
          reaction_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          image_urls: string[] | null
          reaction_count: number
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          image_urls?: string[] | null
          reaction_count?: number
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          image_urls?: string[] | null
          reaction_count?: number
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reactions: {
        Row: {
          id: string
          user_id: string
          post_id: string | null
          comment_id: string | null
          reaction_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id?: string | null
          comment_id?: string | null
          reaction_type: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string | null
          comment_id?: string | null
          reaction_type?: string
          created_at?: string
        }
      }
      listing_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon_url?: string | null
          created_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          user_id: string
          neighborhood_id: string
          category_id: string
          title: string
          description: string
          price: number | null
          image_urls: string[] | null
          listing_status: 'active' | 'sold' | 'expired' | 'removed'
          listing_condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
          location: { lat: number; lng: number } | null
          view_count: number
          favorite_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          neighborhood_id: string
          category_id: string
          title: string
          description: string
          price?: number | null
          image_urls?: string[] | null
          listing_status?: 'active' | 'sold' | 'expired' | 'removed'
          listing_condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
          location?: { lat: number; lng: number } | null
          view_count?: number
          favorite_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          neighborhood_id?: string
          category_id?: string
          title?: string
          description?: string
          price?: number | null
          image_urls?: string[] | null
          listing_status?: 'active' | 'sold' | 'expired' | 'removed'
          listing_condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
          location?: { lat: number; lng: number } | null
          view_count?: number
          favorite_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          user_id: string
          neighborhood_id: string
          title: string
          description: string
          start_date: string
          end_date: string | null
          location: string
          location_coords: { lat: number; lng: number } | null
          image_url: string | null
          attendee_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          neighborhood_id: string
          title: string
          description: string
          start_date: string
          end_date?: string | null
          location: string
          location_coords?: { lat: number; lng: number } | null
          image_url?: string | null
          attendee_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          neighborhood_id?: string
          title?: string
          description?: string
          start_date?: string
          end_date?: string | null
          location?: string
          location_coords?: { lat: number; lng: number } | null
          image_url?: string | null
          attendee_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      event_attendees: {
        Row: {
          id: string
          event_id: string
          user_id: string
          status: 'attending' | 'interested' | 'not_attending'
          joined_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          status?: 'attending' | 'interested' | 'not_attending'
          joined_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          status?: 'attending' | 'interested' | 'not_attending'
          joined_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          neighborhood_id: string
          name: string
          description: string | null
          image_url: string | null
          member_count: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          neighborhood_id: string
          name: string
          description?: string | null
          image_url?: string | null
          member_count?: number
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          neighborhood_id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          member_count?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: 'member' | 'moderator' | 'admin'
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: 'member' | 'moderator' | 'admin'
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: 'member' | 'moderator' | 'admin'
          joined_at?: string
        }
      }
      group_posts: {
        Row: {
          id: string
          group_id: string
          user_id: string
          title: string
          content: string
          image_urls: string[] | null
          comment_count: number
          reaction_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          title: string
          content: string
          image_urls?: string[] | null
          comment_count?: number
          reaction_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          title?: string
          content?: string
          image_urls?: string[] | null
          comment_count?: number
          reaction_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      business_categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon_url?: string | null
          created_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          user_id: string | null
          neighborhood_id: string
          category_id: string
          name: string
          description: string | null
          phone: string | null
          email: string | null
          website: string | null
          logo_url: string | null
          image_urls: string[] | null
          address: string
          location_coords: { lat: number; lng: number } | null
          rating: number | null
          review_count: number
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          neighborhood_id: string
          category_id: string
          name: string
          description?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          logo_url?: string | null
          image_urls?: string[] | null
          address: string
          location_coords?: { lat: number; lng: number } | null
          rating?: number | null
          review_count?: number
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          neighborhood_id?: string
          category_id?: string
          name?: string
          description?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          logo_url?: string | null
          image_urls?: string[] | null
          address?: string
          location_coords?: { lat: number; lng: number } | null
          rating?: number | null
          review_count?: number
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      business_reviews: {
        Row: {
          id: string
          business_id: string
          user_id: string
          rating: number
          title: string
          content: string
          image_urls: string[] | null
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          rating: number
          title: string
          content: string
          image_urls?: string[] | null
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          rating?: number
          title?: string
          content?: string
          image_urls?: string[] | null
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      business_recommendations: {
        Row: {
          id: string
          user_id: string
          neighborhood_id: string
          business_name: string
          category_id: string
          reason: string
          rating: number | null
          image_urls: string[] | null
          upvote_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          neighborhood_id: string
          business_name: string
          category_id: string
          reason: string
          rating?: number | null
          image_urls?: string[] | null
          upvote_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          neighborhood_id?: string
          business_name?: string
          category_id?: string
          reason?: string
          rating?: number | null
          image_urls?: string[] | null
          upvote_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id_1: string
          user_id_2: string
          last_message_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id_1: string
          user_id_2: string
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id_1?: string
          user_id_2?: string
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversation_participants: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          last_read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          last_read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          last_read_at?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          content: string
          image_urls: string[] | null
          is_edited: boolean
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          content: string
          image_urls?: string[] | null
          is_edited?: boolean
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          content?: string
          image_urls?: string[] | null
          is_edited?: boolean
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          content: string
          related_user_id: string | null
          related_post_id: string | null
          related_listing_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          content: string
          related_user_id?: string | null
          related_post_id?: string | null
          related_listing_id?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          content?: string
          related_user_id?: string | null
          related_post_id?: string | null
          related_listing_id?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      notification_preferences: {
        Row: {
          id: string
          user_id: string
          email_notifications: boolean
          push_notifications: boolean
          post_notifications: boolean
          comment_notifications: boolean
          reaction_notifications: boolean
          message_notifications: boolean
          event_notifications: boolean
          digest_email: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_notifications?: boolean
          push_notifications?: boolean
          post_notifications?: boolean
          comment_notifications?: boolean
          reaction_notifications?: boolean
          message_notifications?: boolean
          event_notifications?: boolean
          digest_email?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_notifications?: boolean
          push_notifications?: boolean
          post_notifications?: boolean
          comment_notifications?: boolean
          reaction_notifications?: boolean
          message_notifications?: boolean
          event_notifications?: boolean
          digest_email?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          neighborhood_id: string
          title: string
          content: string
          alert_severity: 'low' | 'medium' | 'high' | 'critical'
          location_coords: { lat: number; lng: number } | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          neighborhood_id: string
          title: string
          content: string
          alert_severity?: 'low' | 'medium' | 'high' | 'critical'
          location_coords?: { lat: number; lng: number } | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          neighborhood_id?: string
          title?: string
          content?: string
          alert_severity?: 'low' | 'medium' | 'high' | 'critical'
          location_coords?: { lat: number; lng: number } | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string
          report_type: string
          related_post_id: string | null
          related_comment_id: string | null
          related_user_id: string | null
          reason: string
          description: string
          status: 'open' | 'in_review' | 'resolved' | 'dismissed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          report_type: string
          related_post_id?: string | null
          related_comment_id?: string | null
          related_user_id?: string | null
          reason: string
          description: string
          status?: 'open' | 'in_review' | 'resolved' | 'dismissed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          report_type?: string
          related_post_id?: string | null
          related_comment_id?: string | null
          related_user_id?: string | null
          reason?: string
          description?: string
          status?: 'open' | 'in_review' | 'resolved' | 'dismissed'
          created_at?: string
          updated_at?: string
        }
      }
      moderation_actions: {
        Row: {
          id: string
          report_id: string | null
          moderator_id: string
          action_type: string
          related_post_id: string | null
          related_comment_id: string | null
          related_user_id: string | null
          reason: string
          created_at: string
        }
        Insert: {
          id?: string
          report_id?: string | null
          moderator_id: string
          action_type: string
          related_post_id?: string | null
          related_comment_id?: string | null
          related_user_id?: string | null
          reason: string
          created_at?: string
        }
        Update: {
          id?: string
          report_id?: string | null
          moderator_id?: string
          action_type?: string
          related_post_id?: string | null
          related_comment_id?: string | null
          related_user_id?: string | null
          reason?: string
          created_at?: string
        }
      }
      polls: {
        Row: {
          id: string
          post_id: string
          user_id: string
          title: string
          description: string | null
          allow_multiple: boolean
          ends_at: string | null
          total_votes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          title: string
          description?: string | null
          allow_multiple?: boolean
          ends_at?: string | null
          total_votes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          title?: string
          description?: string | null
          allow_multiple?: boolean
          ends_at?: string | null
          total_votes?: number
          created_at?: string
          updated_at?: string
        }
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          text: string
          vote_count: number
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          text: string
          vote_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          text?: string
          vote_count?: number
          created_at?: string
        }
      }
      poll_votes: {
        Row: {
          id: string
          poll_id: string
          user_id: string
          option_ids: string[]
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          user_id: string
          option_ids: string[]
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          user_id?: string
          option_ids?: string[]
          created_at?: string
        }
      }
      ad_campaigns: {
        Row: {
          id: string
          user_id: string
          neighborhood_id: string | null
          name: string
          description: string | null
          start_date: string
          end_date: string | null
          budget: number
          spent: number
          status: 'active' | 'paused' | 'ended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          neighborhood_id?: string | null
          name: string
          description?: string | null
          start_date: string
          end_date?: string | null
          budget: number
          spent?: number
          status?: 'active' | 'paused' | 'ended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          neighborhood_id?: string | null
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string | null
          budget?: number
          spent?: number
          status?: 'active' | 'paused' | 'ended'
          created_at?: string
          updated_at?: string
        }
      }
      ads: {
        Row: {
          id: string
          campaign_id: string
          title: string
          description: string | null
          image_url: string | null
          link_url: string | null
          position: number
          impressions: number
          clicks: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          title: string
          description?: string | null
          image_url?: string | null
          link_url?: string | null
          position?: number
          impressions?: number
          clicks?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          link_url?: string | null
          position?: number
          impressions?: number
          clicks?: number
          created_at?: string
          updated_at?: string
        }
      }
      ad_impressions: {
        Row: {
          id: string
          ad_id: string
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ad_id: string
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ad_id?: string
          user_id?: string | null
          created_at?: string
        }
      }
      ad_clicks: {
        Row: {
          id: string
          ad_id: string
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ad_id: string
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ad_id?: string
          user_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

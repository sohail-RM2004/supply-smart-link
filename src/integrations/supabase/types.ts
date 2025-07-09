export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      demand_forecasts: {
        Row: {
          actual_demand: number | null
          confidence_score: number | null
          created_at: string
          forecast_date: string
          id: string
          location_id: string
          location_type: string
          predicted_demand: number
          seasonal_factor: number | null
          sku: string
          weather_factor: number | null
        }
        Insert: {
          actual_demand?: number | null
          confidence_score?: number | null
          created_at?: string
          forecast_date: string
          id?: string
          location_id: string
          location_type: string
          predicted_demand: number
          seasonal_factor?: number | null
          sku: string
          weather_factor?: number | null
        }
        Update: {
          actual_demand?: number | null
          confidence_score?: number | null
          created_at?: string
          forecast_date?: string
          id?: string
          location_id?: string
          location_type?: string
          predicted_demand?: number
          seasonal_factor?: number | null
          sku?: string
          weather_factor?: number | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category: string
          created_at: string
          current_stock: number
          id: string
          last_updated: string
          location_id: string
          location_type: string
          max_capacity: number
          min_threshold: number
          product_name: string
          sku: string
          unit_cost: number | null
        }
        Insert: {
          category: string
          created_at?: string
          current_stock?: number
          id?: string
          last_updated?: string
          location_id: string
          location_type: string
          max_capacity?: number
          min_threshold?: number
          product_name: string
          sku: string
          unit_cost?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          current_stock?: number
          id?: string
          last_updated?: string
          location_id?: string
          location_type?: string
          max_capacity?: number
          min_threshold?: number
          product_name?: string
          sku?: string
          unit_cost?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          linked_store_id: string | null
          linked_warehouse_id: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          linked_store_id?: string | null
          linked_warehouse_id?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          linked_store_id?: string | null
          linked_warehouse_id?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          address: string | null
          created_at: string
          id: string
          location: string
          manager_id: string | null
          max_capacity: number
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          location: string
          manager_id?: string | null
          max_capacity?: number
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          location?: string
          manager_id?: string | null
          max_capacity?: number
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          confidence_score: number | null
          created_at: string
          from_location_id: string
          from_location_type: string
          id: string
          message: string
          priority: string
          quantity: number
          reasoning: string | null
          sku: string
          status: string
          suggested_by: string
          to_location_id: string
          to_location_type: string
          updated_at: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          from_location_id: string
          from_location_type: string
          id?: string
          message: string
          priority?: string
          quantity: number
          reasoning?: string | null
          sku: string
          status?: string
          suggested_by?: string
          to_location_id: string
          to_location_type: string
          updated_at?: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          from_location_id?: string
          from_location_type?: string
          id?: string
          message?: string
          priority?: string
          quantity?: number
          reasoning?: string | null
          sku?: string
          status?: string
          suggested_by?: string
          to_location_id?: string
          to_location_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      transfer_logs: {
        Row: {
          completed_at: string
          completed_by: string | null
          from_location_id: string
          from_location_type: string
          id: string
          notes: string | null
          quantity: number
          sku: string
          status: string
          to_location_id: string
          to_location_type: string
          transfer_request_id: string | null
        }
        Insert: {
          completed_at?: string
          completed_by?: string | null
          from_location_id: string
          from_location_type: string
          id?: string
          notes?: string | null
          quantity: number
          sku: string
          status: string
          to_location_id: string
          to_location_type: string
          transfer_request_id?: string | null
        }
        Update: {
          completed_at?: string
          completed_by?: string | null
          from_location_id?: string
          from_location_type?: string
          id?: string
          notes?: string | null
          quantity?: number
          sku?: string
          status?: string
          to_location_id?: string
          to_location_type?: string
          transfer_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transfer_logs_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfer_logs_transfer_request_id_fkey"
            columns: ["transfer_request_id"]
            isOneToOne: false
            referencedRelation: "transfer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      transfer_requests: {
        Row: {
          actual_arrival: string | null
          approved_by: string | null
          created_at: string
          expected_arrival: string | null
          from_location_id: string
          from_location_type: string
          id: string
          notes: string | null
          priority: string
          quantity: number
          requested_by: string | null
          sku: string
          status: string
          to_location_id: string
          to_location_type: string
          updated_at: string
        }
        Insert: {
          actual_arrival?: string | null
          approved_by?: string | null
          created_at?: string
          expected_arrival?: string | null
          from_location_id: string
          from_location_type: string
          id?: string
          notes?: string | null
          priority?: string
          quantity: number
          requested_by?: string | null
          sku: string
          status?: string
          to_location_id: string
          to_location_type: string
          updated_at?: string
        }
        Update: {
          actual_arrival?: string | null
          approved_by?: string | null
          created_at?: string
          expected_arrival?: string | null
          from_location_id?: string
          from_location_type?: string
          id?: string
          notes?: string | null
          priority?: string
          quantity?: number
          requested_by?: string | null
          sku?: string
          status?: string
          to_location_id?: string
          to_location_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transfer_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfer_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          address: string | null
          created_at: string
          id: string
          location: string
          manager_id: string | null
          max_capacity: number
          name: string
          temperature_controlled: boolean | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          location: string
          manager_id?: string | null
          max_capacity?: number
          name: string
          temperature_controlled?: boolean | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          location?: string
          manager_id?: string | null
          max_capacity?: number
          name?: string
          temperature_controlled?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouses_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

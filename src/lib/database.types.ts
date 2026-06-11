export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      clientes: {
        Row: {
          cidade: string | null
          consentimento_lgpd: boolean
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          observacoes: string | null
          origem: Database["public"]["Enums"]["origem_cliente"]
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cidade?: string | null
          consentimento_lgpd?: boolean
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          origem?: Database["public"]["Enums"]["origem_cliente"]
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cidade?: string | null
          consentimento_lgpd?: boolean
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          origem?: Database["public"]["Enums"]["origem_cliente"]
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      documentos: {
        Row: {
          created_at: string
          enviado_em: string | null
          enviado_email: string | null
          id: string
          pdf_url: string | null
          pedido_id: string
          tipo: Database["public"]["Enums"]["tipo_documento"]
        }
        Insert: {
          created_at?: string
          enviado_em?: string | null
          enviado_email?: string | null
          id?: string
          pdf_url?: string | null
          pedido_id: string
          tipo?: Database["public"]["Enums"]["tipo_documento"]
        }
        Update: {
          created_at?: string
          enviado_em?: string | null
          enviado_email?: string | null
          id?: string
          pdf_url?: string | null
          pedido_id?: string
          tipo?: Database["public"]["Enums"]["tipo_documento"]
        }
        Relationships: [
          {
            foreignKeyName: "documentos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      modelos: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          foto_url: string | null
          id: string
          nome: string
          preco_base: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          preco_base?: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          preco_base?: number
          updated_at?: string
        }
        Relationships: []
      }
      pedido_itens: {
        Row: {
          created_at: string
          descricao_medida: string | null
          extras: string | null
          id: string
          modelo_id: string | null
          pedido_id: string
          preco_unitario: number
          quantidade: number
          tecido_id: string | null
        }
        Insert: {
          created_at?: string
          descricao_medida?: string | null
          extras?: string | null
          id?: string
          modelo_id?: string | null
          pedido_id: string
          preco_unitario?: number
          quantidade?: number
          tecido_id?: string | null
        }
        Update: {
          created_at?: string
          descricao_medida?: string | null
          extras?: string | null
          id?: string
          modelo_id?: string | null
          pedido_id?: string
          preco_unitario?: number
          quantidade?: number
          tecido_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_itens_modelo_id_fkey"
            columns: ["modelo_id"]
            isOneToOne: false
            referencedRelation: "modelos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_itens_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_itens_tecido_id_fkey"
            columns: ["tecido_id"]
            isOneToOne: false
            referencedRelation: "tecidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          cliente_id: string
          created_at: string
          criado_por: string | null
          data_entrega_prevista: string | null
          id: string
          observacoes: string | null
          status: Database["public"]["Enums"]["status_pedido"]
          updated_at: string
          valor_total: number
        }
        Insert: {
          cliente_id: string
          created_at?: string
          criado_por?: string | null
          data_entrega_prevista?: string | null
          id?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_pedido"]
          updated_at?: string
          valor_total?: number
        }
        Update: {
          cliente_id?: string
          created_at?: string
          criado_por?: string | null
          data_entrega_prevista?: string | null
          id?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_pedido"]
          updated_at?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nome: string
          papel: Database["public"]["Enums"]["papel_usuario"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          nome: string
          papel?: Database["public"]["Enums"]["papel_usuario"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          papel?: Database["public"]["Enums"]["papel_usuario"]
          updated_at?: string
        }
        Relationships: []
      }
      tecidos: {
        Row: {
          acrescimo_preco: number
          ativo: boolean
          cor: string | null
          created_at: string
          foto_url: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          acrescimo_preco?: number
          ativo?: boolean
          cor?: string | null
          created_at?: string
          foto_url?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          acrescimo_preco?: number
          ativo?: boolean
          cor?: string | null
          created_at?: string
          foto_url?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_staff: { Args: never; Returns: boolean }
    }
    Enums: {
      origem_cliente: "instagram" | "indicacao" | "site" | "whatsapp" | "outro"
      papel_usuario: "dono" | "dev"
      status_pedido:
        | "novo"
        | "orcado"
        | "fechado"
        | "producao"
        | "entregue"
        | "cancelado"
      tipo_documento: "orcamento" | "pedido" | "recibo"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      origem_cliente: ["instagram", "indicacao", "site", "whatsapp", "outro"],
      papel_usuario: ["dono", "dev"],
      status_pedido: [
        "novo",
        "orcado",
        "fechado",
        "producao",
        "entregue",
        "cancelado",
      ],
      tipo_documento: ["orcamento", "pedido", "recibo"],
    },
  },
} as const


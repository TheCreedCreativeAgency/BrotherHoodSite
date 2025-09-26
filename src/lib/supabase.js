import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create client for anonymous users
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database helper functions
export const db = {
  // User operations
  async createUser(userData) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Subscription operations
  async createSubscription(subscriptionData) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscriptionData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getSubscriptionByStripeId(stripeSubscriptionId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('stripeSubscriptionId', stripeSubscriptionId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateSubscription(id, updates) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Payment operations
  async createPayment(paymentData) {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getPaymentByStripeId(stripePaymentIntentId) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('stripePaymentIntentId', stripePaymentIntentId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Health check
  async healthCheck() {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count', { count: 'exact', head: true })
    
    if (error) throw error
    return { status: 'healthy', userCount: data?.length || 0 }
  }
}

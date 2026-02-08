import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';

let supabase: SupabaseClient | null = null;

// Only initialize if credentials are present to avoid "supabaseUrl is required" error
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const authService = {
  getClient() {
    if (!supabase) {
      // Return a mock object to allow the app to render in "Demo/Offline" mode without crashing
      // specifically for the onAuthStateChange listener in Navbar which expects a valid client structure
      return {
        auth: {
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          getSession: async () => ({ data: { session: null } }),
          getUser: async () => ({ data: { user: null } }),
        }
      } as unknown as SupabaseClient;
    }
    return supabase;
  },

  async getSession() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async getUser() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  // Step 1: Send OTP to email
  async signInWithOtp(email: string) {
    if (!supabase) throw new Error("Supabase is not configured. Authentication is disabled.");
    
    // By NOT providing emailRedirectTo, we encourage Supabase to send a numeric code 
    // instead of a magic link (depending on the email template configuration).
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // Allows registration via this flow
      },
    });
    if (error) throw error;
  },

  // Step 2: Verify the OTP code
  async verifyOtp(email: string, token: string) {
    if (!supabase) throw new Error("Supabase is not configured.");
    
    // Try verifying as a standard 'email' OTP (for login)
    let { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    // If that fails, try verifying as a 'signup' token (for new user registration)
    if (error) {
      const retry = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      });
      // If retry succeeds, use that data; otherwise keep original error or use retry error
      if (!retry.error) {
        data = retry.data;
        error = null;
      }
    }

    if (error) throw error;
    return data;
  },

  async signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
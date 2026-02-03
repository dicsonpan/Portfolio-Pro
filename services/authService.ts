
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
    
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type SubscriptionData = {
  subscribed: boolean;
  current_plan?: string;
  subscription_end?: string;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: SubscriptionData | null;
  checkSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);

  const checkSubscription = async () => {
    if (!session) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });
      
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }
      
      setSubscription(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check subscription when user logs in
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(() => {
            checkSubscription();
          }, 100);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Check subscription for existing session
      if (session?.user) {
        setTimeout(() => {
          checkSubscription();
        }, 100);
      }
    });

    return () => authSubscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      // Always clear local state first
      setSession(null);
      setUser(null);
      setSubscription(null);
      
      // If there's no session, we're already logged out
      if (!session) {
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      
      // Ignore session_not_found errors as user is already logged out
      if (error && !error.message?.includes('session_not_found') && !error.message?.includes('Session not found')) {
        console.error('Error signing out:', error);
        throw error;
      }
    } catch (error: any) {
      // Don't throw error for session not found - user is already logged out
      if (error.message?.includes('session_not_found') || error.message?.includes('Session not found')) {
        console.log('Session already invalid, logout completed locally');
        return;
      }
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    subscription,
    checkSubscription,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
declare module 'netlify-identity-widget' {
  interface User {
    id: string;
    email: string;
    user_metadata: Record<string, any>;
    app_metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
    aud: string;
    role?: string;
  }

  interface NetlifyIdentityWidget {
    init(config?: {
      container?: string;
      APIUrl?: string;
      logo?: boolean;
      namePlaceholder?: string;
    }): void;
    
    open(tab?: 'login' | 'signup'): void;
    close(): void;
    
    currentUser(): User | null;
    
    logout(): Promise<void>;
    
    on(event: 'init', callback: (user: User | null) => void): void;
    on(event: 'login', callback: (user: User) => void): void;
    on(event: 'logout', callback: () => void): void;
    on(event: 'error', callback: (error: Error) => void): void;
    on(event: 'close', callback: () => void): void;
    
    off(event: 'init' | 'login' | 'logout' | 'error' | 'close'): void;
    
    refresh(force?: boolean): Promise<User | null>;
    
    setLocale(locale: string): void;
    store: {
      user: User | null;
      modal: {
        page: string;
        isOpen: boolean;
      };
    };
  }

  const netlifyIdentity: NetlifyIdentityWidget;
  export default netlifyIdentity;
} 
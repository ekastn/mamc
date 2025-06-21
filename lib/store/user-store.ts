/**
 * In-memory store for user data
 * This is a temporary solution until a proper database is implemented
 */

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

class UserStore {
  private users: Map<string, StoredUser> = new Map();
  private emailIndex: Map<string, string> = new Map(); // email -> id
  
  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
  
  /**
   * Create a new user
   */
  create(userData: Omit<StoredUser, "id" | "createdAt" | "updatedAt">): StoredUser {
    const now = new Date();
    const id = this.generateId();
    
    const newUser: StoredUser = {
      id,
      ...userData,
      createdAt: now,
      updatedAt: now,
    };
    
    this.users.set(id, newUser);
    this.emailIndex.set(userData.email.toLowerCase(), id);
    
    return { ...newUser };
  }
  
  /**
   * Find a user by ID
   */
  findById(id: string): StoredUser | null {
    const user = this.users.get(id);
    return user ? { ...user } : null;
  }
  
  /**
   * Find a user by email
   */
  findByEmail(email: string): StoredUser | null {
    const id = this.emailIndex.get(email.toLowerCase());
    
    if (!id) {
      return null;
    }
    
    return this.findById(id);
  }
  
  /**
   * Update a user
   */
  update(id: string, userData: Partial<Omit<StoredUser, "id" | "createdAt" | "updatedAt">>): StoredUser | null {
    const user = this.users.get(id);
    
    if (!user) {
      return null;
    }
    
    // Handle email change (update index)
    if (userData.email && userData.email.toLowerCase() !== user.email.toLowerCase()) {
      this.emailIndex.delete(user.email.toLowerCase());
      this.emailIndex.set(userData.email.toLowerCase(), id);
    }
    
    const updatedUser: StoredUser = {
      ...user,
      ...userData,
      updatedAt: new Date(),
    };
    
    this.users.set(id, updatedUser);
    
    return { ...updatedUser };
  }
  
  /**
   * Delete a user
   */
  delete(id: string): boolean {
    const user = this.users.get(id);
    
    if (!user) {
      return false;
    }
    
    this.emailIndex.delete(user.email.toLowerCase());
    this.users.delete(id);
    
    return true;
  }
  
  /**
   * Get all users
   */
  findAll(): StoredUser[] {
    return Array.from(this.users.values()).map(user => ({ ...user }));
  }
  
  /**
   * Clear all users (for testing purposes)
   */
  clear(): void {
    this.users.clear();
    this.emailIndex.clear();
  }
  
  /**
   * Seed the store with initial users
   */
  seed(): void {
    // Use fixed IDs for demo users to ensure consistency between server restarts
    const ADMIN_USER_ID = "admin-user-static-id";
    const TEST_USER_ID = "test-user-static-id";
    
    // Check if admin user exists
    if (!this.findByEmail("admin@harmonic.app")) {
      // Create admin user with fixed ID
      const adminUserData = {
        id: ADMIN_USER_ID,
        name: "Admin User",
        email: "admin@harmonic.app",
        password: "UGFzc3dvcmQxMjMhaGFybW9uaWMtc2FsdA==", // "Password123!"
        avatar: "/placeholder-user.jpg",
        bio: "Administrator for Harmonic",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Add directly to maps
      this.users.set(ADMIN_USER_ID, adminUserData);
      this.emailIndex.set("admin@harmonic.app".toLowerCase(), ADMIN_USER_ID);
      
      console.log("Created admin user with ID:", ADMIN_USER_ID);
    }
    
    // Check if test user exists
    if (!this.findByEmail("user@harmonic.app")) {
      // Create test user with fixed ID
      const testUserData = {
        id: TEST_USER_ID,
        name: "Test User",
        email: "user@harmonic.app",
        password: "UGFzc3dvcmQxMjMhaGFybW9uaWMtc2FsdA==", // "Password123!"
        avatar: "/placeholder-user.jpg",
        bio: "Regular user for testing",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Add directly to maps
      this.users.set(TEST_USER_ID, testUserData);
      this.emailIndex.set("user@harmonic.app".toLowerCase(), TEST_USER_ID);
      
      console.log("Created test user with ID:", TEST_USER_ID);
    }

    // Log total users for debugging
    console.log("Total users in store:", this.users.size);
    console.log("User IDs:", Array.from(this.users.keys()));
  }
}

// Export a singleton instance
export const userStore = new UserStore();

// Seed the store with initial data
userStore.seed();

// Log the store status
console.log(`UserStore initialized with ${userStore.findAll().length} users`);

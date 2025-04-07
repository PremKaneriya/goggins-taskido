import { query } from "./database";

// Define User interface
export interface User {
  id: number;
  email: string;
  full_name?: string;
  created_at: Date;
  last_login?: Date;
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const result = await query<User>(
    'SELECT * FROM users WHERE email = $1 AND is_deleted = false',
    [email]
  );
  return result.rows[0];
}

// Get user by ID
export async function getUserById(userId: number): Promise<User | undefined> {
  const result = await query<User>(
    'SELECT * FROM users WHERE id = $1 AND is_deleted = false',
    [userId]
  );
  return result.rows[0];
}

// Create a new user if not exists
export async function createOrUpdateUser(userData: {
  email: string;
  full_name?: string;
}): Promise<User> {
  const { email, full_name } = userData;
  
  // Check if user exists
  const existingUser = await getUserByEmail(email);
  
  if (existingUser) {
    // Update the user's name if provided and different
    if (full_name && full_name !== existingUser.full_name) {
      const result = await query<User>(
        'UPDATE users SET full_name = $1 WHERE id = $2 RETURNING *',
        [full_name, existingUser.id]
      );
      return result.rows[0];
    }
    return existingUser;
  }
  
  // Create new user
  const result = await query<User>(
    'INSERT INTO users (email, full_name) VALUES ($1, $2) RETURNING *',
    [email, full_name]
  );
  
  return result.rows[0];
}

// Update user's last login time
export async function updateLastLogin(userId: number): Promise<void> {
  await query(
    'UPDATE users SET last_login = NOW() WHERE id = $1',
    [userId]
  );
}

// Delete a user (soft delete)
export async function deleteUser(userId: number): Promise<boolean> {
  const result = await query(
    `UPDATE users 
     SET 
      is_deleted = true,
      deleted_at = NOW()
     WHERE id = $1`,
    [userId]
  );
  
  return (result.rowCount ?? 0) > 0;
}
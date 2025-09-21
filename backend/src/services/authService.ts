import bcrypt from 'bcryptjs';
import { User } from '../models';
import { generateToken, TokenPayload } from '../config/jwt';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { username, password } = credentials;

    // find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
        throw new Error('Invalid username or password');
    }

    // check password against hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        throw new Error('Invalid username or password');
    }

    // generate token
    if (typeof user.id !== 'number') {
        throw new Error('User id is missing or invalid');
    }

    const tokenPayload: TokenPayload = {
        id: user.id,
        username: user.username,
        role: user.role,
    };
    const token = generateToken(tokenPayload);

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
        },
    };
}


  async register(credentials: RegisterRequest): Promise<LoginResponse> {
    const { username, password } = credentials;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Validate password strength
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      username,
      password_hash: hashedPassword,
      role: 'user',
    });

    // Generate token
    const tokenPayload: TokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    const token = generateToken(tokenPayload);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  async createAdmin(username: string, password: string): Promise<void> {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      username,
      password_hash: hashedPassword,
      role: 'admin',
    });
  }
}

export default new AuthService();
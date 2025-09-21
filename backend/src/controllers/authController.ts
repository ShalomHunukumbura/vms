import { Request, Response } from 'express';
import authService from '../services/authService';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const result = await authService.login({ username, password });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const result = await authService.register({ username, password });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    });
  }
};

export const createInitialAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    await authService.createAdmin(username, password);

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('exists')) {
        return res.status(400).json({ success: false, error: error.message });
      }
      return res.status(500).json({ success: false, error: error.message });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create admin',
    });
  }
};
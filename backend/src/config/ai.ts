import axios from "axios";

export type AIProvider = 'grok' | 'groq' | 'gemini' | 'ollama';

export interface AIConfig {
    provider: AIProvider;
    apiKey?: string;
    baseURL: string;
    model: string;
}

// Get AI provider from environment or default to 'grok'
const getAIProvider = (): AIProvider => {
    const provider = process.env.AI_PROVIDER as AIProvider;
    return provider || 'grok';
};

const configs: Record<AIProvider, AIConfig> = {
    grok: {
        provider: 'grok',
        apiKey: process.env.GROK_API_KEY,
        baseURL: 'https://api.x.ai/v1',
        model: 'grok-beta'
    },
    groq: {
        provider: 'groq',
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
        model: 'mixtral-8x7b-32768'
    },
    gemini: {
        provider: 'gemini',
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta',
        model: 'gemini-pro'
    },
    ollama: {
        provider: 'ollama',
        baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        model: 'llama2'
    }
};

const currentProvider = getAIProvider();
const aiConfig = configs[currentProvider];

export const aiClient = axios.create({
    baseURL: aiConfig.baseURL,
    headers: {
        'Authorization': aiConfig.apiKey ? `Bearer ${aiConfig.apiKey}` : undefined,
        'Content-Type': 'application/json'
    }
});

export default aiConfig;
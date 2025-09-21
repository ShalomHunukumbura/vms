import { aiClient } from "../config/ai";
import aiConfig, { AIProvider } from "../config/ai";

export interface VehicleData {
  type: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  engine_size: string;
  price: number;
}

interface AIResponse {
  choices?: Array<{
    message: {
      content: string;
    };
  }>;
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  response?: string;
}

class AIService {
  private createPrompt(vehicleData: VehicleData): string {
    return `Create an engaging, professional sales description for this vehicle:

Vehicle Details:
- Type: ${vehicleData.type}
- Brand: ${vehicleData.brand}
- Model: ${vehicleData.model}
- Year: ${vehicleData.year}
- Color: ${vehicleData.color}
- Engine: ${vehicleData.engine_size}
- Price: $${vehicleData.price.toLocaleString()}

Requirements:
- 2-3 paragraphs (150-200 words)
- Highlight key features and benefits
- Use persuasive but professional language
- Include emotional appeal
- Focus on value proposition
- Make it sound exciting and desirable

Generate a compelling description that would attract potential buyers:`;
  }

  private getFallbackDescription(vehicleData: VehicleData): string {
    return `Experience the perfect blend of performance and style with this ${vehicleData.year} ${vehicleData.brand} ${vehicleData.model}. This stunning ${vehicleData.color} ${vehicleData.type} features a powerful ${vehicleData.engine_size} engine that delivers both efficiency and excitement on every drive.

With its sleek design and premium features, this vehicle offers exceptional value at $${vehicleData.price.toLocaleString()}. Whether you're commuting to work or embarking on weekend adventures, this ${vehicleData.brand} ${vehicleData.model} provides the reliability and sophistication you deserve.

Don't miss this opportunity to own a vehicle that combines cutting-edge technology with timeless style. Contact us today to schedule a test drive and experience the difference for yourself!`;
  }

  async generateDescription(vehicleData: VehicleData): Promise<string> {
    try {
      const prompt = this.createPrompt(vehicleData);
      let response;

      switch (aiConfig.provider) {
        case 'openrouter':
        case 'grok':
        case 'groq':
          response = await aiClient.post('/chat/completions', {
            model: aiConfig.model,
            messages: [
              {
                role: "system",
                content: "You are a professional automotive sales copywriter specializing in creating compelling vehicle descriptions that drive sales.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: 300,
            temperature: 0.7,
          });
          break;

        case 'gemini':
          response = await aiClient.post(`/models/${aiConfig.model}:generateContent?key=${aiConfig.apiKey}`, {
            contents: [{
              parts: [{
                text: `You are a professional automotive sales copywriter. ${prompt}`
              }]
            }],
            generationConfig: {
              maxOutputTokens: 300,
              temperature: 0.7,
            }
          });
          break;

        case 'ollama':
          response = await aiClient.post('/api/generate', {
            model: aiConfig.model,
            prompt: `You are a professional automotive sales copywriter. ${prompt}`,
            stream: false,
            options: {
              num_predict: 300,
              temperature: 0.7,
            }
          });
          break;

        default:
          throw new Error(`Unsupported AI provider: ${aiConfig.provider}`);
      }

      const aiResponse: AIResponse = response.data as AIResponse;
      let description: string | undefined;

      // Extract description based on provider response format
      switch (aiConfig.provider) {
        case 'openrouter':
        case 'grok':
        case 'groq':
          description = aiResponse.choices?.[0]?.message?.content?.trim();
          break;
        case 'gemini':
          description = aiResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          break;
        case 'ollama':
          description = aiResponse.response?.trim();
          break;
      }

      if (!description) {
        console.log('Empty AI response, using fallback description');
        return this.getFallbackDescription(vehicleData);
      }

      return description;
    } catch (error) {
      console.error(`${aiConfig.provider} API error:`, error);
      console.log('Falling back to default description generation');
      return this.getFallbackDescription(vehicleData);
    }
}

}

export default new AIService();

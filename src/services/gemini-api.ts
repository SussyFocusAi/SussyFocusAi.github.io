// src/lib/gemini-api.ts
import { Message, Task, GeminiApiCallParams } from '../types/index';

// 🔑 API Key is checked via environment variable in the consumer module
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

/**
 * Calls the Google Gemini API to get a productivity coach response.
 * @param params - Contains all necessary context: user message, image, history, tasks, and goal.
 * @returns The AI's response text.
 */
export const callGeminiAPI = async ({
    userMessage,
    imageData,
    messages,
    tasks,
    currentGoal,
}: GeminiApiCallParams): Promise<string> => {

    if (!API_KEY) {
        return "⚠️ API Key is missing. Please check your environment variables (NEXT_PUBLIC_GEMINI_API_KEY).";
    }

    try {
        const contextInfo: string[] = [];
        if (tasks.length > 0) {
            contextInfo.push(`Current tasks: ${tasks.map(t => `${t.completed ? '✓' : '○'} ${t.text}`).join(', ')}`);
        }
        if (currentGoal) {
            contextInfo.push(`Current goal: ${currentGoal}`);
        }

        // IMPROVED SYSTEM PROMPT for better structure and adherence
        const systemPrompt = `You are an **elite AI productivity coach and task management assistant**. Your primary functions are:
1. Break down complex user requests into **actionable tasks** (format tasks as numbered or bulleted lists).
2. Help the user define and **focus on one clear goal**.
3. Provide encouraging, concise, and structured advice.
4. Integrate visual input (images) into your productivity strategy.

${contextInfo.length > 0 ? '--- Current Context ---\n' + contextInfo.join('\n') : ''}

Always respond in a **friendly, motivating, and highly organized manner**. If asked for tasks, always provide them in a clear list format.`;

        // Build conversation history (last 5 messages for context)
        const conversationHistory = messages.slice(-5).map(m =>
            `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`
        ).join('\n');

        const fullPrompt = `${systemPrompt}

${conversationHistory ? 'Previous conversation:\n' + conversationHistory + '\n\n' : ''}User: ${userMessage}`;

        // Prepare the request body parts
        const parts: any[] = [];

        if (imageData) {
            const [meta, base64Data] = imageData.split(',');
            const mimeTypeMatch = meta.match(/data:(.*?);/);
            const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';

            parts.push({
                inline_data: {
                    mime_type: mimeType,
                    data: base64Data
                }
            });
        }

        parts.push({ text: fullPrompt });

        const model = 'gemini-2.5-flash';

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: parts
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API detailed error:", errorData);
            throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No response from Gemini API');
        }

        return data.candidates[0].content.parts[0].text;

    } catch (error: any) {
        console.error('Gemini API error:', error);
        return `I encountered an error: ${error.message}. Please ensure your API key is correct and the network is working.`;
    }
};
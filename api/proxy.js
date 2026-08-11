export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is missing' });
    }

    // Вставляем твой ключ прямо сюда
    const apiKey = "AQ.Ab8RN6JH5mahUV6_XKchQNno0x4mEhAmlbv2EC6dPixeyD0o5A";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Пустой ответ от модели";

    return res.status(200).json({ answer: answer });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

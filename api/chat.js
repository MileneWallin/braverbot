export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Endast POST tillåts' });
  }

  const { message, context } = req.body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: context || 'Du är en vänlig hundcoach från Braver Dogs.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || '(Inget svar)';
  res.status(200).json({ reply });
}

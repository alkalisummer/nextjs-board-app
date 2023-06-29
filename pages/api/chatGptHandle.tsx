import { NextApiRequest, NextApiResponse } from 'next';

export default async function chatGptHandle(request: NextApiRequest, response: NextApiResponse) {
  const openai = require('openai');

  const client = new openai.OpenAIApiClient({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const chatParams = {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,

    messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
  };

  await client
    .complete(chatParams)
    .then((res: any) => {
      const message = res.data.choices[0].message;
      console.log('Assistant:', message.content);
    })
    .catch((err: any) => {
      console.error('Error:', err);
    });

  return <div>chatGpt</div>;
}

import OpenAI from 'openai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { memoryTitle, memoryContext } = req.body;

  if (!memoryTitle || !memoryContext) {
    return res.status(400).json({ error: 'Missing memoryTitle or memoryContext' });
  }

  try {
    const prompt = `
      Buatkan satu kalimat caption yang sangat estetik, puitis, sedikit melankolis tapi keren (anak senja/indie style)
      tentang kenangan sekolah jurusan DKV (Desain Komunikasi Visual).

      Topik: "${memoryTitle}"
      Konteks: "${memoryContext}"

      Instruksi:
      - Gunakan Bahasa Indonesia gaul/slang dikit tapi puitis.
      - Maksimal 20 kata.
      - Berikan variasi yang unik dan tidak klise.
      - Tanpa tanda kutip.
    `;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
      max_tokens: 100,
      stream: false,
    });

    const result = completion.choices[0]?.message?.content;

    if (!result) {
      throw new Error("No result from API");
    }

    return res.status(200).json({ quote: result.trim() });
  } catch (error: any) {
    console.error("Nvidia API Error:", error);
    return res.status(500).json({ error: 'Failed to generate quote' });
  }
}

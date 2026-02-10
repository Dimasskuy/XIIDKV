import OpenAI from 'openai';

// Konfigurasi Nvidia API (OpenAI Compatible)
const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
  dangerouslyAllowBrowser: true // Diperlukan untuk client-side request
});

// Daftar fallback jika API gagal/error, agar teks tidak selalu sama
const FALLBACK_QUOTES = [
  "Jejak langkah kita mungkin hilang, tapi ceritanya abadi di memori.",
  "Masa depan adalah misteri, tapi masa lalu kita adalah karya seni.",
  "Bukan tentang tempatnya, tapi dengan siapa kita menghabiskan waktu.",
  "Setiap sudut sekolah ini menyimpan tawa renyah kita.",
  "Terima kasih untuk setiap detik yang berharga, kawan.",
  "Kita pernah ada di sini, melukis mimpi di kanvas yang sama.",
  "Waktu berlalu, tapi rasa persahabatan ini tetap valid.",
  "Sahabat adalah palet warna yang melengkapi hidup kita.",
  "Sampai jumpa di kesuksesan kita masing-masing, jangan lupa pulang.",
  "Kenangan ini lebih mahal daripada tugas DKV yang menumpuk.",
  "Satu frekuensi, satu cerita, selamanya 3 DKV.",
  "Langit senja jadi saksi bisu kenakalan kita."
];

export const generateNostalgicQuote = async (memoryTitle: string, memoryContext: string): Promise<string> => {
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
      temperature: 1, // Naikkan temperatur agar hasil lebih variatif
      max_tokens: 100,
      stream: false,
    });

    const result = completion.choices[0]?.message?.content;
    
    if (!result) {
      throw new Error("No result from API");
    }

    return result.trim();

  } catch (error) {
    console.error("Nvidia API Error (using fallback):", error);
    // Jika error, ambil salah satu quote secara acak dari daftar fallback
    // Ini menjawab kenapa teks "tetap sama" -> karena sebelumnya hanya return 1 string fix.
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    return FALLBACK_QUOTES[randomIndex];
  }
};
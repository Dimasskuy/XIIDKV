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
    const response = await fetch('/api/generate-quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memoryTitle, memoryContext }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch quote from API');
    }

    const data = await response.json();
    return data.quote;

  } catch (error) {
    console.error("API Error (using fallback):", error);
    // Jika error, ambil salah satu quote secara acak dari daftar fallback
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    return FALLBACK_QUOTES[randomIndex];
  }
};

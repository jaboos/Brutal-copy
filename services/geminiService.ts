import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
Jsi "Brutal Copy Auditor". Jsi elitní editor, který nenávidí korporátní marketingový bullshit, klišé a vatu. 
Tvým úkolem je vzít text a přetvořit ho na poctivé řemeslo, které má koule.

Pravidla pro tvou práci:
1. ŽÁDNÝ BALAST: Slova jako "řešení", "unikátní", "komplexní" nebo "naším cílem je" okamžitě smaž.
2. LIDSKOST: Piš přímo, srozumitelně a bez pózy. Klidně začínej věty „A“ nebo „Ale“. 
3. PŘÍSNOST: Pokud je headline nebo myšlenka slabá, řekni to na rovinu. Nesouhlas, když je to na místě.
4. KONTEXT: Rozlišuj mezi civilním, drsným stylem (barbershop) a odborným, srozumitelným stylem (stavebnictví).
5. STRUKTURA: Méně slov, více smyslu. Opravuj logiku i copy.

Výstup musí být v češtině a v JSON formátu:
- score: 0-100 (Brutal Score). Buď přísný, 100 dostane jen geniální text.
- critique: 1-2 věty. Buď upřímný, sarkastický, jdi k jádru věci. Žádné mazání medu kolem pusy.
- variations: pole 3 objektů:
    1. Direct: Úderné, krátké, okamžitá výzva k akci.
    2. Story/Hook: Začni silným háčkem, který vzbudí zvědavost.
    3. Conflict: Postav problém proti řešení nebo zpochybni status quo.
`;

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  
  if (!apiKey) {
    throw new Error("API klíč nebyl nalezen. Zkontrolujte nastavení VITE_API_KEY ve Vercelu.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const model = ai.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION 
  });

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            critique: { type: Type.STRING },
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["title", "content", "explanation"]
              }
            }
          },
          required: ["score", "critique", "variations"]
        }
      }
    });

    const response = await result.response;
    const resultText = response.text();
    
    if (!resultText) {
      throw new Error("Žádný obsah nebyl vygenerován.");
    }
    
    return JSON.parse(resultText) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Nepodařilo se provést analýzu. Zkus to znovu a lépe.");
  }
};

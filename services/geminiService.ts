
import { GoogleGenAI, Type } from "@google/genai";
import { TradingSignal, UserInput } from "../types";

const SYSTEM_PROMPT = `You are an AI trading signal engine for a SaaS product called QuantAI Trading Engine.
You generate simple, practical, and educational trading setups for Forex, Gold (XAUUSD), and major crypto pairs like BTCUSDT and ETHUSDT.
These outputs are not financial advice and must never be presented as guaranteed or high‑certainty predictions.

### Core behavior
1. Work only with the parameters provided by the user: market type, symbol, timeframe, capital, max risk percent, and (optionally) higher‑timeframe trend or bias.
2. If key information is missing or unclear (invalid symbol, missing capital/risk %, strange timeframe), ask 1–2 short clarification questions before giving a signal.
3. Use simple, explainable technical logic:
   - Higher‑timeframe trend direction (if provided).
   - Key support and resistance levels.
   - Recent swing highs and lows.
   - Basic structures: breakout, pullback, or rejection from a level.
   - Risk–reward ratio.
4. Prefer high‑quality setups over frequent signals:
   - Prioritise trades where approximate risk–reward is around 1:2 or better.
   - If market conditions look choppy, news‑driven, or unclear, it is better to return a no‑trade signal than to force a weak idea.
5. Keep language short, direct, and beginner‑friendly. Explain logic in plain English.

### Market & symbol rules
- Supported market types and example symbols:
  - Crypto: BTCUSDT, ETHUSDT, SOLUSDT, XRPUSDT.
  - Forex: EURUSD, GBPUSD, USDJPY, USDCAD, AUDUSD, NZDUSD.
  - Commodity / Metals: XAUUSD (Gold), XAGUSD (Silver), UKOIL, USOIL.
- If the user provides an unsupported or unknown symbol for the chosen market type:
  - Set "direction": "no-trade".
  - Use reason and warnings to briefly explain that the symbol is not recognised and suggest 2–3 valid alternatives for that market type.

### Risk management & quality filter
- Always assume the user wants to risk at most the given percentage of their account capital on a single trade.
- If capital or risk percent is missing, ask for those values before giving a position size.
- Avoid setups with very tight stops that are unrealistic for the timeframe.
- Prefer trades in the direction of the higher‑timeframe trend when that information is provided.
- It is acceptable and often preferable to return direction = "no-trade" when:
  - price is stuck in a tight range with no clear structure,
  - risk–reward is worse than approximately 1:1.5, or
  - there is no logical place for a stop‑loss.

### Use of Python / code execution
When useful and available, you may internally use Python code execution to:
- calculate risk_amount_usd = capital * (max_risk_percent / 100), and
- estimate position size or quantity using position_size = risk_amount_usd / abs(entry_price - stoploss).
Round the position size to a reasonable number of decimals.
Do not show Python code or intermediate calculations in the final answer. Only use them to fill the position_size_hint field with a human‑readable description.

### Output format (strict JSON, SaaS‑friendly)
Your final response must ALWAYS be exactly one JSON object in this flat structure, with no extra keys and no text before or after:
{
  "direction": "buy or sell or no-trade",
  "entry_zone": "single price or small range like '91750 - 91850'",
  "stoploss": "numeric price level",
  "targets": ["TP1 price", "TP2 price"],
  "position_size_hint": "very short text describing risk amount and approximate size, e.g. 'Risk $10 (1% of $1000); approx 0.0077 BTC'",
  "rr_ratio": "risk:reward ratio like '1:2.0' or '1:2.5'",
  "reason": "1–3 short sentences explaining why this setup is valid (trend, levels, structure)",
  "warnings": "1–2 short risk warnings or conditions to avoid or exit this trade"
}

### Additional constraints
- Never promise a specific win rate or probability (such as 70% or 80%). Instead, focus on selecting only relatively clean, high‑quality setups and clearly explaining the logic and risks.
- Never change field names or JSON structure, even if the user prompt is messy.
- Keep reason and warnings compact so they fit cleanly inside a SaaS dashboard card.`;

export const generateSignal = async (input: UserInput): Promise<TradingSignal | string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Use the parameters below to generate one high‑quality trading setup.
Prefer a clean structure and an approximate risk–reward of 1:2 or better; if conditions are messy, return no-trade.
Use Python code execution if needed for accurate risk and position size numbers.

Parameters:
- Market type: ${input.marketType}
- Symbol: ${input.symbol}
- Timeframe: ${input.timeframe}
- Higher‑timeframe trend/bias (optional): ${input.htfTrend || 'Not provided'}
- Account capital: ${input.capital} USD
- Max risk per trade: ${input.risk}%

Return only the JSON object defined in the system instructions.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            direction: { type: Type.STRING },
            entry_zone: { type: Type.STRING },
            stoploss: { type: Type.STRING },
            targets: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            position_size_hint: { type: Type.STRING },
            rr_ratio: { type: Type.STRING },
            reason: { type: Type.STRING },
            warnings: { type: Type.STRING },
          },
          required: ["direction", "entry_zone", "stoploss", "targets", "position_size_hint", "rr_ratio", "reason", "warnings"]
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response text from AI");
    
    try {
      const data = JSON.parse(text);
      
      // If the model asks a clarification question instead of a JSON or inside the JSON reason
      if (data.direction === "no-trade" && (data.reason.toLowerCase().includes("?") || data.reason.toLowerCase().includes("clarify") || data.reason.toLowerCase().includes("please provide"))) {
         return data.reason;
      }
      
      return {
        ...data,
        timestamp: new Date().toLocaleTimeString(),
        symbol: input.symbol
      };
    } catch (e) {
      return text.trim();
    }
  } catch (error: any) {
    console.error("Error generating signal:", error);
    return "I encountered an error processing the market data. This could be due to connectivity or symbol recognition issues.";
  }
};

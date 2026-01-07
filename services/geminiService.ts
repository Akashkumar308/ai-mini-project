
import { GoogleGenAI, Type } from "@google/genai";
import { Bill, Product, StockLog, User } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export interface AiAnalysisResult {
  billingValidation: string;
  stockStatus: string;
  lowStockAlerts: string;
  restockingRecommendations: string;
  salesAnalysis: string;
  salesPrediction: string;
  gstGuidance: string;
  chatbotResponse: string;
  invoiceSummary: string;
  loginValidationStatus: string;
  uiAuditStatus: string;
  registrationStatus: string;
  userDataStorageStatus: string;
  settingsStatus: string;
}

export const getAiAnalysis = async (
  userQuestion: string,
  currentBill: Partial<Bill>,
  products: Product[],
  billingHistory: Bill[],
  stockHistory: StockLog[],
  user: User
): Promise<AiAnalysisResult> => {
  const systemInstruction = `
    You are an intelligent AI assistant for "Bike Ledgers", an Indian bike spare parts billing and stock system.
    
    Responsibilities:
    1. REGISTRATION & LOGIN: Acknowledge user lifecycle. Current company: ${user.companyName}.
    2. SETTINGS & GSTIN: Users can now manage their Company Name, Location, and GSTIN (GST Number) in the Settings tab. Ensure the GSTIN is mentioned as correctly stored.
    3. BILLING: Validate quantities, pricing, calculation accuracy, and tax norms. Ensure Invoice Prefix is used correctly.
    4. STOCK: Suggest restocking based on trends. Check if Low Stock Alerts are enabled in user settings: ${user.lowStockAlertsEnabled}.
    5. SALES: Predict revenue and identify fast/slow movers.
    6. GST: Advise on 5%, 12%, 18%, 28% categories. Suggest default GST % from user settings: ${user.defaultGstRate}%.
    7. SMART CHATBOT: Provide actionable "Fix Suggestions" and "Feature working as expected" reports.

    Rules:
    - Language: Concise, professional, Indian business context.
    - Status: If a feature is healthy, state "Feature working as expected".
    - UI: Always emphasize high contrast for visibility.
    - Currency: ₹ (INR).
  `;

  const inputData = {
    userProfile: {
      email: user.email,
      company: user.companyName,
      location: user.companyLocation,
      gstin: user.gstin || 'Not set',
      settings: {
        defaultGst: user.defaultGstRate,
        prefix: user.invoicePrefix,
        alerts: user.lowStockAlertsEnabled
      }
    },
    productStockData: products.map(p => ({ name: p.name, stock: p.stock, min: p.minThreshold })),
    currentBill: {
      items: currentBill.items || [],
      subtotal: currentBill.subtotal || 0,
      gst: currentBill.gstAmount || 0,
      total: currentBill.total || 0
    },
    billingHistory: billingHistory.slice(-20),
    stockHistory: stockHistory.slice(-20),
    userQuestion
  };

  const prompt = `
    Audit the current state for ${user.companyName}.
    User Question: "${userQuestion || 'General Business Audit'}"
    Context: ${JSON.stringify(inputData)}
    Provide a comprehensive analysis in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            billingValidation: { type: Type.STRING },
            stockStatus: { type: Type.STRING },
            lowStockAlerts: { type: Type.STRING },
            restockingRecommendations: { type: Type.STRING },
            salesAnalysis: { type: Type.STRING },
            salesPrediction: { type: Type.STRING },
            gstGuidance: { type: Type.STRING },
            chatbotResponse: { type: Type.STRING },
            invoiceSummary: { type: Type.STRING },
            loginValidationStatus: { type: Type.STRING },
            uiAuditStatus: { type: Type.STRING },
            registrationStatus: { type: Type.STRING },
            userDataStorageStatus: { type: Type.STRING },
            settingsStatus: { type: Type.STRING }
          },
          required: [
            "billingValidation", 
            "stockStatus", 
            "lowStockAlerts", 
            "restockingRecommendations", 
            "salesAnalysis", 
            "salesPrediction", 
            "gstGuidance", 
            "chatbotResponse",
            "invoiceSummary",
            "loginValidationStatus",
            "uiAuditStatus",
            "registrationStatus",
            "userDataStorageStatus",
            "settingsStatus"
          ]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
};

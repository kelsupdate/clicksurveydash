// src/utils/mpesaParser.js
export const parseMpesaMessage = (message) => {
  // Extract amount (handles formats like "Ksh1,000.00" or "Ksh 1000")
  const amountRegex = /Ksh\s?([\d,]+(\.\d{2})?)/;
  const amountMatch = message.match(amountRegex);
  
  // Extract till name (handles "Paybill" or "Till Number" formats)
  const tillRegex = /(Paybill|Till Number):\s*([^\n,]+)/i;
  const tillMatch = message.match(tillRegex);
  
  if (!amountMatch || !tillMatch) return null;
  
  return {
    amount: parseFloat(amountMatch[1].replace(/,/g, '')),
    tillName: tillMatch[2].trim()
  };
};

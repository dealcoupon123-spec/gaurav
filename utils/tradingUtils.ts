
export const calculatePositionSize = (
  capital: number,
  riskPercent: number,
  entry: number,
  stopLoss: number,
  marketType: string
): string => {
  if (isNaN(entry) || isNaN(stopLoss) || entry === stopLoss) return "N/A";
  
  const riskAmount = capital * (riskPercent / 100);
  const distance = Math.abs(entry - stopLoss);
  
  if (marketType === 'Forex') {
    // Basic calculation for 1 lot = 100,000 units. 
    // Pip calculation varies, but this is a simplified 'lot sizing' idea.
    const lots = riskAmount / (distance * 100000); 
    return `${lots.toFixed(2)} Lots`;
  } else if (marketType === 'Commodity' && entry > 1000) { // Likely Gold
    const contracts = riskAmount / distance;
    return `${contracts.toFixed(2)} Oz/Units`;
  } else {
    // Crypto / Spot
    const units = riskAmount / distance;
    return `${units.toFixed(4)} Units`;
  }
};

export const parsePrice = (priceStr: string): number => {
  const match = priceStr.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : NaN;
};

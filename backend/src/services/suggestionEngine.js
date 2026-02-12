/**
 * Suggestion engine – returns a single immediate, doable action.
 */
function generateSuggestion({ timeOfDay, contextSnapshot }) {
  const { steps, sleepHours } = contextSnapshot || {};

  // Base candidates
  const candidates = [];

  // If steps are low, prioritize walk
  if (steps == null || steps < 5000) {
    candidates.push('Take a 10-minute brisk walk in the next hour.');
  }

  // If sleep is low, gentle suggestion
  if (sleepHours != null && sleepHours < 6) {
    candidates.push('Aim to wind down 30 minutes earlier tonight to support recovery.');
  }

  // Time-of-day specific
  if (timeOfDay === 'night') {
    candidates.push('Have a protein-rich snack (like paneer, nuts, or Greek yogurt) instead of more sweets.');
  } else if (timeOfDay === 'afternoon') {
    candidates.push('Pair your next chai or snack with some protein to smooth the sugar spike.');
  }

  // Generic fallbacks
  if (candidates.length === 0) {
    candidates.push('Drink a full glass of water and add a short 5–10 minute walk.');
  }

  // Always return ONE primary action
  return candidates[0];
}

module.exports = { generateSuggestion };


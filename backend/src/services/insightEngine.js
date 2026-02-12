/**
 * Simple rule-based insight engine (MVP).
 * Uses sleep, steps, time of day, and sugarEstimate to craft 1–2 lines of feedback.
 */
function generateInsight({ sugarEstimate, timeOfDay, contextSnapshot }) {
  const { sleepHours, steps } = contextSnapshot || {};

  // Baseline intensity bucket
  let intensity = 'moderate';
  if (sugarEstimate <= 10) intensity = 'low';
  else if (sugarEstimate >= 25) intensity = 'high';

  const messages = [];

  // Sleep rule: If sleep < 6 and sugar at night
  if (sleepHours != null && sleepHours < 6 && timeOfDay === 'night') {
    messages.push(
      'Your sleep was short and you logged sugar late at night, which can make recovery and next-day energy harder.'
    );
  }

  // Steps rule: low steps + afternoon sugar
  if (steps != null && steps < 4000 && timeOfDay === 'afternoon') {
    messages.push(
      'Today’s steps are on the lower side; adding sugar in the afternoon can lead to an energy dip later.'
    );
  }

  // Intensity-based filler
  if (intensity === 'high') {
    messages.push('This was a higher-sugar choice; your body will need extra support to keep glucose stable.');
  } else if (intensity === 'low') {
    messages.push('This is a relatively lighter sugar choice—nice job keeping things in check.');
  } else {
    messages.push('This is a moderate sugar hit—what you do next can smooth the spike.');
  }

  // Deduplicate and return a compact insight string
  const unique = [...new Set(messages)].filter(Boolean);
  return unique.join(' ');
}

module.exports = { generateInsight };


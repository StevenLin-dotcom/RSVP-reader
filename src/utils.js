/**
 * RSVP Utility Functions
 * Shared utility functions for RSVP reader
 */

/**
 * Parse text into word array
 */
function parseText(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }
  return text.trim().split(/\s+/).filter(word => word.length > 0);
}

/**
 * Update word info display
 */
function updateWordInfo(word, renderer, wordInfoElement) {
  if (!wordInfoElement || !renderer) {
    return;
  }

  const parts = renderer._splitWord(word);
  const cleanWord = word.replace(/^["""'''`([{<¿¡]+/, '');
  const orpIndex = renderer._getORPIndex(cleanWord);
  
  wordInfoElement.innerHTML = 
    `Word: "${word}" | Length: ${word.length} | ORP Index: ${orpIndex}<br>` +
    `Parts: ["${parts.before}"] [<span style="color:#ff6b6b">${parts.orp}</span>] ["${parts.after}"]`;
}

/**
 * Convert WPM to milliseconds per word
 */
function wpmToMs(wpm) {
  return 60000 / wpm;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseText,
    updateWordInfo,
    wpmToMs
  };
}

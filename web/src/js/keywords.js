// Words that trigger audio alerts when seen in chat messages, e.g. "#fire" or "fire".
export const FUN_WORDS = ['duck', 'boom', 'wub']
export const EMERGENCY_WORDS = ['emergency', 'fire']

function escapeRegExp(word) {
  return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildRegex(words) {
  return new RegExp('#(' + words.map(escapeRegExp).join('|') + ')\\b', 'gi')
}

const funRe = buildRegex(FUN_WORDS)
const emergencyRe = buildRegex(EMERGENCY_WORDS)

// Returns [{ word, category }] for every trigger word found in text.
// Only matches hashtagged words (e.g. "#fire"), not bare "fire".
export function findTriggers(text) {
  if (!text) return []
  var triggers = []

  funRe.lastIndex = 0
  var m
  while ((m = funRe.exec(text))) {
    triggers.push({ word: m[1].toLowerCase(), category: 'fun' })
  }

  emergencyRe.lastIndex = 0
  while ((m = emergencyRe.exec(text))) {
    triggers.push({ word: m[1].toLowerCase(), category: 'emergency' })
  }

  return triggers
}

// Commands that speak the rest of the message aloud (via the browser's TTS)
// instead of playing a sound effect. Must be the very first thing in the message.
export const SPEAK_WORDS = { fun: ['speak', 'fun'], emergency: ['emergency', 'yell'] }

const speakRe = new RegExp(
  '^!(' + SPEAK_WORDS.fun.concat(SPEAK_WORDS.emergency).map(escapeRegExp).join('|') + ')\\s+(\\S[\\s\\S]*)$',
  'i'
)

// Returns { category, text } if the message starts with a speak command
// (e.g. "!speak the stage is on fire"), otherwise null.
export function findSpeechCommand(text) {
  if (!text) return null
  var m = speakRe.exec(text)
  if (!m) return null
  var word = m[1].toLowerCase()
  var category = SPEAK_WORDS.fun.indexOf(word) !== -1 ? 'fun' : 'emergency'
  return { category: category, text: m[2] }
}

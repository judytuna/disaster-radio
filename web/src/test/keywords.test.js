import { describe, it, expect } from 'vitest'
import { findTriggers, findSpeechCommand } from '../js/keywords.js'

describe('findTriggers', () => {
  it('matches a hashtagged fun word', () => {
    expect(findTriggers('somebody say #boom')).toEqual([{ word: 'boom', category: 'fun' }])
  })

  it('matches a hashtagged emergency word', () => {
    expect(findTriggers('there is a #fire near stage 2')).toEqual([{ word: 'fire', category: 'emergency' }])
  })

  it('does not match a bare word without a hashtag', () => {
    expect(findTriggers('somebody say boom')).toEqual([])
    expect(findTriggers('there is a fire near stage 2')).toEqual([])
  })

  it('is case-insensitive', () => {
    expect(findTriggers('#DUCK #duck #DuCk')).toEqual([
      { word: 'duck', category: 'fun' },
      { word: 'duck', category: 'fun' },
      { word: 'duck', category: 'fun' },
    ])
  })

  it('does not match trigger words as substrings of other hashtags', () => {
    expect(findTriggers('#backfire')).toEqual([])
  })

  it('finds multiple distinct triggers in one message', () => {
    expect(findTriggers('#emergency there is also a #wub going on')).toEqual([
      { word: 'wub', category: 'fun' },
      { word: 'emergency', category: 'emergency' },
    ])
  })

  it('returns an empty array for messages with no triggers', () => {
    expect(findTriggers('<judy> hello everyone')).toEqual([])
  })

  it('returns an empty array for empty/undefined input', () => {
    expect(findTriggers('')).toEqual([])
    expect(findTriggers(undefined)).toEqual([])
  })
})

describe('findSpeechCommand', () => {
  it('matches !speak on the fun channel', () => {
    expect(findSpeechCommand('!speak the stage is on fire')).toEqual({
      category: 'fun',
      text: 'the stage is on fire',
    })
  })

  it('matches !fun as an alias for !speak', () => {
    expect(findSpeechCommand('!fun woohoo party time')).toEqual({
      category: 'fun',
      text: 'woohoo party time',
    })
  })

  it('matches !emergency on the emergency channel', () => {
    expect(findSpeechCommand('!emergency evacuate the north tent')).toEqual({
      category: 'emergency',
      text: 'evacuate the north tent',
    })
  })

  it('matches !yell as an alias for !emergency', () => {
    expect(findSpeechCommand('!yell everybody get out now')).toEqual({
      category: 'emergency',
      text: 'everybody get out now',
    })
  })

  it('is case-insensitive', () => {
    expect(findSpeechCommand('!SPEAK hello')).toEqual({ category: 'fun', text: 'hello' })
  })

  it('only matches at the very start of the message', () => {
    expect(findSpeechCommand('hey everyone !speak testing')).toBeNull()
    expect(findSpeechCommand('<judy> !yell fire')).toBeNull()
  })

  it('does not match a command word as a prefix of another word', () => {
    expect(findSpeechCommand('!speaking too fast')).toBeNull()
    expect(findSpeechCommand('!funny business here')).toBeNull()
  })

  it('requires text after the command', () => {
    expect(findSpeechCommand('!speak')).toBeNull()
    expect(findSpeechCommand('!speak   ')).toBeNull()
  })

  it('returns null for messages with no speech command', () => {
    expect(findSpeechCommand('hello everyone')).toBeNull()
  })

  it('returns null for empty/undefined input', () => {
    expect(findSpeechCommand('')).toBeNull()
    expect(findSpeechCommand(undefined)).toBeNull()
  })
})

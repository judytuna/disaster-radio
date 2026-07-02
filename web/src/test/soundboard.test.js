import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('soundboard.handleMessage speech commands', () => {
  let soundboard
  let speakSpy

  beforeEach(async () => {
    vi.resetModules()
    speakSpy = vi.fn()
    global.SpeechSynthesisUtterance = function(text) { this.text = text }
    window.speechSynthesis = { speak: speakSpy }
    soundboard = (await import('../js/soundboard.js')).default
  })

  it('speaks the message after !speak', () => {
    soundboard.handleMessage('!speak testing one two three')
    expect(speakSpy).toHaveBeenCalledTimes(1)
    expect(speakSpy.mock.calls[0][0].text).toBe('testing one two three')
  })

  it('speaks the message after !yell (emergency alias)', () => {
    soundboard.handleMessage('!yell evacuate now')
    expect(speakSpy).toHaveBeenCalledTimes(1)
    expect(speakSpy.mock.calls[0][0].text).toBe('evacuate now')
  })

  it('does not speak if the command is not at the very start', () => {
    soundboard.handleMessage('hey everyone !speak testing')
    expect(speakSpy).not.toHaveBeenCalled()
  })

  it('does not throw and does not speak for ordinary hashtag messages', () => {
    expect(() => soundboard.handleMessage('#boom')).not.toThrow()
    expect(speakSpy).not.toHaveBeenCalled()
  })

  it('does not throw when speechSynthesis is unavailable', () => {
    delete window.speechSynthesis
    expect(() => soundboard.handleMessage('!speak hello')).not.toThrow()
  })
})

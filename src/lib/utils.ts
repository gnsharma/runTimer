import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getDesiredVoice = () => {
	const synth = window.speechSynthesis
	const voices = speechSynthesis.getVoices()

	const desiredLocalVoices: SpeechSynthesisVoice[] = []
	const desiredRemoteVoices: SpeechSynthesisVoice[] = []
	const otherLocalVoices: SpeechSynthesisVoice[] = []
	const otherRemoteVoices: SpeechSynthesisVoice[] = []

	voices.forEach(voice => {
		if (voice.lang === 'hi-IN') {
			if (voice.name === 'Microsoft Kalpana - Hindi (India)') {
				desiredLocalVoices.unshift(voice)
				return
			}

			if (voice.localService) {
				desiredLocalVoices.push(voice)
				return
			}

			desiredRemoteVoices.push(voice)
			return
		}

		if (voice.localService) {
			otherLocalVoices.push(voice)
		} else {
			otherRemoteVoices.push(voice)
		}
	})

	if (desiredLocalVoices.length) {
		return { synth, voice: desiredLocalVoices[0] }
	}

	if (desiredRemoteVoices.length) {
		return { synth, voice: desiredRemoteVoices[0] }
	}

	if (otherLocalVoices.length) {
		return { synth, voice: otherLocalVoices[0] }
	}

	return { synth, voice: otherRemoteVoices[0] }
}

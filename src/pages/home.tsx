/**
 * v0 by Vercel.
 * @see https://v0.dev/t/XJdcxVEKU5e
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client'
import { useEffect, useState } from 'react'

import { Button } from 'components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from 'components/ui/card'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'

import { getDesiredVoice } from 'lib/utils'

const MINUTES_TO_SECONDS = 60
const SECONDS_TO_MILLISECONDS = 1000

const { synth, voice } = getDesiredVoice()

export default function Component() {
	const [elapsedTime, setElapsedTime] = useState(0)
	const [intervalDuration, setIntervalDuration] = useState(0)
	const [isRunning, setIsRunning] = useState(false)
	const [timer, setTimer] = useState<NodeJS.Timeout | undefined>()

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
	}

	const onClickStart = () => {
		if (!intervalDuration) {
			return
		}

		setIsRunning(true)
		const timer = setInterval(
			() => {
				setElapsedTime(prevTime => {
					const notificationText = `${Math.floor(prevTime + intervalDuration)} minutes हो गयी है.`
					const utterThis = new SpeechSynthesisUtterance(notificationText)
					if (voice) {
						utterThis.voice = voice
					}
					synth.speak(utterThis)
					return prevTime + intervalDuration
				})
			},
			intervalDuration * MINUTES_TO_SECONDS * SECONDS_TO_MILLISECONDS
		)
		setTimer(timer)
	}

	const onClickStop = () => {
		setIsRunning(false)
		clearInterval(timer)
	}
	const onClickReset = () => {
		setElapsedTime(0)
		setIntervalDuration(0)
		setIsRunning(false)
		clearInterval(timer)
	}

	useEffect(() => {
		return () => clearInterval(timer)
	}, [timer])

	return (
		<Card className='mx-auto w-full max-w-md'>
			<CardHeader>
				<CardTitle>{'Elapsed Time Announcer'}</CardTitle>
				<CardDescription>
					{'Configure the interval at which elapsed time is announced.'}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form className='grid gap-4' onSubmit={handleSubmit}>
					<div className='grid gap-2'>
						<Label htmlFor='interval'>{'Announcement Interval'}</Label>
						<div className='flex items-center gap-2'>
							<Input
								id='interval'
								type='number'
								value={intervalDuration || ''}
								onChange={event =>
									setIntervalDuration(Number(event.target.value))
								}
								placeholder='Enter minutes'
							/>
							<span className='text-muted-foreground'>{'minutes'}</span>
						</div>
					</div>
					<div className='flex justify-between'>
						{isRunning ? (
							<Button variant='outline' onClick={onClickStop}>
								{'Stop'}
							</Button>
						) : (
							<Button onClick={onClickStart}>{'Start'}</Button>
						)}
						<Button variant='outline' onClick={onClickReset}>
							{'Reset'}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}

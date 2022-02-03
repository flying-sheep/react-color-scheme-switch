import React, {useState} from 'react'

import MoonPath from './crescent-path.js'
import {m, l, a} from './svg-path.js'
import {useSpring, animated} from '@react-spring/web'

const AnimatedMoonPath = animated(MoonPath)

export type State = 'light' | 'dark' | 'auto'

export const states: Array<{name: State; fullness: number; color: string}> = [
	{name: 'light', fullness: 1, color: 'gold'},
	{name: 'auto', fullness: 0.5, color: 'white'},
	{name: 'dark', fullness: 0.2, color: 'lavender'},
]

const state2props = Object.fromEntries(
	states.map(({name, ...props}, i) => [name, {x: i / 2, ...props}]),
)

function relativeCoords(event: React.MouseEvent) {
	const bounds = event.currentTarget.getBoundingClientRect()
	const x = event.clientX - bounds.left
	const y = event.clientY - bounds.top
	return {x, y, w: bounds.width, h: bounds.height}
}

interface ThemeToggleProps {
	height?: number;
	// Colors?: Record<State, string>
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({height = 50}) => {
	const [state, setState] = useState<State>('auto')
	const {color, x, fullness} = useSpring(state2props[state])

	const handleClick = (event: React.MouseEvent) => {
		const {x, w} = relativeCoords(event)
		const idx = Math.floor((x / w) * 3) // TODO: can clicking the last pixel make this go OOB?
		const clickedState = states[idx].name
		// To make the middle state more discoverable,
		// make it always switch to sth. when at the extrema.
		setState(clickedState === state ? states[1].name : clickedState)
	}

	return (
		<svg
			style={{width: `${2 * height}px`, height: `${height}px`}}
			viewBox="0 0 1 1"
			onClick={handleClick}
		>
			<path
				d={`
          ${m(1, 1)}
          ${a(1, 0, 0.3, 0.3)}
          ${l(0, 0)}
          ${a(0, 1, 0.3, 0.3)}
          z
        `}
				fill="dimgray"
			/>
			<AnimatedMoonPath
				fullness={fullness}
				fill={color}
				cx={x}
				cy={0.5}
				transform="scale(.8)"
			/>
		</svg>
	)
}

export default ThemeToggle

import {type CSSProperties, forwardRef, useCallback, useState} from 'react'

import {m, l, a} from './svg-path.js'
import MoonPath from './crescent-path.js'
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

type ThemeToggleProps = {
	// Colors?: Record<State, string>
	readonly onClick?: (event: React.MouseEvent<SVGSVGElement>, state: State) => void;
} & Omit<React.SVGAttributes<SVGSVGElement>, 'viewBox' | 'onClick'>

const ThemeToggle = forwardRef<SVGSVGElement, ThemeToggleProps>(({
	onClick,
	/// SVG
	style = {height: '50px'},
	...svgProps
}, ref) => {
	const [state, setState] = useState<State>('auto')
	const {color, x, fullness} = useSpring(state2props[state])

	const handleClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
		const {x, w} = relativeCoords(event)
		const idx = Math.floor((x / w) * 3) // TODO: can clicking the last pixel make this go OOB?
		const clickedState = states[idx].name
		// To make the middle state more discoverable,
		// make it always switch to sth. when at the extrema.
		const newState = clickedState === state ? states[1].name : clickedState
		setState(newState)
		onClick?.(event, newState)
	}, [onClick, state])

	return (
		<svg
			style={deriveDims(style)}
			viewBox='0 0 1 1'
			onClick={handleClick}
			{...svgProps}
			ref={ref}
		>
			<path
				d={`
					${m(1, 1)}
					${a(1, 0, 0.3, 0.3)}
					${l(0, 0)}
					${a(0, 1, 0.3, 0.3)}
					z
				`}
				fill='dimgray'
			/>
			<AnimatedMoonPath
				fullness={fullness}
				fill={color}
				cx={x}
				cy={0.5}
				transform='scale(.8)'
			/>
		</svg>
	)
})

export default ThemeToggle

function relativeCoords<T extends Element, E extends MouseEvent>(event: React.MouseEvent<T, E>) {
	const bounds = event.currentTarget.getBoundingClientRect()
	const x = event.clientX - bounds.left
	const y = event.clientY - bounds.top
	return {x, y, w: bounds.width, h: bounds.height}
}

function deriveDims(style: CSSProperties): CSSProperties {
	let {height, width, ...rest} = style
	if (height !== undefined && width === undefined) {
		width = `calc(${height} * 2)`
	} else if (height === undefined && width !== undefined) {
		height = `calc(${width} / 2)`
	}

	return {height, width, ...rest}
}

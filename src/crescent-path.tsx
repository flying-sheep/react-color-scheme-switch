import {type SVGProps} from 'react'
import {a, m} from './svg-path.js'

type CrescentPathProps = {
	readonly fullness?: number;
	readonly cx?: number;
	readonly cy?: number;
} & SVGProps<SVGPathElement>

export default function CrescentPath({
	fullness = 1,
	fill = 'white',
	cx = 0,
	cy = 0,
	...props
}: CrescentPathProps): JSX.Element {
	const goToTop = m(0, 0.5)
	const outer = a(0, -0.5, 0.5, 0.5, false)
	const inner = a(0, 0.5, fullness - 0.5, 0.5, fullness < 0.5)
	return (
		<g transform={`translate(${cx} ${cy})`}>
			<path d={`${goToTop}${outer}${inner}z`} fill={fill} {...props}/>
		</g>
	)
}

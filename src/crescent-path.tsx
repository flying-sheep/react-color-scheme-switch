import React from 'react'

import {a, m} from './svg-path'

interface CrescentPathProps extends React.SVGProps<SVGPathElement> {
	fullness?: number;
	cx?: number;
	cy?: number;
}

const CrescentPath: React.FC<CrescentPathProps> = ({
	fullness = 1,
	fill = 'white',
	cx = 0,
	cy = 0,
	...props
}) => {
	const goToTop = m(0, 0.5)
	const outer = a(0.5, 0.5, 0, -0.5, false)
	const inner = a(fullness - 0.5, 0.5, 0, 0.5, fullness < 0.5)
	return (
		<g transform={`translate(${cx} ${cy})`}>
			<path d={`${goToTop}${outer}${inner}z`} fill={fill} {...props}/>
		</g>
	)
}

export default CrescentPath

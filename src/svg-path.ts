export const m = (x: number, y: number) => `M${x} ${y}`
export const l = (x: number, y: number) => `L${x} ${y}`
// https://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands

export const a = (
	x: number,
	y: number,
	rx: number,
	ry: number = rx,
	sweep = false,
) => `A${rx} ${ry} 0 1 ${sweep ? 1 : 0} ${x} ${y}`

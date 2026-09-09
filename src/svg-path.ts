export const m = (x: number, y: number) => `M${x} ${y}`
export const l = (x: number, y: number) => `L${x} ${y}`
// https://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands

/**
 Simplified Arc.
 The SVG syntax is `rx ry x-axis-rotation large-arc-flag sweep-flag x y`.
 @param x X coordinate of target position
 @param y Y coordinate of target position
 @param rx X-radius
 @param ry Y-radius
 @param isClockwise Determines on which side the arc is
 @returns SVG code to use in `<path/>`
 */
export const a = (
	x: number,
	y: number,
	rx: number,
	ry: number = rx,
	isClockwise = false,
// eslint-disable-next-line max-params
) => `A${rx} ${ry} 0 1 ${isClockwise ? 1 : 0} ${x} ${y}`

declare module '*.mdx' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export default function MDXComponent(properties: Record<string, any>): JSX.Element
}

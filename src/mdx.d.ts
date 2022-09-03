declare module '*.mdx' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export default function MDXComponent(props: Record<string, any>): JSX.Element
}

import Head from 'next/head'
import Link from 'next/link'

export default function HeadComponent({ children }) {
	return (
		<>
			<Head>
				<Link href="/">
					<a>Home</a>
				</Link>
			</Head>
			<main>{children}</main>
		</>
	)
}

import '../styles/globals.css'
import HeadComponent from '../components/Head'

function MyApp({ Component, pageProps }) {
	return (
		<>
			<HeadComponent />
			<div style={{ padding: '100px' }}>
				<Component {...pageProps} />
			</div>
		</>
	)
}

export default MyApp

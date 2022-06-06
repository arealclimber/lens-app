import { useEffect, useState } from 'react'
import { client, recommendProfiles } from '../api'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
	const oBlueColor = '#A5C4F3' + '90'
	const [profiles, setProfiles] = useState([])
	useEffect(() => {
		fetchProfiles()
	}, [])

	async function fetchProfiles() {
		try {
			const response = await client.query(recommendProfiles).toPromise()
			console.log({ response })

			setProfiles(response.data.recommendedProfiles)
		} catch (err) {
			console.error(err)
		}
	}

	// To Not rendering anything to see if console log messeage are what we want
	// return null

	// 1703
	// Map over all these profiles and then provide a way to kind of like drill down into each individual profile
	return (
		<div>
			{profiles.map((profile, index) => (
				<Link href={`/profile/${profile.id}`} key={index}>
					<a>
						<div>
							{profile.picutre ? (
								<Image
									alt="Profile Picture"
									src={profile.picture.original.url}
									width={60}
									height={60}
								/>
							) : (
								<div
									style={{
										width: '60px',
										height: '60px',
										backgroundColor: oBlueColor,
										border: '1px solid black',
									}}
								/>
							)}

							<h4>{profile.handle}</h4>
							<p>{profile.bio}</p>
						</div>
					</a>
				</Link>
			))}
		</div>
	)
}

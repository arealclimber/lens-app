import { useEffect, useState } from 'react'
import { client, getPublications, recommendProfiles } from '../api'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
	const oBlueColor = '#A5C4F3' + '90'
	const [profiles, setProfiles] = useState([])
	const [searchString, setSearchString] = useState('')

	useEffect(() => {
		fetchProfiles()
	}, [])

	async function fetchProfiles() {
		try {
			const response = await client.query(recommendProfiles).toPromise()
			console.log({ response })

			const profileData = await Promise.all(
				response.data.recommendedProfiles.map(async (profile) => {
					const pub = await client
						.query(getPublications, { id: profile.id, limit: 1 })
						.toPromise()
					profile.publication = pub.data.publications.items[0]
					return profile
				})
			)

			setProfiles(profileData)
			// console.log(profileData[0].picutre)
		} catch (err) {
			console.error(err)
		}
	}

	// To Not rendering anything to see if console log messeage are what we want
	// return null

	// 1703
	// Map over all these profiles and then provide a way to kind of like drill down into each individual profile

	const blankPhotoStyle = {
		width: '100px',
		height: '100px',
		backgroundColor: oBlueColor,
		border: '1px solid black',
	}

	if (!profiles) return null

	return (
		<div>
			{profiles.map((profile, index) => (
				<Link href={`/profile/${profile.id}`} key={index}>
					<a>
						<div>
							{profile.picture ? (
								profile.picture.original ? (
									<Image
										src={profile.picture.original.url}
										width={100}
										height={100}
										alt="loading..."
									/>
								) : (
									<Image
										src={profile.picture.uri}
										width={100}
										height={100}
										alt="loading..."
									/>
								)
							) : (
								<div style={blankPhotoStyle} />
							)}
							<h2>{profile.id}</h2>

							<h4>{profile.handle}</h4>
							<p>{profile.bio}</p>
							<div
								style={{
									height: '10px',
									backgroundColor: '',
									padding: '20px',
								}}
							/>
						</div>
					</a>
				</Link>
			))}
		</div>
	)
}

import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { client, getProfiles, getPublications } from '../../api'
import Image from 'next/image'
import { ethers } from 'ethers'
import Link from 'next/link'

import ABI from '../../abi.json'
const address = '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'

export default function Profile() {
	const oBlueColor = '#A5C4F3' + '90'

	const [profile, setProfile] = useState()
	const [pubs, setPubs] = useState([])
	const router = useRouter()
	const { id } = router.query

	const blankPhotoStyle = {
		width: '200px',
		height: '200px',
		backgroundColor: oBlueColor,
		border: '1px solid black',
	}

	useEffect(() => {
		if (id) {
			fetchProfile()
		}
	}, [id])

	async function fetchProfile() {
		try {
			const response = await client.query(getProfiles, { id }).toPromise()
			console.log('response: ', response)

			setProfile(response.data.profiles.items[0])

			console.log({ id })

			// const publicationData = await client
			// 	.query(getPublications, {
			// 		request: {
			// 			id,
			// 		},
			// 	})
			// 	.toPromise()
			const publicationData = await client
				.query(getPublications, { id })
				.toPromise()

			console.log({ publicationData })
			setPubs(publicationData.data.publications.items)
			console.log(`Publication Data: ${publicationData}`)
			// console.log(JSON.stringify(publicationData))
			// setPubs(publicationData.)
		} catch (err) {
			console.error(err)
		}
	}

	async function connect() {
		const accounts = await window.ethereum.request({
			method: 'eth_requestAccounts',
		})
		console.log({ accounts })
		// console.log(accounts)
	}

	// FIXME: contract.follow is not a function
	async function followUser() {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()

		const contract = new ethers.Contract(address, ABI, signer)

		try {
			const tx = await contract.follow([id], [0x0])
			await tx.wait()
			console.log(`followed user successfully... ${profile.handle}`)
		} catch (err) {
			// console.error({ err })
			console.error(err)
		}
	}

	if (!profile) return null

	return (
		<div>
			<button onClick={connect}>Connect</button>
			{profile.picture ? (
				profile.picture.original ? (
					<Image
						src={profile.picture.original.url}
						width={200}
						height={200}
						alt="loading..."
					/>
				) : (
					<Image
						src={profile.picture.uri}
						width={200}
						height={200}
						alt="loading..."
					/>
				)
			) : (
				<div style={blankPhotoStyle} />
			)}
			<div>
				<h4>{profile.handle}</h4>
				<p>{profile.bio}</p>
				<p>Followers: {profile.stats.totalFollowers}</p>
				<p>Following: {profile.stats.totalFollowing}</p>
			</div>
			<button onClick={followUser}>Follow</button>
			<div>
				{pubs.map((pub, index) => (
					<div
						key={index}
						style={{ padding: '20px', borderTop: '1px solid #ededed' }}
					>
						{pub.metadata.content}
					</div>
				))}
			</div>
		</div>
	)
}

import {useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import {client, getProfiles} from '../../api'
import Image from 'next/image'

export default function Profile() {
    const router = useRouter()
    const {id} = router.query

    useEffect(() => {
        if (id) {
            fetchProfile()
        }
    }, [id])

    async function fetchProfile() {
        try {
            const response = await client.query(getProfiles, {id}).toPromise()
            console.log('response: ', response)
        } catch (err) {
            console.error(err)
        }
    }


    return (
        <div>
            {id}
        </div>
    )
}




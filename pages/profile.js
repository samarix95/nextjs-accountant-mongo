import { useSession } from 'next-auth/client'
import dynamic from 'next/dynamic'

const UnauthenticatedComponent = dynamic(() =>
    import('../src/Unauthenticated')
)
const AuthenticatedComponent = dynamic(() =>
    import('../src/Authenticated')
)

export default function Profile() {
    const [session, loading] = useSession()

    if (typeof window !== 'undefined' && loading) return <p>Loading...</p>

    if (!session) return <UnauthenticatedComponent />

    return <AuthenticatedComponent user={session.user} />
}
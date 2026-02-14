import { getCases } from '@/actions/cases'
import DashboardClient from '@/components/dashboard-client'

export const dynamic = 'force-dynamic'

export default async function DashboardPage(props) {
    const searchParams = await props.searchParams
    const query = searchParams?.query || ''
    const cases = await getCases(query)

    return (
        <div className="min-h-screen bg-muted/30">
            <DashboardClient initialCases={cases} />
        </div>
    )
}

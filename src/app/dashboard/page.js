import { getCases } from '@/actions/cases'
import DashboardClient from '@/components/dashboard-client'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const cases = await getCases()

    return (
        <div className="min-h-screen bg-muted/30">
            <DashboardClient initialCases={cases} />
        </div>
    )
}

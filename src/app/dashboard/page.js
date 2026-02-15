import { getCases } from '@/actions/cases'
import DashboardClient from '@/components/dashboard-client'

export const dynamic = 'force-dynamic'

export default async function DashboardPage(props) {
    const searchParams = await props.searchParams
    const query = searchParams?.query || ''
    const currentPage = Number(searchParams?.page) || 1
    const pageSize = 10

    const { cases, totalCount } = await getCases(query, currentPage, pageSize)
    const totalPages = Math.ceil(totalCount / pageSize)

    return (
        <DashboardClient
            initialCases={cases}
            totalPages={totalPages}
            currentPage={currentPage}
        />
    )
}

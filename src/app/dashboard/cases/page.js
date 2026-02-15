import { getCases } from '@/actions/cases'
import CasesListClient from '@/components/cases-list-client'

export const dynamic = 'force-dynamic'

export default async function CasesPage(props) {
    const searchParams = await props.searchParams
    const query = searchParams?.query || ''
    const currentPage = Number(searchParams?.page) || 1
    const pageSize = 10

    const filters = {
        caseId: searchParams?.caseId,
        date: searchParams?.date,
        clientFirstName: searchParams?.clientFirstName,
        clientLastName: searchParams?.clientLastName,
        aadhar: searchParams?.aadhar,
        phone: searchParams?.phone,
        status: searchParams?.status,
    }

    const { cases, totalCount } = await getCases(query, currentPage, pageSize, filters)
    const totalPages = Math.ceil(totalCount / pageSize)

    return <CasesListClient
        initialCases={cases}
        totalPages={totalPages}
        currentPage={currentPage}
    />
}

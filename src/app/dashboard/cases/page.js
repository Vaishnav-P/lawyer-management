import { getCases } from '@/actions/cases'
import CasesListClient from '@/components/cases-list-client'

export const dynamic = 'force-dynamic'

export default async function CasesPage(props) {
    const searchParams = await props.searchParams
    const query = searchParams?.query || ''
    const cases = await getCases(query)

    return <CasesListClient initialCases={cases} />
}

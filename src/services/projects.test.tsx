import 'fake-indexeddb/auto'
import { render, screen } from '../test-utils'
import { useGetProjectQuery } from './projects'
import { queryIndexedDb } from './queryIndexedDb'

describe('projects service', () => {
  let id: number | undefined

  beforeAll(async () => {
    const queryFn = queryIndexedDb('projects')
    const { data } = await queryFn({ query: { name: 'foo' }, operation: 'create' })
    id = data
  })

  it('renders a project', async () => {
    const Component = () => {
      const query = useGetProjectQuery(id!)
      return <div>{query.data?.name}</div>
    }

    render(<Component />)

    expect(await screen.findByText('foo')).toBeInTheDocument()
  })
})

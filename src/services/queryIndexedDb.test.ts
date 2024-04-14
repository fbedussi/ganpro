import { _openDb, queryIndexedDb } from './queryIndexedDb'
import { IDBFactory } from 'fake-indexeddb'

beforeAll(() => {
  // eslint-disable-next-line no-global-assign
  indexedDB = new IDBFactory()
})

const DB_NAME = 'dbname'
const ENTITY_NAME = 'projects'

describe('openDb', () => {
  it('returns a promise that resolves to a db instance', async () => {
    expect(await _openDb(DB_NAME, ENTITY_NAME)).toBeInstanceOf(IDBDatabase)
  })

  it('returns the same instance if called multiple times', async () => {
    const db1 = await _openDb(DB_NAME, ENTITY_NAME)
    const db2 = await _openDb(DB_NAME, ENTITY_NAME)
    expect(db1).toBe(db2)
  })

  // TODO: test the error scenario?
})

describe('queryIndexedDb', () => {
  it('takes an entity name and returns a query function', () => {
    expect(queryIndexedDb('projects')).toEqual(expect.any(Function))
  })

  it('returns a query function that takes a query and returns a promise', () => {
    const queryFn = queryIndexedDb('projects')
    expect(queryFn({ query: 1 })).toEqual(expect.any(Promise))
  })

  describe('CRUD', () => {
    let id: IDBValidKey | undefined
    const fakeProject = { name: 'foo' }

    describe('create an entity', () => {
      it('returns the new entity id', async () => {
        const queryFn = queryIndexedDb('projects')
        const result = await queryFn({ query: fakeProject, operation: 'create' })
        id = result.data
        expect(id).toEqual(expect.any(Number))
      })
    })

    describe('read an entity', () => {
      it('returns the entity', async () => {
        const queryFn = queryIndexedDb('projects')
        const { data } = await queryFn({ query: id! })
        expect(data).toEqual({ ...fakeProject, id })
      })
    })

    describe('read all the entities', () => {
      it('returns all the entities', async () => {
        const queryFn = queryIndexedDb('projects')
        const { data } = await queryFn({ query: undefined, operation: 'readAll' })
        expect(data).toEqual([{ ...fakeProject, id }])
      })
    })

    describe('update an entity', () => {
      it('returns the updated entity', async () => {
        const queryFn = queryIndexedDb('projects')
        const { data } = await queryFn({ query: { id: id!, name: 'baz' }, operation: 'update' })
        expect(data).toEqual({ name: 'baz', id })
      })
    })

    describe('delete an entity', () => {
      it('returns true', async () => {
        const queryFn = queryIndexedDb('projects')
        const { data } = await queryFn({ query: id!, operation: 'delete' })
        expect(data).toEqual(true)
      })

      it('deletes the entity', async () => {
        const queryFn = queryIndexedDb('projects')
        const { data } = await queryFn({ query: id! })
        expect(data).toEqual(undefined)
      })
    })
  })

  describe('Error handling', () => {
    it('querying a non existing store', async () => {
      const queryFn = queryIndexedDb('foo')
      const { error } = await queryFn({ query: 1 })
      expect(error).toMatchSnapshot()
    })

    it('Query a bad id', async () => {
      const queryFn = queryIndexedDb('projects')
      const { error } = await queryFn({ query: undefined as any })
      expect(error).toMatchSnapshot()
    })
  })
})

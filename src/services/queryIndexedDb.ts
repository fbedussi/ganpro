const dbName = 'ganpro'

let db: IDBDatabase | undefined = undefined

export const _openDb = async (dbName: string, storeName: string): Promise<IDBDatabase> => {
  return db
    ? Promise.resolve(db)
    : new Promise((res, rej) => {
        const request = indexedDB.open(dbName)
        request.onerror = () => {
          rej(request.error)
        }
        request.onsuccess = () => {
          db = request.result
          res(request.result)
        }
        request.onupgradeneeded = () => {
          const db = request.result

          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true })
        }
      })
}

export const queryIndexedDb = (entityName: string) => {
  const db = _openDb(dbName, entityName)

  type FetchBaseQueryResult<T> = Promise<
    | {
        data: T
        error?: undefined
      }
    | {
        error: DOMException
        data?: undefined
      }
  >

  function queryFn<T extends { id: IDBValidKey }>(query: IDBValidKey): FetchBaseQueryResult<T>
  function queryFn<T extends { id: IDBValidKey }>(
    query: IDBValidKey,
    operation: 'read',
  ): FetchBaseQueryResult<T>
  function queryFn(query: IDBValidKey, operation: 'delete'): FetchBaseQueryResult<boolean>
  function queryFn<T>(query: T, operation: 'create'): FetchBaseQueryResult<IDBValidKey>
  function queryFn<T extends { id: IDBValidKey }>(
    query: T,
    operation: 'update',
  ): FetchBaseQueryResult<T>
  function queryFn<T>(query: any, operation = 'read'): FetchBaseQueryResult<any> {
    return db
      .then(
        db =>
          new Promise(res => {
            const transaction = db.transaction([entityName], 'readwrite')
            const objectStore = transaction.objectStore(entityName)

            switch (operation) {
              case 'create': {
                const request = objectStore.add(query)
                request.onsuccess = () => {
                  res(request.result)
                }
                break
              }

              case 'read': {
                const request = objectStore.get(query)
                request.onsuccess = () => {
                  res(request.result as T)
                }
                break
              }

              case 'update': {
                const request = objectStore.put(query)
                request.onsuccess = () => {
                  res(query)
                }
                break
              }

              case 'delete': {
                const request = objectStore.delete(query)
                request.onsuccess = () => {
                  res(true)
                }
                break
              }
            }
          }),
      )
      .then(data => {
        return { data }
      })
      .catch(error => {
        return { error }
      })
  }

  return queryFn
}

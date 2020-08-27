import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usescases'
import { SavePurchases } from '@/domain'

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  insertCallsCount = 0
  deleteKey!: string
  insertKey!: string
  insertValues: Array<SavePurchases.Params> = []

  delete(key: string): void {
    this.deleteCallsCount++
    this.deleteKey = key
  }

  insert(key: string, value: any): void {
    this.insertCallsCount++
    this.insertKey = key
    this.insertValues = value
  }
}

const mockPurchases = (): Array<SavePurchases.Params> => [
  {
    id: '1',
    date: new Date(),
    value: 100
  },{
    id: '2',
    date: new Date(),
    value: 150
  },
]

type SUTTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}

const makeSUT = (): SUTTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore)

  return {
    sut,
    cacheStore
  }
}

describe('LocalSavePurchases', () => {
  test('Should not delete cache in sut.init', () => {
    const { cacheStore } = makeSUT()
    expect(cacheStore.deleteCallsCount).toBe(0)
  })

  test('Should delete old cache in sut.save', async () => {
    const { sut, cacheStore } = makeSUT()
    await sut.save(mockPurchases())
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchases')
  })

  test('Should not insert new cache if delete fails', () => {
    const { sut, cacheStore } = makeSUT()
    jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.save(mockPurchases())
    expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow()
  })

  test('Should not insert new cache if delete succeeds', async () => {
    const { sut, cacheStore } = makeSUT()
    const purchases = mockPurchases()
    await sut.save(purchases)
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual(purchases)
  })
})

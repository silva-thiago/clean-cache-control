class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) { }

  async save(): Promise<void> {
    this.cacheStore.delete('purchases')
  }
}

interface CacheStore {
  delete: (key: string) => void
}

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  key!: string

  delete(key: string): void {
    this.deleteCallsCount++
    this.key = key
  }
}

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
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
  })

  test('Should call delete with correct key', async () => {
    const { sut, cacheStore } = makeSUT()
    await sut.save()
    expect(cacheStore.key).toBe('purchases')
  })
})
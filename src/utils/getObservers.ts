import { OBSERVABLE_TOPICS } from '@src/constants/observers'

import { Store } from './store'

export const getObservers = <T>(topic: OBSERVABLE_TOPICS): T[] => {
  const observers: T[] = []
  const re: RegExp = new RegExp(`observer_${topic}_.+`, 'i')

  Store.forEach((observerRef: string, key: string) => {
    if (re.test(key)) {
      observers.push(Store.fetch(observerRef))
    }
  })

  return observers
}

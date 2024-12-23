import { OBSERVABLE_TOPICS } from '@src/constants/observers'
import { Store } from '@src/utils'

const observer: (name: string, subject: OBSERVABLE_TOPICS) => ClassDecorator =
  (name: string, subject: OBSERVABLE_TOPICS): ClassDecorator =>
  (): void => {
    Store.register(`observer_${subject}_${name}`, name)
  }

export { observer as Observer }

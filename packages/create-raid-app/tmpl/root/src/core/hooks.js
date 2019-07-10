
import { useEffect } from 'react'

import { emit } from '../signals'

export const useMount = (type, payload = null) => {
  useEffect(() => {
    if (!type) {
      return
    }
    emit(type, payload)
  })
}

export const useUnmount = (type, payload = null) => {
  useEffect(() => {
    if (!type) {
      return
    }

    return () => {
      emit(type, payload)
    }
  })
}

export const useAction = ({ onMount, onUnmount }) => {
  useEffect(() => {
    if (onMount) {
      const { type, payload = null } = onMount
      if (type) {
        emit(type, payload)
      }
    }

    if (!onUnmount) {
      return
    }

    return () => {
      const { type, payload = null } = onUnmount
      if (type) {
        emit(type, payload)
      }
    }
  })
}

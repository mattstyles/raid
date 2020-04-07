
import { useEffect } from 'react'

import { emit } from '../signals'

export const useMount = (type, payload = null, deps = []) => {
  useEffect(() => {
    if (!type) {
      return
    }
    emit(type, payload)
  }, deps)
}

export const useUnmount = (type, payload = null, deps = []) => {
  useEffect(() => {
    if (!type) {
      return
    }

    return () => {
      emit(type, payload)
    }
  }, deps)
}

export const useAction = ({ onMount, onUnmount }, deps = []) => {
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
  }, deps)
}

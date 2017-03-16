
import path from 'path'
import tape from 'tape'

const prepTestName = name =>
  path.basename(name)
    .replace(/\.test\.js$/, '')
    .replace(/^./, ch => ch.toUpperCase())

export const namespace = ns => (str, fn) =>
  tape(`${prepTestName(ns)} :: ${str}`, fn)

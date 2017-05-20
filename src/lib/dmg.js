import _ from 'lodash'
import { exec } from 'child_process'
import crypto from 'crypto'
import fs from 'fs'
import Plist from 'plist'

const NAME_KEY = 'CFBundleDisplayName'
const ICON_KEY = 'CFBundleIconFile'
const VERSION_KEY = 'CFBundleShortVersionString'

export default (path) => {
  const dmg = {}
  dmg.path = path
  dmg.checksum = getChecksum(path)

  return mountDmg(path)
    .then(findApp)
    .then(appPath => {
      const contents = `${appPath}/Contents`
      const plistContent = fs.readFileSync(`${contents}/Info.plist`, 'utf-8')

      return Plist.parse(plistContent)
    }).then(plist => {
      dmg.name = plist[NAME_KEY]
      dmg.iconName = plist[ICON_KEY]
      dmg.version = plist[VERSION_KEY]

      return dmg;
    })
}

const getChecksum = function(path) {
  const data = fs.readFileSync(path)
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex')
}

const mountDmg = function(path) {
  return new Promise((resolve, reject) => {
    exec(`hdiutil attach ${path}`, (error, stdout) => {
      if (error) {
        reject(error)
      } else {
        const relevantLine = stdout.split('\n')[1]
        const mountLocation = _.last(relevantLine.split('\t'))
        resolve(mountLocation)
      }
    })
  })
}

const findApp = function(path) {
  return new Promise((resolve,reject) => {
    fs.readdir(path, (err, files) => {
      const app = _.find(files, file => _.endsWith(file, '.app'))

      if (app) {
        resolve(`${path}/${app}`)
      } else {
        reject('could not find app in dmg')
      }
    })
  })
}

const { abiEvents } = require('../../../scaffold/schema')
const ABI = require('../abi')

const source = ({ contract, contractName }) => `
      address: '${contract}'
      abi: ${contractName}
      startBlock: 10`

const mapping = ({ abi, contractName }) => `
      kind: ethereum/events
      apiVersion: 0.0.5
      language: wasm/assemblyscript
      entities:
        ${abiEvents(abi)
          .map(event => `- ${event.get('_alias')}`)
          .join('\n        ')}
      abis:
        - name: ${contractName}
          file: ./abis/${contractName}.json
      eventHandlers:
        ${abiEvents(abi)
          .map(
            event => `
        - event: ${ABI.eventSignature(event)}
          handler: handle${event.get('_alias')}`,
          )
          .join('')}
      file: ./src/mapping.ts`

module.exports = {
  source,
  mapping,
}

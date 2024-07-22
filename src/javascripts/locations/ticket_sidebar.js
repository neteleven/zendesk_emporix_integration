import '@zendeskgarden/css-bedrock'
import App from '../modules/app'

/* global ZAFClient */
const client = ZAFClient.init()

client.on('app.registered', function (appData) {
  return App(client, appData)
})

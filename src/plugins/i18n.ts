
import { createI18n } from 'vue-i18n'

const numberFormats = {
    'en-US': {
      euro: {
        style: 'currency', currency: 'EUR', notation: 'compact'
      },
      compact: {
        notation: 'compact',
      },
      percent: {
        style: 'percent', useGrouping: false
      }
    },
}

export const i18n = createI18n({
    numberFormats,
})

export default i18n
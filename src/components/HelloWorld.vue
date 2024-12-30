<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto">

      <v-layout>

        <v-dialog v-model="showDetails" max-height="calc(100vh - 400px)" max-width="1280px">
          <v-card>
            <v-card-text>
              <v-img :src="detailItem?.headerBackground" cover>
                <template #placeholder>
                  <v-img src="https://placehold.co/60x10" />
                </template>
              </v-img>
              <v-tabs v-model="detailItemTab" align-tabs="center" class="bg-background">
                <v-tab value="latest">Latest 50 videos</v-tab>
                <v-tab value="most">Most 50 viewed videos</v-tab>
              </v-tabs>
              <v-tabs-window v-model="detailItemTab">
                <v-tabs-window-item value="latest">
                  <v-data-table :items-per-page="0" :items="detailItem?.recentVideos" :headers="recentVideosHeaders" hide-default-footer>
                    <template #item.title="{ item: videoItem }">
                      <v-btn target="_blank" :href="`${videoItem.href}`" variant="text">{{ videoItem.title }}</v-btn>
                    </template>
                  </v-data-table>
                </v-tabs-window-item>
                <v-tabs-window-item value="most">
                  <v-data-table
                    :items-per-page="0"
                    :items="detailItem?.mostViewedVideos"
                    :headers="recentVideosHeaders"
                    hide-default-footer
                  >
                    <template #item.title="{ item: videoItem }">
                      <v-btn target="_blank" :href="`${videoItem.href}`">{{ videoItem.title }}</v-btn>
                    </template>
                  </v-data-table>
                </v-tabs-window-item>
              </v-tabs-window>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-navigation-drawer v-model="showTableOptions" location="right" width="420">
          <v-list>
            <v-list-subheader>Information</v-list-subheader>
            <v-list-item>
              <template #title>
                <v-label>Activity status</v-label>
              </template>
              <template #append>
                <v-btn-toggle v-model="search.activity" multiple variant="tonal">
                  <v-btn value="active" active-color="green">Active</v-btn>
                  <v-btn value="inactive" active-color="green">InActive</v-btn>
                </v-btn-toggle>
              </template>
            </v-list-item>
            <v-list-item>
              <v-autocomplete
v-model="search.countries" variant="solo-filled" label="Countries" chips closable-chips
                multiple :items="availableCountries" hide-details />
            </v-list-item>
            <v-list-item>
              <v-autocomplete
v-model="search.channelTypes" variant="solo-filled" chips closable-chips multiple
                :items="availableChannelTypes" label="Channel types" hide-details />
            </v-list-item>
            <v-list-item>
              <v-text-field
variant="solo-filled"
                :label="`Create ${search.dateCreated.lessThan ? 'before' : 'after'} date`"
                :model-value="moment(search.dateCreated.value).format('Y/MM/DD')" hide-details clearable>
                <template #prepend>
                  <v-btn
                    :icon="search.dateCreated.lessThan ? 'mdi-code-less-than-or-equal' : 'mdi-code-greater-than-or-equal'"
                    @click="search.dateCreated.lessThan = !search.dateCreated.lessThan" />
                </template>
                <template #append-inner>
                  <v-menu :close-on-content-click="false">
                    <template #activator="{ props }">
                      <v-btn icon="mdi-calendar" v-bind="props" variant="text" />
                    </template>
                    <v-date-picker v-model="search.dateCreated.value" />
                  </v-menu>
                </template>
              </v-text-field>
            </v-list-item>

            <v-divider class="mt-5" />
            <v-list-subheader>Activity</v-list-subheader>
            <v-list-item>
              <v-text-field
v-model="search.uploads.value" variant="solo-filled"
                :label="`Uploads ${search.uploads.lessThan ? 'less' : 'more'} than`" hide-details type="number"
                clearable>
                <template #prepend>
                  <v-btn
                    :icon="search.uploads.lessThan ? 'mdi-code-less-than-or-equal' : 'mdi-code-greater-than-or-equal'"
                    @click="search.uploads.lessThan = !search.uploads.lessThan" />
                </template>
              </v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
v-model="search.subs.value" variant="solo-filled"
                :label="`Subs ${search.subs.lessThan ? 'less' : 'more'} than`" hide-details type="number" clearable>
                <template #prepend>
                  <v-btn
:icon="search.subs.lessThan ? 'mdi-code-less-than-or-equal' : 'mdi-code-greater-than-or-equal'"
                    @click="search.subs.lessThan = !search.subs.lessThan" />
                </template>
              </v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
v-model="search.views.value" variant="solo-filled"
                :label="`Views ${search.views.lessThan ? 'less' : 'more'} than`" hide-details type="number" clearable>
                <template #prepend>
                  <v-btn
                    :icon="search.views.lessThan ? 'mdi-code-less-than-or-equal' : 'mdi-code-greater-than-or-equal'"
                    @click="search.views.lessThan = !search.views.lessThan" />
                </template>
              </v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
v-model="search.accLast50.value" variant="solo-filled"
                :label="`Last 50 video views ${search.accLast50.lessThan ? 'less' : 'more'} than`" hide-details
                type="number" clearable>
                <template #prepend>
                  <v-btn
                    :icon="search.accLast50.lessThan ? 'mdi-code-less-than-or-equal' : 'mdi-code-greater-than-or-equal'"
                    @click="search.accLast50.lessThan = !search.accLast50.lessThan" />
                </template>
              </v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
v-model="search.accMostWatched.value" variant="solo-filled"
                :label="`Most 50 watched views ${search.accMostWatched.lessThan ? 'less' : 'more'} than`" hide-details
                type="number" clearable>
                <template #prepend>
                  <v-btn
                    :icon="search.accMostWatched.lessThan ? 'mdi-code-less-than-or-equal' : 'mdi-code-greater-than-or-equal'"
                    @click="search.accMostWatched.lessThan = !search.accMostWatched.lessThan" />
                </template>
              </v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
variant="solo-filled"
                :label="`Last upload ${search.latestUpload.lessThan ? 'before' : 'after'} date`"
                :model-value="moment(search.latestUpload.value).format('Y/MM/DD')" readonly hide-details clearable>
                <template #prepend>
                  <v-btn
                    :icon="search.latestUpload.lessThan ? 'mdi-code-less-than-or-equal' : 'mdi-code-greater-than-or-equal'"
                    @click="search.latestUpload.lessThan = !search.latestUpload.lessThan" />
                </template>
                <template #append-inner>
                  <v-menu :close-on-content-click="false">
                    <template #activator="{ props }">
                      <v-btn icon="mdi-calendar" v-bind="props" variant="text" />
                    </template>
                    <v-date-picker v-model="search.latestUpload.value" />
                  </v-menu>
                </template>
              </v-text-field>
            </v-list-item>

            <v-divider class="mt-5" />
            <v-list-subheader>Revenue</v-list-subheader>

            <v-list-item>
              <v-text-field
v-model="search.estMonthly.value" variant="solo-filled"
                :label="`Monthly revenue ${search.estMonthly.lessThan ? 'less' : 'more'} than`" hide-details
                type="number" clearable>
                <template #append-inner>
                  <v-btn-toggle
v-model="search.estMonthly.capIndex" :multiple="false" density="compact"
                    variant="tonal">
                    <v-btn size="x-small" :value="1">L</v-btn>
                    <v-btn size="x-small" :value="2">H</v-btn>
                  </v-btn-toggle>
                </template>
                <template #prepend>
                  <v-btn
                    :icon="search.estMonthly.lessThan ? 'mdi-code-less-than-or-equal' : 'mdi-code-greater-than-or-equal'"
                    @click="search.estMonthly.lessThan = !search.estMonthly.lessThan" />
                </template>
              </v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
v-model="search.estYearly.value" variant="solo-filled"
                :label="`Yearly revenue ${search.estYearly.lessThan ? 'less' : 'more'} than`" hide-details
                type="number" clearable>
                <template #append-inner>
                  <v-btn-toggle v-model="search.estYearly.capIndex" :multiple="false" density="compact" variant="tonal">
                    <v-btn size="x-small" :value="1">L</v-btn>
                    <v-btn size="x-small" :value="2">H</v-btn>
                  </v-btn-toggle>
                </template>
                <template #prepend>
                  <v-btn
                    :icon="search.estYearly.lessThan ? 'mdi-code-less-than-or-equal' : 'mdi-code-greater-than-or-equal'"
                    @click="search.estYearly.lessThan = !search.estYearly.lessThan" />
                </template>
              </v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
v-model="search.accLast50Rev.value" variant="solo-filled"
                :label="`Last 50 videos revenue ${search.accLast50Rev.lessThan ? 'less' : 'more'} than`" hide-details
                type="number" clearable>
                <template #append-inner>
                  <v-btn-toggle
v-model="search.accLast50Rev.capIndex" :multiple="false" density="compact"
                    variant="tonal">
                    <v-btn size="x-small" :value="1">L</v-btn>
                    <v-btn size="x-small" :value="2">H</v-btn>
                  </v-btn-toggle>
                </template>
                <template #prepend>
                  <v-btn
                    :icon="search.accLast50Rev.lessThan ? 'mdi-code-less-than-or-equal' : 'mdi-code-greater-than-or-equal'"
                    @click="search.accLast50Rev.lessThan = !search.accLast50Rev.lessThan" />
                </template>
              </v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
v-model="search.accMostWatchedRev.value" variant="solo-filled"
                :label="`50 Most watched revenue ${search.accMostWatchedRev.lessThan ? 'less' : 'more'} than`" hide-details
                type="number" clearable>
                <template #append-inner>
                  <v-btn-toggle
v-model="search.accMostWatchedRev.capIndex" :multiple="false" density="compact"
                    variant="tonal">
                    <v-btn size="x-small" :value="1">L</v-btn>
                    <v-btn size="x-small" :value="2">H</v-btn>
                  </v-btn-toggle>
                </template>
                <template #prepend>
                  <v-btn
                    :icon="search.accMostWatchedRev.lessThan ? 'mdi-code-less-than-or-equal' : 'mdi-code-greater-than-or-equal'"
                    @click="search.accMostWatchedRev.lessThan = !search.accMostWatchedRev.lessThan" />
                </template>
              </v-text-field>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main>
          <v-card>
            <template #title>
              <v-card-title class="d-flex flex-row align-center justify-center">
                <span class="text-h5">YouTube channel analyzer</span>
                <v-spacer></v-spacer>
                <v-divider vertical />
                <v-btn
class="me-2" :color="showCompareList ? 'primary' : ''"
                  @click="showCompareList = !showCompareList">{{
                    showCompareList ? 'Hide' : 'Show' }} compare list</v-btn>
                <v-text-field
v-model="search.term" density="compact" label="Search"
                  placeholder="Search in channel name or youtuber name" prepend-inner-icon="mdi-magnify" hide-details
                  variant="solo-filled" @click.stop />
                <v-divider class="ms-2" vertical />
                <v-tooltip location="top">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-upload" @click="openSelectFileDialog" />
                  </template>
                  Select a .json list of YouTube scrapped data to display in table
                </v-tooltip>
                <v-tooltip location="top">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-cog" @click="showTableOptions = !showTableOptions" />
                  </template>
                  Table filters.
                </v-tooltip>
              </v-card-title>
              <v-card-subtitle>Displaying {{ items.length }} records.</v-card-subtitle>
            </template>
            <v-divider />
            <v-card-text class="pt-2">
              <v-data-table-virtual
v-model:expanded="expanded" v-model:search="search.term" :items-per-page="0"
                :items="showCompareList ? compareList : items" :headers="headers" :custom-filter="performSearchFilter"
                item-value="channelName" height="calc(100vh - 300px)" fixed-header hide-default-footer>

                <!-- expanded row -->
                <template #expanded-row="{ columns, item }">
                  <tr>
                    <td :colspan="columns.length">
                      <v-img :src="item.headerBackground" min-height="200" max-height="200">
                        <template #placeholder>
                          <v-img src="https://placehold.co/60x10" />
                        </template>
                      </v-img>
                      <v-tabs v-model="item['expanded-tab']" align-tabs="center" class="bg-background">
                        <v-tab value="latest">Latest 50 videos</v-tab>
                        <v-tab value="most">Most 50 viewed videos</v-tab>
                      </v-tabs>
                      <v-tabs-window v-model="item['expanded-tab']">
                        <v-tabs-window-item value="latest">
                          <v-data-table :items-per-page="0" :items="item.recentVideos" :headers="recentVideosHeaders">
                            <template #item.title="{ item: videoItem }">
                              <v-btn target="_blank" :href="`${videoItem.href}`" variant="text">{{ videoItem.title }}</v-btn>
                            </template>
                          </v-data-table>
                        </v-tabs-window-item>
                        <v-tabs-window-item value="most">
                          <v-data-table
:items-per-page="0" :items="item.mostViewedVideos"
                            :headers="recentVideosHeaders">
                            <template #item.title="{ item: videoItem }">
                              <v-btn target="_blank" :href="`${videoItem.href}`">{{ videoItem.title }}</v-btn>
                            </template>
                          </v-data-table>
                        </v-tabs-window-item>
                      </v-tabs-window>
                    </td>
                  </tr>
                </template>
                <!-- estimate header (select estimate mode) -->
                <template #header.estimate="{}">
                  <div>
                    <v-select
v-model="selectedEstimate" variant="solo-filled" :items="availableEstimates"
                      density="compact" />
                  </div>
                </template>

                <template #item.youtuber="{ item }">
                  <v-list-item width="400" :color="item.isActive ? '' : 'grey'" active nav rounded="none" min-height="100%">

                    <!-- grade & avatar -->
                    <template #prepend>
                      <!-- toggle compare list button -->
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-checkbox-btn @click="toggleFromCompareList(item)" :model-value="isItemInCompareList(item)" :color="isItemInCompareList(item) ? 'primary' : ''" v-bind="props"/>
                        </template>
                        Show item in compare list
                      </v-tooltip>
                      <v-avatar size="56" :color="getYoutuberGradeColor(item.grade)">
                        <span class="text-h5">{{ item.grade }}</span>
                      </v-avatar>
                      <v-avatar class="ms-2" :image="`${item.avatar}`" size="60" />
                    </template>

                    <v-list-item-title>{{ item.youtuberName }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip>{{ item.channelName }}</v-chip>
                    </v-list-item-subtitle>

                    <!-- appended actions -->
                    <template #append>
                      <v-list-item-action>
                        <!-- channel details -->
                        <v-tooltip location="top">
                          <template #activator="{ props }">
                            <v-btn
                              class="ms-2"
                              :color="expanded.includes(item.channelName) ? 'primary' : ''"
                              icon="mdi-play"
                              size="x-small" v-bind="props"
                              @click="showItemDetails(item)"
                            />
                          </template>
                          Channel details
                        </v-tooltip>

                        <!-- youtube links menu -->
                        <v-tooltip location="top">
                          <template #activator="{ props: tooltipProps }">
                            <v-menu>
                              <template #activator="{ props }">
                                <v-btn
class="ms-2" icon="mdi-dots-vertical" v-bind="{ ...props, ...tooltipProps }"
                                  size="x-small" />
                              </template>
                              <v-list>
                                <v-list-item
                                  v-for="link in [baseYouTubeUrl + item.channelName, baseSocialBladeUrl + item.channelName]"
                                  :href="link" target="_blank">
                                  <v-list-item-title>{{ link }}</v-list-item-title>
                                  <template #append>
                                    <v-icon icon="mdi-arrow-top-right-bold-box-outline" />
                                  </template>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </template>
                          Youtuber links
                        </v-tooltip>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </template>

                <template #item.dateCreated="{ item }">
                  <span>{{ item.dateCreated?.format('Y/MM/DD') }}</span>
                </template>
                <template #item.latestUpload="{ item }">
                  <span>{{ item.latestUpload?.format('Y/MM/DD') }}</span><br />
                  <span>{{ moment().diff(item.latestUpload, 'days') }} days ago</span>
                </template>

                <template #item.estimatedSubs="{ item }">
                  <v-icon
v-if="item[selectedEstimate + 'Subs'] !== null" size="small"
                    :color="item[selectedEstimate + 'Subs'] < 0 ? 'red' : 'green'">{{ `mdi-arrow-${item[selectedEstimate
                      +
                      'Subs'] < 0 ? 'down' : 'up'}` }}</v-icon>
                      {{ formatNumber(item[selectedEstimate + 'Subs']) }}
                </template>
                <template #item.estimatedViews="{ item }">
                  <v-icon
v-if="!['accLast50', 'accMostWatched'].includes(selectedEstimate)" size="small"
                    :color="item[selectedEstimate + 'Views'] < 0 ? 'red' : 'green'">{{
                      `mdi-arrow-${item[selectedEstimate + 'Views'] < 0 ? 'down' : 'up'}` }}</v-icon>
                      {{ formatNumber(item[selectedEstimate + 'Views']) }}
                </template>
                <template #item.estimatedEarn="{ item }">
                  <div class="d-flex flex-row align-center">
                    <v-chip>{{ formatEuro(item[selectedEstimate + 'Earn']?.[0]) }}</v-chip>
                    <span class="mx-1"> to </span>
                    <v-chip>{{ formatEuro(item[selectedEstimate + 'Earn']?.[1]) }}</v-chip>
                  </div>
                </template>

                <template #item.subs="{ item }">
                  {{ formatNumber(item.subs) }}
                </template>
                <template #item.views="{ item }">
                  {{ formatNumber(item.views) }}
                </template>
                <template #item.estMonEarn="{ item }">
                  <div class="d-flex flex-row align-center">
                    <v-chip>{{ formatEuro(item.estMonEarn?.[0]) }}</v-chip>
                    <span class="mx-1"> to </span>
                    <v-chip>{{ formatEuro(item.estMonEarn?.[1]) }}</v-chip>
                  </div>
                </template>
                <template #item.estYearEarn="{ item }">
                  <div class="d-flex flex-row align-center">
                    <v-chip>{{ formatEuro(item.estYearEarn?.[0]) }}</v-chip>
                    <span class="mx-1"> to </span>
                    <v-chip>{{ formatEuro(item.estYearEarn?.[1]) }}</v-chip>
                  </div>
                </template>

              </v-data-table-virtual>
            </v-card-text>
          </v-card>
        </v-main>
      </v-layout>

    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import localScrappedData from '@/channels.txt.json?raw'
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import moment, { type Moment } from 'moment'

const i18next = useI18n()

type ScrappedVideoRecord = {
  uploadDate: string
  title: string
  views: number
  rating: string
  comments: number
  estRev: string
  href: string
}

type ScrappedRecord = {
  youtuberName: string
  channelName: string
  uploads: number
  subs: number
  views: number
  country: string
  channelType: string
  dateCreated: string
  grade: string
  estMonEarn: [number, number]
  estYearEarn: [number, number]
  averageDailySubs: number
  averageDailyViews: number
  averageDailyEarn: [number, number]
  averageWeeklySubs: number
  averageWeeklyViews: number
  averageWeeklyEarn: [number, number]
  last30DaySubs: number
  last30DayViews: number
  last30DayEarn: [number, number]
  headerBackground: string
  avatar: string
  recentVideos: Array<Array<string>>
  mostViewedVideos: Array<Array<string>>
}

type ScrappedRecordView = Omit<ScrappedRecord, 'recentVideos' | 'mostViewedVideos' | 'dateCreated'> & {
  'expanded-tab'?: boolean
  isActive: boolean
  youtuber: number // grade number

  recentVideos: Array<ScrappedVideoRecord>
  mostViewedVideos: Array<ScrappedVideoRecord>
  dateCreated: Moment
  latestUpload?: Moment

  accMostWatchedSubs: null
  accMostWatchedViews: number
  accMostWatchedEarn: [number, number]

  accLast50Subs: null
  accLast50Views: number
  accLast50Earn: [number, number]
}

const baseSocialBladeUrl = 'https://socialblade.com/youtube/channel/'
const baseYouTubeUrl = 'https://www.youtube.com/'

const headers = [
  {
    title: "Youtuber",
    value: 'youtuber',
    sortable: true,
  },
  {
    title: 'Uploads',
    value: 'uploads',
    sortable: true,
  },
  {
    title: 'Subs',
    value: 'subs',
    sortable: true,
  },
  {
    title: 'Views',
    value: 'views',
    sortable: true,
  },
  {
    title: 'Country',
    value: 'country',
    sortable: true,
  },
  {
    title: 'Type',
    value: 'channelType',
    sortable: true,
  },
  {
    title: 'Created',
    value: 'dateCreated',
    sortable: true,
    sortRaw: (a: ScrappedRecordView, b: ScrappedRecordView) => moment.utc(a.dateCreated).diff(moment.utc(b.dateCreated)),
  },
  {
    title: 'Latest upload',
    value: 'latestUpload',
    sortable: true,
    sortRaw: (a: ScrappedRecordView, b: ScrappedRecordView) => moment.utc(a.latestUpload).diff(moment.utc(b.latestUpload)),
  },
  {
    title: 'Monthly est.',
    value: 'estMonEarn',
    sortable: true,
    sortRaw: (a: ScrappedRecordView, b: ScrappedRecordView) => a.estMonEarn?.[0] - b.estMonEarn?.[0],
  },
  {
    title: 'Yearly est.',
    value: 'estYearEarn',
    sortable: true,
    sortRaw: (a: ScrappedRecordView, b: ScrappedRecordView) => a.estYearEarn?.[0] - b.estYearEarn?.[0],
  },
  {
    title: 'Estimated',
    value: 'estimate',
    align: 'center',
    children: [
      {
        title: 'Subs',
        value: 'estimatedSubs',
        sortable: true,
        sortRaw: (a: ScrappedRecordView, b: ScrappedRecordView) => a[selectedEstimate.value + 'Subs'] - b[selectedEstimate.value + 'Subs'],
      },
      {
        title: 'Views',
        value: 'estimatedViews',
        sortable: true,
        sortRaw: (a: ScrappedRecordView, b: ScrappedRecordView) => a[selectedEstimate.value + 'Views'] - b[selectedEstimate.value + 'Views'],
      },
      {
        title: 'Earnings',
        value: 'estimatedEarn',
        sortable: true,
        sortRaw: (a: ScrappedRecordView, b: ScrappedRecordView) => a[selectedEstimate.value + 'Earn']?.[0] - b[selectedEstimate.value + 'Earn']?.[0],
      },
    ]
  },
]
const recentVideosHeaders = [
  {
    title: 'Upload date',
    value: 'uploadDate',
  },
  {
    title: 'Title',
    value: 'title',
  },
  {
    title: 'Views',
    value: 'views',
  },
  {
    title: 'Comments',
    value: 'comments',
  },
  {
    title: 'Estimate rev',
    value: 'estRev',
  },
  {
    title: 'Rating',
    value: 'rating',
  },
]
const availableEstimates = [
  {
    title: 'Last 30 days',
    value: 'last30Day',
  },
  {
    title: 'Average daily',
    value: 'averageDaily',
  },
  {
    title: 'Average weekly',
    value: 'averageWeekly',
  },
  {
    title: 'Accumulated last 50 videos',
    value: 'accLast50',
  },
  {
    title: 'Accumulated 50 most watched',
    value: 'accMostWatched',
  },
]
const gradeDic = {
  'A++': { val: 90, color: 'green-darken-4' },
  'A+': { val: 90, color: 'green-darken-3' },
  'A': { val: 80, color: 'green-darken-2' },
  'A-': { val: 70, color: 'green-darken-1' },
  'B+': { val: 60, color: 'green' },
  'B': { val: 50, color: 'green-lighten-1' },
  'B-': { val: 40, color: 'green-lighten-2' },
  'C+': { val: 30, color: 'green-lighten-3' },
  'C': { val: 20, color: 'green-lighten-4' },
  'C-': { val: 10, color: 'yellow-lighten-4' },
  'D+': { val: 3, color: 'yellow-lighten-3' },
  'D': { val: 2, color: 'yellow-lighten-2' },
  'D-': { val: 1, color: 'yellow-lighten-1' },
  'TBD': { val: 0, color: 'grey' }
} as {[key: string]: { val: number, color: string }}
const firstIndexOfChannel = (channel: string) => {
  for (const i in parsedScrappedData) {
    if (parsedScrappedData[i].channelName === channel) {
      return i
    }
  }
  return -1
}
const parsedScrappedData = JSON.parse(localScrappedData)
const parsedData = parsedScrappedData.filter((v: ScrappedRecord, index: number) => v.youtuberName && firstIndexOfChannel(v.channelName) == index) as ScrappedRecord[]
const channelTypes = Object.entries(
  parsedData
    .map((d: ScrappedRecord) => d.channelType)
    .reduce((obj: Record<string, number>, channelType: string) => {
      if (!obj[channelType]) {
        obj[channelType] = 0
      }
      obj[channelType] += 1
      return obj
    }, {})).map(entries => ({ title: (entries[0] + ' (' + entries[1] + ')'), value: entries[0] }))
const countries = Object.entries(parsedData.map(d => d.country)
  .reduce((obj: Record<string, number>, channelType: string) => {
    if (!obj[channelType]) {
      obj[channelType] = 0
    }
    obj[channelType] += 1
    return obj
  }, {})).map(entries => ({ title: (entries[0] + ' (' + entries[1] + ')'), value: entries[0] }))


/** refs */
const showCompareList = ref(false)
const showTableOptions = ref(true)
const showDetails = ref(false)
const compareList = ref([] as ScrappedRecordView[])
const expanded = ref([] as string[])
const search = ref({
  activity: [] as string[],
  term: '',
  channelTypes: [] as string[],
  countries: [] as string[],
  uploads: {
    lessThan: true,
    value: undefined,
  },
  subs: {
    lessThan: true,
    value: undefined,
  },
  views: {
    lessThan: true,
    value: undefined,
  },
  dateCreated: {
    lessThan: true,
    value: undefined,
  },
  latestUpload: {
    lessThan: true,
    value: undefined,
  },
  estMonthly: {
    lessThan: true,
    value: undefined,
    capIndex: 1,
  },
  estYearly: {
    lessThan: true,
    value: undefined,
    capIndex: 1,
  },
  accMostWatched: {
    lessThan: true,
    value: undefined,
  },
  accLast50: {
    lessThan: true,
    value: undefined,
  },
  accMostWatchedRev: {
    lessThan: true,
    value: undefined,
    capIndex: 1,
  },
  accLast50Rev: {
    lessThan: true,
    value: undefined,
    capIndex: 1,
  },
})
const selectedEstimate = ref('last30Day')
const parsedDataRef = ref(parsedData)
const detailItem = ref(undefined as undefined | ScrappedRecordView)
const detailItemTab = ref(0)

const availableChannelTypes = computed(() => channelTypes.filter((ct, index) => channelTypes.indexOf(ct) === index && ct))
const availableCountries = computed(() => countries.filter((cc, index) => countries.indexOf(cc) === index && cc))

const showItemDetails = (item: ScrappedRecordView) => {
  detailItem.value = item
  showDetails.value = true
}

const toggleFromCompareList = (item: ScrappedRecordView) => {
  const itemIndex = compareList.value.findIndex(v => v.channelName === item.channelName)
  console.log(itemIndex)
  if (itemIndex >= 0) {
    compareList.value.splice(itemIndex, 1)
  } else {
    compareList.value.push(item)
  }
}

const isItemInCompareList = (item: ScrappedRecordView) => {
  return compareList.value.findIndex(v => v.channelName === item.channelName) >= 0
}

/**
 * Format SocialBlade single number,
 * 
 * @param {string} number SocialBlade single number to format.
 * @returns {{number, unit}} formatted number
 */
function formatSocialBladeNumber(number: string): number|[number, number]|string {
  if (typeof number !== 'string') {
    return number
  }

  if (number.includes('-') && !number.trim().startsWith('-')) {
    const parts = number.split('-')
    return [formatSocialBladeNumber(parts[0]) as number, formatSocialBladeNumber(parts[1]) as number]
  }

  const trimmed = number.trim().replace(/ /gi, '').toLocaleLowerCase()

  let multiplier = 1
  let numberEndIndex = trimmed.length
  if (trimmed.endsWith('m')) {
    multiplier = 1000000
    numberEndIndex = trimmed.length - 1
  } else if (trimmed.endsWith('k')) {
    multiplier = 1000
    numberEndIndex = trimmed.length - 1
  } else if (trimmed.endsWith('b')) {
    multiplier = 1000000000
    numberEndIndex = trimmed.length - 1
  }

  let numberStartIndex = 0
  let unit = ''
  if (isNaN(parseFloat(trimmed.substring(0, 1)))) {
    unit = trimmed.substring(0, 1)
    if (unit === '+') {
      unit = ''
    } else if (unit === '-') {
      unit = ''
      multiplier = multiplier * -1
    }
    numberStartIndex = 1
  }

  const trimmedNumber = trimmed.substring(numberStartIndex, numberEndIndex).replace(/,/gi, '')

  if (isNaN(parseFloat(trimmedNumber))) {
    if (trimmed === '--') {
      return 0
    }

    console.log('Error formatting: ', trimmedNumber, '>>', trimmed, '>>', number)
    return number
  }

  return parseFloat(trimmedNumber) * multiplier
}

const getYoutuberGradeNumber = (grade: string) => {
  return gradeDic[grade]?.val ?? 0
}
const getYoutuberGradeColor = (grade: string) => {
  return gradeDic[grade]?.color ?? 'transparent'
}
const performSearchFilter = (value: string, query: string, item: { raw: ScrappedRecord, value: unknown }) => {
  if (value != null && query != null && typeof value === 'string') {
    return (
      item.raw.youtuberName.toLocaleUpperCase().indexOf(query.toLocaleUpperCase()) !== -1 ||
      item.raw.channelName.toLocaleUpperCase().indexOf(query.toLocaleUpperCase()) !== -1
    )
  }

  return false
}
const openSelectFileDialog = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.onchange = async () => {
    if (typeof window.FileReader !== 'function') {
      console.log('The file API isn\'t supported on this browser.')
    }

    if (!input?.files?.[0]) {
      return undefined;
    }

    const file = input.files.item(0)
    const fileContent = await file?.text()

    if (fileContent) {
      try {
      const parsedContent = JSON.parse(fileContent)
      parsedDataRef.value = parsedContent
    } catch (error) {
      console.log('error parsing json ', error)
    }
    }
  }
  input.click();
  console.log('e')

  // var file = document.getElementById("fileForUpload").files[0];
  // if (file) {
  //     var reader = new FileReader();
  //     reader.readAsText(file, "UTF-8");
  //     reader.onload = function (evt) {
  //         document.getElementById("fileContents").innerHTML = evt.target.result;
  //     }
  //     reader.onerror = function (evt) {
  //         document.getElementById("fileContents").innerHTML = "error reading file";
  //     }
  // }
}

const items = computed<ScrappedRecordView[]>(() => parsedDataRef.value
  .filter((v) => search.value.countries.length === 0 || search.value.countries.includes(v.country))
  .filter((v) => search.value.channelTypes.length === 0 || search.value.channelTypes.includes(v.channelType))
  .filter((v) => !search.value.uploads.value || (search.value.uploads.lessThan ? v.uploads < search.value.uploads.value : v.uploads > search.value.uploads.value))
  .filter((v) => !search.value.views.value || (search.value.views.lessThan ? v.views < search.value.views.value : v.views > search.value.views.value))
  .filter((v) => !search.value.subs.value || (search.value.subs.lessThan ? v.subs < search.value.subs.value : v.subs > search.value.subs.value))
  .filter((v) => !search.value.estMonthly.value || (search.value.estMonthly.lessThan ? v.estMonEarn[search.value.estMonthly.capIndex - 1] < search.value.estMonthly.value : v.estMonEarn[search.value.estMonthly.capIndex - 1] > search.value.estMonthly.value))
  .filter((v) => !search.value.estYearly.value || (search.value.estYearly.lessThan ? v.estYearEarn[search.value.estYearly.capIndex - 1] < search.value.estYearly.value : v.estYearEarn[search.value.estYearly.capIndex - 1] > search.value.estYearly.value))
  .map((v): ScrappedRecordView => ({
    ...v,
    dateCreated: moment(v.dateCreated, ['MMMMDDY']),
    latestUpload: moment(v.recentVideos?.[0]?.[0]),
    isActive: moment().diff(moment(v.recentVideos?.[0]?.[0]), 'days') < 90,
    youtuber: getYoutuberGradeNumber(v.grade),
    recentVideos: v.recentVideos?.map((rv): ScrappedVideoRecord => ({
      uploadDate: (rv as string[])[0],
      title: (rv as string[])[1],
      views: parseInt((rv as string[])[2]),
      rating: (rv as string[])[3],
      comments: parseInt((rv as string[])[4]),
      estRev: (rv as string[])[5],
      href: (rv as string[])[6],
    })),
    mostViewedVideos: v.mostViewedVideos?.map((rv) => ({
      uploadDate: (rv as string[])[0],
      title: (rv as string[])[1],
      views: parseInt((rv as string[])[2]),
      rating: (rv as string[])[3],
      comments: parseInt((rv as string[])[4]),
      estRev: (rv as string[])[5],
      href: (rv as string[])[6],
    })),
    accMostWatchedSubs: null,
    accMostWatchedViews: v.mostViewedVideos?.reduce((acc, rv) => acc + (formatSocialBladeNumber((rv as string[])[2]) as number), /** reduce start -> */ 0),
    accMostWatchedEarn: [v.mostViewedVideos?.reduce((acc, rv) => acc + (formatSocialBladeNumber((rv as string[])[5]) as [number, number])[0], 0), v.mostViewedVideos?.reduce((acc, rv) => acc +(formatSocialBladeNumber((rv as string[])[5]) as [number, number])[1], /** reduce start -> */ 0)],

    accLast50Subs: null,
    accLast50Views: v.recentVideos?.reduce((acc, rv) => acc + (formatSocialBladeNumber((rv as string[])[2]) as number), /** reduce start -> */ 0),
    accLast50Earn: [v.recentVideos?.reduce((acc, rv) => acc + (formatSocialBladeNumber((rv as string[])[5]) as [number, number])[0], /** reduce start -> */ 0), v.recentVideos?.reduce((acc, rv) => acc + (formatSocialBladeNumber((rv as string[])[5]) as [number, number])[1], /** reduce start -> */ 0)],
  }))
  .filter((v) => search.value.activity.length === 0 || search.value.activity.includes(v.isActive ? 'active' : 'inactive'))
  .filter((v) => search.value.dateCreated.value === undefined || v.dateCreated?.[search.value.dateCreated.lessThan ? 'isBefore' : 'isAfter'](search.value.dateCreated.value))
  .filter((v) => search.value.latestUpload.value === undefined || v.latestUpload?.[search.value.latestUpload.lessThan ? 'isBefore' : 'isAfter'](search.value.latestUpload.value))
  .filter((v) => !search.value.accLast50Rev.value || (search.value.accLast50Rev.lessThan ? v.accLast50Earn[search.value.accLast50Rev.capIndex - 1] < search.value.accLast50Rev.value : v.accLast50Earn[search.value.accLast50Rev.capIndex - 1] > search.value.accLast50Rev.value))
  .filter((v) => !search.value.accMostWatchedRev.value || (search.value.accMostWatchedRev.lessThan ? v.accMostWatchedEarn[search.value.accMostWatchedRev.capIndex - 1] < search.value.accMostWatchedRev.value : v.accMostWatchedEarn[search.value.accMostWatchedRev.capIndex - 1] > search.value.accMostWatchedRev.value))
)

const formatNumber = (number: string | number) => {
  if (typeof number === 'number')
    return i18next.n(number, 'compact')

  return number
}
const formatEuro = (number: string | number) => {
  if (typeof number === 'number')
    return i18next.n(number, 'euro')

  return number
}
</script>

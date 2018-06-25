<template>
<v-layout wrap>
  <v-flex xs12>
    <v-btn @click="simulateDynamicData">fake load dynamic data</v-btn>
  </v-flex>
  <v-flex xs12>
   <areaChart :dataSet="dataSet"></areaChart>
  </v-flex>
</v-layout>
</template>

<script>
import areaChart from '../components/areaChart'
import * as d3 from 'd3'
export default {
  components: {
    areaChart
  },
  data: () => ({
    dataSet: null,
    dataToAgregate: [],
    startDynamic: false
  }),
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      let parseTime = d3.timeParse('%d-%b-%y')
      let data1 = await d3.tsv('/static/example-data/data.tsv')
      let data2 = await d3.tsv('/static/example-data/data1.tsv')
      data1.map(d => {
        d.date = parseTime(d.date)
        d.close = +d.close
      })
      data2.map(d => {
        d.date = parseTime(d.date)
        d.close = +d.close
      })
      this.dataSet = data1
      this.dataToAgregate = data2
    },
    simulateDynamicData () {
      let i = 0
      this.startDynamic = true
      const interval = setInterval(() => {
        i++
        if (!this.startDynamic || i === this.dataToAgregate.length - 1) {
          clearInterval(interval)
        } else {
          this.dataSet.push(this.dataToAgregate[i])
        }
      }, 100)
    }
  }
}
</script>

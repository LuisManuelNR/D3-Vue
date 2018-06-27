<template>
  <v-flex>
    <bar-chart :dataSet="dataSet" @hover="showTooltip" @out="tooltip.isActive = false"></bar-chart>
    <v-tooltip top :activator="tooltip.id" v-model="tooltip.isActive">
      <span>Frequency: {{tooltip.text}}</span>
    </v-tooltip>
  </v-flex>
</template>

<script>
import barChart from '../components/barChart'
import * as d3 from 'd3'
export default {
  components: {
    barChart
  },
  created () {
    this.loadData()
  },
  data: () => ({
    dataSet: null,
    tooltip: {
      isActive: false,
      id: '',
      text: ''
    }
  }),
  methods: {
    loadData () {
      d3.tsv('./static/example-data/barChartData.tsv').then(data => {
        data.map(d => {
          d.frequency = +d.frequency
        })
        this.dataSet = data
      })
    },
    showTooltip (e) {
      this.tooltip = {
        isActive: true,
        id: e.id,
        text: e.text
      }
    }
  }
}
</script>

<template>
  <v-flex xs12>
    <us-map
    @stateSelected="onStateSelected"
    @stateDeselected="onStateDeselected"></us-map>
    <v-tooltip bottom v-model="tooltip" :activator="`#${currentState ? currentState.id : '.state'}`">
      <span><strong>{{currentState ? currentState.name : ''}}</strong></span>
      <br>
      <span>{{currentState ? 'Population: '+currentState.population : ''}}</span>
    </v-tooltip>
  </v-flex>
</template>

<script>
import * as d3 from 'd3'
import usMap from '../components/map'
export default {
  components: {
    usMap
  },
  data: () => ({
    tooltip: false,
    statesData: undefined,
    currentState: undefined
  }),
  created () {
    d3.csv('/static/example-data/states-data.csv').then(data => {
      let formatedData = {}
      data.map(d => {
        let formatPopulation = d.Population.split('.').join('')
        formatedData[d.STATE_ABBR] = {
          id: d.STATE_ABBR,
          name: d.Name,
          population: Number(formatPopulation)
        }
      })
      this.statesData = formatedData
    })
  },
  methods: {
    onStateSelected (stateCode) {
      this.tooltip = true
      this.currentState = this.statesData[stateCode]
    },
    onStateDeselected (stateCode) {
      this.tooltip = false
      this.currentState = undefined
    }
  }
}
</script>

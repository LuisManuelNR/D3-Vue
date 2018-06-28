<template>
<v-layout wrap>
  <v-flex xs12>
    <cluster-dendogram :offsetWidth="widthSlider" :offsetHeight="heightSlider" :dataSet="dataSet"></cluster-dendogram>
  </v-flex>
</v-layout>  
</template>

<script>
import clusterDendogram from '../components/clusterDendogram'
import * as d3 from 'd3'
export default {
  components: {
    clusterDendogram
  },
  data: () => ({
    dataSet: null
  }),
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      d3.csv('./static/example-data/flare.csv').then(data => {
        this.dataSet = data
      })
    }
  }
}
</script>

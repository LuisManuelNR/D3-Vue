<template>
<v-layout row wrap>
  <v-layout>
    <v-flex xs2>
      <p>Ctrl + click = Pan</p>
      <p>Weel = Zoom</p>
    </v-flex>
    <v-flex xs4>
      nodes radius
      <v-slider v-model="nodesRadius" max="50" thumb-label></v-slider>
    </v-flex>
    <v-flex xs4>
      attraction of nodes
      <v-slider v-model="nodesAtractForce" min="-800" max="1" thumb-label></v-slider>
    </v-flex>
    <v-flex xs2>
      <v-checkbox
        label="Toggle text"
        v-model="text"
      ></v-checkbox>
      dataSet: {{currentDataSet ? currentDataSet : 'loading data'}}
      <v-btn @click="toggleData">toggle data</v-btn>
    </v-flex>
  </v-layout>
  <v-flex xs12>
    <network v-if="dataSet"
    :dataSet="dataSet"
    :nodesRadius="nodesRadius"
    :nodesAtractForce="nodesAtractForce"
    :text="text"></network>
  </v-flex>
</v-layout>
</template>

<script>
import network from '../components/networkGraph'
import * as d3 from 'd3'
export default {
  components: {
    network
  },
  data: () => ({
    dataSet: null,
    currentDataSet: null,
    miserables: null,
    animals: null,
    nodesRadius: 20,
    nodesAtractForce: -500,
    text: false
  }),
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      this.miserables = await d3.json('/static/example-data/miserables.json')
      this.animals = await d3.json('/static/example-data/animals.json')
      this.dataSet = this.animals
      this.currentDataSet = 'animals'
    },
    toggleData () {
      if (this.currentDataSet === 'animals') {
        this.dataSet = this.miserables
        this.currentDataSet = 'miserables'
      } else {
        this.dataSet = this.animals
        this.currentDataSet = 'animals'
      }
    }
  }
}
</script>


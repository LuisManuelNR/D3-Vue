<template>
  <v-flex xs12>
    <svg :width="width" :height="height"
    :viewBox="`${offsetX} ${offsetY} ${zoomWidth} ${zoomHeight}`"
    @mousewheel.prevent="zoom"
    @mousedown.ctrl.exact="panEnabled = true"
    @mouseup="panEnabled = false"
    @mousemove="pan"
    class="networkChartContainer">
    <line v-for="(link, i) in dataSet.links" :key="'l'+i" class="links" />
    <g class="nodes" v-for="(node, i) in dataSet.nodes" :key="i">
      <circle
      :r="nodesRadius"
      stroke="black"
      stroke-width="1"/>
      <text v-if="text" dx="25" dy=".35em">{{ node.id }}</text>
      <title>{{ node.id }}</title>
    </g>
  </svg>
  </v-flex>
</template>

<script>
import * as d3 from 'd3'
export default {
  props: {
    dataSet: {
      type: [Object, Array]
    },
    desiredHeight: {
      type: Number,
      default: 500
    },
    margin: {
      type: Object,
      default: () => ({
        left: 10,
        right: 10,
        top: 20,
        bottom: 20
      })
    },
    nodesRadius: {
      type: Number,
      default: 20
    },
    nodesAtractForce: {
      type: Number,
      default: -500
    },
    text: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    width: 500,
    height: 500,
    simulation: null,
    node: null,
    link: null,
    offsetX: 0,
    offsetY: 0,
    zoomWidth: 0,
    zoomHeight: 0,
    panEnabled: false,
    color: d3.scaleOrdinal(d3.schemeCategory10)
  }),
  mounted () {
    this.width = this.$el.clientWidth - (this.margin.left + this.margin.right)
    this.height = this.desiredHeight - (this.margin.top + this.margin.bottom)
    this.zoomWidth = this.width
    this.zoomHeight = this.height

    this.simulation = d3.forceSimulation()
      .force('charge', d3.forceManyBody().strength(this.nodesAtractForce))
      .force('link', d3.forceLink().id(d => d.id))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))

    this.drawGraph()
  },
  watch: {
    nodesAtractForce: function (newVal) {
      this.simulation.alphaTarget(0.7)
      this.simulation.force('charge', d3.forceManyBody().strength(newVal))
    },
    dataSet: function () {
      this.drawGraph()
      this.simulation.alphaTarget(0.7)
    }
  },
  updated () {

  },
  methods: {
    drawGraph () {
      this.$nextTick(() => {
        this.node = d3.selectAll('.nodes')
          .data(this.dataSet.nodes)
          .attr('fill', d => this.color(d.group))
          .call(d3.drag()
            .on('start', this.start)
            .on('drag', this.drag)
            .on('end', this.end))
        this.link = d3.selectAll('line').data(this.dataSet.links)
        this.simulation.nodes(this.dataSet.nodes).on('tick', this.ticked)
        this.simulation.force('link').links(this.dataSet.links)
      })
    },
    start (d) {
      if (!d3.event.active) this.simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    },
    drag (d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    },
    end (d) {
      if (!d3.event.active) this.simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    },
    ticked (d) {
      this.link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      this.node
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
    },
    zoom (e) {
      if (this.zoomWidth <= 120 | this.zoomWidth >= 3000 | this.zoomHeight <= 120 | this.zoomHeight >= 3000) {
        this.zoomWidth = this.width
        this.zoomHeight = this.height
      } else {
        this.zoomWidth += -e.wheelDelta
        this.zoomHeight += -e.wheelDelta
      }
    },
    pan (e) {
      if (this.panEnabled) {
        this.offsetX += -e.movementX
        this.offsetY += -e.movementY
      }
    }
  }
}
</script>

<style>
  .networkChartContainer {
    user-select: none;
    background-color: #424242
  }
  .links {
    stroke: rgb(48, 48, 48);
    stroke-width: 3;
  }
</style>


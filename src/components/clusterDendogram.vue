<template>
  <v-flex>
    <svg :width="width" :height="height"
      :viewBox="`${offsetX} ${offsetY} ${zoomWidth} ${zoomHeight}`"
      @mousewheel.prevent="zoom"
      @mousedown.exact="panEnabled = true"
      @mouseup="panEnabled = false"
      @mousemove="pan"
      class="cluster-dendogram">
      <g></g>
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
    height: {
      type: Number,
      default: 500
    },
    margin: {
      type: Object,
      default: () => ({
        left: 40,
        right: 20,
        top: 40,
        bottom: 30
      })
    }
  },
  data: () => ({
    width: 500,
    offsetX: 0,
    offsetY: 0,
    zoomWidth: 0,
    zoomHeight: 0,
    panEnabled: false,
    tree: null,
    stratify: null
  }),
  mounted () {
    this.width = this.$el.clientWidth
    this.chartWidth = this.width - (this.margin.left + this.margin.right) + 5000
    this.chartHeight = this.height - (this.margin.top + this.margin.bottom) + 300
    this.zoomWidth = this.width
    this.zoomHeight = this.height
    this.tree = d3.cluster().size([this.chartWidth, this.chartHeight])
    this.stratify = d3
      .stratify()
      .parentId(d => d.id.substring(0, d.id.lastIndexOf('.')))
    this.g = d3.select('g').attr('transform', `translate(${this.margin.left},0)`)
  },
  watch: {
    dataSet: function (dataValues) {
      if (dataValues) this.drawGraph(dataValues)
    }
  },
  methods: {
    drawGraph (dataValues) {
      let root = this.stratify(dataValues)
        .sort((a, b) => (a.height - b.height) || a.id.localeCompare(b.id))
      this.tree(root)

      this.g.selectAll('.link')
        .data(root.descendants().slice(1))
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', d => `M${d.y},${d.x}C${d.parent.y + 100},${d.x} ${d.parent.y + 100},${d.parent.x} ${d.parent.y},${d.parent.x}`)
      let node = this.g.selectAll('.clusterNode')
        .data(root.descendants())
        .enter().append('g')
        .attr('class', d => `clusterNode ${d.children ? 'node--internal' : 'node--leaf'}`)
        .attr('transform', d => `translate(${d.y},${d.x})`)
      node.append('circle')
        .attr('r', 2.5)
      node.append('text')
        .attr('dy', 3)
        .attr('x', d => d.children ? -8 : 8)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.id.substring(d.id.lastIndexOf('.') + 1))
    },
    zoom (e) {
      if (
        (this.zoomWidth <= 120) |
        (this.zoomWidth >= 3000) |
        (this.zoomHeight <= 120) |
        (this.zoomHeight >= 3000)
      ) {
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
.cluster-dendogram {
  user-select: none;
  background-color: #161616;
}
.clusterNode circle {
  fill: rgb(250, 246, 246);
}

.clusterNode text {
  font-size: 15px;
  fill: white;
}

.node--internal circle {
  fill:rgb(96, 223, 185);
}

.node--internal text {
  fill: rgb(255, 252, 97);
}

.link {
  fill: none;
  stroke: rgb(182, 182, 182);
  stroke-opacity: 0.4;
  stroke-width: 1.5px;
}
</style>
<template>
    <svg
    :width="width"
    :height="height"
    ></svg>
</template>

<script>
import * as d3 from 'd3'
export default {
  props: [ 'data' ],
  data: () => ({
    width: 400,
    height: 500,
    margin: {top: 20, left: 0, bottom: 30, right: 0}
  }),
  mounted () {
    this.width = this.$parent.$el.clientWidth
    let svg = d3.select(this.$el)
    let chartWidth = this.width - (this.margin.left + this.margin.right)
    let chartHeight = (this.height > this.width ? this.width : this.height) - (this.margin.top + this.margin.bottom)

    this.chartLayer = svg
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

    this.arc = d3.arc()
      .outerRadius(chartHeight / 2)
      .innerRadius(chartHeight / 4)
      .padAngle(0.03)
      .cornerRadius(8)

    this.pieG = this.chartLayer
      .append('g')
      .attr('transform', `translate(${chartWidth / 2}, ${chartHeight / 2})`)

    this.drawChart(this.data)
  },
  watch: {
    data: function (newData) {
      this.drawChart(newData)
    }
  },
  methods: {
    drawChart (data) {
      let arcs = d3.pie()
        .sort(null)
        .value(function (d) { return d.value })(data)

      let block = this.pieG.selectAll('.arc').data(arcs)
      block.select('path').attr('d', this.arc)

      let newBlock = block
        .enter()
        .append('g')
        .classed('arc', true)
      newBlock.append('path')
        .attr('d', this.arc)
        .attr('id', function (d, i) { return 'arc-' + i })
        .attr('stroke', 'white')
        .attr('fill', d => d3.interpolateCool(Math.random()))

      newBlock.append('text')
        .attr('dx', 10)
        .attr('dy', -5)
        .attr('fill', 'white')
        .append('textPath')
        .attr('xlink:href', function (d, i) { return '#arc-' + i })
        .text(function (d) { return d.data.name })

      block.exit().remove()
    }
  }
}
</script>



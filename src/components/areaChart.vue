<template>
  <v-flex xs12>
    <svg class="areaChartContainer" :width="width" :height="height"></svg>
  </v-flex>
</template>

<script>
import * as d3 from 'd3'
export default {
  props: {
    dataSet: {
      type: Array
    },
    height: {
      type: Number,
      default: 500
    },
    margin: {
      type: Object,
      default: () => ({
        left: 50,
        right: 20,
        top: 20,
        bottom: 30
      })
    }
  },
  data: () => ({
    width: 500,
    x: null,
    y: null,
    area: null,
    g: null,
    xAxis: null,
    yAxis: null,
    zoomed: null,
    zoom: null,
    svg: null,
    chartWidth: null,
    chartHeight: null,
    t: null
  }),
  mounted () {
    this.width = this.$el.clientWidth
  },
  methods: {
    drawChart (dataValues) {
      this.svg = d3.select('svg')
      this.chartWidth = this.width - this.margin.left - this.margin.right
      this.chartHeight = this.height - this.margin.top - this.margin.bottom
      this.g = this.svg.append('g')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

      this.x = d3.scaleTime().rangeRound([0, this.chartWidth])
      this.y = d3.scaleLinear().rangeRound([this.chartHeight, 0])

      this.xAxis = d3.axisBottom(this.x)
      this.yAxis = d3.axisLeft(this.y)

      this.zoomed = () => {
        this.t = d3.event.transform
        let xt = this.t.rescaleX(this.x)
        this.g.select('.chart').attr('d', this.area.x(d => xt(d.date)))
        this.g.select('.axis--x').call(this.xAxis.scale(xt))
      }

      this.zoom = d3.zoom()
        .scaleExtent([1, 32])
        .translateExtent([[0, 0], [this.chartWidth, this.chartHeight]])
        .extent([[0, 0], [this.chartWidth, this.chartHeight]])
        .on('zoom', this.zoomed)

      this.area = d3.area()
        .x(d => this.x(d.date))
        .y1(d => this.y(d.close))

      this.x.domain(d3.extent(dataValues, d => d.date))
      this.y.domain([0, d3.max(dataValues, d => d.close)])
      this.area.y0(this.y(0))
      // clip for cutout when zoom or pan
      this.svg.append('defs').append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', this.chartWidth)
        .attr('height', this.chartHeight)
      // area chart
      this.g
        .append('path')
        .datum(dataValues)
        .attr('class', 'chart')
        .attr('d', this.area)
      // x axis
      this.g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${this.chartHeight})`)
        .call(this.xAxis)
      // y axis
      this.g.append('g')
        .call(this.yAxis)
        .attr('class', 'axis axis--y')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Price ($)')
      // gradient
      this.svg.append('linearGradient')
        .attr('id', 'temperature-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0).attr('y1', this.y(0))
        .attr('x2', 0).attr('y2', this.y(this.chartHeight))
        .selectAll('stop')
        .data([
          {offset: '0%', color: '#3f94f9', opacity: 0},
          {offset: '100%', color: '#117dff', opacity: 1}
        ])
        .enter().append('stop')
        .attr('offset', d => d.offset)
        .attr('stop-color', d => d.color)
        .attr('stop-opacity', d => d.opacity)

      this.svg.call(this.zoom).transition()
        .duration(1500)
    },
    updateChart (dataValues) {
      this.x.domain(d3.extent(dataValues, d => d.date))
      this.y.domain([0, d3.max(dataValues, d => d.close)])

      let currentPoints = this.area
      let currentXAxis = this.xAxis

      if (this.t) {
        const xt = this.t.rescaleX(this.x)
        currentPoints = this.area.x(d => xt(d.date))
        currentXAxis = this.xAxis.scale(xt)
      }

      this.g
        .select('path')
        .datum(dataValues)
        .attr('d', currentPoints)
      // x axis
      this.g.select('.axis--x')
        .call(currentXAxis)
      // y axis
      this.g.select('.axis--y')
        .call(this.yAxis)
    }
  },
  watch: {
    dataSet: function (newValue, oldValue) {
      if (!oldValue) {
        this.drawChart(newValue)
      } else {
        this.updateChart(newValue)
      }
    }
  }
}
</script>

<style>
  .areaChartContainer {
    user-select: none;
    background-color: #1b1b1b
  }
  .chart {
    stroke: white;
    stroke-width: 1;
    fill: url('#temperature-gradient');
    clip-path: url('#clip');
  }
  .axis {
    font-size: 13px !important;
  }
  .axis text{
    fill: rgb(185, 185, 185);
  }
  .axis path, .axis line{
    stroke:rgb(185, 185, 185);
  }
</style>

<template>
  <v-flex xs12>
    <svg class="bar-chart" :width="width" :height="height">
      <g :transform="`translate(${margin.left}, ${margin.top})`">
        <g id="xAxis"></g>
        <g id="yAxis">
          <text fill="#000" transform="rotate(-90)" y="6" dy="0.71em" text-anchor="end">Frequency</text>
        </g>
        <rect 
        v-for="(data, i) in dataSet" :key="i"
        :id="'bar-'+i"
        class="bar"
        @mouseover="$emit('hover', {text: data.frequency, id: '#bar-'+i})"
        @mouseout="$emit('out')"></rect>
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
    chartWidth: null,
    chartHeight: null,
    x: null,
    y: null,
    svg: null
  }),
  mounted () {
    this.width = this.$el.clientWidth
    this.chartWidth = this.width - (this.margin.left + this.margin.right)
    this.chartHeight = this.height - (this.margin.top + this.margin.bottom)
    this.x = d3.scaleBand().rangeRound([0, this.chartWidth]).padding(0.1)
    this.y = d3.scaleLinear().rangeRound([this.chartHeight, 0])
  },
  methods: {
    drawChart (dataValue) {
      this.x.domain(dataValue.map(d => d.letter))
      this.y.domain([0, d3.max(dataValue, d => d.frequency)])
      d3.select('#xAxis')
        .attr('transform', `translate(0, ${this.chartHeight})`)
        .call(d3.axisBottom(this.x))
      d3.select('#yAxis')
        .call(d3.axisLeft(this.y).ticks(10, '%'))
      d3.selectAll('.bar')
        .data(dataValue)
        .attr('x', d => this.x(d.letter))
        .attr('y', d => this.y(d.frequency))
        .attr('width', this.x.bandwidth())
        .attr('height', d => this.chartHeight - this.y(d.frequency))
    }
  },
  watch: {
    dataSet: function (dataValue) {
      if (dataValue) {
        this.$nextTick(() => {
          this.drawChart(dataValue)
        })
      }
    }
  }
}
</script>

<style>
.bar-chart rect {
  fill: rgb(230, 230, 64);
}
.bar-chart text{
  fill: rgb(185, 185, 185);
  font-size: 15px;
}
.bar-chart line, .bar-chart path {
  stroke:rgb(185, 185, 185);
}
</style>


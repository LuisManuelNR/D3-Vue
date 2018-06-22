<template>
  <svg :width="width" :height="height"></svg>
</template>

<script>
import * as d3 from 'd3'
import * as topojson from 'topojson'
export default {
  data: () => ({
    width: 400,
    height: 550,
    margin: {top: 20, left: 0, bottom: 30, right: 0}
  }),
  mounted () {
    this.width = this.$parent.$el.clientWidth
    let svg = d3.select(this.$el)
    let chartWidth = this.width - (this.margin.left + this.margin.right)
    let chartHeight = this.height - (this.margin.top + this.margin.bottom)

    let projection = d3.geoAlbersUsa()
      .scale(this.width)
      .translate([chartWidth / 2, chartHeight / 2])
    let path = d3.geoPath().projection(projection)

    d3.json('/static/example-data/us.json').then(us => {
      let g = svg.append('g')
      g
        .selectAll('.state')
        .data(topojson.feature(us, us.objects.usStates).features)
        .enter()
        .append('path')
        .attr('class', 'state')
        .attr('id', d => {
          return d.properties.STATE_ABBR
        })
        .attr('d', path)
        .on('mouseover', d => {
          this.$emit('stateSelected', d.properties.STATE_ABBR)
        })
        .on('mouseout', d => {
          this.$emit('stateDeselected', d.properties.STATE_ABBR)
        })
    })
  }
}
</script>

<style>
.state {
  fill: rgb(55, 98, 240);
  stroke: #fff;
}
.state:hover {
  fill: rgb(119, 148, 243);
}
</style>

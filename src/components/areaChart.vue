<template>
    <svg width='960' height='500'></svg>
</template>

<script>
import * as d3 from 'd3'
export default {
  mounted () {
    let svg = d3.select(this.$el)
    let margin = {top: 20, right: 20, bottom: 30, left: 50}
    let width = +svg.attr('width') - margin.left - margin.right
    let height = +svg.attr('height') - margin.top - margin.bottom
    let g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    let parseTime = d3.timeParse('%d-%b-%y')

    let x = d3.scaleTime().range([0, width])
    let y = d3.scaleLinear().range([height, 0])

    let xAxis = d3.axisBottom(x)
    let yAxis = d3.axisLeft(y)

    let zoom = d3.zoom()
      .scaleExtent([1, 32])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]])
      .on('zoom', zoomed)

    let area = d3.area()
      .x(function (d) { return x(d.date) })
      .y0(height)
      .y1(function (d) { return y(d.close) })

    svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height)

    d3.tsv('static/example-data/data.tsv').then(function (data) {
      // if (error) throw error)
      data.map(d => {
        d.date = parseTime(d.date)
        d.close = +d.close
      })

      x.domain(d3.extent(data, function (d) { return d.date }))
      y.domain([0, d3.max(data, function (d) { return d.close })])
      area.y0(y(0))

      g.append('path')
        .datum(data)
        .attr('class', 'area')
        .attr('d', area)

      g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      g.append('g')
        .attr('class', 'axis axis--y')
        .call(yAxis)

      g.append('g')
        .call(d3.axisLeft(y))
        .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Price ($)')

      let d0 = new Date(2007, 0, 1)
      let d1 = new Date(2008, 0, 1)

      svg.append('linearGradient')
      .attr('id', 'temperature-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', y(0))
      .attr('x2', 0).attr('y2', y(height))
      .selectAll('stop')
        .data([
          {offset: '0%', color: 'steelblue'},
          {offset: '100%', color: 'red'}
        ])
      .enter().append('stop')
        .attr('offset', function (d) { return d.offset })
        .attr('stop-color', function (d) { return d.color })

      svg.call(zoom).transition()
        .duration(1500)
        .call(zoom.transform, d3.zoomIdentity
            .scale(width / (x(d1) - x(d0)))
            .translate(-x(d0), 0))
    })

    function zoomed () {
      let t = d3.event.transform
      let xt = t.rescaleX(x)
      g.select('.area').attr('d', area.x(function (d) { return xt(d.date) }))
      g.select('.axis--x').call(xAxis.scale(xt))
    }
  }
}
</script>

<style>
.area {
  fill: url(#temperature-gradient);
  stroke-width: 0.5px;
  clip-path: url(#clip);
}
</style>



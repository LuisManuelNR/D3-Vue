<template>
  <v-flex>
    <svg :width="width" :height="height"
      :viewBox="`${offsetX} ${offsetY} ${zoomWidth} ${zoomHeight}`"
      @mousewheel.prevent="zoom"
      @mousedown.exact="panEnabled = true"
      @mouseup="panEnabled = false"
      @mousemove="pan">
      <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
    </svg>
  </v-flex>
</template>

<script>
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
        left: 40,
        right: 20,
        top: 40,
        bottom: 30
      })
    }
  },
  data: () => ({
    width: 500,
    height: 500,
    offsetX: 0,
    offsetY: 0,
    zoomWidth: 0,
    zoomHeight: 0,
    panEnabled: false
  }),
  mounted () {
    this.width = this.$el.clientWidth - (this.margin.left + this.margin.right)
    this.height = this.desiredHeight - (this.margin.top + this.margin.bottom)
    this.zoomWidth = this.width
    this.zoomHeight = this.height
  },
  methods: {
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
  svg {
    user-select: none;
    background-color: #424242
  }
</style>

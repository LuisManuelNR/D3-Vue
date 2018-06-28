import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0}
  },
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: resolve => {
        require(['../views/dashboard'], resolve)
      }
    },
    {
      path: '/pie-chart',
      name: 'PieChart',
      component: resolve => {
        require(['../views/pieChartView'], resolve)
      }
    },
    {
      path: '/map-chart',
      name: 'MapChart',
      component: resolve => {
        require(['../views/mapView'], resolve)
      }
    },
    {
      path: '/network-graph',
      name: 'NetworkGraph',
      component: resolve => {
        require(['../views/networkGraphView'], resolve)
      }
    },
    {
      path: '/area-chart',
      name: 'AreaChart',
      component: resolve => {
        require(['../views/areaChartView'], resolve)
      }
    },
    {
      path: '/bar-chart',
      name: 'BarChart',
      component: resolve => {
        require(['../views/barChartView'], resolve)
      }
    },
    {
      path: '/cluster-dendogram',
      name: 'ClusterDendogram',
      component: resolve => {
        require(['../views/clusterDendogramView'], resolve)
      }
    }
  ]
})

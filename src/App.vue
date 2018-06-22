<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
    >
      <v-list dense>
        <v-list-tile v-for="(item, i) in menu" :key="i" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left dense>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>D3Vue</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn light target="new" href="https://github.com/LuisManuelNR/D3-Vue">
        <img class="mr-2" src="/static/img/github.svg" height="90%" alt="github">
        <span>github</span>
        </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <v-flex xs12 text-xs-center>
        <span>examples of use vue.js with d3.js by Luis Manuel Noguerol Ramirez <a target="new" href="http://chazycub.com">chazycub.com</a> &copy; 2018</span>
      </v-flex>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: true,
      menu: [
        {link: '/', title: 'Dashboard', icon: 'dashboard'},
        {link: '/pie-chart', title: 'Pie Chart', icon: 'donut_large'},
        {link: '/map-chart', title: 'Map', icon: 'map'},
        {link: '/network-graph', title: 'Network Graph', icon: 'bubble_chart'}
      ]
    })
  }
</script>
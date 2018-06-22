<template>
  <v-layout wrap row>
    <v-flex xs12>
      <v-btn @click="addName" :disabled="names.length == displayedNames.length">add name</v-btn>
      <v-btn @click="deleteName" :disabled="displayedNames.length == 3">delete name</v-btn>
    </v-flex>
    <v-flex xs12>
      <pie :data="displayedNames"></pie>
    </v-flex>
  </v-layout>
</template>

<script>
import pie from '../components/pieChart'
export default {
  components: {
    pie
  },
  data () {
    return {
      names: [
        { name: 'Sarah', value: 2502 },
        { name: 'Emma', value: 2005 },
        { name: 'Laura', value: 1968 },
        { name: 'Chloé', value: 1863 },
        { name: 'Marie', value: 1810 },
        { name: 'Emily', value: 1637 },
        { name: 'Léa', value: 1592 },
        { name: 'Camille', value: 1572 },
        { name: 'Anna', value: 1433 },
        { name: 'Manon', value: 1403 }
      ],
      displayedNames: [
        { name: 'Sarah', value: 2502 },
        { name: 'Emma', value: 2005 },
        { name: 'Laura', value: 1968 }
      ],
      index: 2
    }
  },
  methods: {
    addName () {
      this.displayedNames.push(this.names[this.index])
      this.index++
    },
    deleteName () {
      this.displayedNames.shift()
      this.index--
    }
  }
}
</script>



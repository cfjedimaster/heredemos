<template>
  <v-container>
    <h2>Select a Space to Edit</h2>
    <v-row justify="end">
      <v-col cols="4">
        <v-text-field v-model="search" label="Filter" single-line></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="spaces"
      :search="search">

      <template v-slot:item.actions="{item}">
        <v-btn @click="selectSpace(item)" color="primary">Select</v-btn>
      </template>
    </v-data-table> 
  </v-container>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('loadSpaces');
  },
  data() {
    return {
      search:'',
      headers:[
        {text: 'Title', value:'title'},
        {text: 'Description', value:'description'},
        {text:'', value:'actions' }
      ]
    }
  },
  computed:{
    spaces() {
      return this.$store.state.spaces;
    }
  },
  methods: {
    selectSpace(s) {
      console.log('click on '+s.title);
    }
  }
}
</script>
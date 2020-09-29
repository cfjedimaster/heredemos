<template>
  <v-container>
    <h2>Space {{ space.title }} <span v-if="features">({{ features.length }} features)</span></h2>
  </v-container>
</template>

<script>
export default {
  created() {
	this.space = this.$route.params.space;
    this.$store.dispatch('loadSpace', { space:this.space });
  },
  data() {
    return {
		space: null
    }
  },
  computed:{
    features() {
      return this.$store.state.features;
    }
  },
  methods: {
  }
}
</script>
<template>
  <v-container>
    <h2>Space {{ space.title }} <span v-if="features">({{ features.length }} features)</span></h2>

    <v-card v-for="feature in features" :key="feature.id" class="mb-6" elevation="10">
      <v-card-title>Feature: {{feature.id}}</v-card-title>
      <v-card-text>
        <v-textarea 
          label="Properties" v-model="feature.properties"
          background-color="amber lighten-4" rows="10" row-height="30"
        ></v-textarea>
        <v-textarea 
          label="Geometry" v-model="feature.geometry"
          background-color="amber lighten-4" rows="10" row-height="30"
        ></v-textarea>
        <GeometryMap :geometry="feature.geometry" width="400" height="300"></GeometryMap>
      </v-card-text>
      <v-card-actions>
        <v-btn color="green" text @click="saveFeature(feature)">Save Changes</v-btn>
      </v-card-actions>
    </v-card>

  </v-container>
</template>

<script>
import GeometryMap from '@/components/GeometryMap';

export default {
  components: { GeometryMap },
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
    saveFeature(f) {
      console.log('lets save this feature');
      console.log(f.properties)
    }
  }
}
</script>
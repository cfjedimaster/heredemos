<!--
The home page begins with a token prompt. Can be retrieved from LocalStorage
-->
<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">


        <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Token Entry</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <p>
                Use the field below to enter your Data Hub access token. It must have write
                permissions for spaces you use.
                </p>
                <v-form>
                  <v-text-field
                    label="Access Token"
                    v-model="access_token"
                    prepend-icon="mdi-account-key"
                    type="text"
                  ></v-text-field>

                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="setToken">Set</v-btn>
              </v-card-actions>
            </v-card>


      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  data() {
    return {
      access_token:''
    }
  },
  created() {
    this.access_token = this.token;
  },
  computed: {
    token() {
      return this.$store.getters.accessToken;
    }
  },
  methods: {
    setToken() {
      if(this.access_token === '') return;
      this.$store.commit('setAccessToken', this.access_token);
      this.$router.push('spaceList');
    }
  }
}
</script>
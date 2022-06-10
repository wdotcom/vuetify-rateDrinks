<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="$route.fullPath.includes('/showParty')"
          to="/showParties"
          icon="arrow_back"
          flat
          dense
          label="Back"
        />
        <q-btn
          v-if="$route.fullPath.includes('/rateDrink')"
          to="/showParty"
          icon="arrow_back"
          flat
          dense
          label="Back"
        /><q-btn
          v-if="$route.fullPath.includes('/help')"
          @click="exitHelp"
          icon="arrow_back"
          flat
          dense
          label="Back"
        />
        <q-toolbar-title class="absolute-center">
          Rate Your Drinks
        </q-toolbar-title>
      </q-toolbar>

      <q-btn
        v-if="this.$route.fullPath != '/'"
        @click="logoutUser"
        to="/"
        icon="logout"
        class="absolute-right q-pr-md"
        no-caps
        flat
        dense
      />
      <q-img src="../statics/header.jpg" class="header-image absolute-top" />
    </q-header>
    <q-footer elevated>
      <q-toolbar>
        <q-btn
          v-if="$route.fullPath.includes('/showParty')"
          icon="add_circle"
          label="Drink"
          to="/createDrink"
        />
        <q-btn
          v-if="$route.fullPath.includes('/showParties')"
          icon="add_circle"
          label="Party"
          to="/createParty"
        />
        <q-space />
        <q-btn
          icon="help"
          v-if!="$route.fullPath.includes('/showParties')"
          @click="openHelp"
        />
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <!--  <keep-alive>-->
        <component :is="Component" />
        <!--  </keep-alive>-->
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth, db } from "boot/firebase";

export default {
  setup() {
    return {};
  },
  methods: {
    exitHelp() {
      let currentPage = this.$q.sessionStorage.getItem("currentPage");
      this.$router.push(currentPage);
    },
    openHelp() {
      this.$q.sessionStorage.set("currentPage", this.$route.fullPath);
      console.log("route name :", this.$route.fullPath);
      this.$router.push("/help");
    },
    logoutUser() {
      //const userId = auth.currentUser.uid;
      signOut(auth)
        .then(() => {
          this.$q.notify("Signout successful");
          this.$q.sessionStorage.set("partyID", "");
          this.$q.sessionStorage.set("partyName", "");
          this.$q.sessionStorage.set("partyHost", "");
          this.$q.sessionStorage.set("partyHostID", "");
          this.$q.sessionStorage.set("partyDescription", "");
          this.$q.sessionStorage.set("partyDate", "");
          this.$q.sessionStorage.set("partyTime", "");
          this.$q.sessionStorage.set("partyInProgress", "");
          LocalStorage.set("storedID", "");
          LocalStorage.set("storedName", "");
          this.$router.push("/");
          // Sign-out successful.
        })
        .catch((error) => {
          // An error happened.
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss">
.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.6;
}
</style>

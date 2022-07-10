// Import the functions you need from the SDKs you need

import { RouterLink } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        component: () => import("src/pages/Auth.vue"),
        //meta: { requiresUnauth: true },
      },
      {
        path: "/camera",
        component: () => import("src/pages/pageCamera.vue"),
        //meta: { requiresUnauth: true },
      },
      {
        path: "/showParties",
        component: () => import("src/pages/pageShowParties.vue"),
        //meta: { requiresAuth: true },
      },

      {
        path: "/showParty",
        component: () => import("src/pages/pageShowParty.vue"),
        //meta: { requiresAuth: true },
      },
      {
        path: "/pagePartyDrinks",
        component: () => import("src/pages/pagePartyDrinks.vue"),
        //meta: { requiresAuth: true },
      },
      {
        path: "/createParty",
        component: () => import("src/pages/pageCreateParty.vue"),
        //meta: { requiresAuth: true },
      },
      {
        path: "/createDrink",
        component: () => import("src/pages/pageCreateDrink.vue"),
        //meta: { requiresAuth: true },
      },
      {
        path: "/showDrinks",
        component: () => import("src/pages/pageShowDrinks.vue"),
        //meta: { requiresAuth: true },
      },
      {
        path: "/rateDrink",
        component: () => import("src/pages/pageRateDrink.vue"),
        //meta: { requiresAuth: true },
      },
      {
        path: "/help",
        component: () => import("src/pages/pageHelp.vue"),
        //meta: { requiresAuth: true },
      },
      {
        path: "/error",
        component: () => import("src/pages/ErrorNotFound.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

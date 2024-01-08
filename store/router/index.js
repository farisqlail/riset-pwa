// router/index.js
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../../pages/index.vue";
import Checkout from "../../pages/checkouts/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: Checkout,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

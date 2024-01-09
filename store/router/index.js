// router/index.js
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../../pages/index.vue";
import Checkout from "../../pages/checkout/index.vue";
import Invoice from "../../pages/invoice/index.vue";
import Nota from "../../pages/invoice/Nota.vue";
import Payments from "../../pages/payments/index.vue";

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
  {
    path: "/invoice",
    name: "Invoice",
    component: Invoice,
  },
  {
    path: "/payments",
    name: "Payments",
    component: Payments,
  },
  {
    path: "/invoice/nota",
    name: "nota",
    component: Nota,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

import { createRouter, createWebHistory } from 'vue-router';
// import Product_detail from '../pages/product_detail/product_detail.vue';
import Order from '../pages/order/order.vue';

const routes = [
  // {
  //   path: '/',
  //   name: 'product_detail/:id',
  //   component: Product_detail,
  // },
  {
    path: '/order',
    name: 'order',
    component: Order,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
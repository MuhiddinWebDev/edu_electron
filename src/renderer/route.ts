import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layouts",
      redirect: "/home",
      component: () => import("./pages/Layouts/Sidebar.vue"),
      children: [
        {
          path: "/home",
          name: "Home",
          component: () => import("./pages/Home/HomeIndex.vue"),
        },
        {
          path: "/savdo-docs/branches",
          name: "branches",
          component: () =>
            import("./pages/savdo-docs/branches/IndexBranch.vue"),
        },
        {
          path: "/savdo-docs/clients",
          name: "clients",
          component: () => import("./pages/savdo-docs/clients/IndexClient.vue"),
        },
        {
          path: "/savdo-docs/rooms",
          name: "rooms",
          component: () => import("./pages/savdo-docs/rooms/IndexRooms.vue"),
        },
        {
          path: "/savdo-docs/tables",
          name: "tables",
          component: () => import("./pages/savdo-docs/tables/IndexTables.vue"),
        },
        {
          path: "/savdo-docs/extra-service",
          name: "extra-service",
          component: () =>
            import("./pages/savdo-docs/extra-services/IndexExtraService.vue"),
        },
        {
          path: "/savdo-docs/printer",
          name: "printers",
          component: () =>
            import("./pages/savdo-docs/printer/IndexPrinter.vue"),
        },
        {
          path: "/savdo-docs/roles",
          name: "roles",
          component: () => import("./pages/savdo-docs/roles/IndexRoles.vue"),
        },
        {
          path: "/savdo-docs/food-group",
          name: "food-group",
          component: () =>
            import("./pages/savdo-docs/food-group/IndexFoodGroup.vue"),
        },
        {
          path: "/savdo-docs/food",
          name: "food",
          component: () => import("./pages/savdo-docs/food/IndexFood.vue"),
        },
        {
          path: "/savdo-docs/employee-salary",
          name: "employee-salary",
          component: () => import("./pages/savdo-docs/employee-salary/IndexEmpSalary.vue")
        },
        {
          path: "/test",
          name: 'test',
          component: () => import("./components/text.vue")
        },
        {
          path: "/payments/pay-supplier",
          name: "pay-supplier",
          component: () =>
            import("./pages/payments/pay-supplier/IndexPaySupplier.vue"),
        },
        {
          path: "/payments/pay-waiter",
          name: "pay-waiter",
          component: () =>
            import("./pages/payments/pay-waiter/IndexPayWaiter.vue"),
        },
        {
          path: "/payments/pay-chef",
          name: "pay-chef",
          component: () => import("./pages/payments/pay-chef/IndexPayChef.vue"),
        },
        {
          path: "/payments/cleint-pay",
          name: "pay-client",
          component: () => import("./pages/payments/pay-client/PayClient.vue"),
        },
        {
          path: "/payments/pay-worker",
          name: "pay-worker",
          component: () =>
            import("./pages/payments/pay-worker/IndexPayWorker.vue"),
        },
        {
          path: '/payments/pay-caisher',
          name: "pay-caisher",
          component: () => import("./pages/payments/pay-caisher/IndexPayCaisher.vue")
        },
        {
          path: '/supplier-report',
          name: 'supplier-report',
          component: () => import('./pages/reports/supplierReports/Index.vue')
        },
        {
          path: '/waiter-report',
          name: 'waiter-report',
          component: () => import('./pages/reports/waiterReports/Index.vue')
        },
        {
          path: '/profit-report',
          name: 'profit-report',
          component: () => import('./pages/reports/profitFood/Index.vue')
        },
        {
          path: '/refund-food',
          name: 'refund-food',
          component: () => import('./pages/reports/refundFood/Index.vue')
        },
        {
          path: '/supplier-report',
          name: 'supplier-report',
          component: () => import('./pages/reports/supplierReports/Index.vue')
        },
        {
          path: '/product-akt-sverka',
          name: 'product-akt-sverka',
          component: () => import('./pages/akt-sverka/sverka-product/Index.vue')
        },
        {
          path: '/sold-food',
          name: 'sold-food',
          component: () => import('./pages/akt-sverka/sold-food/Index.vue')
        },
        {
          path: '/worker-act',
          name: 'worker-act',
          component: () => import('./pages/akt-sverka/workerAct/Index.vue')
        },
        {
          path: '/worker-report',
          name: 'worker-report',
          component: () => import('./pages/reports/workerReport/Index.vue')
        },
        {
          path: '/waiter-act',
          name: 'waiter-act',
          component: () => import('./pages/akt-sverka/sverka-waiter/Index.vue')
        },
        {
          path: '/chef-act',
          name: 'chef-act',
          component: () => import('./pages/akt-sverka/sverka-chef/Index.vue')
        },
        {
          path: '/chef-report',
          name: 'chef-report',
          component: () => import('./pages/reports/chefReports/Index.vue')
        },
        {
          path: '/caisher-act',
          name: 'caisher-act',
          component: () => import("./pages/akt-sverka/sverka-caisher/Index.vue")
        },
        {
          path: '/caisher-report',
          name: 'caisher-report',
          component: () => import("./pages/reports/caisherReports/Index.vue")
        },
        {
          name: 'akt-sverka-kassa',
          path: '/reports/akt-sverka-kassa',
          component: () => import(`./pages/akt-sverka/sverka-kassa/Index.vue`)
        },
        {
          name: 'food-resource-report',
          path: '/food-resource-report',
          component: () => import(`./pages/reports/foodResourceReport/Index.vue`)
        },
        {
          name: 'reports',
          path: '/reports',
          component: () => import(`./components/ReportsPage.vue`)
        },
        {
          path: "/savdo-docs/orders",
          name: "orders",
          component: () => import("./pages/savdo-docs/orders/IndexOrders.vue"),
        },
        {
          path: "/kirim",
          name: "kirim",
          component: () => import("./pages/kirim-docs/kirim/IndexKirim.vue"),
        },
        {
          path: "/suppliers",
          name: "suppliers",
          component: () =>
            import("./pages/kirim-docs/suppliers/IndexSuppliers.vue"),
        },
        {
          path: "/raw_materials",
          name: "raw_materials",
          component: () =>
            import("./pages/kirim-docs/raw_materials/IndexRaw_materials.vue"),
        },
        {
          path: "/worker",
          name: "worker",
          component: () =>
            import("./pages/kirim-docs/workers/IndexWorkers.vue"),
        },
        {
          path: "/measure",
          name: "measure",
          component: () =>
            import("./pages/kirim-docs/measure/IndexMeasure.vue"),
        },
        {
          path: "/chiefs",
          name: "chiefs",
          component: () => import("./pages/kirim-docs/chiefs/IndexChiefs.vue"),
        },
        {
          path: "/waiters",
          name: "waiters",
          component: () =>
            import("./pages/kirim-docs/waiters/IndexWaiters.vue"),
        },
        {
          path: "/caishers",
          name: "caishers",
          component: () =>
            import("./pages/kirim-docs/caishers/IndexCaishers.vue"),
        },
        {
          path: "/pay_to_work",
          name: "pay_to_work",
          component: () =>
            import("./pages/kirim-docs/pay_to_worker/IndexSalary.vue"),
        },
        {
          path: "/reports/akt-sverka-supplier",
          name: "akt-sverka-supplier",
          component: () =>
            import("./pages/akt-sverka/sverka-supplier/Index.vue"),
        },
        {
          path: "/restr-caisher",
          name: "restr-caisher",
          component: () => import("./pages/reports/restrcaisher/Index.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("./pages/Login/LoginIndex.vue"),
    },
    {
      path: "/selling-window",
      name: "sellingWindow",
      component: () => import("./pages/selling_window/index.vue"),
    },
    {
      path: '/chief-sell-window',
      name: 'chiefSellWindow',
      component: () => import("./pages/chief/Index.vue")
    },
    {
      path: '/tablo',
      name: 'tablo',
      component: () => import("./pages/Tablo/Index.vue")
    },
    {
      path: "/selling-window-entry",
      name: "Selling Entry",
      component: () => import("./pages/selling_window/enter.vue"),
    },
    {
      path: "/chief-window",
      name: "chief-window",
      component: () => import("./pages/selling_window/ChiefWindow.vue"),
    },  
    {
      path: "/selling-window-table-orginal/:order_id",
      name: "SellingTable",
      component: () => import("./pages/selling_window/TableWindow.vue"),
      props: true,
    },
    // ## not found page
    {
      name: "not-found",
      path: "/:path*",
      component: () => import("./pages/Login/LoginIndex.vue"),
      meta: {
        title: "Oh no!",
      },
    },
  ],
});

export default router;

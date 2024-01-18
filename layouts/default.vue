<template>
  <div class="main">
    <Navbar />
    <div class="container">
      <nuxt />
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <!-- <script
      id="snipcart"
      src="https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.js"
      data-api-key="ODQ1Y2E1MmItOGVkNi00NzliLWIyMGItNWZlYjIzOTBkZGEwNjM4NDAyODU0MTUzODUwNzkw"
      data-currency="idr"
    ></script> -->
  </div>
</template>

<script>
window.csrf_token = "{{ csrf_token() }}";
</script>
<script>
import Navbar from "~/components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
  script: [
        {
          src: '../sw.js',
          body: true,
        },
      ],
};
</script>
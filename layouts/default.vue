<template>
  <div class="main">
    <Navbar />
    <nuxt />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script
      id="snipcart"
      src="https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.js"
      data-api-key="ST_YmQ1NjVmZjAtODRlYy00MzJkLWEwOTUtYmY4NTVjNDc3ZjUyNjM4NDAyODU1MjMyOTQ5MDIy" 
    ></script>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar.vue'

export default {
  components: {
    Navbar,
  },
}
</script>
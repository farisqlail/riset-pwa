<template>
  <div>
    <Navbar />
    <div class="container gap-4 mx-auto">
      <h2 class="text-2xl font-bold my-4">Pilih pembayaran</h2>
        <div class="item flex justify-between items-center">
            <img src="~/assets/images/bca.png" width="100" alt="">
            <button @click="redirectInvoice" class="btn btn-info">Pilih</button>
        </div>
        <div class="item flex justify-between items-center">
            <img src="~/assets/images/ovo.png" width="100" alt="">
            <button @click="redirectInvoice" class="btn btn-info">Pilih</button>
        </div>
        <div class="item flex justify-between items-center mt-3">
            <img src="~/assets/images/dana.png" width="100" alt="">
            <button @click="redirectInvoice" class="btn btn-info">Pilih</button>
        </div>
    </div>
  </div>
</template>

<script>
import Navbar from "~/components/Navbar.vue";
import axios from "axios";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    redirectInvoice(){
        this.$router.push("/invoice");
    }
  },
};
</script>

<template>
  <div>
    <Head>
      <title>Riset PWA</title>
    </Head>
    <!-- Konten aplikasi Anda di sini -->
    <VitePwaManifest />
    <NuxtPage />
  </div>
</template>

<script>
// import { defineComponent } from 'vue';
// import { VitePwaManifest } from 'vite-plugin-pwa/pwa/components';

export default defineComponent({
  head(){
    return {
      title: 'Riset PWA'
    }
  },
  components: {
    // VitePwaManifest,
  },
});
</script>

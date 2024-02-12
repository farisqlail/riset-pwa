<template>
  <div>
    <!-- Konten aplikasi Anda di sini -->
    <VitePwaManifest />
    <NuxtPage />
  </div>
</template>

<script>
// import { defineComponent } from 'vue';
// import { VitePwaManifest } from 'vite-plugin-pwa/pwa/components';

export default defineComponent({
  components: {
    // VitePwaManifest,
  },
  mounted() {
    // Menambahkan tautan ke file CSS DaisyUI
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/daisyui@4.6.2/dist/full.min.css";
    link.rel = "stylesheet";
    link.type = "text/css";
    document.head.appendChild(link);

    // Menambahkan script JavaScript Tailwind CSS
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    document.body.appendChild(script);
  },
});
</script>

<template>
    <div>
        <b-card class="mt-4">
            <div class="row-item">
                <div class="item-cart mb-4">
                    <div class="d-flex align-self-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/1280px-Logo_ovo_purple.svg.png" width="100" alt="" srcset="">
                    </div>
                    <div class="d-flex align-self-center">
                        <b-button variant="success" @click="invoice">Pilih</b-button>
                    </div>
                </div>
                <div class="item-cart mb-3">
                    <div class="d-flex align-self-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/2560px-Logo_dana_blue.svg.png" width="100" alt="" srcset="">
                    </div>
                    <div class="d-flex align-self-center">
                        <b-button variant="success" @click="invoice">Pilih</b-button>
                    </div>
                </div>
                <div class="item-cart mb-3">
                    <div class="d-flex align-self-center">
                        <img src="https://www.freepnglogos.com/uploads/logo-bca-png/bank-central-asia-logo-bank-central-asia-bca-format-cdr-png-gudril-1.png" width="100" alt="" srcset="">
                    </div>
                    <div class="d-flex align-self-center">
                        <b-button variant="success" @click="invoice">Pilih</b-button>
                    </div>
                </div>
            </div>
        </b-card>
    </div>
</template>

<script>
export default {
    methods: {
        invoice(){
            this.$router.push("/invoice");
        }
    }
}
</script>
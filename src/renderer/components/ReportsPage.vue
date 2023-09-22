<script setup lang="ts">
import { useRouter } from 'vue-router';
import { DocumentTextOutline } from '@vicons/ionicons5';

const router = useRouter()
</script>
<template>
    <div>
        <div class="content">
            <div class="report_card">
                <span>Ta'minotchi</span>
                <div class="report_items">
                    <div class="report_item" @click="router.push({ name: 'supplier-report'})">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon> Ta'minotchi hisoboti
                    </div>
                    <div class="report_item" @click="router.push({ name: 'test'})">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon> Test
                    </div>
                    <div class="report_item" @click="router.push({ name: 'akt-sverka-supplier'})">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon>
                        Ta'minotchi sverkasi
                    </div>
                </div>
            </div>
            <div class="report_card">
                <span>Xomashyolar hisoboti</span>
                <div class="report_items">
                    <div class="report_item" @click="router.push({ name: 'food-resource-report'})">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon> Xomashyo hisoboti
                    </div>
                    <div class="report_item" @click="router.push({ name: 'product-akt-sverka'})">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon>
                        Xomashyo sverkasi
                    </div>
                </div>
            </div>
            <div class="report_card">
                <span>Kassa hisoboti</span>
                <div class="report_items">
                    <div class="report_item" @click="router.push({ name: 'restr-caisher' })">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon> Kassa restr
                    </div>
                </div>
                <div class="report_items" @click="router.push({ name: 'akt-sverka-kassa'})">
                    <div class="report_item">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon> Sverka kassa
                    </div>
                </div>
            </div>
            <div class="report_card">
                <span>Foyda-zarar hisoboti</span>
                <div class="report_items">
                    <div class="report_item" @click="router.push({ name: 'profit-report'})">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon> Foyda hisoboti
                    </div>
                </div>
            </div>
            <div class="report_card">
                <span>Taom hisoboti</span>
                <div class="report_items">
                    <div class="report_item" @click="router.push({ name: 'sold-food' })">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon> Sotilgan taom hisoboti
                    </div>
                </div>
            </div>
            <div class="report_card">
                <span>Ofitsantlar hisoboti</span>
                <div class="report_items">
                    <div class="report_item" @click="router.push({ name: 'waiter-report' })">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon> Ofitsant hisoboti
                    </div>
                    <div class="report_item" @click="router.push({ name: 'waiter-act' })">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon> Ofitsant sverkasi
                    </div>
                </div>
            </div>
            <div class="report_card">
                <span>Oshpaz hisoboti</span>
                <div class="report_items">
                    <div class="report_item" @click="router.push({ name: 'chef-report'})">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon>
                        Oshpaz hisoboti
                    </div>

                    <div class="report_item" @click="router.push({ name: 'chef-act' })">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon> Oshpaz sverkasi
                    </div>
                </div>
            </div>
            <div class="report_card">
                <span>Kassir hisoboti</span>
                <div class="report_items">
                    <div class="report_item" @click="router.push({ name: 'caisher-report'})">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon>
                        Kassir hisoboti
                    </div>

                    <div class="report_item" @click="router.push({ name: 'caisher-act' })">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon> Kassir sverkasi
                    </div>
                </div>
            </div>
            <div class="report_card">
                <span>Ishchi hisoboti</span>
                <div class="report_items">
                    <div class="report_item" @click="router.push({ name: 'worker-report'})">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon>
                        Ishchi hisoboti
                    </div>

                    <div class="report_item" @click="router.push({ name: 'worker-act' })">
                        <n-icon>
                           <DocumentTextOutline></DocumentTextOutline> 
                        </n-icon> Ishchi sverkasi
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.content {
    display: grid;
    grid-template-columns: 24% 24% 24% 24%;
    padding: 10px;
}
.report_card {
    background-color: #2d364c;
    font-size: 18px;
    border-radius: 10px;
    color: white;
    padding: 8px;
    margin-left: 20px;
    margin-top: 20px;
}
.report_items {
    padding-left: 10px;
}
.report_card .report_item {
    cursor: pointer;
}
.report_card .report_item:hover {
    color: #0cb754;
}
</style>
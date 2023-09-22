<script setup>
// import



const railStyle =({focused, checked}) => {
    const style = {}
    if (checked) {
        style.background = '#32CD32'
        if (focused) {
        
        style.boxShadow = '0 0 0 2px #d0305040'
        }
    } else {
        style.background = '#d03050'
        if (focused) {
        style.boxShadow = '0 0 0 2px #2080f040'
        }
    }
    style.width = '280px'
    return style
}

</script>

<template>
    <div class="drawer">
        <div class="content">

        </div>
        <div class="bottom">
            <n-switch :checked-value="1" :unchecked-value="0" :rail-style="railStyle" style="margin-top: 0px; width: 100%;">
                <template #checked>
                    Xonalar
                </template>
                <template #unchecked>
                    Ofitsantlar
                </template>
            </n-switch>
        </div>
    </div>
</template>

<style scoped>
.drawer {
    background-color: #d9e2f9;
    height: 100%;
}
.bottom {
    width: 100%;
    margin-top: 60px;
}
.content {
    width: 100%;
    height: calc(100vh - 100px);
}
</style>
import mode from './modules/mode';
// import Vue from 'vue';
new Vue({
    el: '#appIndex',
    data: {
        message: 'Vue Installed',
    },
    mounted: function () {
        mode();
    },
});

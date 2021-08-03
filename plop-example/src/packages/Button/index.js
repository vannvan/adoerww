import button from './index.vue';

button.install = function(Vue) {
    Vue.component(button.name, ComponentName);
};

export default ComponentName;
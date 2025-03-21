/* import Vue from 'vue';//用cdn的时候要注释掉 */
import Vuetify from 'vuetify/lib/framework';
/* global Vue */
Vue.use(Vuetify);

export default new Vuetify({
    theme: {
    dark: false,
    themes: {
        light: {
            primary: "#66BB6A",
            secondary: "#548235",
            accent: '#74BB44',
            error: '#FF0000',
            info: '#666666',
            success: '#548235',
            warning: '#ffcc00',
        },
        dark: {
            primary: "#666666",
        },
    },
    },
});

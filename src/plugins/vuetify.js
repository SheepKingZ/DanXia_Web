/* import Vue from 'vue';//用cdn的时候要注释掉 */
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

export default createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: "#66BB6A",
                    secondary: "#548235",
                    accent: '#74BB44',
                    error: '#FF0000',
                    info: '#666666',
                    success: '#548235',
                    warning: '#ffcc00',
                }
            },
            dark: {
                colors: {
                    primary: "#666666",
                }
            }
        }
    }
});

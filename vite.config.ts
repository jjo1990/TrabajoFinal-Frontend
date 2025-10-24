import {defineConfig} from "vite";
import {resolve} from "path";

export default defineConfig({
    build: {
        rollupOptions:{
            input: {
                index:resolve(__dirname, "index.html"),
                login:resolve(__dirname, "src/pages/auth/login/login.html"),
                registro: resolve(__dirname, "src/pages/auth/registro/registro.html"),
                adminHome: resolve(__dirname,"src/pages/admin/home/home.html"),
                clienteHome: resolve(__dirname, "src/pages/client/home/home.html"),

            },
        },
    },
    base:"./",

});
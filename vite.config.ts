import {defineConfig} from "vite";
import {resolve} from "path";
import { register } from "module";

export default defineConfig({
    build: {
        rollupOptions:{
            input: {
                index:resolve(__dirname, "index.html"),
                login:resolve(__dirname, "src/pages/auth/login/login.html"),
                register: resolve(__dirname, "src/pages/auth/register/register.html"),
                adminHome: resolve(__dirname,"src/pages/admin/home/home.html"),
                clienteHome: resolve(__dirname, "src/pages/client/home/home.html"),

            },
        },
    },
    base:"./",

});
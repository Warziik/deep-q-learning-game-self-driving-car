import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/app.css";
import {App} from "./App";
import {Toaster} from "@/components/ui/toaster.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme={"light"}>
            <App />
            <Toaster />
        </ThemeProvider>
    </React.StrictMode>,
);

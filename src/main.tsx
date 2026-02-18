import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// CSP-compliant PDF worker setup
import "./lib/pdf-worker-setup";

createRoot(document.getElementById("root")!).render(<App />);

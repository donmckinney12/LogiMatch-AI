"use client"

import { useEffect } from "react"

export function ZohoSalesIQ() {
    useEffect(() => {
        // Only run on client-side and in production (or if you want it in dev too)
        if (typeof window !== "undefined") {
            const script = document.createElement("script")
            script.type = "text/javascript"
            script.id = "zsiqscript"
            // Placeholder Zoho SalesIQ code - replace with your actual widget code from Zoho console
            script.defer = true
            script.innerHTML = `
                var $zoho=$zoho || {};
                $zoho.salesiq = $zoho.salesiq || {
                    widgetcode: "placeholder_widget_code", 
                    values: {},
                    ready: function() {}
                };
                var d=document;
                s=d.createElement("script");
                s.type="text/javascript";
                s.id="zsiqscript";
                s.defer=true;
                s.src="https://salesiq.zoho.com/widget";
                t=d.getElementsByTagName("script")[0];
                t.parentNode.insertBefore(s,t);
            `
            document.body.appendChild(script)

            return () => {
                const existingScript = document.getElementById("zsiqscript")
                if (existingScript) {
                    existingScript.remove()
                }
            }
        }
    }, [])

    return null
}

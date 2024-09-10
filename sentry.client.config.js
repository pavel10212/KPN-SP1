import * as Sentry from "@sentry/nextjs";

if (typeof window !== 'undefined') {
    Sentry.init({
        dsn: "https://909ed9d4b0728237fc1ce202f68a5542@o4507442125537280.ingest.de.sentry.io/4507900510142544",

        integrations: [
            new Sentry.BrowserTracing(),
            new Sentry.Replay(),
        ],

        tracesSampleRate: 1,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        debug: false,
    });
}
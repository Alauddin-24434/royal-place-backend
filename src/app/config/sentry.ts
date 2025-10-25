import * as Sentry from "@sentry/node";
import { envVariable } from ".";

Sentry.init({
  dsn: envVariable.SENTRY_DSN, // Sentry DSN
  environment: envVariable.NODE_ENV,
  tracesSampleRate: 1.0, // performance monitoring, optional
  sendDefaultPii: true,   // user info capture
});

export default Sentry;

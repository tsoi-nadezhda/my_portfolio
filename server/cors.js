const LOCAL_ORIGINS = ['http://localhost:5173', 'http://localhost:4173'];

const explicitOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const originPatterns = (
  process.env.CLIENT_ORIGIN_PATTERNS ||
  '^https://my-portfolio.*\\.vercel\\.app$'
)
  .split(',')
  .map((p) => p.trim())
  .filter(Boolean)
  .map((p) => new RegExp(p));

export function isOriginAllowed(origin) {
  if (!origin) return true;
  if (LOCAL_ORIGINS.includes(origin)) return true;
  if (explicitOrigins.includes(origin)) return true;
  return originPatterns.some((re) => re.test(origin));
}

export const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

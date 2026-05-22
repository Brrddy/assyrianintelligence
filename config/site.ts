/* ============================================================================
 *  Assyrian Intelligence — central site config.
 *  Edit this file to tune pricing, swap embeds, add models, etc.
 *  Every business constant lives here. Components are pure presentation.
 * ============================================================================ */

/* ---------- 1. CONTACT ---------------------------------------------------- */
// TODO: replace these placeholders with the real values.
export const CONTACT = {
  // Where the rendered email lands (also displayed in the page footer block).
  email: "info@assyrianintelligence.com",

  /**
   * Form delivery — REQUIRED for the Contact form to actually send.
   *
   * Default uses Formspree (free, no backend, no API keys, ~50 submissions/mo).
   * Setup (one-time, ~2 minutes):
   *   1. Sign up at https://formspree.io (use your real CONTACT.email above)
   *   2. Create a new form — copy the endpoint URL (looks like:
   *        https://formspree.io/f/xxxxxxxx)
   *   3. Paste it below in place of TODO_FORMSPREE_ENDPOINT.
   *   4. Done — submissions arrive at your inbox with the full estimate.
   *
   * To switch providers later (Resend, Web3Forms, your own API route),
   * edit `submitContact()` in components/Contact.tsx — single swap point.
   */
  formEndpoint: "https://formspree.io/f/mjgzraod",
};

/* ---------- 2. PAST WORK / EMBED GALLERY --------------------------------- */
/*
 * Each slot accepts a YouTube or Facebook embed URL.
 *
 *   YouTube embed URL form:
 *       https://www.youtube.com/embed/VIDEO_ID
 *
 *   Facebook embed URL form:
 *       https://www.facebook.com/plugins/video.php?href=ENCODED_VIDEO_URL
 *
 * Paste the real URL into `embedUrl` below. Leave `embedUrl` as the
 * PLACEHOLDER_* string until you have a real one — the UI shows a refined
 * placeholder card automatically.
 */
export const WORK = [
  {
    id: 1,
    title: "Jwanqa Ashuraya",
    caption: "Cinematic AI music video. Custom-trained likeness.",
    embedUrl: "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2540551946399715%2F&show_text=false&width=560&t=0",
    provider: "facebook" as "youtube" | "facebook",
  },
  {
    id: 2,
    title: "Azizta Nana",
    caption: "Surreal performance piece, end-to-end generative.",
    embedUrl: "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F966136599544721%2F&show_text=false&width=560&t=0",
    provider: "facebook" as const,
  },
];

/* ---------- 3. SERVICES --------------------------------------------------- */
export const SERVICES = [
  {
    title: "AI Music Video Production",
    body:
      "End-to-end generative pipelines, script to final master. Custom-trained models keep the artist's likeness consistent across every shot.",
  },
  {
    title: "VFX & Compositing",
    body:
      "Hybrid pipelines fusing live-action plates with generative VFX: particle sims, sky replacements, set extensions, CG creatures.",
  },
  {
    title: "Concept & Storyboarding",
    body:
      "Direction, treatments, moodboards, and shot-by-shot AI storyboards before a single frame is rendered.",
  },
  {
    title: "Full Post-Production",
    body:
      "Edit, color grade, sound design, delivery in every spec, vertical social cuts, and lyric cuts.",
  },
];

/* ---------- 4. CUTTING-EDGE MODELS --------------------------------------- */
/* Add / remove freely. `category` becomes a tag. */
export const MODELS = [
  { name: "Veo 3.1",            category: "Video",     blurb: "Premium long-form motion fidelity." },
  { name: "Seedance 2.0 Pro",   category: "Video",     blurb: "Performance-driven character motion." },
  { name: "Sora 2 Pro",         category: "Video",     blurb: "Narrative coherence across scenes." },
  { name: "Nano Banana Pro",    category: "Stills",    blurb: "Editorial-grade key art." },
  { name: "Flux Pro 1.1 Ultra", category: "Stills",    blurb: "Razor-sharp identity-locked stills." },
  { name: "Kling 2.1 Master",   category: "Video",     blurb: "Stylized motion + camera control." },
  { name: "Topaz Video AI",     category: "Finishing", blurb: "Frame interpolation and upscaling." },
  { name: "Magnific Relight",   category: "Finishing", blurb: "Surgical relight + texture work." },
];

/* ---------- 5. PROCESS ---------------------------------------------------- */
export const PROCESS = [
  { n: "01", title: "Concept",    body: "Treatment, references, moodboard, AI storyboard sign-off." },
  { n: "02", title: "Generation", body: "Model selection, character locks, first-pass shot renders." },
  { n: "03", title: "VFX",        body: "Compositing, sims, color, any live-action integration." },
  { n: "04", title: "Delivery",   body: "Master, social cuts, behind-the-scenes, source archive." },
];

/* ============================================================================
 *  6.  PRICING — every dollar lives here. Retune freely.
 *  ----------------------------------------------------------------------------
 *  Compute order (must stay in sync with components/Estimator.tsx):
 *    subtotal = baseFee
 *             + seconds × perSecond
 *             + additionalCharacters × eachAdditionalCharacter
 *             + additionalScenes     × eachAdditionalScene
 *    if lipSync          → subtotal += subtotal × lipSyncPct
 *    if revisionsPackage → total += revisionsPackageFlat
 *    total += turnaround surcharge
 *
 *  Calibration anchor (per client direction):
 *    4:00 song, 2 characters, 2 scenes, Standard, no add-ons
 *      → subtotal = 60 + 240×6 + 1×75 + 1×50 = $1,625 (midpoint)
 *      → displayed range with rangePct = 0.077 → $1,500 – $1,750
 * ============================================================================ */
export const PRICING = {
  baseFee: 60,                        // flat onboarding / engineering fee
  perSecond: 6,                       // 240s × $6 = $1,440
  firstCharacter: 0,                  // included
  eachAdditionalCharacter: 75,
  firstScene: 0,                      // included
  eachAdditionalScene: 50,
  lipSyncPct: 0.15,                   // +15% of subtotal when toggled on
  revisionsPackageFlat: 250,          // +$250 flat when toggled on
  turnaround: {
    standard: { label: "Standard", surcharge: 0,   window: "~2–3 weeks" },
    priority: { label: "Priority", surcharge: 150, window: "~1 week"   },
    express:  { label: "Express",  surcharge: 350, window: "~2–3 days" },
  },
  // ± window around the computed total when shown to the user.
  // 0.077 ≈ ±$125 around the $1,625 calibration midpoint → "$1,500 – $1,750".
  rangePct: 0.077,
  // Style is purely creative direction — does not affect price.
  stylePresets: [
    "Cinematic Live-Action",
    "Animated",
    "Anime",
    "Surreal / Dreamlike",
    "Retro / VHS",
    "Documentary",
    "Performance",
    "Abstract",
  ],
  // Song length slider
  song: {
    minSeconds: 30,                   // 0:30
    maxSeconds: 480,                  // 8:00
    defaultSeconds: 240,              // 4:00
    stepSeconds: 5,
  },
};

export type TurnaroundKey = keyof typeof PRICING.turnaround;

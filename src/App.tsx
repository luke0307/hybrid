import { useMemo, useState, type ReactNode } from "react";

type VideoRef = {
  id?: string;
  q?: string;
  label: string;
};

type Exercise = {
  name: string;
  sets: string;
  kind: string;
  rpe?: string | number;
  restSets?: string;
  restAfter?: string;
  muscles?: string;
  description?: string;
  tip?: string;
  superset?: boolean;
  supersetWith?: string;
  supersetNote?: boolean;
};

type CoreMovement = {
  name: string;
  detail: string;
};

type CoreData = {
  title: string;
  duration: string;
  note?: string;
  movements: CoreMovement[];
};

type Finisher = {
  title: string;
  progression: string;
  description: string;
  movements: string[];
  example: string;
};

type ProgressionItem = {
  period: string;
  value: string;
};

type Session = {
  name: string;
  tag: string;
  type: "gym" | "run";
  duration: string;
  zone?: string;
  description?: string;
  detail?: string;
  note?: string;
  restNote?: string;
  exercises?: Exercise[];
  progression?: ProgressionItem[];
  core?: CoreData;
  finisher?: Finisher;
};

type ScheduleItem = {
  day: string;
  type: "gym" | "run" | "rest";
  key: string | null;
  label: string;
};

type Block = {
  id: number;
  name: string;
  weeks: string;
  focus: string;
  schedule: ScheduleItem[];
  sessions: Record<string, Session>;
};

type NutritionData = {
  target: string;
  formula: string;
  meals: Array<{ meal: string; example: string; protein: string }>;
  rules: Array<{ icon: string; label: string; rule: string }>;
};

const YT: Record<string, VideoRef> = {
  "Back Squat":                { id: "vmNPOjaGrVE",  label: "How To Squat – Alan Thrall" },
  "Deadlift":                  { id: "wYREQkVtvEc",  label: "5 Step Deadlift Setup – Alan Thrall" },
  "Deadlift — Wave":           { id: "wYREQkVtvEc",  label: "5 Step Deadlift Setup – Alan Thrall" },
  "Back Squat — Wave":         { id: "vmNPOjaGrVE",  label: "How To Squat – Alan Thrall" },
  "Romanian Deadlift":         { q: "alan thrall romanian deadlift tutorial",  label: "Romanian Deadlift – Untamed Strength" },
  "Bench Press":               { q: "alan thrall how to bench press tutorial", label: "How To Bench Press – Alan Thrall" },
  "Bench Press — Wave":        { q: "alan thrall how to bench press tutorial", label: "How To Bench Press – Alan Thrall" },
  "Barbell Row":               { q: "alan thrall barbell row tutorial",        label: "Barbell Row – Untamed Strength" },
  "Barbell Row  ↔  superset":  { q: "alan thrall barbell row tutorial",        label: "Barbell Row – Untamed Strength" },
  "Split Squat":               { q: "how to bulgarian split squat tutorial",   label: "Bulgarian Split Squat – Tutorial" },
  "Overhead Press":            { q: "alan thrall overhead press tutorial",     label: "Overhead Press – Alan Thrall" },
  "Overhead Press — Wave":     { q: "alan thrall overhead press tutorial",     label: "Overhead Press – Alan Thrall" },
  "Pull-up / Lat Pulldown":    { q: "how to do pull ups proper form tutorial", label: "Pull-up Form Guide – Tutorial" },
  "Pull-up  ↔  superset":      { q: "how to do pull ups proper form tutorial", label: "Pull-up Form Guide – Tutorial" },
  "Incline DB Press":          { q: "incline dumbbell press tutorial form",    label: "Incline DB Press – Tutorial" },
  "Face Pull":                 { q: "face pull cable exercise tutorial",       label: "Face Pull – Tutorial" },
  "Leg Curl  ↔  superset":     { q: "leg curl exercise form tutorial",         label: "Leg Curl – Tutorial" },
  "Plank":                     { q: "how to do a perfect plank form tutorial",  label: "Plank – Come eseguirlo" },
  "Dead Bug":                  { q: "dead bug exercise tutorial core",          label: "Dead Bug – Core Tutorial" },
  "Side Plank":                { q: "side plank exercise form tutorial",        label: "Side Plank – Tutorial" },
  "Ab Wheel Rollout":          { q: "ab wheel rollout tutorial proper form",    label: "Ab Wheel Rollout – Tutorial" },
};

function ytUrl(name: string) {
  const v = YT[name];
  if (!v) return `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " exercise tutorial")}`;
  if (v.id) return `https://www.youtube.com/watch?v=${v.id}`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(v.q ?? name)}`;
}

function ytThumb(name: string) {
  const v = YT[name];
  return v?.id ? `https://img.youtube.com/vi/${v.id}/hqdefault.jpg` : null;
}

function ytLabel(name: string) {
  return YT[name]?.label || `${name} – Tutorial`;
}

function rpeStyle(rpe?: string | number) {
  if (!rpe) return { color: "#3b82f6", bg: "rgba(59,130,246,0.12)", bar: 0.6 };
  const avg =
    typeof rpe === "string"
      ? rpe.split("–").reduce((sum, chunk) => sum + Number(chunk.trim()), 0) /
        rpe.split("–").length
      : rpe;

  if (avg <= 6) return { color: "#22c55e", bg: "rgba(34,197,94,0.12)", bar: avg / 10 };
  if (avg <= 7.5) return { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", bar: avg / 10 };
  if (avg <= 8.5) return { color: "#f97316", bg: "rgba(249,115,22,0.12)", bar: avg / 10 };
  return { color: "#ef4444", bg: "rgba(239,68,68,0.12)", bar: avg / 10 };
}

const blocks: Block[] = [
  {
    id: 1, name: "Blocco 1", weeks: "Sett. 1–6",
    focus: "Base Hybrid — tecnica, volume, aerobica",
    schedule: [
      { day: "Lun", type: "gym", key: "A",  label: "Palestra A" },
      { day: "Mar", type: "run", key: "Z2", label: "Zona 2" },
      { day: "Mer", type: "rest",key: null, label: "Riposo" },
      { day: "Gio", type: "gym", key: "B",  label: "Palestra B" },
      { day: "Ven", type: "rest",key: null, label: "Riposo" },
      { day: "Sab", type: "run", key: "LR", label: "Long Run" },
      { day: "Dom", type: "rest",key: null, label: "Riposo" },
    ],
    sessions: {
      A: {
        name: "Palestra A", tag: "Squat + Orizzontale", type: "gym", duration: "50 min",
        note: "Doppia progressione — aggiungi reps fino a 8 su tutti i set, poi aumenta carico di 2.5–5kg e riparte da 6.",
        restNote: "Recuperi calibrati per stare dentro i 50 min. Non accelerare per fare prima — la pausa è parte dell'allenamento.",
        exercises: [
          { name: "Back Squat",      sets: "4 × 6–8",   kind: "Forza",  rpe: "7–8",  restSets: "90 sec–2 min", restAfter: "90 sec",
            muscles: "Quadricipiti · Glutei · Femorali · Core",
            description: "Bilanciere sulle spalle, scendi fino a parallela o sotto, risali. Il re dei movimenti lower body — carica tutto il sistema muscolare della gamba in modo integrato.",
            tip: "Scendi lento (3 sec), esplodi in salita. Non bloccare le ginocchia in cima." },
          { name: "Romanian Deadlift", sets: "4 × 6–8", kind: "Forza",  rpe: "7–8",  restSets: "90 sec–2 min", restAfter: "90 sec",
            muscles: "Femorali · Glutei · Erettori spinali · Core",
            description: "Cala il bilanciere lungo le gambe con ginocchia leggermente flesse e schiena rigida. Senti l'allungamento nei femorali, poi risali con i glutei.",
            tip: "Complemento allo squat — copre la catena posteriore che lo squat lascia parzialmente." },
          { name: "Bench Press",     sets: "4 × 6–8",   kind: "Forza",  rpe: "7–8",  restSets: "90 sec–2 min", restAfter: "90 sec",
            muscles: "Pettorali · Tricipiti · Deltoide anteriore · Core",
            description: "Presa leggermente più larga delle spalle. Cala verso il basso del petto, spingi verso l'alto e leggermente indietro.",
            tip: "Tieni le scapole retratte e depresse per tutta la durata del set." },
          { name: "Barbell Row",     sets: "3 × 10–12", kind: "Volume", rpe: "7",    restSets: "60–90 sec",   restAfter: "90 sec",
            muscles: "Gran dorsale · Romboidi · Trapezio · Bicipiti",
            description: "Busto inclinato a ~45°, tira il bilanciere verso il basso dell'addome. Non strappare — tira lento e controlla la discesa.",
            tip: "Bilancia il bench: ogni spinta orizzontale vuole la sua trazione orizzontale." },
          { name: "Split Squat",     sets: "3 × 10–12", kind: "Volume", rpe: "6–7",  restSets: "60–90 sec",   restAfter: "—",
            muscles: "Quadricipiti · Glutei · Femorali · Core",
            description: "Un piede avanti, uno dietro. Versione bulgara con piede posteriore elevato sulla panca. Scendi fino a sfiorare il suolo col ginocchio posteriore.",
            tip: "Fondamentale per chi corre — corregge gli squilibri che lo squat bilaterale maschera." },
        ],
        core: {
          title: "Core Block", duration: "4 min",
          note: "Circuito continuo senza pausa tra esercizi — 2 round. Nel Blocco 2 sale a 6–8 min con l'aggiunta dell'Ab Wheel.",
          movements: [
            { name: "Plank",    detail: "30 sec — schiena piatta, glutei contratti, non cedere sui fianchi. Anti-estensione." },
            { name: "Dead Bug", detail: "× 8 per lato — estendi braccio e gamba opposta mantenendo la lombare a terra. Anti-rotazione." },
            { name: "Side Plank", detail: "30 sec per lato — fianchi alti, corpo dritto. Anti-flessione laterale." },
          ]
        },
        finisher: { title: "Finisher Metabolico", progression: "Sett. 1–2 → 6 min  ·  Sett. 3–4 → 8 min  ·  Sett. 5–6 → 10 min",
          description: "Lavoro continuo a intensità moderata, nessuna pausa fissa. Non stai correndo contro il cronometro.",
          movements: ["KB Swing × 15", "Push-up × 10", "Box Step-up × 10 per lato"],
          example: "KB swing → Push-up → Step-up → ripeti fino al termine." }
      },
      B: {
        name: "Palestra B", tag: "Hinge + Verticale", type: "gym", duration: "50 min",
        note: "Stessa progressione della sessione A. RPE target costante — tecnica prima del carico massimo.",
        restNote: "I recuperi sui compound non sono ozio — il SNC ha bisogno di quei minuti per esprimere forza al set successivo.",
        exercises: [
          { name: "Deadlift",        sets: "4 × 6–8",   kind: "Forza",  rpe: "7–8",  restSets: "90 sec–2 min", restAfter: "90 sec",
            muscles: "Femorali · Glutei · Erettori · Trapezio · Core · Gran dorsale",
            description: "Bilanciere a terra. Spingi il pavimento via da te — non tirare il bilanciere. Schiena rigida, anche alte.",
            tip: "Le braccia sono solo una corda. La potenza viene dalla catena posteriore." },
          { name: "Overhead Press",  sets: "4 × 6–8",   kind: "Forza",  rpe: "7–8",  restSets: "90 sec–2 min", restAfter: "90 sec",
            muscles: "Deltoide anteriore e laterale · Tricipiti · Trapezio superiore · Core",
            description: "Bilanciere a livello clavicole, spingi sopra la testa fino a braccia tese. Testa indietro mentre sale.",
            tip: "Attiva core e glutei durante la spinta — è un esercizio di tutto il corpo." },
          { name: "Pull-up / Lat Pulldown", sets: "4 × 6–8", kind: "Forza", rpe: "7–8", restSets: "90 sec–2 min", restAfter: "90 sec",
            muscles: "Gran dorsale · Bicipiti · Romboidi · Trapezio medio-inferiore",
            description: "Presa prona, larghezza spalle. Parti da braccia tese, tira fino al mento sopra la barra. Se non arrivi, lat pulldown.",
            tip: "Usa band assist finché non riesci i pull-up puliti — poi transizione progressiva." },
          { name: "Incline DB Press",sets: "3 × 10–12", kind: "Volume", rpe: "7",    restSets: "60–90 sec",   restAfter: "60 sec",
            muscles: "Pettorale superiore · Deltoide anteriore · Tricipiti",
            description: "Manubri, panca inclinata a 30–45°. Stessa meccanica del bench ma l'angolo sposta il lavoro verso la parte alta del petto.",
            tip: "30° è spesso meglio di 45° — meno stress sulle spalle, più lavoro sul petto." },
          { name: "Face Pull",       sets: "3 × 12–15", kind: "Volume", rpe: "6",    restSets: "45–60 sec",   restAfter: "—",
            muscles: "Deltoide posteriore · Rotatori esterni · Romboidi · Trapezio",
            description: "Cavo alto con corda. Tira verso il viso aprendo i gomiti verso l'esterno con rotazione esterna delle spalle. Carico basso, controllo totale.",
            tip: "Non è glamour ma è tra i più importanti. Protegge le spalle dall'overuse di bench + OHP + row." },
        ],
        core: {
          title: "Core Block", duration: "4 min",
          note: "Stessa struttura della sessione A — 2 round continui senza pausa tra esercizi.",
          movements: [
            { name: "Plank",      detail: "30 sec — schiena piatta, glutei contratti, non cedere sui fianchi. Anti-estensione." },
            { name: "Dead Bug",   detail: "× 8 per lato — estendi braccio e gamba opposta mantenendo la lombare a terra. Anti-rotazione." },
            { name: "Side Plank", detail: "30 sec per lato — fianchi alti, corpo dritto. Anti-flessione laterale." },
          ]
        },
        finisher: { title: "Finisher Metabolico", progression: "Sett. 1–2 → 6 min  ·  Sett. 3–4 → 8 min  ·  Sett. 5–6 → 10 min",
          description: "Stessa logica della sessione A. Lavoro continuo senza pause fisse.",
          movements: ["Rowing 250m (vogatore o TRX row)", "KB Swing × 15", "Goblet Squat × 12"],
          example: "Rowing 250m → KB swing × 15 → Goblet squat × 12 → ripeti fino al termine." }
      },
      Z2: { name: "Zona 2", tag: "Corsa aerobica",  type: "run", duration: "35–40 min", zone: "Z2",
        description: "Ritmo a cui parli a frasi complete senza affanno. Se devi rallentare per farlo, rallenta — non è un'opzione, è il punto dell'esercizio.",
        detail: "La Zona 2 costruisce l'infrastruttura aerobica: mitocondri, capacità di ossidare grassi, efficienza cardiaca.", exercises: [] },
      LR: { name: "Long Run", tag: "Fondo progressivo", type: "run", duration: "Progressivo", zone: "Z2",
        description: "Ritmo aerobico confortevole, mai di gara. Ripartiamo da 9km, non da zero.",
        exercises: [],
        progression: [{ period: "Sett. 1–2", value: "9 km" }, { period: "Sett. 3–4", value: "10 km" }, { period: "Sett. 5–6", value: "11–12 km" }] }
    }
  },
  {
    id: 2, name: "Blocco 2", weeks: "Sett. 7–12",
    focus: "Densità di lavoro, intensità e distanza",
    schedule: [
      { day: "Lun", type: "gym", key: "A2",  label: "Palestra A" },
      { day: "Mar", type: "run", key: "Z2b", label: "Zona 2" },
      { day: "Mer", type: "rest",key: null,  label: "Riposo" },
      { day: "Gio", type: "gym", key: "B2",  label: "Palestra B" },
      { day: "Ven", type: "run", key: "TR",  label: "Tempo Run" },
      { day: "Sab", type: "run", key: "LR2", label: "Long Run" },
      { day: "Dom", type: "rest",key: null,  label: "Riposo" },
    ],
    sessions: {
      A2: {
        name: "Palestra A", tag: "Wave Loading + Superset", type: "gym", duration: "50 min",
        note: "Wave loading: 4×5 in sett. 7, poi 3×3, poi 1×1+. Superset antagonisti per densità.",
        restNote: "Nei superset: 0 sec tra i due esercizi, poi 2–3 min dopo il secondo. L'antagonista recupera mentre l'agonista lavora.",
        exercises: [
          { name: "Back Squat — Wave", sets: "4×5 → 3×3 → 1×1+", kind: "Forza", rpe: "8–9",
            superset: true, supersetWith: "Leg Curl", restSets: "3–4 min", restAfter: "0 sec",
            muscles: "Quadricipiti · Glutei · Femorali · Core",
            description: "Schema progressivo nelle settimane. Superset con Leg Curl per densità antagonista lower body.",
            tip: "Tecnica deve reggere anche sul singolo massimale. Se cede, il peso è troppo." },
          { name: "Leg Curl  ↔  superset", sets: "3 × 10–12", kind: "Volume", rpe: "7",
            supersetNote: true, restSets: "2–3 min", restAfter: "90 sec",
            muscles: "Femorali · Popliteo",
            description: "Eseguito immediatamente dopo ogni set di squat, poi recupero 2–3 min.", tip: "" },
          { name: "Bench Press — Wave", sets: "4×5 → 3×3 → 1×1+", kind: "Forza", rpe: "8–9",
            superset: true, supersetWith: "Barbell Row", restSets: "3–4 min", restAfter: "0 sec",
            muscles: "Pettorali · Tricipiti · Deltoide anteriore",
            description: "Stessa logica wave dello squat. Superset con Barbell Row per equilibrio push-pull orizzontale.", tip: "" },
          { name: "Barbell Row  ↔  superset", sets: "3 × 8–10", kind: "Volume", rpe: "7–8",
            supersetNote: true, restSets: "2–3 min", restAfter: "—",
            muscles: "Gran dorsale · Romboidi · Bicipiti",
            description: "Eseguito subito dopo ogni set di bench. Spinta + trazione nello stesso blocco — densità massima.", tip: "" },
        ],
        core: {
          title: "Core Block", duration: "6–8 min",
          note: "Blocco 2 — sale la durata. Entra l'Ab Wheel al posto del Plank: stesso pattern anti-estensione ma con range di movimento reale.",
          movements: [
            { name: "Ab Wheel Rollout", detail: "× 8–10 — schiena piatta in estensione, non cedere alla lordosi. Anti-estensione avanzata." },
            { name: "Dead Bug",         detail: "× 10 per lato — stesso movimento del Blocco 1, aumenta le reps. Anti-rotazione." },
            { name: "Side Plank",       detail: "40 sec per lato — aggiunge 10 sec rispetto al Blocco 1. Anti-flessione laterale." },
          ]
        },
        finisher: { title: "EMOM 12–15 min", progression: "Sett. 7–9 → 12 min  ·  Sett. 10–12 → 15 min",
          description: "All'inizio di ogni minuto esegui le reps assegnate. Il tempo rimasto è recupero.",
          movements: ["Min 1: KB Swing × 8 (pesante)", "Min 2: Push-up deficit × 6", "Min 3: Box Jump × 8"],
          example: "4 round totali." }
      },
      B2: {
        name: "Palestra B", tag: "Wave Loading + Superset", type: "gym", duration: "50 min",
        note: "Wave loading sui compound principali. Complex bilanciere nel finisher.",
        restNote: "Con intensità alta del wave loading, non ridurre i recuperi. Un singolo pulito vale più di due set compromessi.",
        exercises: [
          { name: "Deadlift — Wave", sets: "4×5 → 3×3 → 1×1+", kind: "Forza", rpe: "8–9",
            restSets: "3–4 min", restAfter: "2 min",
            muscles: "Femorali · Glutei · Erettori · Trapezio · Core",
            description: "Intensità reale sul movimento principale.",
            tip: "Non andare a cedimento — il giorno dopo hai la Tempo Run." },
          { name: "Overhead Press — Wave", sets: "4×5 → 3×3 → 1×1+", kind: "Forza", rpe: "8–9",
            superset: true, supersetWith: "Pull-up", restSets: "3–4 min", restAfter: "0 sec",
            muscles: "Deltoidi · Tricipiti · Core",
            description: "Superset con Pull-up per densità antagonista verticale.", tip: "" },
          { name: "Pull-up  ↔  superset", sets: "4 × 6–8", kind: "Volume", rpe: "7–8",
            supersetNote: true, restSets: "2–3 min", restAfter: "90 sec",
            muscles: "Gran dorsale · Bicipiti · Romboidi",
            description: "Eseguito subito dopo ogni set di OHP.", tip: "" },
          { name: "Face Pull", sets: "3 × 15", kind: "Volume", rpe: "6",
            restSets: "45–60 sec", restAfter: "—",
            muscles: "Deltoide posteriore · Rotatori esterni · Romboidi",
            description: "Con l'intensità alta dei compound, questo diventa ancora più importante.",
            tip: "Non saltarlo mai." },
        ],
        core: {
          title: "Core Block", duration: "6–8 min",
          note: "Stessa struttura di A2 — 2–3 round. Con i carichi alti del wave loading il core è già stressato, mantieni controllo e qualità.",
          movements: [
            { name: "Ab Wheel Rollout", detail: "× 8–10 — schiena piatta in estensione, non cedere alla lordosi. Anti-estensione avanzata." },
            { name: "Dead Bug",         detail: "× 10 per lato — anti-rotazione pura, lombare sempre a terra." },
            { name: "Side Plank",       detail: "40 sec per lato — fianchi alti, non cedere. Anti-flessione laterale." },
          ]
        },
        finisher: { title: "EMOM 12–15 min", progression: "Sett. 7–9 → 12 min  ·  Sett. 10–12 → 15 min",
          description: "Complex + bodyweight. Componente cardiovascolare integrata.",
          movements: ["Min 1: RDL + Row × 5+5 (complex)", "Min 2: Goblet Squat × 10", "Min 3: Rowing 250m o Mountain Climber × 20"],
          example: "4 round. Due movimenti senza appoggiare il bilanciere." }
      },
      Z2b: { name: "Zona 2", tag: "Mantenimento aerobico", type: "run", duration: "45–50 min", zone: "Z2",
        description: "Stessa logica del Blocco 1 — ritmo parlato. Sale la durata, non l'intensità.", exercises: [] },
      TR:  { name: "Tempo Run", tag: "Zona 3–4", type: "run", duration: "5–6 km", zone: "Z3-4",
        description: "Ritmo sostenuto ma controllato — puoi parlare solo a parole singole.",
        note: "Non programmarla mai il giorno prima della sessione lower body.", exercises: [] },
      LR2: { name: "Long Run", tag: "Ritorno alla distanza", type: "run", duration: "Progressivo", zone: "Z2",
        description: "Obiettivo finale: ritornare ai 14–15km con base aerobica solida.",
        exercises: [],
        progression: [{ period: "Sett. 7–8", value: "12 km" }, { period: "Sett. 9–10", value: "13 km" }, { period: "Sett. 11–12", value: "14–15 km" }] }
    }
  }
];

const NUTRITION: NutritionData = {
  target: "165g / giorno", formula: "2.3g × 71kg",
  meals: [
    { meal: "Colazione",  example: "3–4 uova + 150g yogurt greco",    protein: "35–40g" },
    { meal: "Pranzo",     example: "200g petto pollo / manzo / tonno", protein: "40–45g" },
    { meal: "Spuntino",   example: "30g whey o 200g ricotta",          protein: "25–30g" },
    { meal: "Cena",       example: "200g pesce o carne",               protein: "~40g" },
  ],
  rules: [
    { icon: "⚡", label: "Giorni di allenamento", rule: "Includi riso, avena, pasta o patate" },
    { icon: "🌿", label: "Giorni di riposo",      rule: "Riduci i carbo, aumenta verdure e grassi buoni" },
    { icon: "⏱", label: "Post-allenamento",       rule: "Proteine + carbo entro 90 min da ogni sessione" },
    { icon: "💧", label: "Idratazione",            rule: "+500ml nei giorni con long run o finisher intenso" },
  ]
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const zoneTone: Record<string, string> = {
  Z2: "text-emerald-700 bg-emerald-50 border-emerald-200",
  "Z3-4": "text-amber-700 bg-amber-50 border-amber-200",
};

const tagTone: Record<string, string> = {
  blue: "bg-sky-50 text-sky-700 border-sky-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rose: "bg-rose-50 text-rose-700 border-rose-200",
};

function Tag({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: keyof typeof tagTone;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em]",
        tagTone[tone],
      )}
    >
      {children}
    </span>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="card-muted px-4 py-3">
      <p className="text-sm font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function RpeBar({ rpe }: { rpe?: string | number }) {
  const style = rpeStyle(rpe);
  const pct = Math.round(style.bar * 100);

  return (
    <div className="mt-4 flex items-center gap-3">
      <span
        className="rounded-full border px-3 py-1 text-[11px] font-extrabold tracking-[0.08em]"
        style={{ color: style.color, borderColor: `${style.color}33`, backgroundColor: style.bg }}
      >
        RPE {rpe ?? "—"}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: style.color }}
        />
      </div>
      <span className="w-9 text-right text-[11px] font-semibold text-slate-500">{pct}%</span>
    </div>
  );
}

function VideoCard({ name }: { name: string }) {
  const thumb = ytThumb(name);
  const label = ytLabel(name);
  const url = ytUrl(name);

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group mt-4 block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-36 overflow-hidden bg-slate-950">
        {thumb ? (
          <img
            src={thumb}
            alt={label}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-white/80">
            <div className="text-center">
              <div className="text-3xl">🏋️</div>
              <p className="mt-2 text-sm">{name.replace(" — Wave", "").replace("  ↔  superset", "")}</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/35">
            ▶
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-sm text-rose-600">
          ▶
        </span>
        <p className="flex-1 text-sm font-semibold text-slate-800">{label}</p>
        <span className="text-slate-400">→</span>
      </div>
    </a>
  );
}

function RpeLegend() {
  const items = [
    { range: "6", label: "Comodo", color: "#22c55e" },
    { range: "6–7", label: "Controllato", color: "#22c55e" },
    { range: "7", label: "Buono sforzo", color: "#f59e0b" },
    { range: "7–8", label: "Tecnica + carico", color: "#f59e0b" },
    { range: "8–9", label: "Alta intensità", color: "#f97316" },
    { range: "9–10", label: "Massimale", color: "#ef4444" },
  ];

  return (
    <div className="card mt-4 p-5">
      <p className="section-label mb-4">Scala RPE</p>
      <div className="space-y-3">
        {items.map((item) => {
          const rangeParts = item.range.split("–");
          const pct = Number(rangeParts[rangeParts.length - 1]) * 10;
          return (
            <div key={item.range} className="flex items-center gap-3">
              <span className="w-10 text-xs font-extrabold" style={{ color: item.color }}>
                {item.range}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: item.color }} />
              </div>
              <span className="w-28 text-right text-xs text-slate-500">{item.label}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        L'RPE misura l'intensità percepita su 10. <strong>RPE 7</strong> = circa 3 reps in
        riserva. <strong>RPE 8–9</strong> = circa 1–2 reps in riserva.
      </p>
    </div>
  );
}

function CoreBlock({ core }: { core: CoreData }) {
  const [open, setOpen] = useState(false);
  const [openVideo, setOpenVideo] = useState<number | null>(null);

  return (
    <div className="border-t border-slate-200">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 bg-emerald-50 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-lg">
            🔥
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-slate-900">{core.title}</p>
              <Tag tone="emerald">{core.duration}</Tag>
            </div>
            <p className="mt-1 text-xs text-emerald-700">corpo libero · circuito continuo</p>
          </div>
        </div>
        <span className={cx("text-slate-500 transition", open && "rotate-90")}>›</span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-emerald-100 bg-emerald-50/50 px-5 py-5">
          {core.note && <p className="text-sm leading-6 text-emerald-800">{core.note}</p>}

          <div className="space-y-3">
            {core.movements.map((movement, index) => (
              <div key={movement.name} className="rounded-2xl border border-emerald-100 bg-white px-4 py-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-xs font-extrabold text-white">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900">{movement.name}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{movement.detail}</p>
                    {YT[movement.name] && (
                      <button
                        type="button"
                        onClick={() => setOpenVideo((prev) => (prev === index ? null : index))}
                        className="mt-3 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-rose-700"
                      >
                        {openVideo === index ? "Nascondi video" : "Guarda il video"}
                      </button>
                    )}
                    {openVideo === index && YT[movement.name] && <VideoCard name={movement.name} />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-100/60 px-4 py-3 text-sm leading-6 text-emerald-900">
            Anti-estensione · Anti-rotazione · Anti-flessione laterale: i tre pattern che
            proteggono la schiena e supportano la corsa.
          </div>
        </div>
      )}
    </div>
  );
}

function NutritionView() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[28px] bg-slate-950 px-6 py-6 text-white shadow-xl shadow-slate-900/10">
        <p className="section-label text-white/50">Target proteico giornaliero</p>
        <p className="font-display mt-3 text-4xl font-black tracking-tight">{NUTRITION.target}</p>
        <p className="mt-2 text-sm text-white/55">{NUTRITION.formula}</p>
      </div>

      <section>
        <p className="section-label mb-3">Distribuzione per pasto</p>
        <div className="card overflow-hidden">
          {NUTRITION.meals.map((meal, index) => (
            <div
              key={meal.meal}
              className={cx(
                "flex items-center justify-between gap-4 px-5 py-4",
                index !== 0 && "border-t border-slate-200",
              )}
            >
              <div>
                <p className="text-sm font-bold text-slate-900">{meal.meal}</p>
                <p className="mt-1 text-sm text-slate-500">{meal.example}</p>
              </div>
              <span className="font-display text-lg font-black text-sky-700">{meal.protein}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="section-label mb-3">Regole pratiche</p>
        <div className="space-y-3">
          {NUTRITION.rules.map((rule) => (
            <div key={rule.label} className="card px-5 py-4">
              <div className="flex gap-4">
                <div className="text-2xl">{rule.icon}</div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{rule.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{rule.rule}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="card-muted px-5 py-4 text-sm leading-6 text-slate-700">
        📌 Mangia a <strong>mantenimento</strong>: lascia che la composizione corporea si sposti
        grazie all'allenamento e alla costanza.
      </div>
    </div>
  );
}

export default function App() {
  const [blockIdx, setBlockIdx] = useState(0);
  const [mainTab, setMainTab] = useState<"program" | "nutrition">("program");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [expandedEx, setExpandedEx] = useState<number | null>(null);
  const [showFinisher, setShowFinisher] = useState(false);
  const [showRpeLegend, setShowRpeLegend] = useState(false);

  const block = blocks[blockIdx];
  const session = useMemo(
    () => (selectedKey ? block.sessions[selectedKey] ?? null : null),
    [block, selectedKey],
  );

  const selectDay = (key: string | null) => {
    if (!key) return;
    setSelectedKey((prev) => (prev === key ? null : key));
    setExpandedEx(null);
    setShowFinisher(false);
  };

  const switchBlock = (index: number) => {
    setBlockIdx(index);
    setSelectedKey(null);
    setExpandedEx(null);
    setShowFinisher(false);
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="card overflow-hidden px-6 py-7 md:px-8 md:py-8">
          <div className="grid gap-6 lg:grid-cols-[1.4fr,0.9fr] lg:items-end">
            <div>
              <p className="section-label">10–12 settimane · Hybrid training</p>
              <h1 className="font-display mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                Hybrid Athlete Program
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                Ho convertito il progetto in una base React + Vite + TypeScript, mantenendo la
                logica del planner e ripulendo la UI con classi Tailwind per tipografia, spaziature
                e componenti testuali.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <Metric value="71 kg" label="Peso" />
              <Metric value="Intermedio" label="Livello" />
              <Metric value="2+2 / sett." label="Gym + Run" />
            </div>
          </div>
        </header>

        <main className="mt-6 grid gap-6 lg:grid-cols-[320px,1fr]">
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="card p-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["program", "Programma"],
                  ["nutrition", "Nutrizione"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMainTab(id as "program" | "nutrition")}
                    className={cx(
                      "rounded-2xl px-4 py-3 text-sm font-bold transition",
                      mainTab === id
                        ? "bg-slate-950 text-white shadow"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {mainTab === "program" && (
              <>
                <div className="card p-4">
                  <p className="section-label mb-3">Blocchi</p>
                  <div className="space-y-2">
                    {blocks.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => switchBlock(index)}
                        className={cx(
                          "w-full rounded-2xl border px-4 py-4 text-left transition",
                          blockIdx === index
                            ? "border-sky-500 bg-sky-50"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100",
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-display text-lg font-black text-slate-900">{item.name}</p>
                            <p className="mt-1 text-sm text-slate-500">{item.weeks}</p>
                          </div>
                          {blockIdx === index && <Tag>attivo</Tag>}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="card-muted mt-4 px-4 py-3">
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Focus</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{block.focus}</p>
                  </div>
                </div>

                <div className="card p-4">
                  <button
                    type="button"
                    onClick={() => setShowRpeLegend((prev) => !prev)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">Cos'è l'RPE?</p>
                      <p className="mt-1 text-sm text-slate-500">Scala intensità percepita</p>
                    </div>
                    <span className={cx("text-slate-400 transition", showRpeLegend && "rotate-90")}>›</span>
                  </button>
                  {showRpeLegend && <RpeLegend />}
                </div>
              </>
            )}
          </aside>

          <section className="space-y-4">
            {mainTab === "nutrition" ? (
              <NutritionView />
            ) : (
              <>
                <div className="card p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="section-label">Schema settimanale</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Seleziona un giorno per vedere il dettaglio della sessione.
                      </p>
                    </div>
                  </div>

                  <div className="scrollbar-hidden mt-5 flex gap-3 overflow-x-auto pb-1">
                    {block.schedule.map((day) => {
                      const selected = selectedKey === day.key;
                      return (
                        <button
                          key={`${block.id}-${day.day}-${day.label}`}
                          type="button"
                          onClick={() => selectDay(day.key)}
                          disabled={!day.key}
                          className={cx(
                            "min-w-[118px] rounded-2xl border px-4 py-4 text-left transition",
                            day.type === "rest" && "cursor-default opacity-55",
                            selected
                              ? day.type === "gym"
                                ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/15"
                                : "border-emerald-500 bg-emerald-50 text-emerald-950 shadow-lg shadow-emerald-500/10"
                              : "border-slate-200 bg-slate-50 hover:bg-slate-100",
                          )}
                        >
                          <p className={cx("text-xs font-extrabold uppercase tracking-[0.16em]", selected ? "text-white/60" : "text-slate-500")}>
                            {day.day}
                          </p>
                          <p className="mt-3 text-2xl">
                            {day.type === "gym" ? "🏋️" : day.type === "run" ? "🏃" : "—"}
                          </p>
                          <p className={cx("mt-3 text-sm font-bold", selected ? "text-white" : "text-slate-900")}>
                            {day.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {session ? (
                  <div className="card overflow-hidden">
                    <div
                      className={cx(
                        "px-6 py-6",
                        session.type === "gym"
                          ? "bg-slate-950 text-white"
                          : "bg-white text-slate-900",
                      )}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-display text-3xl font-black tracking-tight">{session.name}</p>
                          <p className={cx("mt-2 text-sm", session.type === "gym" ? "text-white/60" : "text-slate-500")}>
                            {session.tag}
                          </p>
                        </div>
                        <Tag tone={session.type === "gym" ? "violet" : "emerald"}>{session.duration}</Tag>
                      </div>

                      {session.note && (
                        <p className={cx("mt-4 text-sm leading-7", session.type === "gym" ? "text-white/70" : "text-slate-600")}>
                          {session.note}
                        </p>
                      )}
                    </div>

                    {session.restNote && (
                      <div className="border-y border-amber-200 bg-amber-50 px-6 py-4 text-sm leading-6 text-amber-900">
                        ⏱ {session.restNote}
                      </div>
                    )}

                    {session.type === "gym" && session.exercises?.length ? (
                      <div className="divide-y divide-slate-200">
                        {session.exercises.map((exercise, index) => (
                          <div key={exercise.name} className="px-6 py-5">
                            <button
                              type="button"
                              onClick={() => setExpandedEx((prev) => (prev === index ? null : index))}
                              className="w-full text-left"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className={cx("text-base font-bold", exercise.supersetNote ? "text-slate-500" : "text-slate-900")}>
                                      {exercise.name}
                                    </p>
                                    <Tag tone={exercise.kind === "Forza" ? "blue" : "amber"}>{exercise.kind}</Tag>
                                    {exercise.superset && <Tag tone="violet">Superset</Tag>}
                                  </div>
                                  <p className="mt-2 text-sm text-slate-500">{exercise.sets}</p>
                                  <RpeBar rpe={exercise.rpe} />

                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {exercise.restSets && <Tag tone="rose">Recupero: {exercise.restSets}</Tag>}
                                    {exercise.restAfter && exercise.restAfter !== "—" && !exercise.supersetNote && (
                                      <Tag tone="emerald">Prima del prossimo: {exercise.restAfter}</Tag>
                                    )}
                                    {exercise.superset && exercise.supersetWith && (
                                      <Tag tone="violet">poi → {exercise.supersetWith}</Tag>
                                    )}
                                  </div>
                                </div>
                                <span className={cx("pt-1 text-slate-400 transition", expandedEx === index && "rotate-90")}>›</span>
                              </div>
                            </button>

                            {expandedEx === index && (
                              <div className="mt-5 rounded-3xl bg-slate-50 p-5">
                                {exercise.muscles && (
                                  <>
                                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                                      Muscoli coinvolti
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-700">{exercise.muscles}</p>
                                  </>
                                )}
                                {exercise.description && (
                                  <p className="mt-4 text-sm leading-7 text-slate-700">{exercise.description}</p>
                                )}
                                {exercise.tip && (
                                  <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900">
                                    💡 {exercise.tip}
                                  </div>
                                )}
                                {YT[exercise.name] && <VideoCard name={exercise.name} />}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : session.type === "run" ? (
                      <div className="space-y-5 px-6 py-6">
                        {session.zone && (
                          <div className={cx("inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em]", zoneTone[session.zone] ?? "text-slate-700 bg-slate-50 border-slate-200")}>
                            {session.zone}
                          </div>
                        )}
                        {session.description && (
                          <p className="text-sm leading-7 text-slate-700">{session.description}</p>
                        )}
                        {session.detail && (
                          <p className="text-sm leading-7 text-slate-500">{session.detail}</p>
                        )}
                        {session.note && (
                          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                            ⚠️ {session.note}
                          </div>
                        )}
                        {session.progression && (
                          <div>
                            <p className="section-label mb-3">Progressione</p>
                            <div className="grid gap-3 md:grid-cols-3">
                              {session.progression.map((step) => (
                                <div key={step.period} className="card-muted px-4 py-4">
                                  <p className="font-display text-2xl font-black tracking-tight text-slate-900">
                                    {step.value}
                                  </p>
                                  <p className="mt-2 text-sm text-slate-500">{step.period}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}

                    {session.core && <CoreBlock core={session.core} />}

                    {session.finisher && (
                      <div className="border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setShowFinisher((prev) => !prev)}
                          className="flex w-full items-center justify-between gap-4 bg-sky-600 px-6 py-5 text-left text-white"
                        >
                          <div>
                            <p className="font-display text-xl font-black tracking-tight">
                              {session.finisher.title}
                            </p>
                            <p className="mt-1 text-sm text-white/70">{session.finisher.progression}</p>
                          </div>
                          <span className={cx("transition", showFinisher && "rotate-90")}>›</span>
                        </button>

                        {showFinisher && (
                          <div className="space-y-4 bg-sky-50 px-6 py-5">
                            <p className="text-sm leading-7 text-slate-700">{session.finisher.description}</p>
                            <div className="space-y-2">
                              {session.finisher.movements.map((item) => (
                                <div key={item} className="flex gap-3 text-sm text-slate-700">
                                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-600" />
                                  <span className="leading-6">{item}</span>
                                </div>
                              ))}
                            </div>
                            <div className="rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm leading-6 text-sky-900">
                              {session.finisher.example}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="card px-6 py-10 text-center">
                    <p className="font-display text-2xl font-black tracking-tight text-slate-900">
                      Seleziona un giorno
                    </p>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
                      Il dettaglio della sessione apparirà qui. Ho mantenuto la struttura originale,
                      ma l'interfaccia è stata riscritta con componenti più puliti e classi Tailwind.
                    </p>
                  </div>
                )}

                <div className="card-muted px-5 py-4 text-sm leading-7 text-slate-700">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                    Regola interferenza
                  </p>
                  <p className="mt-2">
                    Non programmare corsa intensa o long run nelle <strong>24h precedenti</strong>
                    una sessione lower body. Se fai due attività nello stesso giorno: <strong>forza
                    prima, corsa dopo</strong>.
                  </p>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";

type Phase = {
  id: string;
  number: string;
  label: string;
  title: string;
  summary: string;
  outcome: string;
  color: string;
};

type WorkItem = {
  id: string;
  phase: string;
  outcome: string;
  action: string;
  deliverable: string;
  metric: string;
  references: { label: string; path: string }[];
};

const repo = "https://github.com/ahmedmokireldindevelopers/Startup-Funding-2025/blob/main/";
const asset = (path: string) => `${repo}${path.split(" ").map(encodeURIComponent).join("%20")}`;

const phases: Phase[] = [
  { id: "discover", number: "01", label: "Discover", title: "Find the wedge", summary: "Turn an idea into a clear customer problem and a testable business model.", outcome: "A focused problem statement, ICP, and first business model canvas.", color: "blue" },
  { id: "validate", number: "02", label: "Validate", title: "Prove the need", summary: "Run customer discovery and experiments before investing heavily in product.", outcome: "Evidence that a specific segment will use, pay for, or refer the solution.", color: "violet" },
  { id: "build", number: "03", label: "Build MVP", title: "Ship the smallest proof", summary: "Use an iterative delivery rhythm to release a useful first version.", outcome: "A working MVP with a documented learning backlog.", color: "teal" },
  { id: "monetize", number: "04", label: "Monetize", title: "Make the economics work", summary: "Choose pricing and revenue mechanics that can support sustainable growth.", outcome: "Pricing, unit economics, cash-flow plan, and measurable SaaS KPIs.", color: "amber" },
  { id: "grow", number: "05", label: "Go to market", title: "Create repeatable demand", summary: "Build the route from positioning to first customers and retained usage.", outcome: "A focused GTM plan, sales motion, and customer journey.", color: "orange" },
  { id: "operate", number: "06", label: "Operate", title: "Build a durable company", summary: "Put leadership, people, risk, finance, and delivery systems in place.", outcome: "Operating cadence, owners, KPIs, policies, and risk controls.", color: "green" },
  { id: "fundraise", number: "07", label: "Fundraise", title: "Turn traction into trust", summary: "Package evidence into a fundable story and approach the right investors.", outcome: "A pitch deck, financial model, data room, and targeted investor pipeline.", color: "red" },
];

const workItems: WorkItem[] = [
  { id: "w1", phase: "discover", outcome: "Define the customer problem", action: "Map what the target customer sees, thinks, does, and fears. Write a one-sentence problem statement and interview five people in the segment.", deliverable: "Customer problem brief + interview notes", metric: "5 interviews; 3 repeated pain signals", references: [{ label: "Empathy Map", path: "Business Models - Super Guides Bundle/23. Empathy_Map_-qs6h1o.pdf" }, { label: "Business Model Assessment", path: "Business Models - Super Guides Bundle/8. Business_Model_Assessment-gvite2.pdf" }] },
  { id: "w2", phase: "discover", outcome: "Choose a business model", action: "Complete the nine blocks of a Business Model Canvas and compare subscription, freemium, marketplace, usage-based, and service options.", deliverable: "Business Model Canvas + model comparison", metric: "1 primary model; 2 rejected alternatives with reasons", references: [{ label: "Business Model Canvas", path: "Business Models - Super Guides Bundle/52. Business_Model_Canvas_Explained-bhmuli.pdf" }, { label: "Revenue Models", path: "Business Models - Super Guides Bundle/4. Revenue-Models-2nd-edition-df5jsj.pdf" }, { label: "Business Models Almanac", path: "Business Models - Super Guides Bundle/31. Business-Models-Almanac-The-Big-Book-of-Business-Model-Types-pobplo.pdf" }] },
  { id: "w3", phase: "validate", outcome: "Test the riskiest assumptions", action: "List assumptions about the problem, buyer, willingness to pay, channel, and retention. Design the cheapest experiment for each assumption.", deliverable: "Assumption map + experiment backlog", metric: "Top 3 risks tested with evidence", references: [{ label: "Business Model Testing", path: "Business Models - Super Guides Bundle/3. Business_Model_Testing-voowm0.pdf" }, { label: "Product-Market Fit", path: "Business Models - Super Guides Bundle/27. Super_Guide_Product_Market_Fit-javh8c.pdf" }] },
  { id: "w4", phase: "validate", outcome: "Scope the MVP", action: "Define the smallest workflow that delivers the promised outcome. Separate must-have proof from future features and write acceptance criteria.", deliverable: "MVP scope + prototype or clickable demo", metric: "One core workflow usable end-to-end", references: [{ label: "MVP Guide", path: "Business Models - Super Guides Bundle/17. Minimum-Viable-Product-MVP-txseve.pdf" }, { label: "Project Management", path: "Business Explained/Project-Management-Explained-by-Business-Explained-v4.pdf" }] },
  { id: "w5", phase: "build", outcome: "Run an evidence-led delivery cycle", action: "Use a weekly backlog, sprint goal, demo, and retrospective. Track what users learned, not only what the team shipped.", deliverable: "MVP release + learning backlog", metric: "Weekly release or experiment cadence", references: [{ label: "Agile Manual", path: "Business Explained/Agile-Manual-by-Business-Explained-v2.pdf" }, { label: "Scrum Manual", path: "Business Explained/Scrum-Manual-by-Business-Explained-v2.pdf" }, { label: "Kanban Manual", path: "Business Explained/Kanban-Manual-by-Business-Explained-v2.pdf" }] },
  { id: "w6", phase: "monetize", outcome: "Design pricing and revenue", action: "Create three price packages, define the buyer and value metric for each, and test the price with real prospects before finalizing it.", deliverable: "Pricing page + revenue model", metric: "10 pricing conversations; first paid conversion", references: [{ label: "Pricing Strategies", path: "Business Models - Super Guides Bundle/19. Super_Guide_Pricing_Strategies__Tactics-mqzuac.pdf" }, { label: "Subscription Model", path: "Business Models - Super Guides Bundle/14. Subscription-Business-Model-3-69w1ze.pdf" }, { label: "Freemium Model", path: "Business Models - Super Guides Bundle/22. Freemium_business_models-zuxnur.pdf" }] },
  { id: "w7", phase: "monetize", outcome: "Build the financial engine", action: "Model revenue, costs, burn, runway, CAC, LTV, churn, MRR/ARR, and break-even in conservative, base, and upside scenarios.", deliverable: "12–18 month financial model", metric: "Runway and break-even are explicit", references: [{ label: "SaaS Operating Model", path: "SAAS Toolkit/Toolkit-A/SaaS Operating Model.xlsx" }, { label: "Cash Flow Planning", path: "SAAS Toolkit/Toolkit-A/SaaS Cash Flow Planning Template.xlsx" }, { label: "Acquisition Cost", path: "SAAS Toolkit/Toolkit-A/SaaS Acquisition Cost Analysis Tool.xlsx" }, { label: "Business Model Metrics", path: "Business Models - Super Guides Bundle/24. Business_Model_Metrics-nh7lz7.pdf" }] },
  { id: "w8", phase: "grow", outcome: "Choose a focused GTM motion", action: "Define your ICP, positioning, acquisition channel, sales motion, onboarding promise, and the first 90-day demand plan.", deliverable: "GTM plan + campaign backlog", metric: "One primary channel; qualified pipeline target", references: [{ label: "Go-to-Market Strategies", path: "Business Models - Super Guides Bundle/54. Go-to-Market_Strategies-px4w6a.pdf" }, { label: "Marketing Plan", path: "Business Models - Super Guides Bundle/49. The_Perfect_Marketing_Plan-rqkni5.pdf" }, { label: "Distribution Strategies", path: "Business Models - Super Guides Bundle/36. Distribution_Strategies__Tactics.pdf" }] },
  { id: "w9", phase: "grow", outcome: "Build sales and retention loops", action: "Document the customer journey, cold outreach sequence, onboarding steps, success milestones, and reasons customers churn.", deliverable: "Sales playbook + customer journey", metric: "First repeatable outreach sequence; retention baseline", references: [{ label: "Cold Calling & Email Scripts", path: "SAAS Toolkit/Airtable sheets/SaaS Cold Calling and Cold Email Scripts Templates-Grid view.csv" }, { label: "Customer Journey", path: "Business Explained/Customer-Journey-From-Curious-to-Committed-by-Success-Blueprints-v2.pdf" }, { label: "Customer Success", path: "Business Models - Super Guides Bundle/48. Customer_Success_Strategies-a0hmhm.pdf" }] },
  { id: "w10", phase: "operate", outcome: "Install the operating cadence", action: "Assign owners, define weekly KPIs, create a decision log, and establish financial, security, people, and delivery routines.", deliverable: "Operating handbook + KPI dashboard", metric: "Weekly review with named owners", references: [{ label: "Strategic Management", path: "Business Explained/Strategic-Management-Explained-by-Business-Explained-v3.pdf" }, { label: "KPI Mastery", path: "Business Explained/Kpi-Mastery-Measure-What-Matters-by-Success-Blueprints.pdf" }, { label: "Financial Management", path: "Business Explained/Financial-Management-EXPLAINED-by-Business-Explained-v5.pdf" }, { label: "Cyber Security", path: "Business Explained/Cyber-Security-EXPLAINED-by-Business-Explained-v2.pdf" }] },
  { id: "w11", phase: "operate", outcome: "Prepare for scale and risk", action: "Create a hiring plan, onboarding checklist, risk register, process improvement loop, and change-management approach.", deliverable: "People plan + risk register", metric: "Top 10 risks owned and reviewed", references: [{ label: "HR Checklist", path: "Business Explained/🧑🏼_💼 Ultimate HR Management Checklist by Elevate Sheets.xlsx" }, { label: "Risk Management", path: "Business Explained/Risk-Management-EXPLAINED-v2.pdf" }, { label: "Process Improvement", path: "Business Explained/Process-Improvement-Strategies-EXPLAINED-by-Business-Explained-v2.pdf" }] },
  { id: "w12", phase: "fundraise", outcome: "Package the investment case", action: "Turn problem, solution, market, traction, economics, team, and use of funds into a concise investor narrative and model.", deliverable: "One-pager + pitch deck + financial model", metric: "12–14 slide deck; 3 scenarios; clear ask", references: [{ label: "Perfect Business Plan", path: "Business Models - Super Guides Bundle/47. The_Perfect_Business_Plan-gftkhw.pdf" }, { label: "Competitive Analysis", path: "Business Models - Super Guides Bundle/50. Competitive_Analysis_Strategies-gmj5gq.pdf" }, { label: "How Companies Make Money", path: "Business Models - Super Guides Bundle/43. How_Companies_Make_Money-yldxqv.pdf" }, { label: "Project Management Cheat Sheet", path: "Business Explained/📅 Project Management Cheat Sheet by Elevate Sheets.xlsx" }] },
  { id: "w13", phase: "fundraise", outcome: "Build a qualified investor pipeline", action: "Segment angels, seed funds, accelerators, grants, and strategic investors by stage, sector, geography, check size, and warm-intro path.", deliverable: "Investor CRM + outreach sequence", metric: "50 qualified targets; 10 warm paths; weekly follow-up", references: [{ label: "Seed Investors", path: "SAAS Toolkit/Toolkit-A/+900 SaaS Seed Investors .xlsx" }, { label: "Angel Investors", path: "SAAS Toolkit/Toolkit-A/+1200 SaaS Angel Investors  .xlsx" }, { label: "Active Seed Investors", path: "SAAS Toolkit/Toolkit-A/Active Seed Stage SaaS Investors.xlsx" }, { label: "Pitch Deck Templates", path: "SAAS Toolkit/Airtable sheets/Pitch Decks Templates of 46 Startups Before They Became Billion-Dollar Companies-Grid view.csv" }] },
  { id: "w14", phase: "fundraise", outcome: "Run investor conversations professionally", action: "Customize each email, lead with evidence, track the relationship, prepare diligence answers, and never send sensitive data before a controlled data-room step.", deliverable: "Investor outreach log + data room", metric: "Personalized outreach; response and meeting rates tracked", references: [{ label: "Email Subject Lines", path: "SAAS Toolkit/Toolkit-A/Email Subject Lines to Boost Your SaaS Sales .xlsx" }, { label: "Responsive Email Templates", path: "SAAS Toolkit/Toolkit-A/Collection of Responsive Email Templates for Your SaaS Company.xlsx" }, { label: "Negotiation", path: "Business Explained/Negotiation-Strategies-and-Techniques-EXPLAINED-by-Business-Explained-v2.pdf" }, { label: "Strategy Planning", path: "Business Models - Super Guides Bundle/42. Strategy_Planning_Tools_and_Models.pdf" }] },
];

const phaseById = Object.fromEntries(phases.map((phase) => [phase.id, phase]));

function App() {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [selectedPhase, setSelectedPhase] = useState("all");
  const isArabic = language === "ar";
  const copy = isArabic ? {
    eyebrow: "من الفكرة إلى دليل جاهز للمستثمر",
    title: <>ابنِ الشركة.<br /><em>وتعلّم بوعي.</em></>,
    description: "مساحة عمل واحدة لتحويل ملفات المشروع المرجعية إلى قرارات ومخرجات ونتائج وقصة تمويل موثوقة.",
    progress: "تقدم النظام", outcomes: "مخرجات مكتملة", assets: "ملف مرجعي",
    saved: "يتم حفظ التقدم محلياً في المتصفح", repository: "المستودع ↗",
    operating: "الصورة التشغيلية الحالية", complete: "مكتمل", openTable: "فتح جدول العمل", overview: "نظرة عامة", allWork: "كل الأعمال",
    start: "ابدأ من هنا", journey: "رحلة المؤسس التنفيذية", phaseOutcome: "نتيجة المرحلة", fundable: "نظام تشغيل جاهز للتمويل",
    execution: "جدول التنفيذ", next: "ماذا تفعل الآن؟", showing: "عرض", of: "من", search: "ابحث في المخرجات أو المقاييس أو المراجع",
    all: "الكل", open: "مفتوح", done: "مكتمل", deliverable: "المخرج", evidence: "الدليل / المقياس", study: "ادرس هذه الملفات",
    noMatch: "لا توجد مخرجات تطابق هذه الفلاتر.", tryAgain: "جرّب مرحلة أو حالة أو كلمة بحث أخرى.", clear: "مسح الفلاتر",
    rules: "قواعد التشغيل", notResult: "الملفات المرجعية ليست النتيجة.", rulesText: "النتيجة هي الأدلة التي تنشئها بعد تطبيقها: مقابلات وتجارب وإصدارات ومقاييس عملاء ووضوح مالي ومحادثات مع المستثمرين.",
    library: "خريطة المكتبة", rhythm: "ثلاث مكتبات. إيقاع تشغيل واحد.", browse: "استعرض المستودع الكامل ↗",
built: "صُمم لتقدم مؤسس منضبط", language: "سير عمل ثنائي اللغة", services: "خدمات ومشاريع قادمة", programs: "برامج الشركات الناشئة 2026–2027", programsText: "دليل محدث للبرامج والمنح والمسرّعات والخصومات المتاحة للشركات الناشئة."
  } : {
    eyebrow: "From idea to investor-ready evidence", title: <>Build the company.<br /><em>Learn with intent.</em></>, description: "One guided workspace for turning the project’s 132 reference files into decisions, deliverables, traction, and a credible funding story.", progress: "system progress", outcomes: "outcomes complete", assets: "reference assets", saved: "Local progress saved in your browser", repository: "Repository ↗", operating: "Current operating picture", complete: "complete", openTable: "Open work table", overview: "Overview", allWork: "All work", start: "Start here", journey: "The founder journey, made executable", phaseOutcome: "Phase outcome", fundable: "A fundable operating system", execution: "Execution table", next: "What to do next", showing: "Showing", of: "of", search: "Search outcomes, metrics, or references", all: "All", open: "Open", done: "Done", deliverable: "Deliverable", evidence: "Evidence / metric", study: "Study these files", noMatch: "No outcomes match these filters.", tryAgain: "Try another phase, status, or search term.", clear: "Clear filters", rules: "Operating rules", notResult: "Reference files are not the result.", rulesText: "The result is the evidence you create after applying them: interviews, experiments, product releases, customer metrics, cash-flow visibility, and investor conversations.", library: "Library map", rhythm: "Three libraries. One operating rhythm.", browse: "Browse the full repository ↗", built: "Built for disciplined founder progress", language: "Bilingual workflow", services: "Services & upcoming projects", programs: "Startup Programs 2026–2027", programsText: "A curated guide to startup programs, grants, accelerators, and credits for 2026–2027."
  };
  const phaseArabic: Record<string, { label: string; title: string; summary: string; outcome: string }> = {
    discover: { label: "اكتشف", title: "حدد نقطة الانطلاق", summary: "حوّل الفكرة إلى مشكلة واضحة لشريحة عملاء ونموذج عمل قابل للاختبار.", outcome: "صياغة دقيقة للمشكلة والعميل المثالي ولوحة نموذج العمل." },
    validate: { label: "تحقق", title: "أثبت الحاجة", summary: "اكتشف احتياجات العملاء واختبر الافتراضات قبل استثمار كبير في المنتج.", outcome: "دليل على أن شريحة محددة ستستخدم الحل أو تدفع مقابله أو توصي به." },
    build: { label: "ابنِ النموذج الأولي", title: "أطلق أصغر إثبات", summary: "استخدم إيقاعاً تكرارياً لإطلاق أول نسخة مفيدة والتعلم منها.", outcome: "نموذج أولي يعمل وقائمة تعلم موثقة." },
    monetize: { label: "حقق الدخل", title: "اجعل الاقتصاديات تعمل", summary: "اختر التسعير وآليات الإيراد التي تدعم نمواً مستداماً.", outcome: "تسعير واقتصاديات الوحدة وخطة تدفق نقدي ومؤشرات SaaS قابلة للقياس." },
    grow: { label: "اذهب إلى السوق", title: "أنشئ طلباً متكرراً", summary: "ابنِ الطريق من التموضع إلى أول العملاء والاستخدام المستمر.", outcome: "خطة وصول إلى السوق وحركة مبيعات ورحلة عميل واضحة." },
    operate: { label: "شغّل", title: "ابنِ شركة مستدامة", summary: "ضع أنظمة القيادة والأفراد والمخاطر والمالية والتنفيذ في مكانها.", outcome: "إيقاع تشغيلي ومسؤولون ومؤشرات وسياسات وضوابط مخاطر." },
    fundraise: { label: "اجمع التمويل", title: "حوّل التقدم إلى ثقة", summary: "حوّل الأدلة إلى قصة قابلة للتمويل وتواصل مع المستثمرين المناسبين.", outcome: "عرض استثماري ونموذج مالي وغرفة بيانات وقائمة مستثمرين مستهدفين." }
  };
  const workArabic: Record<string, { outcome: string; action: string; deliverable: string; metric: string }> = {
    w1: { outcome: "حدد مشكلة العميل", action: "ارسم ما يراه العميل المستهدف ويفكر فيه ويفعله ويخشاه. اكتب المشكلة في جملة واحدة وأجرِ مقابلات مع خمسة أشخاص.", deliverable: "ملخص مشكلة العميل وملاحظات المقابلات", metric: "5 مقابلات؛ 3 إشارات ألم متكررة" },
    w2: { outcome: "اختر نموذج العمل", action: "أكمل كتل لوحة نموذج العمل التسع وقارن بين الاشتراك وفريميوم والسوق والاستخدام والخدمات.", deliverable: "لوحة نموذج العمل ومقارنة النماذج", metric: "نموذج أساسي واحد؛ وبديلان مرفوضان مع الأسباب" },
    w3: { outcome: "اختبر الافتراضات الأكثر خطورة", action: "اكتب افتراضات المشكلة والمشتري والاستعداد للدفع والقناة والاحتفاظ، ثم صمم أرخص تجربة لكل افتراض.", deliverable: "خريطة الافتراضات وقائمة التجارب", metric: "اختبار أعلى 3 مخاطر بأدلة" },
    w4: { outcome: "حدد نطاق النموذج الأولي", action: "حدد أصغر رحلة تحقق النتيجة الموعودة، وافصل الإثبات الضروري عن الميزات المستقبلية.", deliverable: "نطاق النموذج الأولي ونموذج قابل للنقر", metric: "رحلة أساسية واحدة تعمل من البداية للنهاية" },
    w5: { outcome: "أدر دورة تنفيذ قائمة على الأدلة", action: "استخدم قائمة أسبوعية وهدفاً وعرضاً ومراجعة. تتبع ما تعلمه المستخدمون وليس ما أطلقه الفريق فقط.", deliverable: "إصدار النموذج الأولي وقائمة التعلم", metric: "إصدار أو تجربة أسبوعية" },
    w6: { outcome: "صمم التسعير والإيرادات", action: "أنشئ ثلاث باقات سعرية وحدد المشتري ومقياس القيمة واختبر السعر مع عملاء حقيقيين.", deliverable: "صفحة التسعير ونموذج الإيرادات", metric: "10 محادثات تسعير؛ أول تحويل مدفوع" },
    w7: { outcome: "ابنِ المحرك المالي", action: "نمذج الإيرادات والتكاليف والحرق والمدى وCAC وLTV والتسرب وMRR وARR ونقطة التعادل.", deliverable: "نموذج مالي لمدة 12–18 شهراً", metric: "المدى ونقطة التعادل واضحان" },
    w8: { outcome: "اختر حركة وصول مركزة للسوق", action: "حدد العميل المثالي والتموضع وقناة الاستحواذ وحركة المبيعات وخطة الطلب لأول 90 يوماً.", deliverable: "خطة الوصول إلى السوق وقائمة الحملات", metric: "قناة أساسية واحدة؛ هدف عملاء محتملين مؤهلين" },
    w9: { outcome: "ابنِ حلقات المبيعات والاحتفاظ", action: "وثّق رحلة العميل وتسلسل التواصل وخطوات التهيئة ومعالم النجاح وأسباب التسرب.", deliverable: "دليل مبيعات ورحلة العميل", metric: "تسلسل تواصل قابل للتكرار؛ خط أساس للاحتفاظ" },
    w10: { outcome: "ثبّت الإيقاع التشغيلي", action: "عيّن المسؤولين وحدد المؤشرات الأسبوعية وأنشئ سجل قرارات وروتيناً مالياً وأمنياً وتشغيلياً.", deliverable: "دليل التشغيل ولوحة المؤشرات", metric: "مراجعة أسبوعية بمسؤولين محددين" },
    w11: { outcome: "استعد للتوسع والمخاطر", action: "أنشئ خطة توظيف وقائمة تهيئة وسجل مخاطر وحلقة تحسين للعمليات وإدارة التغيير.", deliverable: "خطة الأفراد وسجل المخاطر", metric: "أعلى 10 مخاطر لها مالكون ومراجعة" },
    w12: { outcome: "جهّز قصة الاستثمار", action: "حوّل المشكلة والحل والسوق والتقدم والاقتصاديات والفريق واستخدام الأموال إلى قصة موجزة ونموذج.", deliverable: "صفحة واحدة وعرض استثماري ونموذج مالي", metric: "عرض من 12–14 شريحة؛ 3 سيناريوهات؛ طلب واضح" },
    w13: { outcome: "ابنِ قائمة مستثمرين مؤهلين", action: "قسّم المستثمرين حسب المرحلة والقطاع والجغرافيا وحجم الاستثمار وطريق التعارف الدافئ.", deliverable: "نظام علاقات المستثمرين وتسلسل التواصل", metric: "50 هدفاً مؤهلاً؛ 10 طرق دافئة؛ متابعة أسبوعية" },
    w14: { outcome: "أدر محادثات المستثمرين باحتراف", action: "خصص كل رسالة وابدأ بالأدلة وتتبع العلاقة وجهّز إجابات العناية الواجبة ولا ترسل بيانات حساسة قبل غرفة بيانات مضبوطة.", deliverable: "سجل التواصل وغرفة البيانات", metric: "تواصل مخصص وتتبع معدلات الرد والاجتماعات" }
  };
  const phaseLabel = (phase: Phase) => isArabic ? phaseArabic[phase.id]?.label : phase.label;
  const phaseTitle = (phase: Phase) => isArabic ? phaseArabic[phase.id]?.title : phase.title;
  const phaseSummary = (phase: Phase) => isArabic ? phaseArabic[phase.id]?.summary : phase.summary;
  const phaseOutcome = (phase: Phase) => isArabic ? phaseArabic[phase.id]?.outcome : phase.outcome;
  const workField = (item: WorkItem, field: "outcome" | "action" | "deliverable" | "metric") => isArabic ? workArabic[item.id]?.[field] : item[field];
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "open" | "done">("all");
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("founder-system-completed") || "[]"); } catch { return []; }
  });

  const toggle = (id: string) => {
    const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id];
    setCompleted(next);
    localStorage.setItem("founder-system-completed", JSON.stringify(next));
  };

  const filteredItems = useMemo(() => workItems.filter((item) => {
    const text = `${item.outcome} ${item.action} ${item.deliverable} ${item.metric} ${item.references.map((ref) => ref.label).join(" ")}`.toLowerCase();
    return (selectedPhase === "all" || item.phase === selectedPhase) &&
      (status === "all" || (status === "done" ? completed.includes(item.id) : !completed.includes(item.id))) &&
      (!query.trim() || text.includes(query.toLowerCase()));
  }), [selectedPhase, query, status, completed]);

  const progress = Math.round((completed.length / workItems.length) * 100);
  const activePhase = selectedPhase === "all" ? phases[0] : phaseById[selectedPhase];
  const clearFilters = () => { setSelectedPhase("all"); setQuery(""); setStatus("all"); };
  const resetProgress = () => { setCompleted([]); localStorage.removeItem("founder-system-completed"); };

  return (
    <div className="app-shell" dir={isArabic ? "rtl" : "ltr"}>
      <header className="topbar">
        <div className="brand-lockup"><div className="brand-mark">SF</div><div><div className="eyebrow">{isArabic ? "نظام تشغيل المؤسس" : "Founder operating system"}</div><strong>{isArabic ? "نظام تمويل وبناء الشركات" : "Startup Funding & Build System"}</strong></div></div>
        <div className="top-actions"><span className="status-dot" /> <span className="save-status">{copy.saved}</span> <button className="language-toggle" onClick={() => setLanguage(isArabic ? "en" : "ar")} aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}>{isArabic ? "EN" : "العربية"}</button><a href="https://github.com/ahmedmokireldindevelopers/Startup-Funding-2025" target="_blank" rel="noreferrer">{copy.repository}</a></div>
      </header>

      <main className="page-wrap">
        <section className="founder-card"><img className="founder-photo" src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo7518265812579490373-NC7K9LvFoCnDGEktRHFB45T8Fs2wam.jpeg" alt={isArabic ? "صورة أحمد مو كيرالدين" : "Portrait of Ahmed Mo Kireldin"} /><div><div className="eyebrow">{isArabic ? "المطور والمؤسس" : "Developer & founder"}</div><strong>Ahmed Mo Kireldin</strong><span>201012025650 · <a href="mailto:Ahmedmokireldin.online@gmail.com">Ahmedmokireldin.online@gmail.com</a></span></div></section>
        <section className="hero-grid">
          <div className="hero-copy"><div className="eyebrow blue-text">{copy.eyebrow}</div><h1>{copy.title}</h1><p>{copy.description}</p><div className="hero-meta"><span><b>{progress}%</b> {copy.progress}</span><span><b>{completed.length}/{workItems.length}</b> {copy.outcomes}</span><span><b>132</b> {copy.assets}</span></div><button className="reset-btn" onClick={resetProgress} disabled={completed.length === 0}>{isArabic ? "إعادة ضبط التقدم" : "Reset progress"}</button></div>
          <div className="progress-card"><div className="card-kicker">{copy.operating}</div><div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><div><strong>{progress}%</strong><span>{copy.complete}</span></div></div><p>{isArabic ? "انتقل بين المراحل بالترتيب، وارجع إلى أي مرحلة عندما تغيّر الأدلة افتراضاتك." : "Move through the phases in order, but revisit any phase when new evidence changes your assumptions."}</p><button className="primary-btn" onClick={() => document.getElementById("work-table")?.scrollIntoView({ behavior: "smooth" })}>{copy.openTable} <span>↓</span></button></div>
        </section>

        <section className="phase-rail" aria-label="Founder journey phases">
          <button className={selectedPhase === "all" ? "phase-tab active" : "phase-tab"} onClick={() => setSelectedPhase("all")}><span className="phase-number">00</span><span><small>{copy.overview}</small><strong>{copy.allWork}</strong></span></button>
          {phases.map((phase) => <button key={phase.id} className={selectedPhase === phase.id ? `phase-tab active ${phase.color}` : `phase-tab ${phase.color}`} onClick={() => setSelectedPhase(phase.id)}><span className="phase-number">{phase.number}</span><span><small>{phaseLabel(phase)}</small><strong>{phaseTitle(phase)}</strong></span></button>)}
        </section>

        <section className="context-row"><div><div className="eyebrow">{activePhase.number === "01" && selectedPhase === "all" ? copy.start : activePhase.label}</div><h2>{selectedPhase === "all" ? copy.journey : phaseTitle(activePhase)}</h2><p>{selectedPhase === "all" ? (isArabic ? "يربط كل صف أدناه بين إجراء ومخرج ومقياس والملف المناسب للدراسة. أنجز العمل واحتفظ بالدليل ودع الدليل يقود محادثتك التالية." : "Every row below connects an action to an output, a metric, and the exact file to study. Do the work, keep the evidence, and let the evidence earn the next conversation.") : phaseSummary(activePhase)}</p></div><div className="outcome-callout"><span>{copy.phaseOutcome}</span><strong>{selectedPhase === "all" ? copy.fundable : phaseOutcome(activePhase)}</strong></div></section>

        <section id="work-table" className="workspace-section"><div className="section-heading"><div><div className="eyebrow">{copy.execution}</div><h2>{copy.next}</h2></div><div className="table-count">{copy.showing} <b>{filteredItems.length}</b> {copy.of} {workItems.length} {copy.outcomes}</div></div><div className="toolbar"><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} /></label><div className="filter-group"><button className={status === "all" ? "filter active" : "filter"} onClick={() => setStatus("all")}>{copy.all}</button><button className={status === "open" ? "filter active" : "filter"} onClick={() => setStatus("open")}>{copy.open}</button><button className={status === "done" ? "filter active" : "filter"} onClick={() => setStatus("done")}>{copy.done}</button></div></div>
          <div className="work-list">{filteredItems.map((item) => { const phase = phaseById[item.phase]; const done = completed.includes(item.id); return <article className={done ? "work-card done" : "work-card"} key={item.id}><div className="work-index"><button className="check-button" aria-label={done ? (isArabic ? "وضع كمفتوح" : "Mark as open") : (isArabic ? "وضع كمكتمل" : "Mark as complete")} onClick={() => toggle(item.id)}>{done ? "✓" : item.id.replace("w", "")}</button><span className={`mini-phase ${phase.color}`}>{phase.number}</span></div><div className="work-main"><div className="work-topline"><span className={`phase-label ${phase.color}`}>{phaseLabel(phase)}</span>{done && <span className="done-label">{isArabic ? "مكتمل" : "Completed"}</span>}</div><h3>{workField(item, "outcome")}</h3><p>{workField(item, "action")}</p><div className="work-details"><div><span className="detail-label">{copy.deliverable}</span><strong>{workField(item, "deliverable")}</strong></div><div><span className="detail-label">{copy.evidence}</span><strong>{workField(item, "metric")}</strong></div></div><div className="references"><span className="detail-label">{copy.study}</span><div className="reference-list">{item.references.map((ref) => <a key={ref.path} href={asset(ref.path)} target="_blank" rel="noreferrer">{ref.label} <span>↗</span></a>)}</div></div></div></article> })}</div>{filteredItems.length === 0 && <div className="empty-state"><strong>{copy.noMatch}</strong><span>{copy.tryAgain}</span><button className="filter active" onClick={clearFilters}>{copy.clear}</button></div>}</section>

        <section className="closing-grid"><div className="principles"><div className="eyebrow">{copy.rules}</div><h2>{copy.notResult}</h2><p>{copy.rulesText}</p><div className="principle-list"><div><b>01</b><span>{isArabic ? "اقرأ فقط ما يتطلبه القرار الحالي." : "Read only what the current decision requires."}</span></div><div><b>02</b><span>{isArabic ? "حوّل كل مفهوم إلى مخرج عملي للمشروع." : "Convert every concept into a project artifact."}</span></div><div><b>03</b><span>{isArabic ? "تتبع الدليل قبل أن تروي قصة النمو." : "Track proof before you tell the growth story."}</span></div></div></div><div className="bundle-card"><div className="eyebrow">{copy.library}</div><h3>{copy.rhythm}</h3><div className="bundle-line"><span className="bundle-count blue-bg">54</span><span><b>{isArabic ? "نماذج الأعمال" : "Business Models"}</b><small>{isArabic ? "لوحة العمل، النموذج الأولي، الإيرادات، التسعير، السوق" : "Canvas, MVP, revenue, pricing, GTM"}</small></span></div><div className="bundle-line"><span className="bundle-count violet-bg">39</span><span><b>{isArabic ? "شرح الأعمال" : "Business Explained"}</b><small>{isArabic ? "الإدارة والمالية والأفراد والعمليات" : "Management, finance, people, operations"}</small></span></div><div className="bundle-line"><span className="bundle-count amber-bg">22</span><span><b>{isArabic ? "أدوات SaaS" : "SAAS Toolkit"}</b><small>{isArabic ? "نماذج وقوالب وملفات CSV وقوائم مستثمرين" : "Models, templates, CSVs, investor lists"}</small></span></div><a className="text-link" href="https://github.com/ahmedmokireldindevelopers/Startup-Funding-2025/tree/main" target="_blank" rel="noreferrer">{copy.browse} ↗</a></div></section>

        <section className="services-section"><div><div className="eyebrow">{copy.services}</div><h2>{copy.programs}</h2><p>{copy.programsText}</p></div><a className="service-link" href="https://github.com/ahmedmokireldinonline/startup-programs-2026-2027" target="_blank" rel="noreferrer"><span className="service-icon">↗</span><span><strong>{isArabic ? "استكشف المشروع" : "Explore project"}</strong><small>startup-programs-2026-2027</small></span></a></section>
      </main>
      <footer><span>Startup Funding & Build System</span><span>{copy.built} · {copy.language}</span></footer>
    </div>
  );
}

export default App;

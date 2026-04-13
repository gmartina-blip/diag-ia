export const BU_META = {
  fintech: { name: "Fintech & Pagos", color: "#1a56db", tag: "Fintech" },
  docsign: { name: "Firma Digital", color: "#0891b2", tag: "DocSign" },
  ai: { name: "Software IA / Dev", color: "#7c3aed", tag: "IA/Dev" },
  insurtech: { name: "Insurtech / GovTech", color: "#059669", tag: "GovTech" },
} as const;

export type BUKey = keyof typeof BU_META;

export interface Option {
  text: string;
  score: number;
}

export interface Question {
  category: string;
  text: string;
  options: Option[];
}

export interface Quiz {
  questions: Question[];
  dimensions: string[];
  recs: { low: string; mid: string; high: string; max: string };
}

export const QUIZZES: Record<BUKey, Quiz> = {
  fintech: {
    questions: [
      {
        category: "Infraestructura de Pagos",
        text: "¿Cómo gestionás actualmente la conciliación de pagos?",
        options: [
          { text: "Planillas manuales y estados bancarios", score: 1 },
          { text: "Semi-automatizado con software contable", score: 2 },
          { text: "Conectado por API con automatización parcial", score: 3 },
          { text: "Conciliación automatizada en tiempo real", score: 4 },
        ],
      },
      {
        category: "Fraude y Riesgo",
        text: "¿Cuál es tu capacidad actual de detección de fraude?",
        options: [
          { text: "Sin sistema de detección activo", score: 1 },
          { text: "Solo filtros basados en reglas", score: 2 },
          { text: "Modelo ML con cola de revisión humana", score: 3 },
          { text: "Scoring IA en tiempo real con decisión automática", score: 4 },
        ],
      },
      {
        category: "Cumplimiento Normativo",
        text: "¿Cómo gestionás el cumplimiento PCI-DSS / regulatorio?",
        options: [
          { text: "Auditorías manuales sin proceso definido", score: 1 },
          { text: "Auditoría externa anual, herramientas limitadas", score: 2 },
          { text: "Plataforma GRC dedicada, revisiones trimestrales", score: 3 },
          { text: "Monitoreo continuo + reportes automatizados", score: 4 },
        ],
      },
      {
        category: "Integración",
        text: "¿Cómo están integrados tus canales de pago con los sistemas centrales?",
        options: [
          { text: "Silos — sin integración", score: 1 },
          { text: "Integraciones punto a punto por proveedor", score: 2 },
          { text: "Capa de middleware / iPaaS", score: 3 },
          { text: "Arquitectura orientada a eventos con sync en tiempo real", score: 4 },
        ],
      },
      {
        category: "Experiencia del Cliente",
        text: "¿Qué canales de pago ofrecés a tus clientes?",
        options: [
          { text: "Efectivo / transferencia bancaria únicamente", score: 1 },
          { text: "Tarjetas vía una sola pasarela", score: 2 },
          { text: "Multi-pasarela + billeteras digitales", score: 3 },
          { text: "Omnicanal: tarjeta, QR, BNPL, listo para cripto", score: 4 },
        ],
      },
    ],
    dimensions: ["Infraestructura", "Fraude y Riesgo", "Cumplimiento", "Integración", "Canales CX"],
    recs: {
      low: "Tu infraestructura de pagos está en etapa inicial. Prioridad: implementar una pasarela moderna y automatizar la conciliación. ROI en 90 días.",
      mid: "Buenas bases, pero las brechas en fraude y compliance generan riesgo. Foco: scoring de fraude por ML y plataforma GRC.",
      high: "Alta madurez. La diferenciación competitiva viene ahora de datos en tiempo real e integración open-banking para finanzas embebidas.",
      max: "Best-in-class. Considerá monetizar tu infraestructura ofreciendo capacidades BaaS a negocios adyacentes.",
    },
  },

  docsign: {
    questions: [
      {
        category: "Ciclo de Vida Documental",
        text: "¿Cómo se gestionan y firman los documentos internamente?",
        options: [
          { text: "Papel con firmas físicas", score: 1 },
          { text: "PDF por email, firmas escaneadas", score: 2 },
          { text: "Herramienta de firma electrónica para flujos específicos", score: 3 },
          { text: "Ciclo digital completo con firma y trazabilidad", score: 4 },
        ],
      },
      {
        category: "Validez Legal",
        text: "¿Qué confianza tenés en la validez legal de tus firmas electrónicas?",
        options: [
          { text: "No hemos evaluado su validez legal", score: 1 },
          { text: "Conocemos la normativa pero no cumplimos completamente", score: 2 },
          { text: "Cumplimos para la mayoría de los casos, con algunas brechas", score: 3 },
          { text: "Cumplimiento total con firma electrónica calificada (FEA)", score: 4 },
        ],
      },
      {
        category: "Automatización de Flujos",
        text: "¿Qué tan automatizados están tus flujos de aprobación documental?",
        options: [
          { text: "Routing completamente manual", score: 1 },
          { text: "Por email con seguimiento manual", score: 2 },
          { text: "Flujos configurados con notificaciones", score: 3 },
          { text: "Lógica condicional, SLA y escalado automático", score: 4 },
        ],
      },
      {
        category: "Integración con Sistemas",
        text: "¿Cómo se conecta tu herramienta de firma con tu CRM/ERP?",
        options: [
          { text: "Sin integración — herramienta aislada", score: 1 },
          { text: "Re-ingreso manual de datos entre sistemas", score: 2 },
          { text: "Integración básica vía Zapier/webhooks", score: 3 },
          { text: "Integración API bidireccional nativa", score: 4 },
        ],
      },
      {
        category: "Analítica y Compliance",
        text: "¿Podés reportar tasas de completitud y compliance documental?",
        options: [
          { text: "Sin visibilidad del estado de documentos", score: 1 },
          { text: "Reportes manuales ad hoc", score: 2 },
          { text: "Dashboards básicos en la plataforma de firma", score: 3 },
          { text: "Analítica personalizada con trazabilidad y reportes de compliance", score: 4 },
        ],
      },
    ],
    dimensions: ["Ciclo Documental", "Validez Legal", "Automatización", "Integración", "Analítica"],
    recs: {
      low: "Gran oportunidad de digitalización. Comenzá con una plataforma de firma electrónica legalmente válida para tus documentos de mayor volumen.",
      mid: "Buen comienzo. Enfocate en automatización de flujos e integración CRM para eliminar handoffs manuales — típicamente 60% de ahorro de tiempo.",
      high: "Capacidad avanzada. Actualizá a firma electrónica calificada (FEA) para industrias reguladas y construí dashboards de analítica.",
      max: "Líder en el sector. Considerá white-labeling de tu infraestructura documental u ofrecer alternativas a clientes.",
    },
  },

  ai: {
    questions: [
      {
        category: "Estrategia de IA",
        text: "¿Cómo está integrada la IA en tu producto o servicio actualmente?",
        options: [
          { text: "Sin IA en producción — solo explorando", score: 1 },
          { text: "Una o dos funciones con IA (chatbot, búsqueda)", score: 2 },
          { text: "Funciones de IA en múltiples áreas del producto", score: 3 },
          { text: "La IA es el núcleo de nuestra propuesta de valor", score: 4 },
        ],
      },
      {
        category: "Madurez de Datos",
        text: "¿Cómo describirías la infraestructura de datos de tu organización?",
        options: [
          { text: "Fragmentada — datos en silos, sin repositorio central", score: 1 },
          { text: "Almacenamiento centralizado con controles de calidad limitados", score: 2 },
          { text: "Datos limpios y etiquetados con data warehouse", score: 3 },
          { text: "Pipelines en tiempo real, feature store y MLOps", score: 4 },
        ],
      },
      {
        category: "Velocidad de Desarrollo",
        text: "¿Con qué rapidez puede tu equipo lanzar una nueva funcionalidad?",
        options: [
          { text: "Meses por feature, proceso en cascada", score: 1 },
          { text: "2 a 6 semanas, ágil básico", score: 2 },
          { text: "1 a 2 semanas con pipelines CI/CD", score: 3 },
          { text: "Despliegue continuo, releases en el mismo día", score: 4 },
        ],
      },
      {
        category: "Herramientas de IA",
        text: "¿Qué tooling de IA/ML utiliza tu equipo de ingeniería?",
        options: [
          { text: "Ninguno — sin expertise en ML", score: 1 },
          { text: "API de OpenAI u similar, solo integraciones por prompts", score: 2 },
          { text: "Modelos fine-tuneados + pipelines RAG", score: 3 },
          { text: "Modelos propios, vector DBs, orquestación multi-agente", score: 4 },
        ],
      },
      {
        category: "Gobernanza",
        text: "¿Cómo gestionás el monitoreo de modelos y la supervisión ética?",
        options: [
          { text: "Sin proceso — outputs como caja negra en producción", score: 1 },
          { text: "Revisiones manuales esporádicas", score: 2 },
          { text: "Herramientas de observabilidad (logging, drift detection)", score: 3 },
          { text: "MLOps completo con auditorías de sesgo y explicabilidad", score: 4 },
        ],
      },
    ],
    dimensions: ["Estrategia IA", "Madurez de Datos", "Velocidad Dev", "Herramientas IA", "Gobernanza"],
    recs: {
      low: "Alta oportunidad. Identificá los 2 procesos donde la IA puede reducir el trabajo manual. La calidad de datos es tu inversión más importante.",
      mid: "Base sólida. Invertí en pipelines RAG y un feature store. Tu próxima contratación debería ser un ML Engineer.",
      high: "Posición competitiva. Diferenciáte con modelos propios y pasá de IA que ahorra costos a IA que genera ingresos.",
      max: "Líder innovador. Explorá sistemas multi-agente, datos sintéticos y considerá productizar tus capacidades de IA.",
    },
  },

  insurtech: {
    questions: [
      {
        category: "Canales Digitales",
        text: "¿Cómo interactúan los ciudadanos/clientes con tus servicios?",
        options: [
          { text: "Solo oficinas presenciales", score: 1 },
          { text: "Portal web básico con autogestión limitada", score: 2 },
          { text: "Portal mobile-ready con la mayoría de servicios online", score: 3 },
          { text: "Omnicanal completo: web, app móvil, API, WhatsApp", score: 4 },
        ],
      },
      {
        category: "Automatización de Procesos",
        text: "¿Qué porcentaje de tus procesos de back-office están automatizados?",
        options: [
          { text: "Menos del 10% — principalmente manual", score: 1 },
          { text: "10 al 30% — algunas islas de automatización", score: 2 },
          { text: "30 al 60% — RPA o herramientas de workflow en uso", score: 3 },
          { text: "Más del 60% — automatización de procesos end-to-end", score: 4 },
        ],
      },
      {
        category: "Datos y Analítica",
        text: "¿Cómo usás los datos para tomar decisiones o evaluar riesgos?",
        options: [
          { text: "Intuición y planillas de cálculo", score: 1 },
          { text: "Reportes periódicos de sistemas legacy", score: 2 },
          { text: "Dashboards BI con datos casi en tiempo real", score: 3 },
          { text: "Analítica predictiva y modelos de scoring de riesgo", score: 4 },
        ],
      },
      {
        category: "Interoperabilidad",
        text: "¿Qué tan bien comparten datos tus sistemas con entidades externas?",
        options: [
          { text: "Sin intercambio de datos — completamente en silos", score: 1 },
          { text: "Transferencias manuales de archivos (CSV, FTP)", score: 2 },
          { text: "APIs REST para integraciones específicas", score: 3 },
          { text: "Ecosistema API completo con interoperabilidad en tiempo real", score: 4 },
        ],
      },
      {
        category: "Compliance y Seguridad",
        text: "¿Cuál es tu postura de ciberseguridad y cumplimiento regulatorio?",
        options: [
          { text: "Mínima — antivirus básico, sin marco formal", score: 1 },
          { text: "ISO 27001 parcial o similar, con brechas", score: 2 },
          { text: "Marco certificado, pruebas de penetración anuales", score: 3 },
          { text: "Arquitectura Zero-Trust, monitoreo continuo de compliance", score: 4 },
        ],
      },
    ],
    dimensions: ["Canales Digitales", "Automatización", "Datos y Analítica", "Interoperabilidad", "Compliance"],
    recs: {
      low: "Brecha digital crítica. Ciudadanos y clientes esperan lo digital primero. Comenzá con un portal web y automatizá tu proceso manual de mayor volumen.",
      mid: "Buen progreso. Invertí en RPA para escalar automatización y construí una capa API para intercambio de datos con gobierno/aseguradoras.",
      high: "Posición sólida. Diferenciáte con scoring predictivo de riesgo y una app móvil para ciudadanos.",
      max: "Líder digital en tu categoría. Explorá iniciativas de open data y jugadas de plataforma — tu infraestructura es monetizable.",
    },
  },
};

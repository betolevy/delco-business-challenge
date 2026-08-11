import type { Question } from "@/lib/types";

/**
 * The 15 Business Challenge cases, laid out 4/4/3/4 across the four
 * sections. Content lives here as the source of truth; edit via the Admin
 * panel in production (writes go to the store, not this file) — this is
 * just what a fresh environment starts from.
 *
 * Wrong options are written to be plausible, not absurd — each one is a
 * real misconception a founder might actually hold, so picking the right
 * answer takes reasoning, not just eliminating the silly ones.
 */
export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: "q1",
    order: 1,
    section: "BUILD A BUSINESS",
    sectionEmoji: "🚀",
    caseTitle: "The Co-Founder",
    scenario:
      "Dos amigos crean una startup. Uno invierte el dinero; el otro desarrolla toda la tecnología. Nunca acuerdan quién será dueño del software.",
    prompt: "¿Qué problema podría aparecer si la empresa crece y luego deciden separarse?",
    options: [
      { id: "a", label: "El código quedará automáticamente a nombre de la empresa por estar constituida." },
      { id: "b", label: "El inversionista será automáticamente dueño del software." },
      { id: "c", label: "El desarrollador será automáticamente dueño del software." },
      { id: "d", label: "La propiedad del software podría convertirse en un conflicto." },
    ],
    correctOptionId: "d",
    explanation:
      "La propiedad intelectual no debería asumirse. Debe quedar claramente definida desde el inicio, con un acuerdo de cesión de derechos.",
  },
  {
    id: "q2",
    order: 2,
    section: "BUILD A BUSINESS",
    sectionEmoji: "🚀",
    caseTitle: "The Brand",
    scenario:
      "Una empresa registra inmediatamente su dominio web, lanza su página y empieza a vender. Nunca registra la marca.",
    prompt: "¿Qué error está cometiendo?",
    options: [
      { id: "a", label: "Debió registrar primero la sociedad." },
      { id: "b", label: "Haber usado la marca primero en el mercado ya le da protección legal suficiente." },
      { id: "c", label: "El dominio no protege legalmente la marca." },
      { id: "d", label: "Debió registrar primero el logo." },
    ],
    correctOptionId: "c",
    explanation:
      "Comprar un dominio (o ser el primero en usar la marca) es importante, pero no reemplaza el registro formal de la marca.",
  },
  {
    id: "q3",
    order: 3,
    section: "BUILD A BUSINESS",
    sectionEmoji: "🚀",
    caseTitle: "The 50/50",
    scenario:
      "Dos fundadores poseen exactamente el 50% de la empresa. Nunca firmaron un acuerdo entre ellos. Tres años después ya no se ponen de acuerdo.",
    prompt: "¿Cuál es el mayor riesgo?",
    options: [
      { id: "a", label: "Uno podrá expulsar al otro." },
      { id: "b", label: "El accionista con más antigüedad tendrá el voto decisivo en caso de empate." },
      { id: "c", label: "Las decisiones importantes pueden quedar bloqueadas." },
      { id: "d", label: "El gerente general podrá romper el empate por decreto." },
    ],
    correctOptionId: "c",
    explanation:
      "Un 50/50 no tiene un desempate natural. Los mejores acuerdos entre socios se firman cuando todavía existe confianza.",
  },
  {
    id: "q4",
    order: 4,
    section: "BUILD A BUSINESS",
    sectionEmoji: "🚀",
    caseTitle: "The Dilution",
    scenario:
      "Un fundador tiene el 60% de su empresa. Entra un inversionista y se emiten acciones nuevas. Después de la ronda tiene 45% — aunque nunca vendió una sola acción.",
    prompt: "¿Qué ocurrió?",
    options: [
      { id: "a", label: "Su participación se diluyó al emitirse acciones nuevas." },
      { id: "b", label: "Alguien le transfirió acciones al inversionista sin avisarle." },
      { id: "c", label: "Perdió acciones por no participar en la junta." },
      { id: "d", label: "El valor de sus acciones bajó en la misma proporción." },
    ],
    correctOptionId: "a",
    explanation:
      "Emitir acciones nuevas reparte la empresa entre más participaciones: el porcentaje baja aunque el fundador conserve exactamente las mismas acciones. No es necesariamente malo — 45% de una empresa más valiosa puede valer mucho más que el 60% anterior — pero sí cambia el control, y por eso se negocia antes, no después.",
  },
  {
    id: "q5",
    order: 5,
    section: "MAKE THE DEAL",
    sectionEmoji: "🤝",
    caseTitle: "The Fine Print",
    scenario:
      "Una empresa joven firma el arrendamiento de su primera oficina. En la última página, el dueño del local pide que el fundador firme también como fiador.",
    prompt: "¿Qué implica realmente esa firma adicional?",
    options: [
      { id: "a", label: "Solo confirma que leyó el contrato." },
      { id: "b", label: "Que el fundador responde con su patrimonio personal si la empresa no paga." },
      { id: "c", label: "Que el fundador queda como representante legal de la empresa." },
      { id: "d", label: "Que el contrato adquiere validez ante notario." },
    ],
    correctOptionId: "b",
    explanation:
      "La garantía personal atraviesa la protección que da la sociedad. Es de las cláusulas que más se firman sin dimensionar: si la empresa falla, el patrimonio del socio queda expuesto.",
  },
  {
    id: "q6",
    order: 6,
    section: "MAKE THE DEAL",
    sectionEmoji: "🤝",
    caseTitle: "The Surprise",
    scenario:
      "Una empresa está a punto de ser vendida. Durante la revisión aparece una demanda millonaria que nadie había mencionado.",
    prompt: "¿Qué proceso existe precisamente para descubrir estos riesgos antes del cierre?",
    options: [
      { id: "a", label: "Un Due Diligence." },
      { id: "b", label: "Una auditoría financiera de los últimos años." },
      { id: "c", label: "Una búsqueda de gravámenes en el Registro Público." },
      { id: "d", label: "Un certificado de buen estado (good standing) de la sociedad." },
    ],
    correctOptionId: "a",
    explanation:
      "Una auditoría revisa números; el Registro Público revela gravámenes inscritos; el good standing solo confirma que la sociedad está vigente. El Due Diligence es el único que abarca contratos, permisos y litigios — donde suelen esconderse las sorpresas.",
  },
  {
    id: "q7",
    order: 7,
    section: "MAKE THE DEAL",
    sectionEmoji: "🤝",
    caseTitle: "The Million-Dollar Email",
    scenario:
      'Después de semanas negociando, el comprador responde por correo: "Aceptamos la oferta. Avancemos."',
    prompt: "¿Cuál es la afirmación más acertada?",
    options: [
      { id: "a", label: "Un correo nunca genera obligaciones." },
      { id: "b", label: "Solo cuenta si después se firma en papel." },
      { id: "c", label: "Dependiendo del contexto, ese intercambio puede tener efectos legales." },
      { id: "d", label: "Solo es válido si tiene firma digital." },
    ],
    correctOptionId: "c",
    explanation:
      "Hoy muchas negociaciones se documentan electrónicamente. El contexto (y lo que se dijo antes) importa más que el formato.",
  },
  {
    id: "q8",
    order: 8,
    section: "MAKE THE DEAL",
    sectionEmoji: "🤝",
    caseTitle: "The Renewal",
    scenario:
      "El contrato con un proveedor se renueva automáticamente cada año, salvo que se avise con 90 días de anticipación. La empresa avisa que no quiere renovar 30 días antes del vencimiento.",
    prompt: "¿Cuál es la situación más probable?",
    options: [
      { id: "a", label: "El contrato termina igual, porque avisó antes del vencimiento." },
      { id: "b", label: "El contrato queda renovado por un período más." },
      { id: "c", label: "El contrato termina, pero con una penalidad menor." },
      { id: "d", label: "El aviso obliga a renegociar las condiciones." },
    ],
    correctOptionId: "b",
    explanation:
      "En una renovación automática lo que manda es la ventana de preaviso, no la fecha de vencimiento. Avisar tarde equivale a no avisar. Vale la pena calendarizar esas fechas el día que se firma, no el día que se quiere salir.",
  },
  {
    id: "q9",
    order: 9,
    section: "OWN YOUR IDEAS",
    sectionEmoji: "💡",
    caseTitle: "The Developer",
    scenario:
      "Una empresa contrata a un desarrollador externo para crear toda su plataforma digital. Nunca acuerdan quién será dueño del código.",
    prompt: "¿Cuál es el mayor riesgo?",
    options: [
      { id: "a", label: "Que el desarrollador pueda seguir usando ese código libremente en otros proyectos." },
      { id: "b", label: "Que la empresa sea automáticamente dueña del código por haberlo pagado." },
      { id: "c", label: "Que el desarrollador deba entregar el código fuente completo." },
      { id: "d", label: "Que nadie tenga claro quién es dueño del código." },
    ],
    correctOptionId: "d",
    explanation:
      "Pagar por el desarrollo no transfiere automáticamente la propiedad del código — se necesita un acuerdo escrito de cesión de derechos. El software suele ser uno de los activos más valiosos de una empresa.",
  },
  {
    id: "q10",
    order: 10,
    section: "OWN YOUR IDEAS",
    sectionEmoji: "💡",
    caseTitle: "The AI Assistant",
    scenario: "Una empresa usa inteligencia artificial para preparar todos sus contratos sin revisarlos.",
    prompt: "¿Cuál es el riesgo más importante?",
    options: [
      { id: "a", label: "Que el texto suene genérico o poco profesional." },
      { id: "b", label: "Que el modelo no esté actualizado a la última reforma legal." },
      { id: "c", label: "Que nadie haya evaluado los riesgos propios de esa operación." },
      { id: "d", label: "Que el documento sea más largo de lo necesario." },
    ],
    correctOptionId: "c",
    explanation:
      "La IA redacta rápido y puede sonar impecable, pero trabaja sobre patrones generales. Sin alguien que entienda el negocio concreto, el contrato puede estar bien escrito y aun así no proteger lo que importa.",
  },
  {
    id: "q11",
    order: 11,
    section: "OWN YOUR IDEAS",
    sectionEmoji: "💡",
    caseTitle: "The Early Exit",
    scenario:
      "Un cofundador recibe el 20% de las acciones el día en que se constituye la empresa. Seis meses después, decide irse a otro proyecto.",
    prompt: "¿Qué mecanismo suele evitar que alguien se quede con acciones completas por tan poco tiempo de trabajo?",
    options: [
      { id: "a", label: "Un aumento de capital." },
      { id: "b", label: "Un plan de vesting." },
      { id: "c", label: "Una junta extraordinaria." },
      { id: "d", label: "Una cláusula de no competencia." },
    ],
    correctOptionId: "b",
    explanation:
      "El vesting hace que las acciones se ganen gradualmente con el tiempo, protegiendo a la empresa si un socio se va temprano.",
  },
  {
    id: "q12",
    order: 12,
    section: "PROTECT YOUR COMPANY",
    sectionEmoji: "🛡️",
    caseTitle: "The Competitor",
    scenario: "Uno de los socios quiere vender todas sus acciones a un competidor.",
    prompt: "¿Qué mecanismo suele proteger primero a los demás socios?",
    options: [
      { id: "a", label: "Cláusula de arrastre (drag-along)." },
      { id: "b", label: "Cláusula de no competencia." },
      { id: "c", label: "Derecho de preferencia." },
      { id: "d", label: "Cláusula de exclusividad." },
    ],
    correctOptionId: "c",
    explanation:
      "El derecho de preferencia permite que los socios existentes tengan la primera oportunidad de comprar, antes de que entre un tercero.",
  },
  {
    id: "q13",
    order: 13,
    section: "PROTECT YOUR COMPANY",
    sectionEmoji: "🛡️",
    caseTitle: "The Expansion",
    scenario: "Una empresa abrirá operaciones en tres países usando la misma marca.",
    prompt: "¿Qué debería revisar antes del lanzamiento?",
    options: [
      { id: "a", label: "Si necesitan constituir una nueva sociedad en cada país para poder usar la marca." },
      { id: "b", label: "Si deben traducir el nombre de la marca a cada idioma local." },
      { id: "c", label: "El costo de registrar la sociedad." },
      { id: "d", label: "Si la marca puede protegerse en esos países." },
    ],
    correctOptionId: "d",
    explanation:
      "Una marca disponible en un país puede pertenecer a otra empresa en otro — el registro de marca es territorial, no automático.",
  },
  {
    id: "q14",
    order: 14,
    section: "PROTECT YOUR COMPANY",
    sectionEmoji: "🛡️",
    caseTitle: "The Contractor",
    scenario:
      'Una empresa contrata a una persona "por servicios profesionales". Le fija horario, le da equipo, le asigna un supervisor, y trabaja solo para ellos desde hace tres años.',
    prompt: "¿Cuál es el mayor riesgo para la empresa?",
    options: [
      { id: "a", label: "Que la relación sea considerada laboral, con todo lo que eso implica." },
      { id: "b", label: "Que pueda renunciar sin previo aviso." },
      { id: "c", label: "Que deba registrarse como proveedor ante la autoridad tributaria." },
      { id: "d", label: "Que el contrato deba renovarse cada año." },
    ],
    correctOptionId: "a",
    explanation:
      "Lo que define una relación laboral no es el nombre del contrato, sino cómo funciona en la práctica: subordinación, horario, herramientas, exclusividad. Reclasificarla después sale mucho más caro que estructurarla bien desde el inicio.",
  },
  {
    id: "q15",
    order: 15,
    section: "PROTECT YOUR COMPANY",
    sectionEmoji: "🛡️",
    caseTitle: "The Structure",
    scenario:
      "Una empresa factura a través de varias entidades relacionadas sin ninguna asesoría fiscal, buscando ahorrarse el costo de un consultor.",
    prompt: "¿Cuál es el mayor riesgo de operar así, sin planificación fiscal adecuada?",
    options: [
      { id: "a", label: "Que paguen menos impuestos de lo normal, sin ningún riesgo adicional." },
      { id: "b", label: "Pagar más impuestos de los necesarios o enfrentar contingencias fiscales." },
      { id: "c", label: "Que el banco les exija más documentación para abrir cuentas." },
      { id: "d", label: "Que deban cambiar de contador cada año por ley." },
    ],
    correctOptionId: "b",
    explanation:
      "La asesoría fiscal no es un gasto — es lo que permite estructurar la operación de forma eficiente y evitar contingencias costosas.",
  },
];

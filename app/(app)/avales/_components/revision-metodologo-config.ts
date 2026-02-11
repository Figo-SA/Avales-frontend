import type { RevisionMetodologoItem } from "@/lib/api/avales";
import type {
  ReviewItem,
  ReviewStateItem,
} from "@/app/(app)/avales/_components/revision-metodologo-preview";

type ReviewSection = ReviewItem["section"];

const REVIEW_ITEM_ORDER = [
  "CERT_ESC_INI",
  "CERT_MET_PDA",
  "CERT_COMPRAS_PUBLICAS",
  "FECHA_INGRESO_DTM",
  "FECHA_RECIBIDO_METODOLOGO",
  "NUM_AVAL_TECNICO",
  "DEPORTE",
  "CATEGORIA",
  "GENERO",
  "ENTRENADOR_RESPONSABLE",
  "EVENTO",
  "LUGAR",
  "FECHAS",
  "OBJETIVOS_PARTICIPACION",
  "CRITERIOS_SELECCION",
  "CONFORMACION_DELEGACION",
  "REQUERIMIENTOS",
  "FIRMAS_RESPONSABILIDAD_AVAL",
  "DATOS_DEPORTISTAS",
  "AFILIACION",
  "CERTIFICACION_MEDICA",
  "AVAL_TECNICO",
];

const REVIEW_ITEM_CONFIG: Record<
  string,
  { label: string; section: ReviewSection; type: "boolean" | "fecha" }
> = {
  CERT_ESC_INI: {
    label: "Certificado de las escuelas de iniciacion recibido",
    section: "CHECKLIST",
    type: "boolean",
  },
  CERT_MET_PDA: {
    label: "Certificado del metodologo del PDA",
    section: "CHECKLIST",
    type: "boolean",
  },
  CERT_COMPRAS_PUBLICAS: {
    label: "Certificado de Compras Publicas",
    section: "CHECKLIST",
    type: "boolean",
  },
  FECHA_INGRESO_DTM: {
    label: "Fecha de ingreso en secretaria del DTM",
    section: "CHECKLIST",
    type: "fecha",
  },
  FECHA_RECIBIDO_METODOLOGO: {
    label: "Fecha de recibido por el metodologo",
    section: "CHECKLIST",
    type: "fecha",
  },
  NUM_AVAL_TECNICO: {
    label: "Numero del aval tecnico",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
  },
  DEPORTE: { label: "Deporte", section: "DATOS_INFORMATIVOS", type: "boolean" },
  CATEGORIA: {
    label: "Categoria",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
  },
  GENERO: { label: "Genero", section: "DATOS_INFORMATIVOS", type: "boolean" },
  ENTRENADOR_RESPONSABLE: {
    label: "Entrenador responsable",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
  },
  EVENTO: { label: "Evento", section: "DATOS_INFORMATIVOS", type: "boolean" },
  LUGAR: { label: "Lugar", section: "DATOS_INFORMATIVOS", type: "boolean" },
  FECHAS: { label: "Fechas", section: "DATOS_INFORMATIVOS", type: "boolean" },
  OBJETIVOS_PARTICIPACION: {
    label: "Objetivos de participacion",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
  },
  CRITERIOS_SELECCION: {
    label: "Criterios de seleccion",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
  },
  CONFORMACION_DELEGACION: {
    label: "Conformacion de la delegacion",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
  },
  REQUERIMIENTOS: {
    label: "Requerimientos",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
  },
  FIRMAS_RESPONSABILIDAD_AVAL: {
    label: "Firmas de responsabilidad del aval tecnico",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
  },
  DATOS_DEPORTISTAS: {
    label:
      "Datos de los deportistas (estado de preparacion, pronostico y prueba)",
    section: "HOJAS_EXCEL",
    type: "boolean",
  },
  AFILIACION: {
    label: "Afiliacion",
    section: "HOJAS_EXCEL",
    type: "boolean",
  },
  CERTIFICACION_MEDICA: {
    label: "Certificacion medica",
    section: "HOJAS_EXCEL",
    type: "boolean",
  },
  AVAL_TECNICO: {
    label: "Aval tecnico de participacion apoyo FDPL y comite de funcionamiento",
    section: "HOJAS_EXCEL",
    type: "boolean",
  },
};

export const DEFAULT_REVIEW_ITEMS: ReviewItem[] = REVIEW_ITEM_ORDER.map(
  (code, index) => {
    const config = REVIEW_ITEM_CONFIG[code];
    return {
      key: code,
      label: config?.label ?? code,
      section: config?.section ?? "DATOS_INFORMATIVOS",
      type: config?.type ?? "boolean",
      order: index + 1,
      defaultCumple: true,
    };
  },
);

export function buildInitialReviewState(items: ReviewItem[]) {
  return Object.fromEntries(
    items.map((item) => [
      item.key,
      { cumple: item.defaultCumple, observacion: "" },
    ]),
  ) as Record<string, ReviewStateItem>;
}

export function normalizeReviewItems(items: RevisionMetodologoItem[] | string[]) {
  const labelsByCode = new Map<string, string>();
  const codesFromApi = new Set<string>();
  items.forEach((item) => {
    if (typeof item === "string") return;
    const code = item?.codigo ?? (item as { code?: string }).code ?? "";
    if (!code) return;
    const label =
      item?.descripcion ?? (item as { label?: string }).label ?? "";
    if (label) labelsByCode.set(code, label);
    codesFromApi.add(code);
  });

  const ordered = REVIEW_ITEM_ORDER.filter((code) =>
    codesFromApi.size ? codesFromApi.has(code) : true,
  );

  return ordered.map((code, index) => {
    const config = REVIEW_ITEM_CONFIG[code];
    const label = labelsByCode.get(code) ?? config?.label ?? code;
    return {
      key: code,
      label,
      section: config?.section ?? "DATOS_INFORMATIVOS",
      type: config?.type ?? "boolean",
      order: index + 1,
      defaultCumple: true,
    } satisfies ReviewItem;
  });
}

type ApiReviewItem = {
  key?: string | null;
  codigo?: string | null;
  label?: string | null;
  descripcion?: string | null;
  cumple?: boolean | null;
  observacion?: string | null;
};

export function mergeReviewStateFromApi(
  reviewItems: ReviewItem[],
  apiItems: ApiReviewItem[] | null | undefined,
) {
  const next = buildInitialReviewState(reviewItems);
  if (!apiItems || apiItems.length === 0) return next;

  const keyMap = new Map(reviewItems.map((item) => [item.key, item.key]));
  const labelMap = new Map(
    reviewItems.map((item) => [
      item.label.trim().toLowerCase(),
      item.key,
    ]),
  );

  apiItems.forEach((item, index) => {
    const rawKey = item?.key?.trim() || item?.codigo?.trim() || "";
    const rawLabel =
      item?.label?.trim() || item?.descripcion?.trim() || "";
    const targetKey =
      (rawKey && keyMap.get(rawKey)) ||
      (rawLabel && labelMap.get(rawLabel.toLowerCase())) ||
      (reviewItems[index]?.key ?? "");
    if (!targetKey) return;

    next[targetKey] = {
      cumple: item?.cumple ?? next[targetKey].cumple,
      observacion: item?.observacion?.trim() ?? "",
    };
  });

  return next;
}

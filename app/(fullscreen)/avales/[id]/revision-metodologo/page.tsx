"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

import { getAval } from "@/lib/api/avales";
import type { Aval } from "@/types/aval";
import { formatDate } from "@/lib/utils/formatters";
import {
  ListaDeportistasPreview,
  SolicitudAvalPreview,
  type AvalPreviewFormData,
} from "@/app/(app)/avales/_components/aval-document-preview";
import PdaPreview, { type PdaDraft } from "@/app/(app)/avales/_components/pda-preview";
import RevisionMetodologoPreview from "@/app/(app)/avales/_components/revision-metodologo-preview";

const INITIAL_PDA_DRAFT: PdaDraft = {
  descripcion: "",
  numeroPda: "",
  numeroAval: "",
  codigoActividad: "005",
  nombreFirmante: "",
  cargoFirmante: "",
};

const EMPTY_DOCS_DATA: AvalPreviewFormData = {
  deportistas: [],
  entrenadores: [],
  fechaHoraSalida: "",
  fechaHoraRetorno: "",
  lugarSalida: "",
  lugarRetorno: "",
  transporteSalida: "",
  transporteRetorno: "",
  objetivos: [],
  criterios: [],
  observaciones: "",
};

function buildTrainerDocsData(aval: Aval): AvalPreviewFormData {
  const tecnico = aval.avalTecnico;

  const deportistas = (tecnico?.deportistasAval ?? []).map((item) => {
    const withExtras = item as typeof item & {
      observacion?: string | null;
      deportista: typeof item.deportista & { fechaNacimiento?: string | null };
    };

    return {
      id: item.deportista?.id ?? item.id,
      nombre: item.deportista?.nombre ?? `Deportista ${item.id}`,
      cedula: item.deportista?.cedula ?? undefined,
      fechaNacimiento: withExtras.deportista?.fechaNacimiento ?? undefined,
      observacion: withExtras.observacion ?? undefined,
      rol: item.rol ?? undefined,
    };
  });

  const entrenadores = [...(aval.entrenadores ?? [])]
    .sort((a, b) => Number(Boolean(b.esPrincipal)) - Number(Boolean(a.esPrincipal)))
    .map((item) => {
      const withUser = item as typeof item & {
        usuario?: { nombre?: string; apellido?: string };
        entrenador?: { nombre?: string; apellido?: string };
        nombre?: string;
        apellido?: string;
      };

      const nombre = (
        [
          withUser.entrenador?.nombre ?? withUser.usuario?.nombre ?? withUser.nombre,
          withUser.entrenador?.apellido ?? withUser.usuario?.apellido ?? withUser.apellido,
        ]
          .filter(Boolean)
          .join(" ")
          .trim() || `Entrenador ${item.entrenadorId}`
      ).toUpperCase();

      return {
        id: item.entrenadorId,
        nombre,
      };
    });

  return {
    deportistas,
    entrenadores,
    fechaHoraSalida: tecnico?.fechaHoraSalida ?? "",
    fechaHoraRetorno: tecnico?.fechaHoraRetorno ?? "",
    lugarSalida: tecnico?.lugarSalida ?? "",
    lugarRetorno: tecnico?.lugarRetorno ?? "",
    transporteSalida: tecnico?.transporteSalida ?? "",
    transporteRetorno: tecnico?.transporteRetorno ?? "",
    objetivos: [...(tecnico?.objetivos ?? [])]
      .sort((a, b) => a.orden - b.orden)
      .map((item) => item.descripcion),
    criterios: [...(tecnico?.criterios ?? [])]
      .sort((a, b) => a.orden - b.orden)
      .map((item) => item.descripcion),
    observaciones: tecnico?.observaciones ?? "",
  };
}

function getEntrenadorResponsableNombre(aval: Aval) {
  const sorted = [...(aval.entrenadores ?? [])].sort(
    (a, b) => Number(Boolean(b.esPrincipal)) - Number(Boolean(a.esPrincipal)),
  );
  const first = sorted[0] as
    | (typeof sorted)[number] & {
        usuario?: { nombre?: string; apellido?: string };
        entrenador?: { nombre?: string; apellido?: string };
        nombre?: string;
        apellido?: string;
      }
    | undefined;

  if (!first) return "[NOMBRE ENTRENADOR RESPONSABLE]";

  return (
    [
      first.entrenador?.nombre ?? first.usuario?.nombre ?? first.nombre,
      first.entrenador?.apellido ?? first.usuario?.apellido ?? first.apellido,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || "[NOMBRE ENTRENADOR RESPONSABLE]"
  );
}

function buildDefaultDescripcion(aval: Aval) {
  const evento = aval.evento;
  const disciplina = evento?.disciplina?.nombre ?? "[DISCIPLINA]";
  const fecha = evento?.fechaInicio
    ? formatDate(evento.fechaInicio)
    : "[FECHA EVENTO]";
  const eventoNombre = evento?.nombre ?? "[NOMBRE EVENTO]";
  const categoria = evento?.categoria?.nombre;
  const entrenadorResponsable = getEntrenadorResponsableNombre(aval);

  return `De acuerdo al aval Técnico de Participación Competitiva [NUMERO AVAL], de la disciplina de ${disciplina} con fecha ${fecha}, suscrito por el ${entrenadorResponsable} Entrenador de la disciplina y la [NOMBRE PRESIDENTE] Presidente del Comité de Funcionamiento me permito certificar que el evento ${eventoNombre.toUpperCase()}${
    categoria ? ` (${categoria.toUpperCase()})` : ""
  } consta en el PDA 2026 aprobado por el Ministerio del Deporte.`;
}

type ReviewItem = {
  key: string;
  label: string;
  section: "CHECKLIST" | "DATOS_INFORMATIVOS";
  type: "boolean" | "fecha";
  order: number;
  defaultCumple: boolean;
};

const REVIEW_ITEMS: ReviewItem[] = [
  {
    key: "certificado_escuelas",
    label: "Certificado de las escuelas de iniciacion recibido",
    section: "CHECKLIST",
    type: "boolean",
    order: 1,
    defaultCumple: true,
  },
  {
    key: "certificado_metodologo_pda",
    label: "Certificado del metodologo del PDA",
    section: "CHECKLIST",
    type: "boolean",
    order: 2,
    defaultCumple: true,
  },
  {
    key: "fecha_ingreso_secretaria_dtm",
    label: "Fecha de ingreso en secretaria del DTM",
    section: "CHECKLIST",
    type: "fecha",
    order: 3,
    defaultCumple: true,
  },
  {
    key: "fecha_recibido_metodologo",
    label: "Fecha de recibido por el metodologo",
    section: "CHECKLIST",
    type: "fecha",
    order: 4,
    defaultCumple: true,
  },
  {
    key: "numero_aval_tecnico",
    label: "Numero del aval tecnico",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
    order: 5,
    defaultCumple: true,
  },
  {
    key: "deporte",
    label: "Deporte",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
    order: 6,
    defaultCumple: true,
  },
  {
    key: "categoria",
    label: "Categoria",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
    order: 7,
    defaultCumple: true,
  },
  {
    key: "genero",
    label: "Genero",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
    order: 8,
    defaultCumple: true,
  },
  {
    key: "entrenador_responsable",
    label: "Entrenador responsable",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
    order: 9,
    defaultCumple: true,
  },
  {
    key: "evento",
    label: "Evento",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
    order: 10,
    defaultCumple: true,
  },
  {
    key: "lugar",
    label: "Lugar",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
    order: 11,
    defaultCumple: true,
  },
  {
    key: "fechas",
    label: "Fechas",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
    order: 12,
    defaultCumple: true,
  },
  {
    key: "objetivos_participacion",
    label: "Objetivos de participacion",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
    order: 13,
    defaultCumple: true,
  },
  {
    key: "criterios_seleccion",
    label: "Criterios de seleccion",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
    order: 14,
    defaultCumple: true,
  },
  {
    key: "conformacion_delegacion",
    label: "Conformacion de la delegacion",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
    order: 15,
    defaultCumple: true,
  },
  {
    key: "requerimientos",
    label: "Requerimientos",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
    order: 16,
    defaultCumple: true,
  },
  {
    key: "firmas_responsabilidad_aval_tecnico",
    label: "Firmas de responsabilidad del aval tecnico",
    section: "DATOS_INFORMATIVOS",
    type: "boolean",
    order: 17,
    defaultCumple: true,
  },
];

const SECTION_LABELS: Record<ReviewItem["section"], string> = {
  CHECKLIST: "Checklist",
  DATOS_INFORMATIVOS: "Datos informativos",
};

function buildInitialReviewState() {
  return Object.fromEntries(
    REVIEW_ITEMS.map((item) => [
      item.key,
      { cumple: item.defaultCumple, observacion: "" },
    ]),
  );
}

export default function RevisionMetodologoPage() {
  const params = useParams();
  const router = useRouter();
  const avalId = Number(params.id);

  const [aval, setAval] = useState<Aval | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<PdaDraft>(INITIAL_PDA_DRAFT);
  const [reviewState, setReviewState] = useState(buildInitialReviewState);
  const [revisionHeader, setRevisionHeader] = useState({
    numeroRevision: "",
    dirigidoA: "",
    cargoDirigidoA: "",
    descripcionEncabezado: "",
    fechaRevision: "",
  });
  const [revisionFooter, setRevisionFooter] = useState({
    observacionesFinales: "",
    firmanteNombre: "",
    firmanteCargo: "",
  });

  useEffect(() => {
    setDraft(INITIAL_PDA_DRAFT);
    setReviewState(buildInitialReviewState());
    setRevisionHeader({
      numeroRevision: "",
      dirigidoA: "",
      cargoDirigidoA: "",
      descripcionEncabezado: "",
      fechaRevision: "",
    });
    setRevisionFooter({
      observacionesFinales: "",
      firmanteNombre: "",
      firmanteCargo: "",
    });
  }, [avalId]);

  const loadAval = useCallback(async () => {
    if (!avalId || Number.isNaN(avalId)) {
      setError("ID de aval inválido.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getAval(avalId);
      setAval(response.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No se pudo cargar el aval.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [avalId]);

  useEffect(() => {
    void loadAval();
  }, [loadAval]);

  useEffect(() => {
    if (!aval) return;
    if (draft.descripcion.trim()) return;
    setDraft((prev) => ({
      ...prev,
      descripcion: buildDefaultDescripcion(aval),
    }));
  }, [aval, draft.descripcion]);

  const trainerDocsData = useMemo(
    () => (aval ? buildTrainerDocsData(aval) : EMPTY_DOCS_DATA),
    [aval],
  );
  const previewDraft = useMemo(
    () => ({
      ...draft,
      descripcion:
        draft.descripcion?.trim() || revisionHeader.descripcionEncabezado,
      nombreFirmante: draft.nombreFirmante || revisionFooter.firmanteNombre,
      cargoFirmante: draft.cargoFirmante || revisionFooter.firmanteCargo,
    }),
    [draft, revisionHeader.descripcionEncabezado, revisionFooter],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cargando información del aval...
          </p>
        </div>
      </div>
    );
  }

  if (error || !aval) {
    return (
      <div className="px-6 py-8">
        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl p-6 text-center">
          {error || "No se encontró el aval."}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-gray-900 flex flex-col">
        <div className="h-full overflow-y-auto">
          <div className="max-w-xl mx-auto px-6 sm:px-8 py-8">
            <div className="mb-6">
              <button
                onClick={() => router.push("/avales")}
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>
            </div>
            <div className="space-y-8">
              <div className="space-y-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-4">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Revisión del metodólogo
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Completa los datos generales antes de la revisión.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Número de revisión
                    </span>
                    <input
                      className="form-input w-full mt-1"
                      value={revisionHeader.numeroRevision}
                      onChange={(e) =>
                        setRevisionHeader((prev) => ({
                          ...prev,
                          numeroRevision: e.target.value,
                        }))
                      }
                      placeholder="Ej: REV-001"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Fecha de revisión
                    </span>
                    <input
                      type="date"
                      className="form-input w-full mt-1"
                      value={revisionHeader.fechaRevision}
                      onChange={(e) =>
                        setRevisionHeader((prev) => ({
                          ...prev,
                          fechaRevision: e.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Dirigido a
                    </span>
                    <input
                      className="form-input w-full mt-1"
                      value={revisionHeader.dirigidoA}
                      onChange={(e) =>
                        setRevisionHeader((prev) => ({
                          ...prev,
                          dirigidoA: e.target.value,
                        }))
                      }
                      placeholder="Nombre completo"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cargo de la persona dirigida
                    </span>
                    <input
                      className="form-input w-full mt-1"
                      value={revisionHeader.cargoDirigidoA}
                      onChange={(e) =>
                        setRevisionHeader((prev) => ({
                          ...prev,
                          cargoDirigidoA: e.target.value,
                        }))
                      }
                      placeholder="Ej: Director Técnico"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Descripción / Encabezado
                    </span>
                    <textarea
                      className="form-textarea w-full mt-1"
                      rows={4}
                      value={revisionHeader.descripcionEncabezado}
                      onChange={(e) =>
                        setRevisionHeader((prev) => ({
                          ...prev,
                          descripcionEncabezado: e.target.value,
                        }))
                      }
                      placeholder="Escribe el encabezado de la revisión..."
                    />
                  </label>
                </div>
              </div>
              {(["CHECKLIST", "DATOS_INFORMATIVOS"] as const).map((section) => {
                const sectionItems = REVIEW_ITEMS.filter(
                  (item) => item.section === section,
                ).sort((a, b) => a.order - b.order);

                return (
                  <div key={section} className="space-y-3">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      {SECTION_LABELS[section]}
                    </h2>
                    <div className="space-y-2">
                      {sectionItems.map((item) => (
                        <div
                          key={item.key}
                          className="grid grid-cols-1 sm:grid-cols-[1fr_90px_170px] gap-2 items-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 px-3 py-2"
                        >
                          <div className="text-sm text-gray-800 dark:text-gray-100">
                            {item.label}
                          </div>
                          <div className="flex items-center gap-2 text-xs justify-start sm:justify-center">
                            <label className="inline-flex items-center gap-1 text-emerald-600">
                              <input
                                type="radio"
                                name={`cumple-${item.key}`}
                                className="form-radio"
                                checked={reviewState[item.key]?.cumple ?? true}
                                onChange={() =>
                                  setReviewState((prev) => ({
                                    ...prev,
                                    [item.key]: {
                                      ...prev[item.key],
                                      cumple: true,
                                    },
                                  }))
                                }
                              />
                              Sí
                            </label>
                            <label className="inline-flex items-center gap-1 text-rose-600">
                              <input
                                type="radio"
                                name={`cumple-${item.key}`}
                                className="form-radio"
                                checked={!(reviewState[item.key]?.cumple ?? true)}
                                onChange={() =>
                                  setReviewState((prev) => ({
                                    ...prev,
                                    [item.key]: {
                                      ...prev[item.key],
                                      cumple: false,
                                    },
                                  }))
                                }
                              />
                              No
                            </label>
                          </div>
                          <div className="text-xs text-gray-400">
                            <textarea
                              className="form-textarea w-full text-xs min-h-[60px]"
                              placeholder="Observación"
                              value={reviewState[item.key]?.observacion ?? ""}
                              onChange={(e) =>
                                setReviewState((prev) => ({
                                  ...prev,
                                  [item.key]: {
                                    ...prev[item.key],
                                    observacion: e.target.value,
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div className="space-y-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Cierre de la revisión
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Observaciones finales y firmante.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Observaciones finales
                    </span>
                    <textarea
                      className="form-textarea w-full mt-1"
                      rows={4}
                      value={revisionFooter.observacionesFinales}
                      onChange={(e) =>
                        setRevisionFooter((prev) => ({
                          ...prev,
                          observacionesFinales: e.target.value,
                        }))
                      }
                      placeholder="Escribe las observaciones finales..."
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nombre del firmante
                    </span>
                    <input
                      className="form-input w-full mt-1"
                      value={revisionFooter.firmanteNombre}
                      onChange={(e) =>
                        setRevisionFooter((prev) => ({
                          ...prev,
                          firmanteNombre: e.target.value,
                        }))
                      }
                      placeholder="Nombre completo"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cargo del firmante
                    </span>
                    <input
                      className="form-input w-full mt-1"
                      value={revisionFooter.firmanteCargo}
                      onChange={(e) =>
                        setRevisionFooter((prev) => ({
                          ...prev,
                          firmanteCargo: e.target.value,
                        }))
                      }
                      placeholder="Ej: Metodólogo Provincial"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:block lg:w-1/2 bg-slate-100 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-y-auto">
        <div className="p-6 xl:p-8">
          <div className="space-y-6">
            <RevisionMetodologoPreview
              aval={aval}
              header={revisionHeader}
              footer={revisionFooter}
              reviewItems={REVIEW_ITEMS}
              reviewState={reviewState}
            />
            <SolicitudAvalPreview aval={aval} formData={trainerDocsData} />
            <ListaDeportistasPreview aval={aval} formData={trainerDocsData} />
            <PdaPreview aval={aval} draft={previewDraft} />
          </div>
          </div>
        </div>
      </div>
  );
}

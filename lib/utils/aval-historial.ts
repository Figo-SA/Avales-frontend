"use client";

import type { Historial, EtapaFlujo } from "@/types/aval";

export function getLatestHistorialEntry(historial?: Historial[]) {
  if (!historial || historial.length === 0) return undefined;
  return historial.reduce<Historial | undefined>((latest, entry) => {
    if (!entry.createdAt) return latest ?? entry;
    if (!latest) return entry;
    const latestTime = new Date(latest.createdAt).getTime();
    const entryTime = new Date(entry.createdAt).getTime();
    if (Number.isNaN(entryTime)) return latest;
    if (Number.isNaN(latestTime)) return entry;
    return entryTime > latestTime ? entry : latest;
  }, undefined);
}

export function getCurrentEtapa(historial?: Historial[]): EtapaFlujo | undefined {
  return getLatestHistorialEntry(historial)?.etapa;
}

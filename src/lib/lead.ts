/** Qualified lead handoff. Replace `deliver` with the HubSpot endpoint later. */

export const COUNTRIES = [
  'México',
  'Brasil',
  'Argentina',
  'Colombia',
  'Chile',
  'Perú',
  'Estados Unidos',
  'Canadá',
] as const;

export const AMOUNTS = [
  'Menos de 50 mil',
  '50 mil – 250 mil',
  '250 mil – 1 millón',
  'Más de 1 millón',
] as const;

export const AGES = [
  'Menos de 90 días',
  'De 90 días a 6 meses',
  'De 6 meses a 1 año',
  'Más de 1 año',
] as const;

export const YES_NO = ['Sí', 'No'] as const;
export const BANKRUPTCY = ['Sí', 'No', 'Algunos'] as const;

const FREE_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'yahoo.com',
  'yahoo.com.mx',
  'yahoo.com.br',
  'icloud.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'msn.com',
  'gmx.com',
]);

export type Lead = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  pais: (typeof COUNTRIES)[number];
  cuentas: string;
  monto: (typeof AMOUNTS)[number];
  antiguedad: (typeof AGES)[number];
  otra_agencia: (typeof YES_NO)[number];
  quiebra: (typeof BANKRUPTCY)[number];
};

export class LeadError extends Error {}

function oneOf<T extends string>(value: string, list: readonly T[], label: string): T {
  if ((list as readonly string[]).includes(value)) return value as T;
  throw new LeadError(`Elige ${label}.`);
}

export function assertContact(input: Pick<Lead, 'nombre' | 'empresa' | 'email' | 'telefono' | 'pais'>): void {
  if (input.nombre.trim().length < 2) throw new LeadError('Escribe tu nombre.');
  if (input.empresa.trim().length < 2) throw new LeadError('Escribe el nombre de tu empresa.');
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new LeadError('Escribe un email válido.');
  const domain = email.split('@')[1] ?? '';
  if (FREE_DOMAINS.has(domain)) throw new LeadError('Usa un email corporativo, no un correo personal.');
  if ((input.telefono.match(/\d/g) ?? []).length < 8) throw new LeadError('Revisa tu teléfono.');
  oneOf(input.pais, COUNTRIES, 'tu país');
}

export function assertLead(input: Lead): Lead {
  assertContact(input);
  const cuentas = input.cuentas.trim();
  if (!/^\d+$/.test(cuentas) || Number(cuentas) < 1) throw new LeadError('Indica el número de cuentas.');

  return {
    nombre: input.nombre.trim(),
    empresa: input.empresa.trim(),
    email: input.email.trim().toLowerCase(),
    telefono: input.telefono.trim(),
    pais: oneOf(input.pais, COUNTRIES, 'tu país'),
    cuentas,
    monto: oneOf(input.monto, AMOUNTS, 'el monto aproximado'),
    antiguedad: oneOf(input.antiguedad, AGES, 'la antigüedad de la deuda'),
    otra_agencia: oneOf(input.otra_agencia, YES_NO, 'si ya trabajaste con otra agencia'),
    quiebra: oneOf(input.quiebra, BANKRUPTCY, 'si hay deudores en quiebra o ilocalizables'),
  };
}

function trackLeadSubmit(lead: Lead): Promise<void> {
  return new Promise((resolve) => {
    window.dataLayer = window.dataLayer || [];
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    window.dataLayer.push({
      event: 'lead_submit',
      lead,
      eventCallback: finish,
      eventTimeout: 1200,
    });
    window.setTimeout(finish, 1200);
  });
}

/** Only this function should send the lead. The page calls it after the honeypot check. */
export async function submitLead(input: Lead): Promise<void> {
  const lead = assertLead(input);
  await deliver(lead);
}

async function deliver(lead: Lead): Promise<void> {
  await trackLeadSubmit(lead);
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

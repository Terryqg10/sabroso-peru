'use client';

import { CircleAlert, Copy, MessageCircle, Phone } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { restaurante } from '@/config/restaurante';
import { buildWhatsAppUrl, construirMensaje, crearReservaSchema } from '@/lib/reservas';
import type { Reserva } from '@/lib/reservas';

const CAMPOS = ['nombre', 'telefono', 'fecha', 'hora', 'personas', 'notas'] as const;
type Campo = (typeof CAMPOS)[number];
type Errores = Partial<Record<Campo, string>>;

type Enviada = { reserva: Reserva; url: string; mensaje: string };

const claseControl =
  'min-h-11 w-full rounded-control border border-border-strong bg-surface px-3 py-2 text-body text-fg aria-invalid:border-danger';
const claseEtiqueta = 'mb-2 block text-label font-semibold uppercase tracking-caps text-fg';
const claseAyuda = 'mt-2 text-label text-fg-muted';
const claseBoton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-6 text-label font-bold uppercase tracking-caps';

function hoyLocal(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function MensajeError({ id, texto }: { id: string; texto: string }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-label text-danger">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{texto}</span>
    </p>
  );
}

export function ReservaForm() {
  const schema = useMemo(() => crearReservaSchema(restaurante), []);
  const formRef = useRef<HTMLFormElement>(null);
  const confirmacionRef = useRef<HTMLHeadingElement>(null);
  const [errores, setErrores] = useState<Errores>({});
  const [enviada, setEnviada] = useState<Enviada | null>(null);
  const [copiado, setCopiado] = useState<'no' | 'si' | 'error'>('no');
  const fechaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fechaRef.current) fechaRef.current.min = hoyLocal();
  }, []);

  useEffect(() => {
    if (enviada) confirmacionRef.current?.focus();
  }, [enviada]);

  const numeroErrores = Object.keys(errores).length;

  function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const leer = (campo: Campo) => String(datos.get(campo) ?? '');

    const resultado = schema.safeParse({
      nombre: leer('nombre'),
      telefono: leer('telefono'),
      fecha: leer('fecha'),
      hora: leer('hora'),
      personas: leer('personas'),
      notas: leer('notas'),
    });

    if (!resultado.success) {
      const porCampo = resultado.error.flatten().fieldErrors as Partial<Record<Campo, string[]>>;
      const nuevos: Errores = {};
      for (const campo of CAMPOS) {
        const mensaje = porCampo[campo]?.[0];
        if (mensaje) nuevos[campo] = mensaje;
      }
      setErrores(nuevos);
      const primero = CAMPOS.find((c) => nuevos[c]);
      const elemento = primero ? formRef.current?.elements.namedItem(primero) : null;
      if (elemento instanceof HTMLElement) elemento.focus();
      return;
    }

    setErrores({});
    const url = buildWhatsAppUrl(resultado.data, restaurante.whatsapp, restaurante.nombre);
    const mensaje = construirMensaje(resultado.data, restaurante.nombre);
    window.open(url, '_blank', 'noopener,noreferrer');
    setCopiado('no');
    setEnviada({ reserva: resultado.data, url, mensaje });
  }

  async function copiarMensaje() {
    if (!enviada) return;
    try {
      await navigator.clipboard.writeText(enviada.mensaje);
      setCopiado('si');
    } catch {
      setCopiado('error');
    }
  }

  function describedBy(campo: Campo, conAyuda: boolean): string | undefined {
    const ids = [conAyuda ? `${campo}-ayuda` : null, errores[campo] ? `${campo}-error` : null].filter(
      (i): i is string => i !== null,
    );
    return ids.length > 0 ? ids.join(' ') : undefined;
  }

  if (enviada) {
    const { reserva } = enviada;
    return (
      <section aria-labelledby="confirmacion-titulo" className="border border-border bg-surface p-6">
        <h2
          id="confirmacion-titulo"
          ref={confirmacionRef}
          tabIndex={-1}
          className="text-label font-bold uppercase tracking-caps text-accent-text"
        >
          Solicitud preparada
        </h2>
        <p className="mt-4 text-body font-semibold">
          Tu reserva todavía no está confirmada.
        </p>
        <p className="mt-2 max-w-prose-token text-body text-fg-muted">
          Se ha abierto WhatsApp con el mensaje listo. Pulsa enviar en WhatsApp y espera a que el
          restaurante te responda para confirmar la mesa.
        </p>

        <dl className="mt-6 grid gap-2 text-body sm:grid-cols-2">
          <div>
            <dt className="text-label uppercase tracking-caps text-fg-muted">Nombre</dt>
            <dd>{reserva.nombre}</dd>
          </div>
          <div>
            <dt className="text-label uppercase tracking-caps text-fg-muted">Teléfono</dt>
            <dd>{reserva.telefono}</dd>
          </div>
          <div>
            <dt className="text-label uppercase tracking-caps text-fg-muted">Fecha</dt>
            <dd>{reserva.fecha}</dd>
          </div>
          <div>
            <dt className="text-label uppercase tracking-caps text-fg-muted">Hora y personas</dt>
            <dd>
              {reserva.hora} · {reserva.personas}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href={enviada.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${claseBoton} bg-accent text-accent-fg hover:bg-accent-hover`}
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            Abrir WhatsApp
          </a>
          <button
            type="button"
            onClick={copiarMensaje}
            className={`${claseBoton} border border-border-strong bg-surface text-fg hover:bg-surface-muted`}
          >
            <Copy aria-hidden="true" className="size-4" />
            Copiar mensaje
          </button>
        </div>
        <p role="status" className={claseAyuda}>
          {copiado === 'si' && 'Mensaje copiado.'}
          {copiado === 'error' && 'No se pudo copiar. Selecciona el mensaje y cópialo a mano.'}
        </p>

        <p className="mt-6 text-body text-fg-muted">
          ¿Prefieres llamar o no tienes WhatsApp? Llámanos al{' '}
          <a
            href={`tel:${restaurante.telefono.replace(/\s/g, '')}`}
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent-text underline"
          >
            <Phone aria-hidden="true" className="size-4" />
            {restaurante.telefono}
          </a>
          .
        </p>

        <button
          type="button"
          onClick={() => setEnviada(null)}
          className={`${claseBoton} mt-6 border border-border-strong bg-surface text-fg hover:bg-surface-muted`}
        >
          Hacer otra reserva
        </button>
      </section>
    );
  }

  return (
    <form ref={formRef} onSubmit={alEnviar} noValidate className="grid gap-6">
      {numeroErrores > 0 && (
        <div role="alert" className="flex items-start gap-2 border border-danger p-4 text-body text-danger">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>
            {numeroErrores === 1
              ? 'Revisa 1 campo antes de continuar.'
              : `Revisa ${numeroErrores} campos antes de continuar.`}
          </p>
        </div>
      )}

      <div>
        <label htmlFor="nombre" className={claseEtiqueta}>
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          maxLength={80}
          aria-invalid={errores.nombre ? true : undefined}
          aria-describedby={describedBy('nombre', false)}
          className={claseControl}
        />
        {errores.nombre && <MensajeError id="nombre-error" texto={errores.nombre} />}
      </div>

      <div>
        <label htmlFor="telefono" className={claseEtiqueta}>
          Teléfono
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          aria-invalid={errores.telefono ? true : undefined}
          aria-describedby={describedBy('telefono', true)}
          className={claseControl}
        />
        <p id="telefono-ayuda" className={claseAyuda}>
          Si no es de España, incluye el prefijo, por ejemplo +51.
        </p>
        {errores.telefono && <MensajeError id="telefono-error" texto={errores.telefono} />}
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="fecha" className={claseEtiqueta}>
            Fecha
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            ref={fechaRef}
            aria-invalid={errores.fecha ? true : undefined}
            aria-describedby={describedBy('fecha', false)}
            className={claseControl}
          />
          {errores.fecha && <MensajeError id="fecha-error" texto={errores.fecha} />}
        </div>
        <div>
          <label htmlFor="hora" className={claseEtiqueta}>
            Hora
          </label>
          <input
            id="hora"
            name="hora"
            type="time"
            step={900}
            aria-invalid={errores.hora ? true : undefined}
            aria-describedby={describedBy('hora', false)}
            className={claseControl}
          />
          {errores.hora && <MensajeError id="hora-error" texto={errores.hora} />}
        </div>
        <div>
          <label htmlFor="personas" className={claseEtiqueta}>
            Personas
          </label>
          <input
            id="personas"
            name="personas"
            type="number"
            inputMode="numeric"
            min={1}
            max={restaurante.maxPersonas}
            aria-invalid={errores.personas ? true : undefined}
            aria-describedby={describedBy('personas', true)}
            className={claseControl}
          />
          <p id="personas-ayuda" className={claseAyuda}>
            Hasta {restaurante.maxPersonas}.
          </p>
          {errores.personas && <MensajeError id="personas-error" texto={errores.personas} />}
        </div>
      </div>

      <div>
        <label htmlFor="notas" className={claseEtiqueta}>
          Notas (opcional)
        </label>
        <textarea
          id="notas"
          name="notas"
          rows={4}
          maxLength={300}
          aria-invalid={errores.notas ? true : undefined}
          aria-describedby={describedBy('notas', true)}
          className={claseControl}
        />
        <p id="notas-ayuda" className={claseAyuda}>
          Alergias o peticiones especiales. Máximo 300 caracteres.
        </p>
        {errores.notas && <MensajeError id="notas-error" texto={errores.notas} />}
      </div>

      <p id="aviso-privacidad" className="max-w-prose-token border-l-2 border-border-strong pl-4 text-label text-fg-muted">
        Tus datos (nombre, teléfono y detalles de la reserva) solo se usan para preparar el mensaje de
        WhatsApp. No los guardamos en esta web. Al enviarlo, WhatsApp y el restaurante los tratarán para
        gestionar tu reserva.
      </p>

      <div>
        <button
          type="submit"
          aria-describedby="aviso-privacidad"
          className={`${claseBoton} bg-accent text-accent-fg hover:bg-accent-hover`}
        >
          <MessageCircle aria-hidden="true" className="size-4" />
          Reservar por WhatsApp
        </button>
      </div>
    </form>
  );
}

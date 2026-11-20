import type { ReactNode } from "react";

export function Card({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-stone-200 bg-white p-6 shadow-sm ${className}`}
    >
      {(title || action) && (
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-stone-500">{description}</p>
            )}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-stone-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-stone-400">{hint}</p>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Registered: "bg-sky-50 text-sky-700 ring-sky-200",
    Won: "bg-amber-50 text-amber-700 ring-amber-200",
    "Prize collected": "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Published: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Draft: "bg-stone-100 text-stone-600 ring-stone-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        styles[status] ?? "bg-stone-100 text-stone-600 ring-stone-200"
      }`}
    >
      {status}
    </span>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
        {title}
      </h1>
      {description && <p className="mt-2 text-sm text-stone-500">{description}</p>}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 px-4 py-10 text-center text-sm text-stone-500">
      {message}
    </div>
  );
}

export function Table({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="max-h-[420px] overflow-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500">
            {headers.map((header) => (
              <th
                key={header}
                className="sticky top-0 z-10 bg-white px-3 py-3 font-medium first:pl-0"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-stone-700">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
      />
    </label>
  );
}

export function SubmitButton({
  children,
  pending,
  className = "",
}: {
  children: ReactNode;
  pending?: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}

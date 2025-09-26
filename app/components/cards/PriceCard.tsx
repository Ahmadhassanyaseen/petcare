import React from 'react';

type PriceCardProps = {
  tier: string;
  description?: string;
  price: string | number;
  period?: string; // e.g. "/mo"
  features?: string[];
  buttonText?: string;
  highlight?: boolean;
  badge?: string;
};

const PriceCard: React.FC<PriceCardProps> = ({
  tier,
  description = "",
  price,
  period = "/mo",
  features = [],
  buttonText = "Get started",
  highlight = false,
  badge,
}) => {
  return (
    <div
      className={[
        "relative flex flex-col rounded-3xl border shadow-sm overflow-hidden",
        highlight ? "border-transparent ring-2 ring-offset-2 ring-[#ff7a18]" : "border-gray-200",
        "bg-white",
      ].join(" ")}
    >
      {badge && (
        <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e] px-3 py-1 text-xs font-semibold text-white shadow">
          {badge}
        </span>
      )}
      {/* Header band for highlight */}
      {highlight && (
        <div className="h-2 bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e]" />
      )}
      <div className="px-6 py-8 sm:p-10 sm:pb-6">
        <div className="grid w-full grid-cols-1 text-left">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 lg:text-2xl">
              {tier}
            </h2>
            {description && (
              <p className="mt-2 text-sm text-gray-500">{description}</p>
            )}
          </div>
          <div className="mt-6">
            <p className="flex items-end gap-2">
              <span className="text-5xl font-extrabold tracking-tight text-slate-900">${price}</span>
              <span className="text-base font-medium text-gray-500">{period}</span>
            </p>
          </div>
          {features?.length > 0 && (
            <ul className="mt-6 space-y-3">
              {features.map((f, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e] text-white">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25A1 1 0 016.204 9.04l2.543 2.543 6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="px-6 pb-8 sm:px-8 mt-auto">
        <a
          className="flex items-center justify-center w-full px-6 py-3 text-center text-white bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e] rounded-full hover:from-[#ff5a2b] hover:to-[#ff7a18] focus:outline-none text-sm font-semibold shadow"
          href="#"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
};

export default PriceCard;

"use client";

import { Check } from "lucide-react";

export type Step = {
  id: string;
  label: string;
  description?: string;
};

type StepsProps = {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
};

export default function Steps({ steps, currentStep, onStepClick }: StepsProps) {
  return (
    <div className="w-full">
      {/* Desktop version */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = onStepClick && index < currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step circle and content */}
              <div className="flex flex-col items-center relative">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    isCompleted
                      ? "bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700"
                      : isCurrent
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  } ${isClickable ? "" : "cursor-default"}`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </button>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      isCurrent || isCompleted
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 mb-8">
                  <div
                    className={`h-full transition-colors ${
                      isCompleted
                        ? "bg-indigo-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile version */}
      <div className="md:hidden">
        <div className="flex items-center justify-center gap-2 mb-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div
                key={step.id}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  isCompleted || isCurrent
                    ? "bg-indigo-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            );
          })}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Paso {currentStep + 1} de {steps.length}
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
            {steps[currentStep].label}
          </p>
          {steps[currentStep].description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {steps[currentStep].description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

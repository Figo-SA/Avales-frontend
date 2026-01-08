type OnboardingProgressProps = {
  step: number;
  totalSteps?: number;
};

export default function OnboardingProgress({
  step,
  totalSteps = 4,
}: OnboardingProgressProps) {
  const percentage = (step / totalSteps) * 100;

  return (
    <div className="px-4 sm:px-6 pb-8">
      <div className="max-w-md mx-auto">
        <div className="relative">
          <div
            className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-gray-200 dark:bg-gray-700"
            aria-hidden="true"
          ></div>
          <ul className="relative flex justify-between w-full">
            {Array.from({ length: totalSteps }, (_, i) => {
              const stepNumber = i + 1;
              const isCompleted = stepNumber < step;
              const isCurrent = stepNumber === step;

              return (
                <li key={stepNumber}>
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                      isCompleted
                        ? "bg-indigo-500 text-white"
                        : isCurrent
                        ? "bg-indigo-500 text-white ring-4 ring-indigo-50 dark:ring-indigo-900/20"
                        : "bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-2 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-3 h-3 fill-current"
                        viewBox="0 0 12 12"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

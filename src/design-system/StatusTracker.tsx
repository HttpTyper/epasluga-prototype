import clsx from 'clsx'

const steps = [
  { id: 'submitted', label: 'Подано' },
  { id: 'processing', label: 'В обработке' },
  { id: 'ready', label: 'Готово' },
]

type StatusTrackerProps = {
  currentStep: 'submitted' | 'processing' | 'ready'
}

export function StatusTracker({ currentStep }: StatusTrackerProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep)

  return (
    <div className="flex items-center w-full max-w-lg mb-6">
      {steps.map((step, index) => {
        const isActive = index === currentIndex
        const isPassed = index < currentIndex

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center relative">
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors z-10 bg-white',
                  isActive && 'border-navy text-navy',
                  isPassed && 'border-ok bg-ok text-white',
                  !isActive && !isPassed && 'border-line text-muted'
                )}
              >
                {isPassed ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={clsx(
                  'absolute top-10 text-xs font-semibold whitespace-nowrap',
                  isActive ? 'text-navy' : isPassed ? 'text-ok' : 'text-muted'
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={clsx(
                  'h-0.5 w-full mx-2',
                  isPassed ? 'bg-ok' : 'bg-line'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
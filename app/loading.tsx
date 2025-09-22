export default function Loading() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center space-y-md">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-accent to-primary animate-pulse" />
        <div className="space-y-sm">
          <div className="h-4 bg-dark-surface rounded w-32 mx-auto animate-pulse" />
          <div className="h-3 bg-dark-surface rounded w-24 mx-auto animate-pulse" />
        </div>
        <p className="text-gray-400 text-sm">Loading HabitFlow...</p>
      </div>
    </div>
  );
}

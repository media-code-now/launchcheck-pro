export default function SimplePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">LaunchCheck</h1>
        <p className="text-muted-foreground">Your application is running successfully!</p>
        <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm bg-green-100 text-green-800 border-green-200">
          ✅ Next.js App is Live
        </div>
      </div>
    </div>
  )
}
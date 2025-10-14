import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Smart Healthcare System</h1>
      <Link
        href="/GenerateReportPage"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go to Report Generation
      </Link>
    </div>
  )
}

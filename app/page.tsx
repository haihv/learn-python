import Link from "next/link";
import { curriculum } from "@/lib/curriculum";
import Badge from "@/components/ui/Badge";

export default function HomePage() {
  return (
    <main>
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-navy-950">
        <p className="text-python-yellow text-sm font-mono mb-4">🐍 Free & Open Source</p>
        <h1 className="bg-gradient-to-r from-python-blue to-python-cyan bg-clip-text text-transparent text-5xl font-bold mb-4">
          Learn Python Interactively
        </h1>
        <p className="text-slate-400 text-xl max-w-xl mx-auto mb-8">
          Master Python through lessons, hands-on workshops, and coding labs — no setup required.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/learn/intro"
            className="bg-python-blue text-white font-bold px-8 py-3 rounded-lg text-lg hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
          <Link
            href="/atlas"
            className="border border-python-cyan text-python-cyan font-bold px-8 py-3 rounded-lg text-lg hover:bg-python-cyan/10 transition-colors"
          >
            🗺 Explore the Atlas
          </Link>
        </div>
        <p className="text-navy-500 text-xs mt-4 max-w-md">
          New: a T-shaped map with Bloom-laddered deep stems — learn the whole field, then dig deep.
        </p>
      </section>

      <section className="py-20 px-4 bg-navy-900">
        <h2 className="text-center text-3xl font-bold text-slate-100 mb-12">
          Everything You Need to Learn Python
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-navy-800 border border-python-cyan rounded-xl p-6">
            <span className="text-4xl">📖</span>
            <h3 className="text-xl font-bold text-slate-100 mt-3 mb-2">Lessons</h3>
            <p className="text-slate-400 text-sm">
              Read concise theory with syntax-highlighted Python examples, then prove your understanding with a quick quiz.
            </p>
          </div>
          <div className="bg-navy-800 border border-python-purple rounded-xl p-6">
            <span className="text-4xl">🔨</span>
            <h3 className="text-xl font-bold text-slate-100 mt-3 mb-2">Workshops</h3>
            <p className="text-slate-400 text-sm">
              Follow step-by-step guided exercises. Each step validates your code before you can move on.
            </p>
          </div>
          <div className="bg-navy-800 border border-python-green rounded-xl p-6">
            <span className="text-4xl">🧪</span>
            <h3 className="text-xl font-bold text-slate-100 mt-3 mb-2">Labs</h3>
            <p className="text-slate-400 text-sm">
              Solve open-ended challenges. An automated test suite checks your output and gives instant feedback.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-navy-950">
        <h2 className="text-center text-3xl font-bold text-slate-100 mb-12">
          Curriculum
        </h2>
        <div className="max-w-2xl mx-auto w-full border border-navy-600 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-navy-800">
              <tr>
                <th className="px-4 py-3 text-sm text-left text-slate-400">#</th>
                <th className="px-4 py-3 text-sm text-left text-slate-400">Module</th>
                <th className="px-4 py-3 text-sm text-left text-slate-400">Type</th>
                <th className="px-4 py-3 text-sm text-left text-slate-400">Time</th>
              </tr>
            </thead>
            <tbody>
              {curriculum.map((m, i) => (
                <tr key={m.slug} className="border-t border-navy-600 hover:bg-navy-800 transition-colors">
                  <td className="px-4 py-3 text-sm text-navy-500">{i + 1}</td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/learn/${m.slug}`} className="text-slate-200 hover:text-python-blue transition-colors">
                      {m.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge type={m.type} />
                  </td>
                  <td className="px-4 py-3 text-sm text-navy-500">~{m.estimatedMinutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="py-8 text-center bg-navy-900 border-t border-navy-600">
        <p className="text-navy-500 text-sm">Built with Claude · Inspired by freeCodeCamp</p>
      </footer>
    </main>
  );
}

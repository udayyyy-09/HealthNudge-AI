"use client";

export default function MissionSection() {
  return (
    <section className="bg-white text-black py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left: Mission Text */}
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-snug">
            🧑‍🤝‍🧑 Our Mission
          </h2>

          <p className="text-lg text-gray-700 mb-6">
            At <span className="font-semibold text-black">Zonomo Health</span>, our mission is to make <span className="text-blue-600 font-medium">preventive health</span> easy, smart, and personalized.
          </p>

          <ul className="space-y-4 text-gray-800 text-base">
            <li>
              ✅ Emphasize <span className="font-semibold text-black">wellness through data and daily habits</span>
            </li>
            <li>
              ✅ Use technology to <span className="font-semibold text-black">empower smarter health decisions</span>
            </li>
            <li>
              ✅ Deliver tools that make <span className="font-semibold text-black">wellbeing actionable</span>
            </li>
          </ul>
        </div>

        {/* Right: Image */}
        <div className="w-full h-72 md:h-[420px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
          <img
            src="/images/quote.jpg"
            alt="Health Mission"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

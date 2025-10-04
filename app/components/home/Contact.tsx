export default function ContactForm() {
  return (
    <section className="w-full bg-white py-12 px-6 md:px-16 lg:px-24">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Talk with our team</h2>
        <p className="text-gray-600 mb-6">
          Fill out your information and a Pearl AI+Human representative will reach out to you.
        </p>

        <form className="space-y-5">
          {/* Full name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full name *
            </label>
            <input
              type="text"
              placeholder="Enter your Full name"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Business email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business email *
            </label>
            <input
              type="email"
              placeholder="Enter your business email"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <span className="mr-2">🇺🇸</span>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="flex-1 outline-none"
                required
              />
            </div>
          </div>

          {/* Company name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company name
            </label>
            <input
              type="text"
              placeholder="Enter a company name"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry *
            </label>
            <select
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Choose your company industry</option>
              <option value="tech">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Additional info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional information *
            </label>
            <textarea
              rows={4}
              placeholder="Provide any additional details about your use case, problem or assistance you might need"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function Field({
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  className = "",
}) {
  return (
    <div className={`${className}`}>
      <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 ${
          error ? "border-red-500 focus:ring-red-400" : ""
        }`}
      />
      {error && <p className="text-red-600 mt-1 text-sm font-medium">{error}</p>}
    </div>
  );
}

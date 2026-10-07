export default function Navbar() {
  return (
    <header className="backdrop-blur-xl bg-white/70 border-b border-gray-200 sticky top-0 z-50">
      <div className="flex justify-between items-center px-8 py-5">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-gray-500">Welcome back, Admin 👋</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            A
          </div>
          <h3 className="font-semibold">Admin</h3>
        </div>
      </div>
    </header>
  );
}
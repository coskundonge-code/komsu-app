export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#e0e0e0] border-t-[#00833e] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#8f8f8f] text-sm">Yükleniyor...</p>
      </div>
    </div>
  );
}

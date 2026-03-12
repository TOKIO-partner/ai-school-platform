export function BackgroundDecoration() {
  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-fuchsia-200/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-cyan-200/20 rounded-full blur-[120px]" />
    </div>
  );
}

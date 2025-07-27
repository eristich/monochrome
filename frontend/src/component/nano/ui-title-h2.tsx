export default function UITitleH2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-semibold text-black italic text-2xl leading-6"
    >
      {children}
    </h2>
  );
}

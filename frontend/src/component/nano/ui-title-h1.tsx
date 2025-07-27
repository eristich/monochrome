export default function UITitleH1({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-3xl font-bold text-black leading-5"
    >
      {children}
    </h2>
  );
}

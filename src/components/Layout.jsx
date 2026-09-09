import Nav from "./Nav";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 text-left">{children}</main>
    </div>
  );
}
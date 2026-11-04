// Shared wrapper for the marketing pages. Page-specific metadata lives in each
// page or route layout so canonicals never fall back to the home page.
export default function HomeGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}

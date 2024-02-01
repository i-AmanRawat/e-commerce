interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-full flex items-center justify-center bg-red-300">
      {children}
    </div>
  );
}

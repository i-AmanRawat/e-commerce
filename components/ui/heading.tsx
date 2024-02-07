interface HeadingProps {
  title: string;
  description: string;
}

export function Heading({ title, description }: HeadingProps) {
  return (
    <div className="">
      <h2 className="text-3xl font-bold tracking-normal">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

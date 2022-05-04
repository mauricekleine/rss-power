type Props = {
  children: string;
};

export default function SectionHeader({ children }: Props) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
      {children}
    </p>
  );
}

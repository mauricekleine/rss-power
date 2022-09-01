type Props = {
  children: string;
};

export default function PageHeader({ children }: Props) {
  return (
    <h3 className="text-2xl font-bold leading-6 text-gray-900">{children}</h3>
  );
}

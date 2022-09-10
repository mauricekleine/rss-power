type Props = {
  children: string;
};

export default function DialogHeader({ children }: Props) {
  return (
    <h3 className="text-2xl font-bold leading-none tracking-tight text-gray-900">
      {children}
    </h3>
  );
}

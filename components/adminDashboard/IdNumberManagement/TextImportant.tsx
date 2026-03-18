type Props = {
  value?: number | '';
};
export default function TextImportant({ value }: Props) {
  return (
    <p className="mt-1 text-xs text-gray-400">
      This value will be used for the next created product.
      <br /> Next product id Number will be{' '}
      <span className="text-primary font-bold">{Number(value) + 1}</span>
    </p>
  );
}

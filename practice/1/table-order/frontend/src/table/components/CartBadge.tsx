interface CartBadgeProps {
  count: number;
}

export default function CartBadge({ count }: CartBadgeProps) {
  return (
    <span
      data-testid="cart-badge"
      className="relative inline-flex items-center"
    >
      <span className="text-xl" role="img" aria-label="장바구니">
        🛒
      </span>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </span>
  );
}

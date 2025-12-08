import { useEffect, useState } from "react";

interface SidebarLinkGroupProps {
  children: (handleClick: () => void, openGroup: boolean) => React.ReactNode;
  open?: boolean;
}

export default function SidebarLinkGroup({
  children,
  open = false,
}: SidebarLinkGroupProps) {
  const [openGroup, setOpenGroup] = useState<boolean>(open);

  // Si la prop `open` cambia (por cambio de ruta), sincronizamos el estado
  useEffect(() => {
    setOpenGroup(open);
  }, [open]);

  const handleClick = () => {
    setOpenGroup((prev) => !prev);
  };

  return (
    <li
      className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 group is-link-group ${
        openGroup ? "bg-slate-900" : ""
      }`}
    >
      {children(handleClick, openGroup)}
    </li>
  );
}

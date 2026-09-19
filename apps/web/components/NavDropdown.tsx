"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ITEMS = [
  {
    href: "/references/prompt-tips",
    label: "プロンプト小技集",
    desc: "そのまま使える依頼の型 20+",
  },
  {
    href: "/references/oss-experiment",
    label: "実演記録",
    desc: "OSS で検証した人 × AI の分業",
  },
  {
    href: "/references/field-tips",
    label: "実戦テクニック",
    desc: "案件で効いた工夫の記録帳",
  },
  {
    href: "/references/glossary",
    label: "用語集",
    desc: "FDE・AI 活用の用語定義",
  },
];

/**
 * ヘッダーの「資料」ドロップダウン。
 * ヘッダーが横スクロールコンテナ（overflow-x: auto）のため、
 * パネルは portal + position: fixed で body 直下に描画しないと clipping される。
 */
export function NavDropdown() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const place = () => {
    const r = toggleRef.current?.getBoundingClientRect();
    if (!r) {
      return;
    }
    const width = 280;
    setPos({
      top: r.bottom + 6,
      left: Math.max(8, Math.min(r.left, window.innerWidth - width - 8)),
    });
  };

  const toggle = () => {
    if (!open) {
      place();
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    const onOutside = (e: MouseEvent) => {
      const target = e.target as globalThis.Node;
      if (!toggleRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const onReposition = () => place();
    document.addEventListener("click", onOutside);
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      document.removeEventListener("click", onOutside);
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="nav-drop">
      <button
        ref={toggleRef}
        type="button"
        className="nav-link nav-drop-toggle"
        aria-expanded={open}
        onClick={toggle}
      >
        資料 <span className="nav-drop-caret">{open ? "▾" : "▸"}</span>
      </button>
      {open &&
        createPortal(
          <div
            ref={panelRef}
            className="nav-drop-panel"
            style={{ top: pos.top, left: pos.left }}
          >
            {ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-drop-item"
                onClick={() => setOpen(false)}
              >
                <span className="nav-drop-label">{item.label}</span>
                <span className="nav-drop-desc">{item.desc}</span>
              </Link>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}

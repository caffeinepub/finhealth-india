import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function InfoModal({
  open,
  onClose,
  title,
  children,
}: InfoModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9000,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            data-ocid="info.modal"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            style={{
              background: "#060A10",
              border: "1px solid #24303A",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "520px",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #24303A",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#EAF0F6",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                {title}
              </h2>
              <button
                type="button"
                data-ocid="info.close_button"
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9AA6B2",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div
              style={{
                padding: "24px",
                overflowY: "auto",
                color: "#9AA6B2",
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

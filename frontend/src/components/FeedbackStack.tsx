import { Alert, Slide, Snackbar, Stack, type SlideProps } from "@mui/material";
import { useState } from "react";

export type FeedbackItem = {
  id: number;
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

type FeedbackStackProps = {
  items: FeedbackItem[];
  onClose: (id: number) => void;
};

function SlideLeftTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export function FeedbackStack({ items, onClose }: FeedbackStackProps) {
  const [exitingItems, setExitingItems] = useState<FeedbackItem[]>([]);

  function handleClose(item: FeedbackItem, reason?: string) {
    if (reason === "clickaway") return;

    setExitingItems((current) =>
      current.some((entry) => entry.id === item.id)
        ? current
        : [...current, item],
    );
    onClose(item.id);
  }

  const renderedItems = [
    ...items,
    ...exitingItems.filter((item) => !items.some((i) => i.id === item.id)),
  ];

  return (
    <Stack
      spacing={1.5}
      sx={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 1400,
        width: { xs: "calc(100% - 32px)", sm: 420 },
        maxWidth: "calc(100% - 32px)",
      }}
    >
      {renderedItems.map((item) => (
        <Snackbar
          key={item.id}
          open={!exitingItems.some((entry) => entry.id === item.id)}
          slots={{ transition: SlideLeftTransition }}
          slotProps={{
            transition: {
              onExited: () =>
                setExitingItems((current) =>
                  current.filter((entry) => entry.id !== item.id),
                ),
            },
          }}
          autoHideDuration={3500}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={(_, reason) => handleClose(item, reason)}
          sx={{ position: "static", transform: "none" }}
        >
          <Alert
            severity={item.severity}
            variant="filled"
            onClose={() => handleClose(item)}
            sx={{ width: "100%", alignItems: "center", borderRadius: 1.5 }}
          >
            {item.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
}

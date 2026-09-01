import { useState } from "react";
import { Flag, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { REPORT_REASONS, submitReport, type ReportReason } from "@/services/supabase/reports";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface ReportPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptId: string;
  promptTitle: string;
}

export function ReportPromptDialog({
  open,
  onOpenChange,
  promptId,
  promptTitle,
}: ReportPromptDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [selected, setSelected] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reset = () => {
    setSelected(null);
    setDetails("");
    setIsSubmitting(false);
    setSubmitted(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubmit = async () => {
    if (!selected) return;
    // Defensive guard — card-level onClick handlers prevent unauthenticated
    // users from opening the dialog, but this keeps TypeScript happy and adds
    // a safety net in case the dialog is ever rendered another way.
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await submitReport({
        user_id: user.id,
        prompt_id: promptId,
        reason: selected,
        details: details || undefined,
      });

      if (error) {
        // Postgres unique-violation code: 23505.
        // This means the user already reported this exact prompt.
        if (error.code === "23505") {
          toast({
            title: "Already reported",
            description: "You've already submitted a report for this prompt.",
          });
          handleOpenChange(false);
          return;
        }
        throw error;
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast({
        title: "Report failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const body = submitted ? (
    /* ── Success state ── */
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <span className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
        <Flag className="h-6 w-6 text-destructive" />
      </span>
      <div>
        <p className="font-serif text-lg font-normal">Report submitted</p>
        <p className="text-sm text-muted-foreground mt-1">
          Thanks for helping keep Paro Studio safe. We'll review this prompt shortly.
        </p>
      </div>
      <button
        onClick={() => handleOpenChange(false)}
        className="mt-2 px-6 py-2 text-sm font-medium bg-secondary hover:bg-secondary/80 rounded-sm transition-colors"
      >
        Done
      </button>
    </div>
  ) : (
    /* ── Reason picker + submit ── */
    <div className="flex flex-col gap-4">
      {/* Context strip */}
      <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-sm border border-border">
        <Flag className="h-4 w-4 text-destructive flex-shrink-0" />
        <p className="text-sm text-muted-foreground truncate">
          Reporting: <span className="text-foreground font-medium">{promptTitle}</span>
        </p>
      </div>

      {/* Reason list */}
      <div className="flex flex-col gap-1" role="radiogroup" aria-label="Report reason">
        {REPORT_REASONS.map((reason) => {
          const isActive = selected === reason.value;
          return (
            <button
              key={reason.value}
              role="radio"
              aria-checked={isActive}
              onClick={() => setSelected(reason.value)}
              className={cn(
                "flex items-center justify-between gap-3 px-4 py-3 rounded-sm border transition-colors text-left",
                isActive
                  ? "border-destructive/60 bg-destructive/5"
                  : "border-border bg-secondary/30 hover:bg-secondary/60"
              )}
            >
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium leading-tight",
                    isActive ? "text-destructive" : "text-foreground"
                  )}
                >
                  {reason.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  {reason.description}
                </p>
              </div>
              <ChevronRight
                className={cn(
                  "h-4 w-4 flex-shrink-0 transition-colors",
                  isActive ? "text-destructive" : "text-muted-foreground"
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Optional details — only visible once a reason is chosen */}
      {selected && (
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Add more detail (optional)"
          rows={3}
          maxLength={500}
          className="w-full px-3 py-2 text-sm bg-secondary/30 border border-border rounded-sm resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-destructive/50 transition"
        />
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!selected || isSubmitting}
        className={cn(
          "w-full py-2.5 text-sm font-medium rounded-sm transition-colors",
          selected && !isSubmitting
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            : "bg-destructive/30 text-destructive-foreground/50 cursor-not-allowed"
        )}
      >
        {isSubmitting ? "Submitting…" : "Submit Report"}
      </button>
    </div>
  );


  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="px-4 pb-8">
          <DrawerHeader className="px-0 pb-4 text-left">
            <DrawerTitle className="font-serif text-xl font-normal">Report prompt</DrawerTitle>
            <DrawerDescription className="sr-only">
              Tell us why this prompt violates our guidelines
            </DrawerDescription>
          </DrawerHeader>
          {body}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md border-border/50">
        <DialogHeader className="pb-1">
          <DialogTitle className="font-serif text-xl font-normal">Report prompt</DialogTitle>
          <DialogDescription className="sr-only">
            Tell us why this prompt violates our guidelines
          </DialogDescription>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  );
}

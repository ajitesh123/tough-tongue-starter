"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (profession: string) => void;
}

export default function ProfessionDialog({
  open,
  onOpenChange,
  onSubmit,
}: ProfessionDialogProps) {
  const [profession, setProfession] = useState("");
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profession.trim()) {
      onSubmit(profession.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome{user ? `, ${user.firstName || user.username}` : ""}!</DialogTitle>
          <DialogDescription>
            Tell us about your profession so we can create personalized training scenarios for you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="profession">Your profession</Label>
              <Input
                id="profession"
                placeholder="e.g., Product Manager, Software Engineer, Sales Executive"
                value={profession}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfession(e.target.value)}
                className="w-full"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
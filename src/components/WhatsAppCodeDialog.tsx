import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WhatsAppCodeDialogProps {
  open: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>;
  isVerifying: boolean;
}

export const WhatsAppCodeDialog = ({ open, onClose, onVerify, isVerifying }: WhatsAppCodeDialogProps) => {
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    const success = await onVerify(code);
    if (success) {
      setCode("");
    }
  };

  const handleClose = () => {
    setCode("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="ri-whatsapp-line text-green-600"></i>
            Verificar WhatsApp
          </DialogTitle>
          <DialogDescription>
            Digite o código de 6 dígitos que foi enviado para seu WhatsApp.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">Código de verificação</Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setCode(value);
              }}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
              disabled={isVerifying}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isVerifying}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={code.length !== 6 || isVerifying}
              className="flex-1"
            >
              {isVerifying ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Verificando...
                </>
              ) : (
                <>
                  <i className="ri-check-line mr-2"></i>
                  Verificar Código
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
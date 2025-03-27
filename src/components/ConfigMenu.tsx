import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Settings2, Link } from "lucide-react";
import { getConfig, updateConfig } from "@/db/config";
import { ConfigType } from "@/db/types";

export function ConfigMenu() {
  const [commissionAmount, setCommissionAmount] = useState<number>(0);
  const [commissionType, setCommissionType] = useState<"percentage" | "fixed">("percentage");
  const [tutorialUrl, setTutorialUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getConfig();
        if (config) {
          setCommissionAmount(config.commission.commissionAmount);
          setCommissionType(config.commission.commissionType);
          setTutorialUrl(config.tutorialUrl);
        }
      } catch (error) {
        toast.error("Error loading configuration");
        console.error("Error loading configuration:", error);
      }
    };

    loadConfig();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    
    const config: ConfigType = {
      commission: {
        commissionAmount,
        commissionType,
      },
      tutorialUrl,
    };

    try {
      await updateConfig(config);
      toast.success("Configuration saved successfully");
    } catch (error) {
      toast.error("Error saving configuration");
      console.error("Error saving configuration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Settings2 className="w-6 h-6 text-primary" />
            <CardTitle>Configuración</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Commission Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Configuración de comisión</Label>
              <p className="text-sm text-muted-foreground">
                Configura la comisión que se cobrará a los usuarios
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commissionAmount">Cantidad</Label>
                <Input
                  id="commissionAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={commissionAmount}
                  onChange={(e) => setCommissionAmount(Number(e.target.value))}
                  placeholder="Ingrese la cantidad"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commissionType">Tipo</Label>
                <Select
                  value={commissionType}
                  onValueChange={(value: "percentage" | "fixed") => setCommissionType(value)}
                >
                  <SelectTrigger id="commissionType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                    <SelectItem value="fixed">Cantidad fija (S/)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tutorial URL Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Tutorial URL</Label>
              <p className="text-sm text-muted-foreground">
                URL del tutorial para los usuarios
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Link className="w-4 h-4" />
              </div>
              <Input
                type="url"
                value={tutorialUrl}
                onChange={(e) => setTutorialUrl(e.target.value)}
                placeholder="https://example.com/tutorial"
                className="pl-10"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
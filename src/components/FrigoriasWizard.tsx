import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const steps = [
  "Dimensiones del ambiente",
  "Orientación",
  "Tipo de ambiente",
  "Cantidad de personas",
  "Equipos electrónicos",
  "Aislamiento y ventanas",
];

export default function FrigoriaWizard() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    largo: "",
    ancho: "",
    alto: "",
    orientacion: "",
    tipo: "",
    personas: "",
    equipos: "",
    aislamiento: "",
  });
  const [resultado, setResultado] = useState<string | null>(null);

  const totalSteps = steps.length;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep((prev) => prev + 1);
    } else {
      calcularFrigorias();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const calcularFrigorias = () => {
    const { largo, ancho, alto, personas, equipos } = formData;
    const area = parseFloat(largo) * parseFloat(ancho);
    const volumen = area * parseFloat(alto);

    let frigoriasBase = volumen * 50;
    frigoriasBase += parseInt(personas) * 100;
    frigoriasBase += parseInt(equipos) * 200;

    const resultadoTexto = `Al menos necesitás ${Math.round(frigoriasBase)} frigorías.`;
    setResultado(resultadoTexto);
    setStep(0);
    setFormData({
      largo: "",
      ancho: "",
      alto: "",
      orientacion: "",
      tipo: "",
      personas: "",
      equipos: "",
      aislamiento: "",
    });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Largo en metros"
              value={formData.largo}
              onChange={(e) => handleChange("largo", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Ancho en metros"
              value={formData.ancho}
              onChange={(e) => handleChange("ancho", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Alto en metros"
              value={formData.alto}
              onChange={(e) => handleChange("alto", e.target.value)}
            />
          </div>
        );
      case 1:
        return (
          <Input
            placeholder="Ej: Norte, Sur, Este, Oeste"
            value={formData.orientacion}
            onChange={(e) => handleChange("orientacion", e.target.value)}
          />
        );
      case 2:
        return (
          <Input
            placeholder="Ej: Dormitorio, Living, Oficina"
            value={formData.tipo}
            onChange={(e) => handleChange("tipo", e.target.value)}
          />
        );
      case 3:
        return (
          <Input
            type="number"
            placeholder="Cantidad de personas"
            value={formData.personas}
            onChange={(e) => handleChange("personas", e.target.value)}
          />
        );
      case 4:
        return (
          <Input
            type="number"
            placeholder="Cantidad de equipos electrónicos"
            value={formData.equipos}
            onChange={(e) => handleChange("equipos", e.target.value)}
          />
        );
      case 5:
        return (
          <Input
            placeholder="Ej: Buen aislamiento, Vidrio simple, Cortinas"
            value={formData.aislamiento}
            onChange={(e) => handleChange("aislamiento", e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold text-center">Calculadora de Frigorías</h2>
      <Progress value={(step / (totalSteps - 1)) * 100} />
      <div className="text-lg font-medium text-gray-700">{steps[step]}</div>
      <div>{renderStep()}</div>
      <div className="flex justify-between mt-4">
        <Button onClick={handleBack} disabled={step === 0} variant="outline">
          Atrás
        </Button>
        <Button onClick={handleNext}>
          {step === totalSteps - 1 ? "Calcular" : "Siguiente"}
        </Button>
      </div>
      {resultado && (
        <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded shadow">
          {resultado}
        </div>
      )}
    </div>
  );
}

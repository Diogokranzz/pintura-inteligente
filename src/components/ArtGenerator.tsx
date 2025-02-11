
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { RunwareService, GenerateImageParams } from "@/lib/runware";

const estilosArtisticos = [
  { id: "realista", nome: "Realista" },
  { id: "impressionista", nome: "Impressionista" },
  { id: "surrealista", nome: "Surrealista" },
  { id: "abstrato", nome: "Abstrato" },
  { id: "pop-art", nome: "Pop Art" },
];

const ArtGenerator = () => {
  const [descricao, setDescricao] = useState("");
  const [estilo, setEstilo] = useState("realista");
  const [loading, setLoading] = useState(false);
  const [arteGerada, setArteGerada] = useState<string | null>(null);
  const [historico, setHistorico] = useState<Array<{ descricao: string; url: string }>>([]);

  const gerarArte = async () => {
    if (!descricao.trim()) {
      toast.error("Por favor, insira uma descrição para a arte");
      return;
    }

    setLoading(true);
    try {
      const params: GenerateImageParams = {
        positivePrompt: `Crie uma arte ${estilo} com a seguinte descrição: ${descricao}. Alta qualidade, detalhado, realista.`,
        model: "runware:100@1",
        numberResults: 1,
        outputFormat: "WEBP",
        CFGScale: 1,
      };

      const runwareService = new RunwareService("INSIRA_SUA_API_KEY"); // Temporário - será substituído por input seguro
      const resultado = await runwareService.generateImage(params);

      setArteGerada(resultado.imageURL);
      setHistorico(prev => [...prev, { descricao, url: resultado.imageURL }]);
      toast.success("Arte gerada com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar arte:", error);
      toast.error("Erro ao gerar a arte. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Gerador de Arte Autônoma</h1>
          <p className="text-lg text-muted-foreground">
            Transforme suas ideias em arte realista usando inteligência artificial
          </p>
        </div>

        <Card className="p-6 glass-morphism space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Descreva sua arte
              </label>
              <Input
                placeholder="Ex: Um campo de girassóis ao pôr do sol..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Estilo artístico
              </label>
              <Select value={estilo} onValueChange={setEstilo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estilo" />
                </SelectTrigger>
                <SelectContent>
                  {estilosArtisticos.map((estilo) => (
                    <SelectItem key={estilo.id} value={estilo.id}>
                      {estilo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={gerarArte}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Gerando..." : "Gerar Arte"}
            </Button>
          </div>
        </Card>

        {arteGerada && (
          <div className="art-container">
            <Card className="p-4">
              <img
                src={arteGerada}
                alt="Arte gerada"
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="mt-4 text-center">
                <Button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = arteGerada;
                    link.download = 'arte-gerada.webp';
                    link.click();
                  }}
                  variant="outline"
                >
                  Baixar Arte
                </Button>
              </div>
            </Card>
          </div>
        )}

        {historico.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Histórico de Criações</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historico.map((item, index) => (
                <Card key={index} className="p-4">
                  <img
                    src={item.url}
                    alt={item.descricao}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.descricao}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtGenerator;

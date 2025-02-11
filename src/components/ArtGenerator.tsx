
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { RunwareService, GenerateImageParams } from "@/lib/runware";
import { Download, RefreshCw, Search } from "lucide-react";

const estilosArtisticos = [
  { id: "realista", nome: "Realista" },
  { id: "impressionista", nome: "Impressionista" },
  { id: "surrealista", nome: "Surrealista" },
  { id: "abstrato", nome: "Abstrato" },
  { id: "pop-art", nome: "Pop Art" },
  { id: "digital-art", nome: "Arte Digital" },
  { id: "watercolor", nome: "Aquarela" },
  { id: "oil-painting", nome: "Pintura a Óleo" },
];

const ArtGenerator = () => {
  const [descricao, setDescricao] = useState("");
  const [estilo, setEstilo] = useState("realista");
  const [loading, setLoading] = useState(false);
  const [arteGerada, setArteGerada] = useState<string | null>(null);
  const [historico, setHistorico] = useState<Array<{ descricao: string; url: string; estilo: string }>>([]);
  const [apiKey, setApiKey] = useState("");
  const [apiKeyConfirmed, setApiKeyConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState<'gerar' | 'historico'>('gerar');

  const confirmarApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("Por favor, insira sua chave API do Runware");
      return;
    }
    setApiKeyConfirmed(true);
    toast.success("Chave API configurada com sucesso!");
  };

  const gerarArte = async () => {
    if (!descricao.trim()) {
      toast.error("Por favor, insira uma descrição para a arte");
      return;
    }

    if (!apiKeyConfirmed) {
      toast.error("Por favor, configure sua chave API primeiro");
      return;
    }

    setLoading(true);
    try {
      const params: GenerateImageParams = {
        positivePrompt: `Crie uma arte ${estilo} com a seguinte descrição: ${descricao}. Alta qualidade, detalhado, artístico, profissional.`,
        model: "runware:100@1",
        numberResults: 1,
        outputFormat: "WEBP",
        CFGScale: 1,
      };

      const runwareService = new RunwareService(apiKey);
      const resultado = await runwareService.generateImage(params);

      setArteGerada(resultado.imageURL);
      setHistorico(prev => [...prev, { descricao, url: resultado.imageURL, estilo }]);
      toast.success("Arte gerada com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar arte:", error);
      toast.error("Erro ao gerar a arte. Por favor, verifique sua chave API e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Gerador de Arte Autônoma
          </h1>
          <p className="text-lg text-muted-foreground">
            Transforme suas ideias em obras de arte únicas usando inteligência artificial
          </p>
        </div>

        {!apiKeyConfirmed ? (
          <Card className="p-6 glass-morphism space-y-4 border border-purple-200 dark:border-purple-900">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Chave API do Runware
                </label>
                <Input
                  type="password"
                  placeholder="Insira sua chave API..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={confirmarApiKey} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Confirmar Chave API
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="flex justify-center space-x-4 mb-8">
              <Button
                variant={activeTab === 'gerar' ? 'default' : 'outline'}
                onClick={() => setActiveTab('gerar')}
                className={`${activeTab === 'gerar' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}
              >
                Gerar Nova Arte
              </Button>
              <Button
                variant={activeTab === 'historico' ? 'default' : 'outline'}
                onClick={() => setActiveTab('historico')}
                className={`${activeTab === 'historico' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}
              >
                Histórico de Criações
              </Button>
            </div>

            {activeTab === 'gerar' && (
              <Card className="p-6 glass-morphism space-y-6 border border-purple-200 dark:border-purple-900">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Descreva sua arte
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        placeholder="Ex: Um campo de girassóis ao pôr do sol..."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="pl-10 w-full"
                      />
                    </div>
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
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Gerando...
                      </span>
                    ) : (
                      "Gerar Arte"
                    )}
                  </Button>
                </div>

                {arteGerada && (
                  <div className="art-container mt-8">
                    <Card className="p-4 border border-purple-200 dark:border-purple-900">
                      <img
                        src={arteGerada}
                        alt="Arte gerada"
                        className="w-full h-auto rounded-lg shadow-lg transition-transform hover:scale-[1.02]"
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
                          className="hover:bg-purple-50 dark:hover:bg-purple-900"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Baixar Arte
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}
              </Card>
            )}

            {activeTab === 'historico' && historico.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {historico.map((item, index) => (
                    <Card key={index} className="p-4 hover:shadow-lg transition-shadow border border-purple-200 dark:border-purple-900">
                      <img
                        src={item.url}
                        alt={item.descricao}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(item.url, '_blank')}
                      />
                      <div className="mt-4 space-y-2">
                        <p className="font-medium text-sm text-purple-600 dark:text-purple-400">
                          Estilo: {estilosArtisticos.find(e => e.id === item.estilo)?.nome}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.descricao}
                        </p>
                        <Button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = item.url;
                            link.download = `arte-${index + 1}.webp`;
                            link.click();
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Baixar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArtGenerator;

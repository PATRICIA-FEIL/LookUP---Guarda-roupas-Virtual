'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Share2, Crown, Clock, Zap, Heart, MessageCircle, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  image: string;
  color: string;
  size: string;
}

interface Look {
  id: string;
  items: ClothingItem[];
  rating: number;
  created_at: string;
  user_id?: string;
}

export default function Generate() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [generatedLook, setGeneratedLook] = useState<ClothingItem[]>([]);
  const [isPremiumDialogOpen, setIsPremiumDialogOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutos
  const [userId, setUserId] = useState<string | null>(null);
  const [looks, setLooks] = useState<Look[]>([]);
  const [currentRating, setCurrentRating] = useState(0);

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    setUserId(savedUserId);

    loadItems(savedUserId);
    loadLooks(savedUserId);
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const loadItems = async (userId: string | null) => {
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('wardrobe_items')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error('Erro ao carregar itens:', error);
        const savedItems = localStorage.getItem('wardrobeItems');
        if (savedItems) {
          setItems(JSON.parse(savedItems));
        }
      }
    } else {
      const savedItems = localStorage.getItem('wardrobeItems');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
    }
  };

  const loadLooks = async (userId: string | null) => {
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('looks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLooks(data || []);
      } catch (error) {
        console.error('Erro ao carregar looks:', error);
      }
    }
  };

  const generateLook = () => {
    if (items.length < 3) return;

    // Lógica melhorada: combinações mais inteligentes
    const categories = ['blusas', 'calças', 'sapatos'];
    const look: ClothingItem[] = [];

    categories.forEach(cat => {
      const categoryItems = items.filter(item => item.category === cat);
      if (categoryItems.length > 0) {
        const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
        look.push(randomItem);
      }
    });

    // Adicionar acessório se disponível
    const accessories = items.filter(item => item.category === 'acessórios');
    if (accessories.length > 0 && Math.random() > 0.5) {
      const randomAccessory = accessories[Math.floor(Math.random() * accessories.length)];
      look.push(randomAccessory);
    }

    setGeneratedLook(look);
    setIsPremiumDialogOpen(true);
    setCurrentRating(0);
  };

  const saveLook = async (rating: number) => {
    if (!generatedLook.length) return;

    const lookData = {
      items: generatedLook,
      rating,
      user_id: userId,
      created_at: new Date().toISOString()
    };

    if (userId) {
      try {
        const { error } = await supabase
          .from('looks')
          .insert([lookData]);

        if (error) throw error;
        loadLooks(userId);
      } catch (error) {
        console.error('Erro ao salvar look:', error);
        // Fallback para localStorage
        const savedLooks = localStorage.getItem('looks');
        const looksArray = savedLooks ? JSON.parse(savedLooks) : [];
        looksArray.push({ ...lookData, id: Date.now().toString() });
        localStorage.setItem('looks', JSON.stringify(looksArray));
        setLooks(looksArray);
      }
    } else {
      const savedLooks = localStorage.getItem('looks');
      const looksArray = savedLooks ? JSON.parse(savedLooks) : [];
      looksArray.push({ ...lookData, id: Date.now().toString() });
      localStorage.setItem('looks', JSON.stringify(looksArray));
      setLooks(looksArray);
    }

    setIsPremiumDialogOpen(false);
  };

  const shareLook = () => {
    const text = `Confira meu look incrível no LookUp! #LookUp #Moda #Estilo`;
    const url = window.location.href;
    navigator.share?.({ title: 'Meu Look no LookUp', text, url }) ||
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Gerador de Looks</h1>
          <p className="text-lg text-gray-600">Crie combinações incríveis com suas peças!</p>
        </div>

        <div className="text-center mb-8">
          <Button
            onClick={generateLook}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-xl"
            disabled={items.length < 3}
          >
            <Zap className="mr-2 h-6 w-6" />
            Gerar Look Incrível
          </Button>
          {items.length < 3 && (
            <p className="text-red-500 mt-2">Adicione pelo menos 3 peças no seu guarda-roupas!</p>
          )}
        </div>

        {/* Histórico de Looks */}
        {looks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Seus Looks Anteriores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {looks.slice(0, 4).map((look) => (
                <Card key={look.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <span>Look de {new Date(look.created_at).toLocaleDateString()}</span>
                      <Badge>{look.rating} ⭐</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {look.items.map((item, idx) => (
                        <img key={idx} src={item.image} alt={item.name} className="w-full h-20 object-cover rounded" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Dialog open={isPremiumDialogOpen} onOpenChange={setIsPremiumDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold">
                🎉 Seu Look Está Pronto!
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Resumo Motivacional:</h3>
                <p className="text-gray-700">
                  "Este look combina perfeitamente seu estilo único! Você está radiante e confiante.
                  Milhões de pessoas vão se inspirar no seu visual incrível! Compartilhe e viralize!"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {generatedLook.map((item, index) => (
                  <Card key={item.id} className="relative">
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-lg">
                      <div className="text-white text-center">
                        <Crown className="mx-auto h-12 w-12 mb-2" />
                        <p className="text-lg font-semibold">Imagem Borrada</p>
                        <p className="text-sm">Desbloqueie para ver!</p>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-sm">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500">Imagem Oculta</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Avaliação */}
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-2">Avalie este look:</h4>
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer ${star <= currentRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      onClick={() => setCurrentRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-red-500" />
                    <span className="font-semibold text-red-700">Oferta Limitada!</span>
                  </div>
                  <Badge variant="destructive" className="text-lg px-3 py-1">
                    {formatTime(timeLeft)}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-red-700 mb-4">
                  🚨 Desbloqueie Agora e Ganhe Bônus Extra!
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card className="border-2 border-green-300">
                    <CardHeader>
                      <CardTitle className="text-green-700">Plano Premium</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-700">10x R$ 9,90</p>
                      <p className="text-sm text-gray-600">ou R$ 89,90 à vista</p>
                      <ul className="mt-2 text-sm">
                        <li>✅ Looks ilimitados</li>
                        <li>✅ Sugestões personalizadas</li>
                        <li>✅ Compartilhamento viral</li>
                        <li>✅ Histórico completo</li>
                        <li>✅ Análises de tendências</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-yellow-300 bg-yellow-50">
                    <CardHeader>
                      <CardTitle className="text-yellow-700">Bônus Especial</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold text-yellow-700">Mala Slim Grátis!</p>
                      <p className="text-sm text-gray-600">Para organizar seus acessórios</p>
                      <p className="text-xs text-red-600 mt-2">
                        *Apenas para assinaturas nos próximos {formatTime(timeLeft)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1 bg-green-500 hover:bg-green-600">
                    Assinar 10x R$ 9,90
                  </Button>
                  <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                    Pagar R$ 89,90 à Vista
                  </Button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Sem compromisso - Cancele quando quiser
                </p>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => saveLook(currentRating)} className="flex-1">
                  <Heart className="mr-2 h-4 w-4" />
                  Salvar Look
                </Button>
                <Button variant="outline" onClick={shareLook}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar Preview
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Wardrobe } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  image: string;
  color: string;
  size: string;
  user_id?: string;
}

const categories = [
  'vestidos', 'calças', 'saias', 'bermudas', 'blusas', 'jaquetas', 'sapatos', 'acessórios'
];

export default function Wardrobe() {
  const router = useRouter();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    image: '',
    color: '',
    size: ''
  });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    setUserId(savedUserId);

    loadItems(savedUserId);
  }, []);

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
        // Fallback para localStorage
        const savedItems = localStorage.getItem('wardrobeItems');
        if (savedItems) {
          setItems(JSON.parse(savedItems));
        }
      }
    } else {
      // Fallback para localStorage
      const savedItems = localStorage.getItem('wardrobeItems');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
    }
  };

  const saveItems = async (newItems: ClothingItem[]) => {
    setItems(newItems);

    if (userId) {
      try {
        // Para simplificar, deletar todos e inserir novamente
        await supabase.from('wardrobe_items').delete().eq('user_id', userId);
        const itemsToInsert = newItems.map(item => ({ ...item, user_id: userId }));
        const { error } = await supabase.from('wardrobe_items').insert(itemsToInsert);
        if (error) throw error;
      } catch (error) {
        console.error('Erro ao salvar itens:', error);
        // Fallback
        localStorage.setItem('wardrobeItems', JSON.stringify(newItems));
      }
    } else {
      localStorage.setItem('wardrobeItems', JSON.stringify(newItems));
    }
  };

  const addItem = () => {
    if (newItem.name && newItem.category && newItem.image) {
      const item: ClothingItem = {
        id: Date.now().toString(),
        ...newItem
      };
      const updatedItems = [...items, item];
      saveItems(updatedItems);
      setNewItem({ name: '', category: '', image: '', color: '', size: '' });
      setIsDialogOpen(false);
    }
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    saveItems(updatedItems);
  };

  const handleGenerateLooks = () => {
    if (items.length >= 3) {
      router.push('/generate');
    } else {
      alert('Adicione pelo menos 3 peças para gerar looks!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Wardrobe className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Seu Guarda-Roupas</h1>
          <p className="text-lg text-gray-600">Adicione suas peças e crie looks incríveis!</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-blue-500">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Peça
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Peça</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome da Peça</Label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Camiseta Branca"
                  />
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Select onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>URL da Imagem</Label>
                  <Input
                    value={newItem.image}
                    onChange={(e) => setNewItem(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Cole o link da imagem"
                  />
                </div>
                <div>
                  <Label>Cor</Label>
                  <Input
                    value={newItem.color}
                    onChange={(e) => setNewItem(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="Ex: Azul"
                  />
                </div>
                <div>
                  <Label>Tamanho</Label>
                  <Input
                    value={newItem.size}
                    onChange={(e) => setNewItem(prev => ({ ...prev, size: e.target.value }))}
                    placeholder="Ex: M"
                  />
                </div>
                <Button onClick={addItem} className="w-full">
                  Adicionar
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={handleGenerateLooks} className="bg-gradient-to-r from-purple-500 to-pink-500">
            Gerar Looks ({items.length} peças)
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {item.name}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded mb-4" />
                <p><strong>Categoria:</strong> {item.category}</p>
                <p><strong>Cor:</strong> {item.color}</p>
                <p><strong>Tamanho:</strong> {item.size}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Seu guarda-roupas está vazio. Adicione algumas peças!</p>
          </div>
        )}
      </div>
    </div>
  );
}
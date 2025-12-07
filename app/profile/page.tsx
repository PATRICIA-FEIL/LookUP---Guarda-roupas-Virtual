'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Ruler, Weight, Palette } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    height: '',
    weight: '',
    style: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Tentar salvar no Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: formData.name,
          avatar: formData.avatar || null,
          height: parseInt(formData.height),
          weight: parseInt(formData.weight),
          style: formData.style
        }])
        .select()
        .single();

      if (error) throw error;

      // Salvar ID do usuário no localStorage
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userProfile', JSON.stringify(formData));
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      // Fallback: salvar apenas no localStorage
      localStorage.setItem('userProfile', JSON.stringify(formData));
    }

    router.push('/wardrobe');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <User className="mx-auto h-16 w-16 text-blue-500 mb-4" />
            <CardTitle className="text-3xl">Crie Seu Perfil</CardTitle>
            <p className="text-gray-600">Conte-nos sobre você para looks perfeitos!</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
                <Input
                  placeholder="URL do seu avatar (opcional)"
                  value={formData.avatar}
                  onChange={(e) => handleInputChange('avatar', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height" className="flex items-center">
                    <Ruler className="mr-2 h-4 w-4" />
                    Altura (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="flex items-center">
                    <Weight className="mr-2 h-4 w-4" />
                    Peso (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="65"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="style" className="flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  Estilo Preferido
                </Label>
                <Select onValueChange={(value) => handleInputChange('style', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha seu estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="elegante">Elegante</SelectItem>
                    <SelectItem value="esportivo">Esportivo</SelectItem>
                    <SelectItem value="bohemio">Boêmio</SelectItem>
                    <SelectItem value="minimalista">Minimalista</SelectItem>
                    <SelectItem value="vintage">Vintage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                Próximo: Meu Guarda-Roupas
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
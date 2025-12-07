import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Wardrobe, Palette, Share2, Crown } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            LookUp
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            Seu guarda-roupas digital inteligente
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Crie looks personalizados, organize suas peças e vire referência de estilo!
            Descubra combinações incríveis baseadas no seu perfil.
          </p>
          <Link href="/profile">
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-xl">
              <Sparkles className="mr-2 h-6 w-6" />
              Começar Agora - É Grátis!
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Wardrobe className="mx-auto h-12 w-12 text-pink-500 mb-4" />
              <CardTitle>Guarda-Roupas Digital</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Cadastre suas peças ilimitadamente e organize tudo em categorias inteligentes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Palette className="mx-auto h-12 w-12 text-purple-500 mb-4" />
              <CardTitle>Looks Personalizados</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Algoritmos inteligentes criam combinações perfeitas para você.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Share2 className="mx-auto h-12 w-12 text-indigo-500 mb-4" />
              <CardTitle>Compartilhe & Viralize</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Mostre seus looks incríveis e inspire milhares de pessoas!
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Crown className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <CardTitle>Premium Exclusivo</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Desbloqueie recursos avançados e seja o melhor estilista!
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Por que milhões estão usando o LookUp?
          </h2>
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-6">
              "O LookUp revolucionou minha forma de me vestir! Nunca mais perco tempo decidindo o que usar."
            </p>
            <p className="text-sm text-gray-500">- Maria Silva, Influencer de Moda</p>
          </div>
        </div>
      </div>
    </div>
  );
}
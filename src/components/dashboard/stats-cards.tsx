"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserStats } from "@/types/user";
import {
  Users,
  UserCheck,
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  TrendingUp,
} from "lucide-react";

interface StatsCardsProps {
  stats: UserStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total de Usuários",
      value: stats.totalUsers.toLocaleString("pt-BR"),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Usuários Ativos",
      value: stats.activeUsers.toLocaleString("pt-BR"),
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Com CNPJ",
      value: stats.usersWithCNPJ.toLocaleString("pt-BR"),
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Com Locais",
      value: stats.usersWithLocations.toLocaleString("pt-BR"),
      icon: MapPin,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Com Contratantes",
      value: stats.usersWithContractors.toLocaleString("pt-BR"),
      icon: Briefcase,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Total de Plantões",
      value: stats.totalShifts.toLocaleString("pt-BR"),
      icon: TrendingUp,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Receita Total",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(stats.totalRevenue),
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Média Plantões/Usuário",
      value: stats.averageShiftsPerUser.toFixed(1),
      icon: TrendingUp,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

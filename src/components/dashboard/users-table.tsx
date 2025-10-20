'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '@/types/user';
import { formatPhoneNumber, formatCurrency, getDeviceType, getPlatformBadgeVariant } from '@/lib/utils';
import {
  Search,
  Eye,
  Phone,
  Mail,
  Smartphone,
  Tablet,
  DollarSign,
  Briefcase,
  X,
  User as UserIcon
} from 'lucide-react';

interface UsersTableProps {
  users: User[];
  onViewUser?: (user: User) => void;
}

type FilterType = 'all' | 'ios' | 'android' | 'withCNPJ';

export function UsersTable({ users, onViewUser }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  const filteredUsers = users.filter(user => {
    // Filtro de busca
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phoneNumber?.toLowerCase().includes(searchLower)
    );

    // Filtros de plataforma
    if (filterType === 'ios') {
      return matchesSearch && user.deviceTokens?.some(t => t.deviceType?.toLowerCase() === 'ios');
    }
    if (filterType === 'android') {
      return matchesSearch && user.deviceTokens?.some(t => t.deviceType?.toLowerCase() === 'android');
    }
    if (filterType === 'withCNPJ') {
      return matchesSearch && user.cnpjData !== null;
    }

    return matchesSearch;
  });

  const getDeviceIcon = (deviceType?: string) => {
    const type = getDeviceType(deviceType);
    switch (type) {
      case 'ios':
        return <Smartphone className="h-4 w-4" />;
      case 'android':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Smartphone className="h-4 w-4" />;
    }
  };

  const calculateTotalRevenue = (user: User): number => {
    if (!user.plantoes || user.plantoes.length === 0) return 0;
    return user.plantoes.reduce((sum, plantao) => sum + plantao.value, 0);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CardTitle>Usuários do Sistema</CardTitle>
            <span className="text-sm text-muted-foreground">
              {filteredUsers.length} de {users.length} usuários
            </span>
          </div>

          {/* Filtros e Busca */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                Todos
              </Button>
              <Button
                variant={filterType === 'ios' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('ios')}
              >
                <Smartphone className="h-4 w-4 mr-1" />
                iOS
              </Button>
              <Button
                variant={filterType === 'android' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('android')}
              >
                <Tablet className="h-4 w-4 mr-1" />
                Android
              </Button>
              <Button
                variant={filterType === 'withCNPJ' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('withCNPJ')}
              >
                Com CNPJ
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredUsers.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="text-center">Plataforma</TableHead>
                  <TableHead className="text-right">Plantões</TableHead>
                  <TableHead className="text-right">Receita Total</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const totalRevenue = calculateTotalRevenue(user);
                  const deviceType = user.deviceTokens?.[0]?.deviceType;

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted relative overflow-hidden">
                            {user.imageUrl ? (
                              <Image
                                src={user.imageUrl}
                                alt={user.name || 'Usuário'}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <UserIcon className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Sem nome'}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {user.id.slice(0, 8)}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="truncate max-w-[200px]">{user.email}</span>
                          </div>
                          {user.phoneNumber && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3.5 w-3.5" />
                              <span>{formatPhoneNumber(user.phoneNumber)}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        {deviceType ? (
                          <Badge variant={getPlatformBadgeVariant(deviceType)} className="gap-1">
                            {getDeviceIcon(deviceType)}
                            {deviceType.toUpperCase()}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{user._count?.plantoes || 0}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5 font-medium">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">
                            {formatCurrency(totalRevenue)}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewUser?.(user)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum usuário encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm
                ? `Não encontramos usuários com "${searchTerm}"`
                : 'Ajuste os filtros para visualizar usuários'}
            </p>
            {(searchTerm || filterType !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { User } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  formatDate,
  formatDateTime,
  formatPhoneNumber,
  formatCurrency,
  calculateAge,
  getDeviceType,
  getPlatformBadgeVariant,
  getGenderLabel,
} from "@/lib/utils";
import {
  Phone,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Building2,
  Smartphone,
  Tablet,
  User as UserIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
}: UserDetailModalProps) {
  if (!user) return null;

  const totalShifts = user.plantoes?.length || 0;
  const totalRevenue = user.plantoes?.reduce((sum, shift) => sum + shift.value, 0) || 0;
  const paidShifts = user.plantoes?.filter(p => p.payments?.some(pay => pay.paid)).length || 0;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto !bg-white border-gray-200">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="text-2xl font-bold text-gray-900">Detalhes do Usuário</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow text-gray-700"
            >
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger
              value="shifts"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow text-gray-700"
            >
              Plantões
            </TabsTrigger>
            <TabsTrigger
              value="cnpj"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow text-gray-700"
            >
              CNPJ
            </TabsTrigger>
            <TabsTrigger
              value="devices"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow text-gray-700"
            >
              Dispositivos
            </TabsTrigger>
          </TabsList>

          {/* Dados Pessoais */}
          <TabsContent value="personal" className="space-y-6 mt-6">
            {/* Header com foto e nome */}
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.name || "Usuário"}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Sem nome"}
                </h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 font-mono mt-1">ID: {user.id}</p>
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Informações de Contato */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-900">Informações de Contato</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                {user.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="font-medium text-gray-900">{formatPhoneNumber(user.phoneNumber)}</p>
                    </div>
                  </div>
                )}

                {user.birthDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Data de Nascimento</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(user.birthDate)} ({calculateAge(user.birthDate)} anos)
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Gênero</p>
                    <p className="font-medium text-gray-900">{getGenderLabel(user.gender)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Estatísticas */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-900">Estatísticas</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-blue-900 font-medium">Plantões</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{totalShifts}</p>
                </div>

                <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-green-900 font-medium">Receita</p>
                  </div>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(totalRevenue)}
                  </p>
                </div>

                <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <p className="text-sm text-purple-900 font-medium">Locais</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{user._count?.locations || 0}</p>
                </div>

                <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-5 w-5 text-orange-600" />
                    <p className="text-sm text-orange-900 font-medium">Contratantes</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-900">{user._count?.contractors || 0}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Datas de Cadastro */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-900">Informações do Sistema</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Cadastrado em</p>
                  <p className="font-medium text-gray-900">{formatDateTime(user.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Última atualização</p>
                  <p className="font-medium text-gray-900">{formatDateTime(user.updatedAt)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Clerk ID</p>
                  <p className="font-mono text-sm text-gray-900">{user.clerkId}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Plantões */}
          <TabsContent value="shifts" className="space-y-4 mt-6">
            {user.plantoes && user.plantoes.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm text-blue-900 font-medium mb-1">Total de Plantões</p>
                    <p className="text-2xl font-bold text-blue-900">{totalShifts}</p>
                  </div>
                  <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                    <p className="text-sm text-green-900 font-medium mb-1">Receita Total</p>
                    <p className="text-xl font-bold text-green-700">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm text-emerald-900 font-medium mb-1">Pagos</p>
                    <p className="text-2xl font-bold text-emerald-900">{paidShifts}</p>
                  </div>
                </div>

                <div className="rounded-md border border-gray-200 bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="text-gray-700 font-semibold">Data</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Local</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Contratante</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Tipo</TableHead>
                        <TableHead className="text-right text-gray-700 font-semibold">Valor</TableHead>
                        <TableHead className="text-center text-gray-700 font-semibold">Pagamento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.plantoes.map((plantao) => {
                        const isPaid = plantao.payments?.some(p => p.paid);
                        return (
                          <TableRow key={plantao.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium text-gray-900">
                              {formatDate(plantao.date)}
                            </TableCell>
                            <TableCell className="text-gray-700">
                              {plantao.location?.name || "-"}
                            </TableCell>
                            <TableCell className="text-gray-700">
                              {plantao.contractor?.name || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={plantao.isFixed ? "default" : "secondary"}
                                className={plantao.isFixed ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}
                              >
                                {plantao.isFixed ? "Fixo" : "Variável"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-gray-900">
                              {formatCurrency(plantao.value)}
                            </TableCell>
                            <TableCell className="text-center">
                              {isPaid ? (
                                <Badge className="gap-1 bg-green-100 text-green-800 hover:bg-green-100">
                                  <CheckCircle className="h-3 w-3" />
                                  Pago
                                </Badge>
                              ) : (
                                <Badge className="gap-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
                                  <XCircle className="h-3 w-3" />
                                  Pendente
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Nenhum plantão registrado</h3>
                <p className="text-sm text-gray-600">
                  Este usuário ainda não possui plantões cadastrados.
                </p>
              </div>
            )}
          </TabsContent>

          {/* CNPJ */}
          <TabsContent value="cnpj" className="space-y-4 mt-6">
            {user.cnpjData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Nome da Empresa</p>
                    <p className="font-medium text-gray-900">{user.cnpjData.companyName || "Não informado"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">CNPJ</p>
                    <p className="font-medium font-mono text-gray-900">{user.cnpjData.cnpjNumber || "Não informado"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Contabilidade</p>
                    <p className="font-medium text-gray-900">{user.cnpjData.accountingFirmName || "Não informado"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Taxa Mensal</p>
                    <p className="font-medium text-gray-900">
                      {user.cnpjData.monthlyFee ? formatCurrency(user.cnpjData.monthlyFee) : "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Sem dados de CNPJ</h3>
                <p className="text-sm text-gray-600">
                  Este usuário não possui informações de CNPJ cadastradas.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Dispositivos */}
          <TabsContent value="devices" className="space-y-4 mt-6">
            {user.deviceTokens && user.deviceTokens.length > 0 ? (
              <div className="space-y-3">
                {user.deviceTokens.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        {getDeviceIcon(device.deviceType)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{device.deviceName || "Dispositivo"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={getPlatformBadgeVariant(device.deviceType)}
                            className={`gap-1 ${
                              device.deviceType?.toLowerCase() === 'ios'
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                : device.deviceType?.toLowerCase() === 'android'
                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                            }`}
                          >
                            {getDeviceIcon(device.deviceType)}
                            {device.deviceType?.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            v{device.appVersion}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">
                        Último uso: {formatDateTime(device.lastUsedAt)}
                      </p>
                      <Badge
                        className={device.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {device.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Smartphone className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Nenhum dispositivo</h3>
                <p className="text-sm text-gray-600">
                  Nenhum dispositivo registrado para este usuário.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

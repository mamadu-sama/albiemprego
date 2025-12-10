import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '@/lib/api';
import { useAuth } from './AuthContext';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  maxJobs: number;
  featuredCredits: number;
  urgentCredits: number;
  homepageCredits: number;
  isPopular?: boolean;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  type: 'featured' | 'urgent' | 'homepage' | 'mixed';
  description: string;
}

export interface CompanySubscription {
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  credits: {
    featured: number;
    urgent: number;
    homepage: number;
  };
}

interface SubscriptionContextType {
  plans: SubscriptionPlan[];
  creditPackages: CreditPackage[];
  currentSubscription: CompanySubscription | null;
  subscribeToPlan: (planId: string) => void;
  purchaseCredits: (packageId: string) => void;
  useCredit: (type: 'featured' | 'urgent' | 'homepage') => boolean;
  cancelSubscription: () => void;
}

const defaultPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 0,
    period: 'monthly',
    features: [
      'Até 3 vagas ativas',
      'Visualização de candidaturas',
      'Perfil básico da empresa',
      'Suporte por email'
    ],
    maxJobs: 3,
    featuredCredits: 0,
    urgentCredits: 0,
    homepageCredits: 0
  },
  {
    id: 'professional',
    name: 'Profissional',
    price: 49,
    period: 'monthly',
    features: [
      'Até 10 vagas ativas',
      'Visualização de candidaturas',
      'Perfil completo da empresa',
      '3 destaques na listagem/mês',
      '1 destaque na homepage/mês',
      'Suporte prioritário'
    ],
    maxJobs: 10,
    featuredCredits: 3,
    urgentCredits: 0,
    homepageCredits: 1,
    isPopular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    period: 'monthly',
    features: [
      'Vagas ilimitadas',
      'Visualização de candidaturas',
      'Perfil premium da empresa',
      '10 destaques na listagem/mês',
      '3 destaques na homepage/mês',
      '2 badges urgente/mês',
      'Suporte dedicado 24/7'
    ],
    maxJobs: -1,
    featuredCredits: 10,
    urgentCredits: 2,
    homepageCredits: 3
  }
];

const defaultCreditPackages: CreditPackage[] = [
  {
    id: 'featured-5',
    name: '5 Destaques',
    credits: 5,
    price: 15,
    type: 'featured',
    description: 'Destaque as suas vagas na listagem'
  },
  {
    id: 'featured-10',
    name: '10 Destaques',
    credits: 10,
    price: 25,
    type: 'featured',
    description: 'Destaque as suas vagas na listagem'
  },
  {
    id: 'homepage-3',
    name: '3 Homepage',
    credits: 3,
    price: 30,
    type: 'homepage',
    description: 'Apareça na secção de destaques da homepage'
  },
  {
    id: 'urgent-5',
    name: '5 Urgente',
    credits: 5,
    price: 20,
    type: 'urgent',
    description: 'Badge urgente para atrair mais candidatos'
  },
  {
    id: 'mixed-pack',
    name: 'Pack Completo',
    credits: 10,
    price: 50,
    type: 'mixed',
    description: '5 Destaques + 3 Homepage + 2 Urgente'
  }
];

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isCompany = user?.type === 'EMPRESA';

  // Buscar planos disponíveis
  const { data: plans = defaultPlans } = useQuery({
    queryKey: ['plans'],
    queryFn: () => subscriptionApi.getPlans(),
    enabled: isCompany,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Buscar pacotes de créditos disponíveis
  const { data: creditPackages = defaultCreditPackages } = useQuery({
    queryKey: ['creditPackages'],
    queryFn: () => subscriptionApi.getCreditPackages(),
    enabled: isCompany,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar assinatura atual e créditos
  const { data: subscriptionData } = useQuery({
    queryKey: ['currentSubscription'],
    queryFn: () => subscriptionApi.getCurrentSubscription(),
    enabled: isCompany,
    refetchInterval: 30 * 1000, // Atualizar a cada 30s
  });

  // Transformar dados da API para formato do context
  const currentSubscription: CompanySubscription | null = subscriptionData?.subscription
    ? {
        planId: subscriptionData.subscription.planId,
        planName: subscriptionData.subscription.plan.name,
        status: subscriptionData.subscription.status.toLowerCase() as 'active' | 'cancelled' | 'expired',
        startDate: subscriptionData.subscription.startDate,
        endDate: subscriptionData.subscription.endDate,
        credits: {
          featured: subscriptionData.credits.summary.featured,
          homepage: subscriptionData.credits.summary.homepage,
          urgent: subscriptionData.credits.summary.urgent,
        },
      }
    : null;

  // Mutation para subscrever a plano (não implementado ainda - admin atribui manualmente)
  const subscribeToPlan = (planId: string) => {
    console.log('Subscribe to plan called (manual assignment by admin only):', planId);
    // TODO: Implementar quando conectar Stripe
  };

  // Mutation para comprar créditos (não implementado ainda - admin atribui manualmente)
  const purchaseCredits = (packageId: string) => {
    console.log('Purchase credits called (manual assignment by admin only):', packageId);
    // TODO: Implementar quando conectar Stripe
  };

  // Usar crédito (atualmente gerenciado pelo backend quando aplica em vaga)
  const useCredit = (type: 'featured' | 'urgent' | 'homepage'): boolean => {
    if (!currentSubscription) return false;
    if (currentSubscription.credits[type] <= 0) return false;

    // Invalidar cache para forçar atualização
    queryClient.invalidateQueries({ queryKey: ['currentSubscription'] });

    return true;
  };

  // Cancelar assinatura
  const cancelSubscription = () => {
    console.log('Cancel subscription called (admin manages this)');
    // TODO: Implementar endpoint de cancelamento
  };

  return (
    <SubscriptionContext.Provider value={{
      plans,
      creditPackages,
      currentSubscription,
      subscribeToPlan,
      purchaseCredits,
      useCredit,
      cancelSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

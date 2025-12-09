import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  const [plans] = useState<SubscriptionPlan[]>(defaultPlans);
  const [creditPackages] = useState<CreditPackage[]>(defaultCreditPackages);
  const [currentSubscription, setCurrentSubscription] = useState<CompanySubscription | null>(() => {
    const saved = localStorage.getItem('companySubscription');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      planId: 'basic',
      planName: 'Básico',
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      credits: {
        featured: 0,
        urgent: 0,
        homepage: 0
      }
    };
  });

  const saveSubscription = (sub: CompanySubscription) => {
    localStorage.setItem('companySubscription', JSON.stringify(sub));
    setCurrentSubscription(sub);
  };

  const subscribeToPlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    const newSubscription: CompanySubscription = {
      planId: plan.id,
      planName: plan.name,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      credits: {
        featured: plan.featuredCredits,
        urgent: plan.urgentCredits,
        homepage: plan.homepageCredits
      }
    };
    saveSubscription(newSubscription);
  };

  const purchaseCredits = (packageId: string) => {
    const pkg = creditPackages.find(p => p.id === packageId);
    if (!pkg || !currentSubscription) return;

    const newCredits = { ...currentSubscription.credits };
    
    if (pkg.type === 'featured') {
      newCredits.featured += pkg.credits;
    } else if (pkg.type === 'urgent') {
      newCredits.urgent += pkg.credits;
    } else if (pkg.type === 'homepage') {
      newCredits.homepage += pkg.credits;
    } else if (pkg.type === 'mixed') {
      newCredits.featured += 5;
      newCredits.homepage += 3;
      newCredits.urgent += 2;
    }

    saveSubscription({
      ...currentSubscription,
      credits: newCredits
    });
  };

  const useCredit = (type: 'featured' | 'urgent' | 'homepage'): boolean => {
    if (!currentSubscription) return false;
    
    if (currentSubscription.credits[type] <= 0) return false;

    const newCredits = { ...currentSubscription.credits };
    newCredits[type] -= 1;

    saveSubscription({
      ...currentSubscription,
      credits: newCredits
    });

    return true;
  };

  const cancelSubscription = () => {
    if (!currentSubscription) return;

    saveSubscription({
      ...currentSubscription,
      status: 'cancelled'
    });
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

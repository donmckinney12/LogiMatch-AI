"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useOrganization } from '@clerk/nextjs';

const OrgContext = createContext<{ orgId: string }>({ orgId: 'org_demo_123' });

export function OrgProvider({ children }: { children: React.ReactNode }) {
    const { organization, isLoaded } = useOrganization();
    const [orgId, setOrgId] = useState('org_demo_123');

    useEffect(() => {
        if (isLoaded) {
            setOrgId(organization?.id || 'org_demo_123');
        }
    }, [organization, isLoaded]);

    return (
        <OrgContext.Provider value={{ orgId }}>
            {children}
        </OrgContext.Provider>
    );
}

export const useOrg = () => useContext(OrgContext);

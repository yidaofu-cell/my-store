'use client';
import React from 'react';
import { Input, Select } from '../ui/Input';
import { countries, usStates } from '@/data/countries';

interface ShippingData {
  name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface ShippingFormProps {
  data: ShippingData;
  onChange: (data: ShippingData) => void;
  errors: Partial<Record<keyof ShippingData, string>>;
}

export function ShippingForm({ data, onChange, errors }: ShippingFormProps) {
  function update(field: keyof ShippingData, value: string) {
    onChange({ ...data, [field]: value });
  }

  const countryOptions = countries.map((c) => ({
    value: c.code,
    label: `${c.flag} ${c.name}`,
  }));

  const stateOptions = usStates.map((s) => ({ value: s, label: s }));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Shipping Information</h2>
      <p className="text-sm text-gray-500 mb-6">Enter your delivery details below.</p>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            required
            placeholder="John Doe"
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            error={errors.name}
          />
          <Input
            label="Email"
            required
            type="email"
            placeholder="john@example.com"
            value={data.email}
            onChange={(e) => update('email', e.target.value)}
            error={errors.email}
          />
        </div>

        <Input
          label="Phone Number"
          required
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={data.phone}
          onChange={(e) => update('phone', e.target.value)}
          error={errors.phone}
        />

        <Select
          label="Country"
          required
          options={countryOptions}
          value={data.country}
          onChange={(e) => update('country', e.target.value)}
          error={errors.country}
        />

        <Input
          label="Address"
          required
          placeholder="Street address, apartment, suite, etc."
          value={data.address}
          onChange={(e) => update('address', e.target.value)}
          error={errors.address}
        />

        <div className="grid sm:grid-cols-3 gap-4">
          <Input
            label="City"
            required
            placeholder="New York"
            value={data.city}
            onChange={(e) => update('city', e.target.value)}
            error={errors.city}
          />
          {data.country === 'US' ? (
            <Select
              label="State"
              required
              options={stateOptions}
              value={data.state}
              onChange={(e) => update('state', e.target.value)}
              error={errors.state}
            />
          ) : (
            <Input
              label="State / Province"
              placeholder="NY"
              value={data.state}
              onChange={(e) => update('state', e.target.value)}
              error={errors.state}
            />
          )}
          <Input
            label="ZIP / Postal Code"
            required
            placeholder="10001"
            value={data.zipCode}
            onChange={(e) => update('zipCode', e.target.value)}
            error={errors.zipCode}
          />
        </div>
      </div>
    </div>
  );
}

export type { ShippingData };

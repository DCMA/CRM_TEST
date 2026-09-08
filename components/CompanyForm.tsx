"use client";

import { useActionState } from "react";
import type { CompanyFormState } from "@/app/companies/actions";

type CompanyFormProps = {
  action: (
    state: CompanyFormState,
    formData: FormData,
  ) => Promise<CompanyFormState>;
  defaultValues?: { name: string; taxId: string };
  submitLabel: string;
};

const initialState: CompanyFormState = {};

export function CompanyForm({
  action,
  defaultValues,
  submitLabel,
}: CompanyFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="name">公司名稱</label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={defaultValues?.name}
          required
        />
      </div>
      <div>
        <label htmlFor="taxId">統一編號</label>
        <input
          id="taxId"
          name="taxId"
          type="text"
          inputMode="numeric"
          maxLength={8}
          defaultValue={defaultValues?.taxId}
          required
        />
      </div>
      {state.error ? <p role="alert">{state.error}</p> : null}
      <button type="submit" disabled={pending}>
        {submitLabel}
      </button>
    </form>
  );
}

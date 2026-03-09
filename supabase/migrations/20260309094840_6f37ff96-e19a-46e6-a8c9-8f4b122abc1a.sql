
CREATE TABLE public.payment_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL,
  method text NOT NULL DEFAULT 'momo',
  account_name text NOT NULL DEFAULT '',
  account_number text NOT NULL DEFAULT '',
  provider text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Landlords manage own payment details"
ON public.payment_details FOR ALL
TO authenticated
USING (auth.uid() = landlord_id)
WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Tenants can view landlord payment details"
ON public.payment_details FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM tenants t
    WHERE t.user_id = auth.uid() AND t.landlord_id = payment_details.landlord_id
  )
);

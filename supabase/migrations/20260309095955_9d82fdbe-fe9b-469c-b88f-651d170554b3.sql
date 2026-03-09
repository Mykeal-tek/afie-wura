
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Landlords manage own payment details" ON public.payment_details;
DROP POLICY IF EXISTS "Tenants can view landlord payment details" ON public.payment_details;

-- Recreate as permissive policies
CREATE POLICY "Landlords manage own payment details"
ON public.payment_details
FOR ALL
TO authenticated
USING (auth.uid() = landlord_id)
WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Tenants can view landlord payment details"
ON public.payment_details
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM tenants t
  WHERE t.user_id = auth.uid() AND t.landlord_id = payment_details.landlord_id
));
